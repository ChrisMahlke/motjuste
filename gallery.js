// The screenshot viewer: a screenshot opens full size, and the arrow keys, Prev and Next, or a
// swipe step through the rest, iPhone then iPad. Without it, each screenshot is a plain link.
(function () {
  var dialog = document.querySelector(".lightbox");
  var shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  if (!dialog || !shots.length || typeof dialog.showModal !== "function") return;

  var image = dialog.querySelector(".lb-img");
  var caption = dialog.querySelector(".lb-caption");
  var count = dialog.querySelector(".lb-count");
  var sub = dialog.querySelector(".lb-sub");
  var index = 0;
  var opener = null;

  function show(i) {
    index = (i + shots.length) % shots.length;
    var shot = shots[index];
    var thumbnail = shot.querySelector("img");
    image.setAttribute("width", thumbnail.getAttribute("width"));
    image.setAttribute("height", thumbnail.getAttribute("height"));
    image.src = shot.getAttribute("href");
    image.alt = thumbnail.alt;
    caption.textContent = shot.dataset.caption;
    count.textContent = " (" + (index + 1) + " of " + shots.length + " · " + shot.dataset.device + ")";
    sub.textContent = shot.dataset.sub;
    dialog.classList.toggle("is-wide", shot.dataset.device === "iPad");
  }

  shots.forEach(function (shot, i) {
    shot.addEventListener("click", function (event) {
      // A click with a modifier key opens the image itself, as a link would.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = shot;
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
  dialog.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
  dialog.querySelector(".lb-close").addEventListener("click", function () { dialog.close(); });

  // A click on the dimmed page around the viewer closes it.
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") { event.preventDefault(); show(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); show(index - 1); }
  });

  dialog.addEventListener("close", function () {
    if (opener) opener.focus();
  });

  var startX = null;
  image.addEventListener("pointerdown", function (event) { startX = event.clientX; });
  image.addEventListener("pointercancel", function () { startX = null; });
  image.addEventListener("pointerup", function (event) {
    if (startX === null) return;
    var distance = event.clientX - startX;
    startX = null;
    if (Math.abs(distance) > 40) show(index + (distance < 0 ? 1 : -1));
  });
})();
