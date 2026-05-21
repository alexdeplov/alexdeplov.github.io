#!/usr/bin/env python3
from __future__ import annotations

import html
import re
import shutil
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import quote, unquote


REPO_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path("/Users/alex/Downloads/Private & Shared/Collection of Generative Art Codes")
OUT_ROOT = REPO_ROOT / "static" / "tools" / "generative-art"
ASSET_ROOT = OUT_ROOT / "assets" / "collection"
PUBLIC_BASE = "/tools/generative-art"
GOATCOUNTER_SCRIPT = '<script data-goatcounter="https://goatinterface.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'
COPY_CODE_SCRIPT = """<script>
document.addEventListener("click", function (event) {
    var button = event.target.closest(".copy-code-button");
    if (!button) return;

    var block = button.closest(".code-block");
    var code = block ? block.querySelector("code") : null;
    if (!code) return;

    var text = code.textContent.replace(/\\n$/, "");

    function setButtonState(label, copied) {
        block.querySelectorAll(".copy-code-button").forEach(function (item) {
            item.textContent = label;
            item.classList.toggle("copied", copied);
        });
    }

    function markCopied() {
        setButtonState("Copied", true);
        window.setTimeout(function () {
            setButtonState("Copy code", false);
        }, 1400);
    }

    function fallbackCopy() {
        var textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            markCopied();
        } finally {
            document.body.removeChild(textarea);
        }
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(markCopied).catch(fallbackCopy);
    } else {
        fallbackCopy();
    }
});
</script>"""

CATEGORIES = [
    ("Animation", "Control animation with Paper.js code."),
    ("Cursor", "Mouse and pointer interactions."),
    ("Path", "Creative vector and path experiments."),
]

MEDIA_EXTENSIONS = {".gif", ".png", ".jpg", ".jpeg", ".webp", ".mp4"}

JS_KEYWORDS = {
    "async",
    "await",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "finally",
    "for",
    "from",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "of",
    "return",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
}

JS_CONSTANTS = {"true", "false", "null", "undefined", "NaN", "Infinity"}

PAPER_JS_BUILTINS = {
    "Color",
    "CompoundPath",
    "Curve",
    "Group",
    "Layer",
    "Matrix",
    "Path",
    "Point",
    "PointText",
    "Project",
    "Raster",
    "Rectangle",
    "Segment",
    "Shape",
    "Size",
    "Symbol",
    "Tool",
    "console",
    "event",
    "Math",
    "paper",
    "project",
    "view",
}


@dataclass
class SourceLink:
    title: str
    url: str


@dataclass
class Item:
    category: str
    title: str
    slug: str
    page_url: str
    preview_url: str | None
    preview_type: str | None
    code_blocks: list[str]
    sketch_links: list[str]
    source_links: list[SourceLink]


def strip_tags(value: str) -> str:
    return re.sub(r"<[^>]+>", "", value)


def clean_text(value: str) -> str:
    return " ".join(html.unescape(strip_tags(value)).split())


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()).strip("-")
    return slug or "example"


def item_id(path: Path) -> str:
    match = re.search(r"([0-9a-f]{32})$", path.stem)
    return match.group(1)[:8] if match else path.stem[-8:]


def public_asset_url(category: str, relative_url: str) -> str:
    decoded = unquote(html.unescape(relative_url))
    encoded = quote(f"{category}/{decoded}", safe="/-_.(),")
    return f"{PUBLIC_BASE}/assets/collection/{encoded}"


def read_order_from_export() -> dict[str, list[Path]]:
    order: dict[str, list[Path]] = {category: [] for category, _ in CATEGORIES}
    export_pages = sorted(SOURCE_ROOT.parent.glob("Collection of Generative Art Codes *.html"))
    if not export_pages:
        return order

    text = export_pages[0].read_text(encoding="utf-8", errors="replace")
    pattern = re.compile(
        r'href="Collection%20of%20Generative%20Art%20Codes/([^"]+?\.html)"',
        re.IGNORECASE,
    )

    seen: set[Path] = set()
    for href in pattern.findall(text):
        decoded = unquote(html.unescape(href))
        category = decoded.split("/", 1)[0]
        if category not in order:
            continue
        path = SOURCE_ROOT / decoded
        if path.exists() and path not in seen:
            order[category].append(path)
            seen.add(path)

    return order


def ordered_html_files(category: str, export_order: dict[str, list[Path]]) -> list[Path]:
    ordered = list(export_order.get(category, []))
    seen = set(ordered)
    remaining = [
        path
        for path in sorted((SOURCE_ROOT / category).glob("*.html"), key=lambda item: item.name.lower())
        if path not in seen
    ]
    return ordered + remaining


def first_preview_from_html(category: str, text: str) -> tuple[str | None, str | None]:
    image_match = re.search(
        r'<figure[^>]*class="[^"]*\bimage\b[^"]*"[^>]*>.*?<img[^>]+src="([^"]+)"',
        text,
        re.IGNORECASE | re.DOTALL,
    )
    if image_match:
        url = public_asset_url(category, image_match.group(1))
        return url, "video" if Path(unquote(url)).suffix.lower() == ".mp4" else "image"

    source_match = re.search(
        r'<a[^>]+href="([^"]+\.(?:gif|png|jpe?g|webp|mp4))"',
        text,
        re.IGNORECASE,
    )
    if source_match:
        relative = source_match.group(1)
        suffix = Path(unquote(relative)).suffix.lower()
        return public_asset_url(category, relative), "video" if suffix == ".mp4" else "image"

    return None, None


def extract_title(path: Path, text: str) -> str:
    match = re.search(r'<h1[^>]*class="[^"]*\bpage-title\b[^"]*"[^>]*>(.*?)</h1>', text, re.DOTALL)
    if match:
        title = clean_text(match.group(1))
        if title:
            return title
    return re.sub(r"\s+[0-9a-f]{32}$", "", path.stem).strip()


def extract_code_blocks(text: str) -> list[str]:
    blocks = []
    pattern = re.compile(r"<pre[^>]*>.*?<code[^>]*>(.*?)</code>.*?</pre>", re.IGNORECASE | re.DOTALL)
    for match in pattern.findall(text):
        code = html.unescape(strip_tags(match)).strip()
        if code:
            blocks.append(code)
    return blocks


def extract_sketch_links(text: str) -> list[str]:
    links = []
    for href in re.findall(r'href="(https?://sketch\.paperjs\.org/[^"]+)"', text, re.IGNORECASE):
        decoded = html.unescape(href)
        if decoded not in links:
            links.append(decoded)
    return links


def extract_source_links(category: str, text: str) -> list[SourceLink]:
    links: list[SourceLink] = []
    pattern = re.compile(r'<div class="source"><a href="([^"]+)">(.*?)</a></div>', re.IGNORECASE | re.DOTALL)
    for href, label in pattern.findall(text):
        decoded = html.unescape(href)
        if decoded.startswith("http://sketch.paperjs.org") or decoded.startswith("https://sketch.paperjs.org"):
            continue
        title = clean_text(label) or Path(unquote(decoded)).name
        if not title:
            continue
        if decoded.startswith("http://") or decoded.startswith("https://"):
            url = decoded
        else:
            url = public_asset_url(category, decoded)
        if all(link.url != url for link in links):
            links.append(SourceLink(title=title, url=url))
    return links


def parse_items() -> list[Item]:
    export_order = read_order_from_export()
    items: list[Item] = []

    for category, _ in CATEGORIES:
        used_slugs: set[str] = set()
        for path in ordered_html_files(category, export_order):
            text = path.read_text(encoding="utf-8", errors="replace")
            title = extract_title(path, text)
            slug = slugify(title)
            if slug in used_slugs:
                slug = f"{slug}-{item_id(path)}"
            used_slugs.add(slug)

            page_url = f"{PUBLIC_BASE}/{slugify(category)}/{slug}/"
            preview_url, preview_type = first_preview_from_html(category, text)
            items.append(
                Item(
                    category=category,
                    title=title,
                    slug=slug,
                    page_url=page_url,
                    preview_url=preview_url,
                    preview_type=preview_type,
                    code_blocks=extract_code_blocks(text),
                    sketch_links=extract_sketch_links(text),
                    source_links=extract_source_links(category, text),
                )
            )

    return items


def media_markup(item: Item, class_name: str = "") -> str:
    classes = f' class="{class_name}"' if class_name else ""
    alt = html.escape(item.title, quote=True)
    if item.preview_type == "video" and item.preview_url:
        return (
            f'<video{classes} src="{html.escape(item.preview_url, quote=True)}" '
            'autoplay loop muted playsinline preload="metadata"></video>'
        )
    if item.preview_url:
        return f'<img{classes} src="{html.escape(item.preview_url, quote=True)}" alt="{alt}" loading="eager" decoding="async">'
    return '<div class="placeholder" aria-hidden="true"></div>'


def color_span(value: str, color: str) -> str:
    return f'<span style="color:{color}">{html.escape(value)}</span>'


def is_identifier_start(value: str) -> bool:
    return value.isalpha() or value in "_$"


def is_identifier_part(value: str) -> bool:
    return value.isalnum() or value in "_$"


def highlight_js_line(line: str, in_block_comment: bool) -> tuple[str, bool]:
    parts: list[str] = []
    index = 0
    length = len(line)

    while index < length:
        if in_block_comment:
            end = line.find("*/", index)
            if end == -1:
                parts.append(color_span(line[index:], "#7f848e"))
                return "".join(parts), True
            parts.append(color_span(line[index : end + 2], "#7f848e"))
            index = end + 2
            in_block_comment = False
            continue

        char = line[index]
        next_char = line[index + 1] if index + 1 < length else ""

        if char == "/" and next_char == "/":
            parts.append(color_span(line[index:], "#7f848e"))
            break

        if char == "/" and next_char == "*":
            end = line.find("*/", index + 2)
            if end == -1:
                parts.append(color_span(line[index:], "#7f848e"))
                return "".join(parts), True
            parts.append(color_span(line[index : end + 2], "#7f848e"))
            index = end + 2
            continue

        if char in {"'", '"', "`"}:
            quote_char = char
            end = index + 1
            escaped = False
            while end < length:
                current = line[end]
                if escaped:
                    escaped = False
                elif current == "\\":
                    escaped = True
                elif current == quote_char:
                    end += 1
                    break
                end += 1
            parts.append(color_span(line[index:end], "#98c379"))
            index = end
            continue

        if char.isdigit() or (char == "." and next_char.isdigit()):
            end = index + 1
            while end < length and re.match(r"[0-9a-fA-FxXoObBeE_+.:-]", line[end]):
                end += 1
            parts.append(color_span(line[index:end], "#d19a66"))
            index = end
            continue

        if is_identifier_start(char):
            end = index + 1
            while end < length and is_identifier_part(line[end]):
                end += 1
            token = line[index:end]
            next_non_space = end
            while next_non_space < length and line[next_non_space].isspace():
                next_non_space += 1
            if token in JS_KEYWORDS:
                parts.append(color_span(token, "#c678dd"))
            elif token in JS_CONSTANTS:
                parts.append(color_span(token, "#d19a66"))
            elif token in PAPER_JS_BUILTINS or (next_non_space < length and line[next_non_space] == "("):
                parts.append(color_span(token, "#e5c07b"))
            else:
                parts.append(html.escape(token))
            index = end
            continue

        if char in "=+-*/%<>!&|?:":
            end = index + 1
            while end < length and line[end] in "=+-*/%<>!&|?:":
                end += 1
            parts.append(color_span(line[index:end], "#56b6c2"))
            index = end
            continue

        parts.append(html.escape(char))
        index += 1

    return "".join(parts), in_block_comment


def highlight_js(code: str) -> str:
    lines = code.splitlines() or [""]
    in_block_comment = False
    rendered_lines = []
    for line in lines:
        highlighted, in_block_comment = highlight_js_line(line, in_block_comment)
        rendered_lines.append(f'<span style="display:flex;"><span>{highlighted}\n</span></span>')
    return "".join(rendered_lines)


def highlighted_code_block(code: str) -> str:
    return (
        '<div class="code-block">'
        '<div class="code-toolbar code-toolbar-top"><button class="copy-code-button" type="button">Copy code</button></div>'
        '<div class="highlight"><pre tabindex="0" '
        'style="color:#abb2bf;background-color:#282c34;-moz-tab-size:4;-o-tab-size:4;'
        'tab-size:4;-webkit-text-size-adjust:none;">'
        f'<code class="language-js" data-lang="js">{highlight_js(code)}</code></pre></div>'
        '<div class="code-toolbar code-toolbar-bottom"><button class="copy-code-button" type="button">Copy code</button></div>'
        '</div>'
    )


def base_styles() -> str:
    return """
        :root {
            color-scheme: light;
            --bg-color: #fcfbf8;
            --text-color: #131522;
            --heading-color: #1a1a1a;
            --muted: #71717a;
            --tile: rgba(0, 0, 0, 0.05);
            --tile-border: rgba(0, 0, 0, 0.06);
            --accent: #f46c04;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg-color: #18181c;
                --text-color: #e3e3e3;
                --heading-color: #d7d7d7;
                --muted: #a1a1aa;
                --tile: rgba(255, 255, 255, 0.05);
                --tile-border: rgba(255, 255, 255, 0.08);
            }
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            background: var(--bg-color);
            color: var(--text-color);
            font-family: "Archivo", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            font-weight: 700;
            line-height: 1.6;
        }

        a { color: inherit; }

        .page {
            width: 100%;
            max-width: 48rem;
            margin: 0 auto;
            padding: 48px 1rem 72px;
        }

        .top-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 52px;
            color: var(--muted);
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
        }

        .top-link:hover { color: var(--heading-color); text-decoration: underline; }

        .hero {
            margin-bottom: 44px;
        }

        h1 {
            margin: 0;
            color: var(--heading-color);
            font-size: 2rem;
            line-height: 1.2;
            letter-spacing: 0;
            font-weight: 700;
        }

        .summary {
            margin: 20px 0 0;
            color: #1d1f21;
            font-family: "Source Serif 4", Georgia, serif;
            font-size: 18px;
            font-weight: 400;
            line-height: 1.6;
        }

        @media (prefers-color-scheme: dark) {
            .summary { color: #b4b4b4; }
        }

        .section-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 22px;
        }

        .section-nav a {
            color: var(--accent);
            font-size: 15px;
            font-weight: 700;
            text-decoration: underline;
        }

        .section-nav a:hover { text-decoration-thickness: 2px; }

        .gallery-section { margin-top: 44px; }

        .section-header {
            margin-bottom: 14px;
        }

        h2 {
            margin: 0;
            color: var(--heading-color);
            font-size: 1.5rem;
            line-height: 1.25;
            letter-spacing: 0;
            font-weight: 700;
        }

        .count {
            display: block;
            color: var(--muted);
            font-size: 13px;
            font-weight: 600;
            margin-top: 4px;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5px;
            width: 100%;
            margin: 0 auto;
            padding: 20px 0;
            align-items: stretch;
        }

        .card {
            display: flex;
            flex-direction: column;
            min-width: 0;
            height: 100%;
            overflow: hidden;
            border-radius: 10px;
            padding: 0;
            background: transparent;
            text-decoration: none;
            color: inherit;
        }

        .thumb {
            width: 100%;
            display: flex;
            place-items: center;
            align-items: center;
            justify-content: center;
            aspect-ratio: 4 / 3;
            overflow: hidden;
            border-radius: 8px;
            background: transparent;
        }

        @media (prefers-color-scheme: dark) {
            .thumb { background: transparent; }
        }

        .thumb img,
        .thumb video {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
            border-radius: inherit;
        }

        .placeholder {
            width: 58px;
            aspect-ratio: 1;
            border: 5px solid rgba(255, 255, 255, 0.18);
            border-top-color: rgba(255, 255, 255, 0.78);
            border-radius: 50%;
        }

        .card-title {
            flex: 0 0 46px;
            display: -webkit-box;
            margin: 0;
            padding: 10px 10px 0 0;
            color: var(--text-color);
            font-size: 13px;
            line-height: 1.2;
            letter-spacing: 0;
            font-weight: 600;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            overflow-wrap: anywhere;
        }

        .article-top {
            width: 100%;
            max-width: 48rem;
            margin: 0 auto;
            padding: 48px 1rem 32px;
            color: var(--muted);
        }

        .article-author {
            color: var(--muted);
            font-weight: 600;
            text-decoration: none;
        }

        .article-author:hover {
            color: var(--heading-color);
            text-decoration: underline;
        }

        .article-detail {
            width: 100%;
            max-width: 48rem;
            margin: 0 auto;
            padding: 32px 1rem 72px;
        }

        .article-header {
            margin-bottom: 32px;
        }

        .article-meta {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0 8px;
            margin-top: 8px;
            color: var(--muted);
            font-size: 14px;
            font-weight: 600;
        }

        .article-meta a {
            color: inherit;
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 2px;
        }

        .article-meta a:hover {
            color: var(--heading-color);
        }

        .preview-panel {
            margin-top: 16px;
            border-radius: 0.3rem;
            overflow: hidden;
            background: var(--tile);
        }

        .preview-panel img,
        .preview-panel video {
            width: 100%;
            max-height: 72vh;
            display: block;
            object-fit: contain;
        }

        .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px 14px;
            margin-top: 24px;
        }

        .text-link {
            display: inline;
            color: var(--accent);
            font-size: 15px;
            font-weight: 700;
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        .text-link:hover {
            text-decoration-thickness: 2px;
        }

        .sketch-link {
            flex: 0 0 100%;
        }

        .button {
            display: inline;
            align-items: center;
            min-height: 0;
            border: 0;
            border-radius: 0;
            padding: 0;
            background: transparent;
            color: var(--accent);
            font-size: 15px;
            font-weight: 700;
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        .button.secondary {
            background: transparent;
            color: var(--accent);
            font-size: 15px;
            font-weight: 750;
            text-decoration: none;
        }

        .button:hover { text-decoration-thickness: 2px; }

        .content-section {
            margin-top: 32px;
        }

        .content-section h2 {
            margin: 0 0 14px;
            color: var(--heading-color);
            font-size: 1.5rem;
            line-height: 1.25;
            font-weight: 700;
        }

        .content-section p {
            color: #1d1f21;
            font-family: "Source Serif 4", Georgia, serif;
            font-size: 18px;
            font-weight: 400;
        }

        @media (prefers-color-scheme: dark) {
            .content-section p { color: #b4b4b4; }
        }

        .code-block {
            margin: 1em 0;
            overflow: hidden;
            border-radius: 0.5rem;
            background-color: #181818;
        }

        @media (prefers-color-scheme: dark) {
            .code-block {
                background-color: hsl(232, 20.3%, 6.4%);
            }
        }

        .code-toolbar {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            min-height: 26px;
            background: inherit;
        }

        .code-toolbar-top {
            padding: 10px 9px 0;
        }

        .code-toolbar-bottom {
            padding: 0 1.5em 10px;
        }

        .copy-code-button {
            appearance: none;
            border: 1px solid rgba(171, 178, 191, 0.26);
            border-radius: 0.3rem;
            padding: 4px 8px;
            background: transparent;
            color: #abb2bf;
            font: inherit;
            font-size: 12px;
            font-weight: 700;
            line-height: 1.2;
            cursor: pointer;
        }

        .copy-code-button:hover,
        .copy-code-button.copied {
            border-color: rgba(244, 108, 4, 0.55);
            color: var(--accent);
        }

        .highlight pre {
            overflow-x: auto;
            margin: 0;
            border: 0;
            border-radius: 0;
            padding: 1.5em;
            box-sizing: border-box;
            background: transparent !important;
            color: #abb2bf;
            font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
            font-size: 0.8rem;
            font-weight: 400 !important;
            line-height: 1.5;
            white-space: pre;
            max-width: 100%;
        }

        @media (prefers-color-scheme: dark) {
            .highlight pre {
                background: transparent !important;
            }
        }

        .highlight code {
            display: block;
            white-space: pre;
        }

        .source-list {
            display: grid;
            gap: 10px;
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .source-list a {
            color: var(--accent);
            font-weight: 700;
        }

        .article-copyright {
            margin: 56px 0 12px;
            color: var(--muted);
            font-size: 14px;
            font-weight: 600;
        }

        @media (max-width: 760px) {
            .page {
                padding-top: 24px;
            }

            .article-top { padding-top: 24px; }

            .grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    """


def render_index(items: list[Item]) -> str:
    grouped = {category: [item for item in items if item.category == category] for category, _ in CATEGORIES}
    nav = "\n".join(
        f'<a href="#{slugify(category)}">{html.escape(category)} <span>{len(grouped[category])}</span></a>'
        for category, _ in CATEGORIES
    )
    sections = []
    for category, description in CATEGORIES:
        cards = []
        for item in grouped[category]:
            cards.append(
                f"""
                <a class="card" href="{html.escape(item.page_url, quote=True)}">
                    <div class="thumb">{media_markup(item, "thumb-media")}</div>
                    <h3 class="card-title">{html.escape(item.title)}</h3>
                </a>
                """
            )
        sections.append(
            f"""
            <section class="gallery-section" id="{slugify(category)}">
                <div class="section-header">
                    <div>
                        <h2>{html.escape(category)}</h2>
                        <p class="summary">{html.escape(description)}</p>
                    </div>
                    <span class="count">{len(grouped[category])} examples</span>
                </div>
                <div class="grid">
                    {''.join(cards)}
                </div>
            </section>
            """
        )

    return f"""<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Generative Art Codes - Alexander Deplov</title>
    <meta name="description" content="Paper.js generative art examples by Alexander Deplov.">
    <link rel="canonical" href="https://interfacecraft.online/tools/generative-art/">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet">
    <style>{base_styles()}</style>
</head>
<body>
    <main class="page">
        <a class="top-link" href="/">Alexander Deplov</a>
        <header class="hero">
            <div>
                <h1>Generative Art Codes</h1>
                <p class="summary">Paper.js sketches and interaction experiments collected as visual examples.</p>
            </div>
            <nav class="section-nav" aria-label="Gallery sections">
                {nav}
            </nav>
        </header>
        {''.join(sections)}
    </main>
    {GOATCOUNTER_SCRIPT}
</body>
</html>
"""


def render_detail(item: Item) -> str:
    sketch_buttons = "\n".join(
        f'<a class="text-link sketch-link" href="{html.escape(link, quote=True)}" target="_blank" rel="noopener noreferrer">Open v{index + 1} in Sketch</a>'
        for index, link in enumerate(item.sketch_links)
    )
    source_buttons = "\n".join(
        f'<a class="button secondary" href="{html.escape(link.url, quote=True)}">{html.escape(link.title)}</a>'
        for link in item.source_links[:6]
    )
    code_sections = "\n".join(
        f"""
        <section class="content-section">
            <h2>{'Code' if index == 0 else f'Code {index + 1}'}</h2>
            {highlighted_code_block(code)}
        </section>
        """
        for index, code in enumerate(item.code_blocks)
    )
    source_section = ""
    if item.source_links:
        source_section = f"""
        <section class="content-section">
            <h2>Files</h2>
            <ul class="source-list">
                {''.join(f'<li><a href="{html.escape(link.url, quote=True)}">{html.escape(link.title)}</a></li>' for link in item.source_links)}
            </ul>
        </section>
        """
    if not code_sections and not source_section:
        code_sections = """
        <section class="content-section">
            <h2>Source</h2>
            <p>The original export did not include an inline code block for this example.</p>
        </section>
        """

    actions = ""
    if sketch_buttons or source_buttons:
        actions = f'<div class="actions">{sketch_buttons}{source_buttons}</div>'
    copy_code_script = COPY_CODE_SCRIPT if item.code_blocks else ""

    preview = media_markup(item, "preview-media")

    return f"""<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{html.escape(item.title)} - Generative Art Codes</title>
    <meta name="description" content="{html.escape(item.title, quote=True)} Paper.js generative art example.">
    <link rel="canonical" href="https://interfacecraft.online{html.escape(item.page_url, quote=True)}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet">
    <style>{base_styles()}</style>
</head>
<body>
    <header class="article-top">
        <a class="article-author" href="/">Alexander Deplov</a>
    </header>
    <article class="article-detail">
        <header class="article-header">
            <h1>{html.escape(item.title)}</h1>
            <div class="article-meta">
                <span>{html.escape(item.category)}</span>
                <span>•</span>
                <a href="/tools/generative-art/">Generative Art Codes</a>
                <span>•</span>
                <span>Paper.js</span>
            </div>
        </header>
        <div class="content">
            <section class="preview-panel" aria-label="Preview">
                {preview}
            </section>
            {actions}
            {source_section}
            {code_sections}
        </div>
        <footer class="article-copyright">
            &copy; 2026 Alexander Deplov, designer and developer of iOS and macOS apps, product designer.
        </footer>
    </article>
    {copy_code_script}
    {GOATCOUNTER_SCRIPT}
</body>
</html>
"""


def copy_assets() -> None:
    ASSET_ROOT.parent.mkdir(parents=True, exist_ok=True)
    if ASSET_ROOT.exists():
        shutil.rmtree(ASSET_ROOT)
    shutil.copytree(SOURCE_ROOT, ASSET_ROOT)


def write_pages(items: list[Item]) -> None:
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    (OUT_ROOT / "index.html").write_text(render_index(items), encoding="utf-8")
    for item in items:
        page_dir = OUT_ROOT / slugify(item.category) / item.slug
        page_dir.mkdir(parents=True, exist_ok=True)
        (page_dir / "index.html").write_text(render_detail(item), encoding="utf-8")


def main() -> None:
    if not SOURCE_ROOT.exists():
        raise SystemExit(f"Source export does not exist: {SOURCE_ROOT}")
    copy_assets()
    items = parse_items()
    write_pages(items)
    print(f"Generated {len(items)} examples at {OUT_ROOT}")


if __name__ == "__main__":
    main()
