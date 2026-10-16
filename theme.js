// Light or dark: the visitor's choice if they've made one, otherwise the device's setting.
// Loaded in <head>, before the page draws, so it never flashes the other theme.
(function () {
  var root = document.documentElement;
  var key = "motjuste-theme";
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function chosen() {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function current() {
    var theme = chosen();
    if (theme === "light" || theme === "dark") return theme;
    return media && media.matches ? "dark" : "light";
  }

  function label(button) {
    var dark = root.getAttribute("data-theme") === "dark";
    button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    button.setAttribute("title", dark ? "Light theme" : "Dark theme");
  }

  root.setAttribute("data-theme", current());

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.querySelector(".theme-toggle");
    if (!button) return;
    label(button);
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(key, next); } catch (e) {}
      label(button);
    });
    if (media && media.addEventListener) {
      media.addEventListener("change", function () {
        if (chosen()) return;
        root.setAttribute("data-theme", current());
        label(button);
      });
    }
  });
})();
