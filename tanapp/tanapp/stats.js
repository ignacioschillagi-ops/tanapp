/* stats.js - streak counter + spaced-repetition review queue (simple Leitner
   system with 5 boxes). Everything is stored in localStorage. */
const Stats = (function () {
  const STREAK_KEY = "tanapp_streak";
  const REVIEW_KEY = "tanapp_review";

  // box -> ms until due again after a correct answer
  const BOX_INTERVAL_MS = [
    0,                    // box 0: due immediately (next session)
    1 * 24 * 3600 * 1000, // box 1: 1 day
    3 * 24 * 3600 * 1000, // box 2: 3 days
    7 * 24 * 3600 * 1000, // box 3: 7 days
    16 * 24 * 3600 * 1000 // box 4: 16 days (well learned)
  ];
  const MAX_BOX = BOX_INTERVAL_MS.length - 1;

  function loadStreak() {
    try { return JSON.parse(localStorage.getItem(STREAK_KEY)) || { current: 0, best: 0 }; }
    catch { return { current: 0, best: 0 }; }
  }
  function saveStreak(s) { localStorage.setItem(STREAK_KEY, JSON.stringify(s)); }

  function getStreak() { return loadStreak(); }

  function registerAnswer(ok) {
    const s = loadStreak();
    if (ok) {
      s.current += 1;
      if (s.current > s.best) s.best = s.current;
    } else {
      s.current = 0;
    }
    saveStreak(s);
    return s;
  }

  function resetStreak() { saveStreak({ current: 0, best: 0 }); }

  function loadReview() {
    try { return JSON.parse(localStorage.getItem(REVIEW_KEY)) || {}; }
    catch { return {}; }
  }
  function saveReview(r) { localStorage.setItem(REVIEW_KEY, JSON.stringify(r)); }

  function keyFor(tense, templateIndex) { return tense + "#" + templateIndex; }

  function registerReview(tense, templateIndex, ok) {
    const r = loadReview();
    const key = keyFor(tense, templateIndex);
    const entry = r[key] || { box: 0, due: 0 };
    if (ok) {
      entry.box = Math.min(MAX_BOX, entry.box + 1);
    } else {
      entry.box = 0;
    }
    entry.due = Date.now() + BOX_INTERVAL_MS[entry.box];
    entry.tense = tense;
    entry.templateIndex = templateIndex;
    r[key] = entry;
    saveReview(r);
  }

  // returns due items (box < MAX_BOX so fully-mastered items eventually stop
  // showing up too often, but still resurface occasionally at the longest interval)
  function getDueItems(limit) {
    const r = loadReview();
    const now = Date.now();
    const due = Object.values(r).filter(e => e.due <= now);
    due.sort((a, b) => a.due - b.due);
    return limit ? due.slice(0, limit) : due;
  }

  function reviewCount() { return getDueItems().length; }

  function clearAll() {
    localStorage.removeItem(STREAK_KEY);
    localStorage.removeItem(REVIEW_KEY);
  }

  return { getStreak, registerAnswer, resetStreak, registerReview, getDueItems, reviewCount, clearAll };
})();
