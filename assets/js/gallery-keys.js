// Keyboard navigation for the fullscreen cover gallery (_includes/gallery.html).
// The gallery is otherwise pure CSS (:target + scroll-snap); this only adds
// ArrowLeft/ArrowRight to step between slides and Escape to close, and only
// while a slide is actually open. location.replace keeps arrow-spamming out of
// the browser history (Back still closes the modal in one press).

// The open slide is the one the URL fragment points at inside a lightbox.
function openSlide() {
  return document.querySelector(".pf-lightbox__slide:target");
}

// Follow an existing gallery anchor (nav buttons / close) — they already carry
// the correct wrap-around / close target, so there's nothing to compute.
function follow(root, selector) {
  const link = root.querySelector(selector);
  if (link) location.replace(link.getAttribute("href"));
}

document.addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const slide = openSlide();
  if (!slide) return;

  // prev/next live inside the slide; close lives on the lightbox around it.
  if (e.key === "ArrowRight") { e.preventDefault(); follow(slide, ".pf-lightbox__next"); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); follow(slide, ".pf-lightbox__prev"); }
  else if (e.key === "Escape") { e.preventDefault(); follow(slide.closest(".pf-lightbox"), ".pf-lightbox__close"); }
});
