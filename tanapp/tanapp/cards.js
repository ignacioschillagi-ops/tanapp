/* cards.js - vocabulary flashcard game, 3 levels, 10 random words per session
   that get renewed (reshuffled) every time a level is started. */
const Cards = (function () {
  let deck = [];
  let idx = 0;
  let level = "facil";

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function start(lvl) {
    level = lvl;
    deck = shuffle(VOCAB[lvl]).slice(0, 10);
    idx = 0;
  }
  function current() { return deck[idx]; }
  function total() { return deck.length; }
  function position() { return idx + 1; }
  function next() { if (idx < deck.length - 1) idx++; return current(); }
  function prev() { if (idx > 0) idx--; return current(); }
  function atStart() { return idx === 0; }
  function atEnd() { return idx === deck.length - 1; }

  return { start, current, total, position, next, prev, atStart, atEnd };
})();
