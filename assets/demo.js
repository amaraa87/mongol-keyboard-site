// The hero demo: replays exactly what the keyboard does.
// IME-style: the field shows the Latin exactly as typed, and the whole
// word turns Cyrillic at the space (the й in "сайн" appears the way the
// real engine produces it), then the ✨ key fires and the grammar fix lands.
(function () {
  "use strict";

  var field = document.getElementById("demo-text");
  var latin = document.getElementById("demo-latin");
  var row = document.getElementById("demo-keys");
  if (!field || !latin || !row) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // [latin key pressed, document state after the keystroke]
  var steps = [
    ["s", "s"],
    ["a", "sa"],
    ["i", "sai"],
    ["n", "sain"],
    [" ", "сайн "],
    ["b", "сайн b"],
    ["a", "сайн ba"],
    ["i", "сайн bai"],
    ["n", "сайн bain"],
    ["a", "сайн baina"],
    [" ", "сайн байна "],
    ["u", "сайн байна u"],
    ["u", "сайн байна uu"],
  ];
  var FIXED = "Сайн байна уу?";

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
        // Pause, then the ✨Засах beat: press, glow, fix lands.
        setTimeout(function () {
          var fix = key("fix");
          press("fix");
          if (fix) fix.classList.add("is-glow");
          setTimeout(function () {
            setText(FIXED, false);
            latin.textContent = "✨ засварласан · corrected";
            if (fix) fix.classList.remove("is-glow");
          }, 550);
          // Hold the result, then loop.
          setTimeout(run, 4200);
        }, 900);
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
