/* exercise.js - the "Conjugar" practice game: batches of 10 distinct verbs,
   3 difficulty levels (facil=A1/A2, normal=B1/B2, dificil=C1/C2), tied to
   both verb frequency and verbal tense complexity. */
const Exercise = (function () {
  let allVerbs = null;
  let batch = [];
  let idx = 0;
  let score = 0;
  let currentLevel = "facil";
  let answered = false;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function normalize(s) {
    return s.trim().toLowerCase().replace(/\s+/g, " ").replace(/['’]/g, "'");
  }

  // maps the "friendly" tense keys used in sentences.js to the actual field
  // names stored in data/verbs120.json (which uses short keys for congiuntivo)
  const FIELD_NAME = {
    presente: "presente",
    imperfetto: "imperfetto",
    passato_remoto: "passato_remoto",
    futuro: "futuro",
    condizionale: "condizionale",
    congiuntivo_presente: "cong_pres",
    congiuntivo_imperfetto: "cong_imp",
    imperativo: "imperativo"
  };

  function formFor(verbData, tense, person, gender) {
    if (SENTENCE_MODULE_COMPOUND.has(tense)) {
      const auxTenseFriendly = SENTENCE_MODULE_COMPOUND_AUX[tense];
      const auxField = FIELD_NAME[auxTenseFriendly] || auxTenseFriendly;
      const auxData = allVerbs[verbData.aux === "essere" ? "essere" : "avere"];
      const auxForms = auxData[auxField];
      return Conjugator.compound(auxForms, verbData.participio, verbData.aux, person, gender);
    }
    const field = FIELD_NAME[tense] || tense;
    return verbData[field][person];
  }

  // aliases so this file doesn't depend on load order of sentences.js internals
  const SENTENCE_MODULE_COMPOUND = COMPOUND_TENSES;
  const SENTENCE_MODULE_COMPOUND_AUX = COMPOUND_AUX_TENSE;

  function buildItem(tense, templateIndex, tmpl, verb) {
    const verbData = allVerbs[verb];
    const gender = tmpl.gender || "m";
    const correct = formFor(verbData, tense, tmpl.person, gender);
    return { verb, tense, templateIndex, template: tmpl, correct };
  }

  async function buildBatch(level) {
    allVerbs = await Conjugator.loadData();
    currentLevel = level;
    isReview = false;
    const tenseKeys = LEVEL_TENSES[level];

    // Each template is tagged with the specific verb(s) it was written for,
    // so we pick from (tense, template) pairs rather than picking a random
    // verb and template independently -- this guarantees the sentence
    // context always matches the meaning of the verb being conjugated.
    const usedVerbs = new Set();
    let candidatePairs = [];
    tenseKeys.forEach(tense => {
      SENTENCE_BANK[tense].forEach((tmpl, i) => candidatePairs.push({ tense, tmpl, templateIndex: i }));
    });
    candidatePairs = shuffle(candidatePairs);

    batch = [];
    for (const pair of candidatePairs) {
      if (batch.length >= 10) break;
      const compatible = pair.tmpl.verbs.filter(v => allVerbs[v] && !usedVerbs.has(v));
      if (compatible.length === 0) continue;
      const verb = pick(compatible);
      usedVerbs.add(verb);
      batch.push(buildItem(pair.tense, pair.templateIndex, pair.tmpl, verb));
    }
    idx = 0;
    score = 0;
    answered = false;
  }

  // Builds a batch from the spaced-repetition review queue (Stats module).
  // Returns false if there is nothing due for review.
  async function buildReviewBatch() {
    allVerbs = await Conjugator.loadData();
    isReview = true;
    const due = Stats.getDueItems(10);
    batch = [];
    for (const entry of due) {
      const tmpl = SENTENCE_BANK[entry.tense]?.[entry.templateIndex];
      if (!tmpl) continue;
      const verb = tmpl.verbs.find(v => allVerbs[v]);
      if (!verb) continue;
      batch.push(buildItem(entry.tense, entry.templateIndex, tmpl, verb));
    }
    idx = 0;
    score = 0;
    answered = false;
    return batch.length > 0;
  }

  function current() { return batch[idx]; }
  function total() { return batch.length; }
  function position() { return idx + 1; }
  function isLast() { return idx >= batch.length - 1; }
  function advance() { idx++; answered = false; }
  function getScore() { return score; }
  function isReviewMode() { return isReview; }

  function checkAnswer(userInput) {
    if (answered) return null;
    answered = true;
    const item = current();
    const ok = normalize(userInput) === normalize(item.correct);
    if (ok) score++;
    const streak = Stats.registerAnswer(ok);
    Stats.registerReview(item.tense, item.templateIndex, ok);
    const personLabel = Conjugator.PERSON_META[item.template.person].pron;
    return {
      ok,
      correct: item.correct,
      explanation: TENSE_EXPLANATIONS[item.tense],
      tenseLabel: TENSE_LABELS[item.tense],
      person: personLabel,
      streak: streak.current
    };
  }

  let isReview = false;

  return {
    buildBatch, buildReviewBatch, current, total, position, isLast, advance,
    getScore, checkAnswer, normalize, isReviewMode
  };
})();
