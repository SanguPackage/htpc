// Enhancement layer on top of highlight.js: per-line wrapping so we can mark
// specific lines, an opt-in number gutter, a filename/language tab, and a copy
// button. Authored from Markdown via a kramdown IAL on the fenced block:
//
//   ```yaml
//   ...
//   ```
//   {: data-line="2,4-6" data-file="compose.yml" .line-numbers}
//
// `data-line` marks lines (1-based, comma list + a-b ranges), `data-file` sets
// the tab caption (falls back to the language), `.line-numbers` shows the gutter.

// "2,4-6" -> Set{2,4,5,6}. Missing/blank -> empty set.
export function parseLineSpec(spec) {
  const set = new Set();
  if (!spec) return set;
  for (const part of String(spec).split(",")) {
    const range = part.trim().match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      for (let i = +range[1]; i <= +range[2]; i++) set.add(i);
    } else if (/^\d+$/.test(part.trim())) {
      set.add(+part.trim());
    }
  }
  return set;
}

// Split highlight.js output into one HTML string per source line. A token span
// may straddle a newline (multi-line strings/comments), so we close every open
// span at the line break and reopen it on the next line to keep each line valid
// HTML. A single trailing newline (kramdown emits one) does not add a blank line.
export function splitHighlightedLines(html) {
  const lines = [];
  const open = []; // stack of opening <span ...> strings still in scope
  let cur = "";
  const token = /(<[^>]+>)|([^<]+)/g;
  let m;
  while ((m = token.exec(html))) {
    if (m[1]) {
      const tag = m[1];
      cur += tag;
      if (tag.startsWith("</")) open.pop();
      else if (!tag.endsWith("/>")) open.push(tag);
    } else {
      const parts = m[2].split("\n");
      for (let i = 0; i < parts.length; i++) {
        if (i > 0) {
          cur += "</span>".repeat(open.length);
          lines.push(cur);
          cur = open.join("");
        }
        cur += parts[i];
      }
    }
  }
  lines.push(cur);
  if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

// Wrap each line in a `.cl` block, marking 1-based lines in `marked`. Joined with
// no separator: a newline text node between blocks inside a <pre> would render as
// an extra blank line. Line breaks for copying are reconstructed from the spans.
export function renderLines(lines, marked) {
  return lines
    .map((line, i) => `<span class="${marked.has(i + 1) ? "cl hl" : "cl"}">${line}</span>`)
    .join("");
}

function languageOf(code) {
  const cls = [...code.classList].find((c) => c.startsWith("language-"));
  return cls ? cls.slice("language-".length) : "";
}

function enhanceBlock(pre, hljs) {
  const code = pre.querySelector("code");
  if (!code || pre.dataset.enhanced) return;
  pre.dataset.enhanced = "1";

  const lang = languageOf(code);
  hljs.highlightElement(code); // adds .hljs + token spans; keeps language class

  const marked = parseLineSpec(pre.getAttribute("data-line"));
  code.innerHTML = renderLines(splitHighlightedLines(code.innerHTML), marked);

  const wrap = document.createElement("div");
  wrap.className = "codewrap";
  if (pre.classList.contains("line-numbers")) wrap.classList.add("line-numbers");
  pre.replaceWith(wrap);

  const bar = document.createElement("div");
  bar.className = "codebar";
  const label = document.createElement("span");
  label.className = "codelang";
  label.textContent = pre.getAttribute("data-file") || lang || "code";
  const copy = document.createElement("button");
  copy.type = "button";
  copy.className = "codecopy";
  copy.textContent = "Copy";
  copy.addEventListener("click", () => {
    // Rebuild newlines from the per-line spans; they carry no whitespace between them.
    const text = [...code.querySelectorAll(".cl")].map((el) => el.textContent).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      copy.textContent = "Copied";
      copy.classList.add("copied");
      setTimeout(() => {
        copy.textContent = "Copy";
        copy.classList.remove("copied");
      }, 1400);
    });
  });
  bar.append(label, copy);
  wrap.append(bar, pre);
}

export function enhanceAll(root = document) {
  const hljs = globalThis.hljs;
  if (!hljs) return;
  root.querySelectorAll("pre > code").forEach((code) => enhanceBlock(code.parentElement, hljs));
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => enhanceAll());
  } else {
    enhanceAll();
  }
}
