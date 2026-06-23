# Audio Lyrics Sync

Reusable workflow for syncing song lyrics to local audio files for the Hugo audio player.

The pipeline is:

1. Split vocals from the full mix with Demucs.
2. Transcribe the vocal stem with Whisper word timestamps.
3. Optionally transcribe the full mix as a backup source.
4. Fuzzy-match known lyric lines against transcript words.
5. Emit the same JSON shape consumed by `audio-block`.
6. Write a report with match scores and unmatched lines.

## Setup

Use a throwaway venv because Whisper, Torch, and Demucs are large:

```sh
python3.12 -m venv /private/tmp/audio-lyrics-sync-venv
/private/tmp/audio-lyrics-sync-venv/bin/pip install -r scripts/audio-lyrics-sync/requirements.txt
```

First run downloads the Whisper model and the Demucs model. Use a writable cache outside the repo:

```sh
export TORCH_HOME=/private/tmp/torch-cache
```

## Run

```sh
/private/tmp/audio-lyrics-sync-venv/bin/python scripts/audio-lyrics-sync/sync_lyrics.py \
  scripts/audio-lyrics-sync/freebsd-music-collection.manifest.json
```

To sync only one track and merge it into the existing lyrics JSON:

```sh
/private/tmp/audio-lyrics-sync-venv/bin/python scripts/audio-lyrics-sync/sync_lyrics.py \
  scripts/audio-lyrics-sync/freebsd-music-collection.manifest.json \
  --track kirk-kirk-bsd
```

The FreeBSD manifest writes:

- `static/audio/freebsd-music-collection-lyrics.json`
- `public/audio/freebsd-music-collection-lyrics.json`
- `.audio-lyrics-work/freebsd-music-collection/report.json`

Review the report before publishing. Low scores mean Whisper did not confidently find that lyric line in the audio.

## Manifest Shape

Each track needs:

- `audio`: local audio file to analyze.
- `player_src`: public path used by the site player.
- `lyrics`: ordered lyric entries.

Lyrics entries can be:

```json
{ "section": "Chorus" }
{ "text": "Boot into the red," }
{ "text": "Known manual line", "time": 57.36 }
```

Useful per-track options:

- `drop_unmatched`: omit lines that do not meet the match threshold.
- `min_score`: score required to accept an automatic match.
- `sources`: `["vocals", "mix"]`, `["vocals"]`, or `["mix"]`.

Use manual `time` values only for lines that need a correction after reviewing the report.
