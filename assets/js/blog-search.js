// Live filter for the Captain's Log (blog.html). Every post is already in the
// DOM, so search is a pure client-side filter over the `data-search` text baked
// into each `.log-entry` — no index, no fetch, no dependency. No-JS degrades to
// the full grouped list.

// While filtering we hide the year headers and compass dividers: results become
// a flat list, which sidesteps having to recompute which year groups went empty.

export function matches(haystack, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const hay = (haystack || "").toLowerCase();
  return terms.every((t) => hay.includes(t));
}

function init() {
  const list = document.querySelector(".log-list");
  const box = document.querySelector(".log-search input");
  if (!list || !box) return;

  const entries = [...list.querySelectorAll(".log-entry")];
  const chrome = [...list.querySelectorAll(".log-year, .pf-divider")];
  const empty = list.parentElement.querySelector(".log-empty");
  const headerClear = document.querySelector(".log-search .log-search-clear");
  const clears = [...document.querySelectorAll(".log-search-clear")];

  // href -> post body text, filled in async from search.json (see below).
  const bodies = Object.create(null);

  const apply = () => {
    const q = box.value.trim();
    const searching = q !== "";
    let hits = 0;
    entries.forEach((el) => {
      const hay = el.dataset.search + " " + (bodies[el.getAttribute("href")] || "");
      const show = matches(hay, q);
      el.hidden = !show;
      if (show) hits++;
    });
    // Year headers/dividers are organisational chrome, meaningless once filtered.
    chrome.forEach((el) => (el.hidden = searching));
    if (empty) empty.hidden = !(searching && hits === 0);
    if (headerClear) headerClear.hidden = !searching;
  };

  const reset = () => {
    box.value = "";
    box.focus();
    apply();
  };

  box.addEventListener("input", apply);
  clears.forEach((btn) => btn.addEventListener("click", reset));
  apply();

  // Pull in post bodies so search reaches article text, not just metadata.
  // Metadata search already works before this resolves; a failure just leaves
  // full-text off rather than breaking the filter.
  const url = list.dataset.searchUrl;
  if (url) {
    fetch(url)
      .then((r) => r.json())
      .then((posts) => {
        posts.forEach((p) => (bodies[p.url] = p.body));
        apply();
      })
      .catch(() => {});
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
