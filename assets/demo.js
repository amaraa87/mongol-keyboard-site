// The hero demo: replays exactly what the keyboard does.
// IME-style: the field shows the Latin exactly as typed, and the whole
// word turns Cyrillic at the space (the й in "сайн" appears the way the
// real engine produces it; the first letter is capitalised at the start).
(function () {
  "use strict";

  var field = document.getElementById("demo-text");
  var latin = document.getElementById("demo-latin");
  var row = document.getElementById("demo-keys");
  if (!field || !latin || !row) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // [latin key pressed, document state after the keystroke]
  var steps = [
    ["s", "S"],
    ["a", "Sa"],
    ["i", "Sai"],
    ["n", "Sain"],
    [" ", "Сайн "],
    ["b", "Сайн b"],
    ["a", "Сайн ba"],
    ["i", "Сайн bai"],
    ["n", "Сайн bain"],
    ["a", "Сайн baina"],
    [" ", "Сайн байна "],
    ["u", "Сайн байна u"],
    ["u", "Сайн байна uu"],
    [" ", "Сайн байна уу "],
  ];

  function key(name) {
    return row.querySelector('[data-key="' + name + '"]');
  }

  function press(name) {
    var el = key(name);
    if (!el) return;
    el.classList.add("is-down");
    setTimeout(function () { el.classList.remove("is-down"); }, 140);
  }

  function setText(value, withCaret) {
    field.textContent = value;
    if (withCaret) {
      var caret = document.createElement("span");
      caret.className = "caret";
      field.appendChild(caret);
    }
  }

  function run() {
    var i = 0;
    setText("", true);
    latin.textContent = "";

    var typer = setInterval(function () {
      if (i >= steps.length) {
        clearInterval(typer);
        // Hold the result, then loop.
        setTimeout(run, 3200);
        return;
      }
      var step = steps[i];
      press(step[0] === " " ? "space" : step[0]);
      setText(step[1], true);
      latin.textContent = steps
        .slice(0, i + 1)
        .map(function (s) { return s[0] === " " ? "␣" : s[0]; })
        .join(" ");
      i += 1;
    }, 260);
  }

  run();
})();
