// Progressive enhancement for post images (_includes/post/image.html): when an
// image's natural resolution is larger than the size it's displayed at, make it
// clickable to open full-screen in a shared overlay. Images already shown at
// full size get no zoom affordance. No-JS degrades to a plain, non-clickable img.

// A few px of slack absorbs sub-pixel layout rounding so we don't offer a zoom
// that reveals nothing. naturalWidth is 0 until the image has loaded.
const THRESHOLD = 8;

export function shouldZoom(naturalWidth, clientWidth) {
  return naturalWidth > 0 && naturalWidth - clientWidth > THRESHOLD;
}

function init() {
  const imgs = document.querySelectorAll(".post-content figure.imagewrapper img");
  if (!imgs.length) return;

  const overlay = document.createElement("div");
  overlay.className = "pf-imgzoom";
  overlay.innerHTML = '<img alt="">';
  const big = overlay.querySelector("img");
  document.body.appendChild(overlay);

  const close = () => overlay.classList.remove("is-open");
  overlay.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  const mark = (img) => img.classList.toggle("zoomable", shouldZoom(img.naturalWidth, img.clientWidth));

  imgs.forEach((img) => {
    if (img.complete && img.naturalWidth) mark(img);
    else img.addEventListener("load", () => mark(img));

    img.addEventListener("click", () => {
      if (!img.classList.contains("zoomable")) return;
      big.src = img.currentSrc || img.src;
      big.alt = img.alt || "";
      overlay.classList.add("is-open");
    });
  });

  // The displayed width changes with the viewport, so re-evaluate on resize.
  window.addEventListener("resize", () => imgs.forEach(mark));
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
