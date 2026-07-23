/* library.js - "Biblioteca de conjugación": type any verb, see every form.
   Looks up the local curated 120-verb dataset first (offline, instant).
   For verbs outside that list it estimates a regular conjugation locally,
   and always offers a live cross-check against the open-source verbe.cc API
   (https://github.com/bretttolbert/verbecc), which knows thousands of verbs
   including irregulars, so coverage isn't limited to the 120 pre-loaded ones.
   It also accepts the SPANISH word (via data/verb_es.js) for the 120 curated
   verbs, in case the user doesn't know how the Italian verb is spelled. */
const Library = (function () {

  function normalizeEs(s) {
    // strips accents/diacritics (á->a, ñ->n, etc.) after NFD decomposition,
    // by dropping combining-mark code points (U+0300-U+036F) one by one --
    // avoids embedding literal combining characters in a regex.
    return s.trim().toLowerCase().normalize("NFD").split("").filter(ch => {
      const code = ch.codePointAt(0);
      return !(code >= 0x0300 && code <= 0x036f);
    }).join("");
  }

  function tableRow(label, forms) {
    const prons = ["io","tu","lui/lei","noi","voi","loro"];
    let rows = "";
    for (let i = 0; i < 6; i++) {
      rows += `<div class="pron">${prons[i]}</div><div>${forms[i] ?? "-"}</div>`;
    }
    return `<div class="mood-block"><div class="tense-name">${label}</div><div class="tense-grid">${rows}</div></div>`;
  }

  function renderLocal(verb, data) {
    const aux = data.aux;
    const compoundHtml = Object.keys(COMPOUND_AUX_TENSE).map(tense => {
      const auxTense = COMPOUND_AUX_TENSE[tense];
      const auxData = window.__libAuxData[aux];
      const forms = [0,1,2,3,4,5].map(p => Conjugator.compound(auxData[auxTense], data.participio, aux, p, p===2?"m":"m"));
      return tableRow(TENSE_LABELS[tense], forms);
    }).join("");

    return `
      <div class="card">
        <div class="lib-verb-title">${verb}</div>
        <div class="lib-source">Fuente: dataset local verificado ${data.level ? "· nivel " + data.level : ""} · auxiliar: <strong>${aux}</strong></div>
        <div class="mood-title">Indicativo</div>
        ${tableRow(TENSE_LABELS.presente, data.presente)}
        ${tableRow(TENSE_LABELS.imperfetto, data.imperfetto)}
        ${tableRow(TENSE_LABELS.passato_remoto, data.passato_remoto)}
        ${tableRow(TENSE_LABELS.futuro, data.futuro)}
        ${tableRow(TENSE_LABELS.passato_prossimo, [0,1,2,3,4,5].map(p=>Conjugator.compound(window.__libAuxData[aux].presente, data.participio, aux, p, "m")))}
        ${tableRow(TENSE_LABELS.trapassato_prossimo, [0,1,2,3,4,5].map(p=>Conjugator.compound(window.__libAuxData[aux].imperfetto, data.participio, aux, p, "m")))}
        ${tableRow(TENSE_LABELS.futuro_anteriore, [0,1,2,3,4,5].map(p=>Conjugator.compound(window.__libAuxData[aux].futuro, data.participio, aux, p, "m")))}
        <div class="mood-title">Congiuntivo</div>
        ${tableRow(TENSE_LABELS.congiuntivo_presente, data.cong_pres)}
        ${tableRow(TENSE_LABELS.congiuntivo_imperfetto, data.cong_imp)}
        ${tableRow(TENSE_LABELS.congiuntivo_trapassato, [0,1,2,3,4,5].map(p=>Conjugator.compound(window.__libAuxData[aux].cong_imp, data.participio, aux, p, "m")))}
        <div class="mood-title">Condizionale</div>
        ${tableRow(TENSE_LABELS.condizionale, data.condizionale)}
        ${tableRow(TENSE_LABELS.condizionale_passato, [0,1,2,3,4,5].map(p=>Conjugator.compound(window.__libAuxData[aux].condizionale, data.participio, aux, p, "m")))}
        <div class="mood-title">Otros</div>
        ${tableRow("Imperativo", data.imperativo)}
        <div class="mood-block"><div class="tense-name">Gerundio / Participio</div>
          <div class="tense-grid"><div class="pron">gerundio</div><div>${data.gerundio}</div><div class="pron">participio</div><div>${data.participio}</div></div>
        </div>
        <p class="muted small">Nota: para verbos con auxiliar <em>essere</em> el participio concuerda en género/número con el sujeto (ej. andato/andata/andati/andate). Arriba se muestra en masculino singular como referencia.</p>
      </div>`;
  }

  function renderLive(verb, value) {
    const moods = value.moods;
    let html = `<div class="card"><div class="lib-verb-title">${value.verb.infinitive}</div>
      <div class="lib-source">Fuente: API abierta <a href="https://verbe.cc" target="_blank" rel="noopener">verbe.cc</a> (proyecto open source verbecc, basado en Verbiste)${value.verb.predicted ? " · conjugación predicha por IA para verbo desconocido" : ""}</div>`;
    for (const moodName in moods) {
      html += `<div class="mood-title">${moodName}</div>`;
      const tenses = moods[moodName];
      for (const tenseName in tenses) {
        const conjs = tenses[tenseName];
        let rows = conjs.map(c => `<div class="pron">${c.pr || ""}${c.g ? " ("+c.g+")" : ""}</div><div>${c.c.join(" / ")}</div>`).join("");
        html += `<div class="mood-block"><div class="tense-name">${tenseName}</div><div class="tense-grid">${rows}</div></div>`;
      }
    }
    html += `</div>`;
    return html;
  }

  async function search(rawVerb) {
    const statusEl = document.getElementById("libStatus");
    const resultsEl = document.getElementById("libResults");
    const typed = rawVerb.trim().toLowerCase();
    if (!typed) return;
    resultsEl.innerHTML = "";
    statusEl.textContent = "Buscando...";
    try {
      const allVerbs = await Conjugator.loadData();
      window.__libAuxData = { avere: allVerbs.avere, essere: allVerbs.essere };

      // if what was typed isn't recognizable as an Italian verb (not in the
      // dataset and doesn't end in -are/-ere/-ire), try treating it as a
      // Spanish word via the data/verb_es.js lookup index.
      let verb = typed;
      let translationNote = "";
      const looksItalian = !!allVerbs[typed] || !!Conjugator.group(typed);
      if (!looksItalian && typeof VERB_ES_TO_IT !== "undefined") {
        const translated = VERB_ES_TO_IT[normalizeEs(typed)];
        if (translated) {
          verb = translated;
          translationNote = `Se interpretó "<strong>${rawVerb.trim()}</strong>" (español) como el verbo italiano "<strong>${translated}</strong>".`;
        }
      }

      const local = await Conjugator.getVerb(verb);
      if (local && local.source === "local") {
        statusEl.innerHTML = translationNote;
        resultsEl.innerHTML = renderLocal(verb, local);
        return;
      }
      // not curated: show our best local regular-verb guess immediately...
      let guessHtml = "";
      if (local && local.source === "regular-guess") {
        guessHtml = renderLocal(verb, local);
      }
      statusEl.innerHTML = (translationNote ? translationNote + " " : "") +
        "Verbo no está en el dataset local, consultando fuente abierta en vivo (verbe.cc)...";
      try {
        const live = await Conjugator.getVerbLive(verb);
        statusEl.innerHTML = translationNote;
        resultsEl.innerHTML = renderLive(verb, live);
      } catch (e) {
        statusEl.innerHTML = (translationNote ? translationNote + " " : "") +
          (guessHtml
            ? "No se pudo contactar la fuente en vivo. Mostrando una conjugación regular estimada localmente:"
            : "No se encontró ese verbo, ni localmente ni en la fuente en vivo. Revisá cómo lo escribiste (probá también escribirlo en español).");
        resultsEl.innerHTML = guessHtml;
      }
    } catch (e) {
      statusEl.textContent = "Ocurrió un error buscando el verbo.";
      console.error(e);
    }
  }

  return { search };
})();
