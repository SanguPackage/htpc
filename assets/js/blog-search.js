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

  const apply = () => {
    const q = box.value.trim();
    const searching = q !== "";
    let hits = 0;
    entries.forEach((el) => {
      const show = matches(el.dataset.search, q);
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
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
