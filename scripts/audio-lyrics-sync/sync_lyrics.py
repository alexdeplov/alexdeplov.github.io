#!/usr/bin/env python3
"""Build synced lyric JSON from local audio, Demucs stems, and Whisper output."""

from __future__ import annotations

import argparse
import collections
import datetime as dt
import difflib
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from typing import Any


DEFAULT_MODEL = "turbo"
DEFAULT_MIN_SCORE = 0.44


@dataclass
class TranscriptToken:
    text: str
    start: float
    end: float
    raw: str


@dataclass
class Match:
    time: float
    score: float
    source: str
    window: str
    status: str


def repo_root() -> pathlib.Path:
    return pathlib.Path(__file__).resolve().parents[2]


def relpath(path: str | pathlib.Path, base: pathlib.Path) -> pathlib.Path:
    value = pathlib.Path(path)
    return value if value.is_absolute() else base / value


def slugify(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-")
    return cleaned or "track"


def normalize_selector(value: str) -> str:
    value = value.split("?", 1)[0].split("#", 1)[0].strip()
    return value.rstrip("/")


def track_matches_selector(track: dict[str, Any], selector: str, base_dir: pathlib.Path) -> bool:
    needle = normalize_selector(selector)
    audio = relpath(track["audio"], base_dir)
    slug = slugify(track.get("slug") or audio.stem)
    candidates = {
        slug,
        normalize_selector(track["player_src"]),
        normalize_selector(str(track["audio"])),
        normalize_selector(str(audio)),
        audio.name,
        audio.stem,
    }
    return needle in candidates


def run(cmd: list[str], *, env: dict[str, str] | None = None) -> None:
    print("+ " + " ".join(cmd), flush=True)
    subprocess.run(cmd, check=True, env=env)


def tool_path(name: str) -> str | None:
    sibling = pathlib.Path(sys.executable).with_name(name)
    if sibling.exists():
        return str(sibling)
    return shutil.which(name)


def ffprobe_duration(audio: pathlib.Path) -> float:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "json",
            str(audio),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    payload = json.loads(result.stdout)
    return round(float(payload["format"]["duration"]), 6)


def normalize_text(value: str) -> list[str]:
    value = value.lower()
    value = value.replace("’", "'").replace("`", "'")
    value = re.sub(r"(\d+)[.-](\d+)", r"\1 \2", value)
    value = value.replace("fifteen-one", "15 1")
    value = value.replace("fifteen, one", "15 1")
    value = value.replace("fifteen one", "15 1")
    value = value.replace("four thousand", "4000")
    value = value.replace("freebsd", "free bsd")
    value = value.replace("riscv64", "risc 64")
    value = value.replace("amd64", "m64")
    value = value.replace("armv7", "arm 7")
    value = value.replace("armv6", "arm 6")
    value = value.replace("powerpc64le", "power pc 64 le")
    value = value.replace("powerpcspe", "power pc spe")
    value = re.sub(r"[^a-z0-9']+", " ", value)
    return [token.strip("'") for token in value.split() if token.strip("'")]


def token_counter(tokens: list[str]) -> collections.Counter[str]:
    return collections.Counter(tokens)


def overlap_ratio(a: list[str], b: list[str]) -> float:
    if not a:
        return 0.0
    left = token_counter(a)
    right = token_counter(b)
    overlap = sum((left & right).values())
    return overlap / len(a)


def score_window(target: list[str], candidate: list[str]) -> float:
    if not target or not candidate:
        return 0.0
    seq = difflib.SequenceMatcher(a=target, b=candidate).ratio()
    overlap = overlap_ratio(target, candidate)
    return (seq * 0.68) + (overlap * 0.32)


def load_transcript_tokens(path: pathlib.Path) -> list[TranscriptToken]:
    payload = json.loads(path.read_text())
    tokens: list[TranscriptToken] = []

    for segment in payload.get("segments", []):
        for word in segment.get("words") or []:
            raw = str(word.get("word", "")).strip()
            for normalized in normalize_text(raw):
                tokens.append(
                    TranscriptToken(
                        text=normalized,
                        start=float(word["start"]),
                        end=float(word.get("end", word["start"])),
                        raw=raw,
                    )
                )

    return tokens


def find_best_match(
    line: str,
    source_tokens: dict[str, list[TranscriptToken]],
    *,
    min_time: float,
    min_score: float,
    max_window_extra: int = 9,
) -> Match | None:
    target = normalize_text(line)
    if not target:
        return None

    best: tuple[float, str, int, int, str] | None = None

    for source_name, tokens in source_tokens.items():
        if not tokens:
            continue

        start_index = 0
        while start_index < len(tokens) and tokens[start_index].start < min_time - 0.25:
            start_index += 1

        max_start = min(len(tokens), start_index + 90)
        for start in range(start_index, max_start):
            min_len = max(1, len(target) - 3)
            max_len = len(target) + max_window_extra
            for size in range(min_len, max_len + 1):
                end = start + size
                if end > len(tokens):
                    break
                candidate = [token.text for token in tokens[start:end]]
                score = score_window(target, candidate)
                if best is None or score > best[0]:
                    window = " ".join(token.raw for token in tokens[start:end])
                    best = (score, source_name, start, end, window)

    if best is None or best[0] < min_score:
        return None

    score, source_name, start, _end, window = best
    return Match(
        time=round(source_tokens[source_name][start].start, 2),
        score=round(score, 3),
        source=source_name,
        window=window,
        status="matched",
    )


def ensure_demucs(
    audio: pathlib.Path,
    *,
    work_dir: pathlib.Path,
    model_name: str,
    skip: bool,
) -> pathlib.Path | None:
    if skip:
        return None

    stem_dir = work_dir / "demucs" / "htdemucs" / audio.stem
    vocals = stem_dir / "vocals.wav"
    if vocals.exists():
        return vocals

    demucs = tool_path("demucs")
    if demucs is None:
        raise SystemExit("demucs is not on PATH. Install requirements or use --skip-analysis.")

    run(
        [
            demucs,
            "--two-stems",
            "vocals",
            "-n",
            model_name,
            "-o",
            str(work_dir / "demucs"),
            str(audio),
        ],
        env=os.environ.copy(),
    )
    return vocals


def ensure_whisper(
    audio: pathlib.Path,
    *,
    output_dir: pathlib.Path,
    model: str,
    model_dir: pathlib.Path,
    language: str,
    skip: bool,
) -> pathlib.Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    transcript = output_dir / f"{audio.stem}.json"
    if transcript.exists():
        return transcript

    if skip:
        raise SystemExit(f"Missing transcript while --skip-analysis is set: {transcript}")

    whisper = tool_path("whisper")
    if whisper is None:
        raise SystemExit("whisper is not on PATH. Install requirements or use --skip-analysis.")

    run(
        [
            whisper,
            str(audio),
            "--model",
            model,
            "--model_dir",
            str(model_dir),
            "--language",
            language,
            "--task",
            "transcribe",
            "--word_timestamps",
            "True",
            "--output_format",
            "json",
            "--output_dir",
            str(output_dir),
            "--fp16",
            "False",
            "--verbose",
            "False",
            "--condition_on_previous_text",
            "False",
        ]
    )
    return transcript


def line_entries(raw_entries: list[Any]) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    for entry in raw_entries:
        if isinstance(entry, str):
            entries.append({"text": entry})
        elif isinstance(entry, dict):
            entries.append(entry)
        else:
            raise SystemExit(f"Invalid lyric entry: {entry!r}")
    return entries


def append_pending_sections(
    output_lines: list[dict[str, Any]],
    pending_sections: list[str],
    time_value: float,
) -> None:
    for section in pending_sections:
        output_lines.append({"type": "section", "time": time_value, "text": section})
    pending_sections.clear()


def align_track(
    track: dict[str, Any],
    *,
    base_dir: pathlib.Path,
    work_dir: pathlib.Path,
    model: str,
    model_dir: pathlib.Path,
    language: str,
    demucs_model: str,
    skip_analysis: bool,
) -> tuple[str, dict[str, Any], list[dict[str, Any]]]:
    audio = relpath(track["audio"], base_dir)
    player_src = track["player_src"]
    slug = slugify(track.get("slug") or audio.stem)
    track_work = work_dir / slug
    track_work.mkdir(parents=True, exist_ok=True)

    duration = float(track.get("duration") or ffprobe_duration(audio))
    sources = track.get("sources") or ["vocals", "mix"]
    source_tokens: dict[str, list[TranscriptToken]] = {}

    vocals_path = ensure_demucs(
        audio,
        work_dir=track_work,
        model_name=demucs_model,
        skip=skip_analysis or "vocals" not in sources,
    )

    if "vocals" in sources and vocals_path is not None:
        transcript = ensure_whisper(
            vocals_path,
            output_dir=track_work / "whisper-vocals",
            model=model,
            model_dir=model_dir,
            language=language,
            skip=skip_analysis,
        )
        source_tokens["vocals"] = load_transcript_tokens(transcript)

    if "mix" in sources:
        transcript = ensure_whisper(
            audio,
            output_dir=track_work / "whisper-mix",
            model=model,
            model_dir=model_dir,
            language=language,
            skip=skip_analysis,
        )
        source_tokens["mix"] = load_transcript_tokens(transcript)

    min_score = float(track.get("min_score", DEFAULT_MIN_SCORE))
    drop_unmatched = bool(track.get("drop_unmatched", False))
    output_lines: list[dict[str, Any]] = []
    pending_sections: list[str] = []
    report: list[dict[str, Any]] = []
    min_time = float(track.get("start_time", 0.0))
    last_time = min_time

    for entry in line_entries(track["lyrics"]):
        if "section" in entry:
            pending_sections.append(str(entry["section"]))
            continue

        text = str(entry["text"])
        manual_time = entry.get("time")
        auto_time: float | None = None

        if manual_time is not None:
            time_value = round(float(manual_time), 2)
            auto_match = (
                find_best_match(
                    text,
                    source_tokens,
                    min_time=min_time,
                    min_score=min_score,
                )
                if source_tokens
                else None
            )
            if auto_match is None:
                match = Match(time=time_value, score=1.0, source="manual", window=text, status="manual")
            else:
                auto_time = auto_match.time
                status = "manual" if abs(auto_time - time_value) < 0.05 else "manual-adjusted"
                match = Match(
                    time=time_value,
                    score=auto_match.score,
                    source=auto_match.source,
                    window=auto_match.window,
                    status=status,
                )
        else:
            match = find_best_match(
                text,
                source_tokens,
                min_time=min_time,
                min_score=min_score,
            )
            if match is None:
                report.append(
                    {
                        "text": text,
                        "status": "unmatched",
                        "min_time": round(min_time, 2),
                    }
                )
                if drop_unmatched:
                    continue
                time_value = round(max(last_time + 2.5, min_time), 2)
                match = Match(time=time_value, score=0.0, source="estimated", window="", status="estimated")

        time_value = match.time
        if time_value < last_time:
            time_value = last_time

        append_pending_sections(output_lines, pending_sections, time_value)
        output_lines.append({"time": time_value, "text": text})
        report_entry = {
            "text": text,
            "time": time_value,
            "score": match.score,
            "source": match.source,
            "status": match.status,
            "window": match.window,
        }
        if auto_time is not None and abs(auto_time - time_value) >= 0.05:
            report_entry["auto_time"] = auto_time
        report.append(report_entry)
        last_time = time_value
        min_time = time_value + 0.2

    vocal_lines = [line for line in output_lines if line.get("type") != "section"]
    payload = {
        "duration": duration,
        "vocalStart": vocal_lines[0]["time"] if vocal_lines else 0,
        "vocalEnd": vocal_lines[-1]["time"] if vocal_lines else duration,
        "alignment": track.get(
            "alignment",
            "Demucs vocal stem plus Whisper word timestamps; see report.json for match scores",
        ),
        "lines": output_lines,
    }
    return player_src, payload, report


def write_json(path: pathlib.Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(format_json(payload) + "\n")


def read_json_if_exists(path: pathlib.Path) -> Any | None:
    if not path.exists():
        return None
    return json.loads(path.read_text())


def order_tracks(tracks: dict[str, Any], manifest_tracks: list[dict[str, Any]]) -> dict[str, Any]:
    ordered: dict[str, Any] = {}
    for track in manifest_tracks:
        player_src = track["player_src"]
        if player_src in tracks:
            ordered[player_src] = tracks[player_src]

    for player_src, payload in tracks.items():
        if player_src not in ordered:
            ordered[player_src] = payload

    return ordered


def is_scalar(value: Any) -> bool:
    return value is None or isinstance(value, (bool, int, float, str))


def is_compact_dict(value: dict[str, Any]) -> bool:
    return bool(value) and all(is_scalar(item) for item in value.values())


def format_json(value: Any, *, indent: int = 0) -> str:
    if isinstance(value, dict):
        if is_compact_dict(value):
            inner = json.dumps(value, ensure_ascii=False, separators=(", ", ": "))
            return "{ " + inner[1:-1] + " }"
        if not value:
            return "{}"

        current = " " * indent
        child = " " * (indent + 2)
        lines = ["{"]
        items = list(value.items())
        for index, (key, item) in enumerate(items):
            comma = "," if index < len(items) - 1 else ""
            lines.append(
                f"{child}{json.dumps(str(key), ensure_ascii=False)}: "
                f"{format_json(item, indent=indent + 2)}{comma}"
            )
        lines.append(f"{current}}}")
        return "\n".join(lines)

    if isinstance(value, list):
        if not value:
            return "[]"

        current = " " * indent
        child = " " * (indent + 2)
        lines = ["["]
        for index, item in enumerate(value):
            comma = "," if index < len(value) - 1 else ""
            lines.append(f"{child}{format_json(item, indent=indent + 2)}{comma}")
        lines.append(f"{current}]")
        return "\n".join(lines)

    return json.dumps(value, ensure_ascii=False)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", help="Path to a lyrics sync manifest JSON file.")
    parser.add_argument("--skip-analysis", action="store_true", help="Reuse existing Demucs and Whisper outputs.")
    parser.add_argument("--model", default=None, help="Whisper model name. Defaults to manifest or turbo.")
    parser.add_argument("--model-dir", default=None, help="Whisper model cache directory.")
    parser.add_argument("--work-dir", default=None, help="Override manifest work_dir.")
    parser.add_argument(
        "--track",
        action="append",
        default=[],
        help="Only sync a matching track slug, player_src, audio path, file name, or stem. Repeatable.",
    )
    args = parser.parse_args()

    base_dir = repo_root()
    manifest_path = relpath(args.manifest, pathlib.Path.cwd())
    manifest = json.loads(manifest_path.read_text())

    work_dir = relpath(args.work_dir or manifest.get("work_dir", ".audio-lyrics-work/default"), base_dir)
    output_path = relpath(manifest["output"], base_dir)
    model = args.model or manifest.get("whisper_model", DEFAULT_MODEL)
    model_dir = relpath(args.model_dir or manifest.get("model_dir", "/private/tmp/whisper-models"), base_dir)
    language = manifest.get("language", "en")
    demucs_model = manifest.get("demucs_model", "htdemucs")

    selected_tracks = manifest["tracks"]
    if args.track:
        selected_tracks = [
            track
            for track in manifest["tracks"]
            if any(track_matches_selector(track, selector, base_dir) for selector in args.track)
        ]
        if not selected_tracks:
            selectors = ", ".join(args.track)
            raise SystemExit(f"No tracks matched --track: {selectors}")

    existing_output = read_json_if_exists(output_path) if args.track else None
    existing_report = read_json_if_exists(work_dir / "report.json") if args.track else None

    tracks: dict[str, Any] = dict((existing_output or {}).get("tracks") or {})
    reports: dict[str, Any] = dict(existing_report or {})

    for track in selected_tracks:
        player_src, payload, report = align_track(
            track,
            base_dir=base_dir,
            work_dir=work_dir,
            model=model,
            model_dir=model_dir,
            language=language,
            demucs_model=demucs_model,
            skip_analysis=args.skip_analysis,
        )
        tracks[player_src] = payload
        reports[player_src] = report

    output = {
        "version": int(manifest.get("version", 1)),
        "generated": dt.date.today().isoformat(),
        "tracks": order_tracks(tracks, manifest["tracks"]),
    }
    write_json(output_path, output)

    for copy_target in manifest.get("copy_to", []):
        write_json(relpath(copy_target, base_dir), output)

    write_json(work_dir / "report.json", reports)
    print(f"Wrote {output_path}")
    print(f"Wrote {work_dir / 'report.json'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
