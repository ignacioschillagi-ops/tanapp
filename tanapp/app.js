/* app.js - navigation + wiring for all views */
(function () {
  "use strict";

  // ---------- navigation ----------
  const views = ["practice","library","chat","cards"];
  function showView(name) {
    views.forEach(v => {
      document.getElementById("view-" + v).classList.toggle("hidden", v !== name);
    });
    document.querySelectorAll(".nav-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.view === name);
    });
  }
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });

  // ---------- settings modal ----------
  const modal = document.getElementById("settingsModal");
  document.getElementById("btnSettings").addEventListener("click", () => {
    document.getElementById("groqKeyInput").value = Chat.getKey();
    refreshStreakUI();
    modal.classList.remove("hidden");
  });
  document.getElementById("btnCloseSettings").addEventListener("click", () => modal.classList.add("hidden"));
  document.getElementById("btnGoSettingsFromChat").addEventListener("click", () => {
    document.getElementById("groqKeyInput").value = Chat.getKey();
    modal.classList.remove("hidden");
  });
  document.getElementById("btnSaveKey").addEventListener("click", () => {
    const val = document.getElementById("groqKeyInput").value.trim();
    Chat.setKey(val);
    document.getElementById("keyStatus").textContent = val ? "API key guardada ✓" : "API key borrada.";
    refreshChatSetupVisibility();
  });
  document.getElementById("btnResetProgress").addEventListener("click", () => {
    Chat.clearHistory();
    Stats.clearAll();
    renderChatHistory();
    refreshStreakUI();
    refreshReviewCard();
    document.getElementById("keyStatus").textContent = "Progreso, racha, repaso e historial de chat borrados.";
  });

  // ---------- streak + spaced-repetition UI ----------
  function refreshStreakUI() {
    const s = Stats.getStreak();
    document.getElementById("streakCount").textContent = s.current;
    document.getElementById("settingsStreak").textContent = s.current;
    document.getElementById("settingsBestStreak").textContent = s.best;
    document.getElementById("settingsReviewCount").textContent = Stats.reviewCount();
  }

  function refreshReviewCard() {
    const n = Stats.reviewCount();
    const card = document.getElementById("reviewCard");
    if (n > 0 && practiceGame.classList.contains("hidden") && practiceSummary.classList.contains("hidden")) {
      card.classList.remove("hidden");
      document.getElementById("reviewText").textContent =
        n === 1 ? "Tenés 1 verbo para repasar." : `Tenés ${n} verbos para repasar.`;
    } else {
      card.classList.add("hidden");
    }
    document.getElementById("settingsReviewCount").textContent = n;
  }

  document.getElementById("btnStartReview").addEventListener("click", async () => {
    const ok = await Exercise.buildReviewBatch();
    if (!ok) { refreshReviewCard(); return; }
    document.querySelectorAll("#view-practice .level-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("reviewCard").classList.add("hidden");
    practiceIntro.classList.add("hidden");
    practiceSummary.classList.add("hidden");
    practiceGame.classList.remove("hidden");
    renderQuestion();
  });

  // =========================================================
  // PRACTICE (Conjugar)
  // =========================================================
  const practiceIntro = document.getElementById("practiceIntro");
  const practiceGame = document.getElementById("practiceGame");
  const practiceSummary = document.getElementById("practiceSummary");
  const answerForm = document.getElementById("answerForm");
  let selectedLevel = null;

  document.querySelectorAll("#view-practice .level-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      document.querySelectorAll("#view-practice .level-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedLevel = btn.dataset.level;
      await Exercise.buildBatch(selectedLevel);
      document.getElementById("reviewCard").classList.add("hidden");
      practiceIntro.classList.add("hidden");
      practiceSummary.classList.add("hidden");
      practiceGame.classList.remove("hidden");
      renderQuestion();
    });
  });

  function renderQuestion() {
    const item = Exercise.current();
    document.getElementById("infinitiveBadge").textContent = item.verb;
    const tmpl = item.template;
    document.getElementById("sentenceText").innerHTML =
      tmpl.before + ' <input type="text" id="answerInput" autocomplete="off" autocapitalize="off" spellcheck="false"> ' + tmpl.after;
    document.getElementById("tenseHint").textContent =
      "Tiempo: " + TENSE_LABELS[item.tense] + " · sujeto: " + Conjugator.PERSON_META[tmpl.person].pron;
    document.getElementById("progressLabel").textContent = Exercise.position() + " / " + Exercise.total();
    document.getElementById("progressFill").style.width = (Exercise.position() / Exercise.total() * 100) + "%";
    document.getElementById("feedback").classList.add("hidden");
    document.getElementById("btnCheck").classList.remove("hidden");
    document.getElementById("btnNext").classList.add("hidden");
    setTimeout(() => document.getElementById("answerInput")?.focus(), 50);
  }

  answerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("answerInput");
    if (!input || document.getElementById("btnNext").classList.contains("hidden") === false) return;
    const result = Exercise.checkAnswer(input.value);
    if (!result) return;
    input.disabled = true;
    const fb = document.getElementById("feedback");
    fb.classList.remove("hidden","ok","bad");
    fb.classList.add(result.ok ? "ok" : "bad");
    fb.innerHTML =
      `<span class="verdict">${result.ok ? "✓ ¡Correcto!" : "✗ Incorrecto"}</span>` +
      (!result.ok ? `<div>La forma correcta era: <span class="correct-form">${result.correct}</span></div>` : "") +
      `<div class="explain"><strong>${result.tenseLabel}</strong> (${result.person}): ${result.explanation}</div>` +
      `<div class="muted small" style="margin-top:8px;">🔥 Racha: ${result.streak}</div>`;
    document.getElementById("btnCheck").classList.add("hidden");
    document.getElementById("btnNext").classList.remove("hidden");
    refreshStreakUI();
  });

  document.getElementById("btnNext").addEventListener("click", () => {
    if (Exercise.isLast()) {
      practiceGame.classList.add("hidden");
      practiceSummary.classList.remove("hidden");
      document.getElementById("summaryScore").textContent =
        `Puntaje: ${Exercise.getScore()} / ${Exercise.total()} correctas.`;
      const s = Stats.getStreak();
      document.getElementById("summaryStreak").textContent =
        `🔥 Racha actual: ${s.current} · Mejor racha: ${s.best}`;
      refreshStreakUI();
      refreshReviewCard();
    } else {
      Exercise.advance();
      renderQuestion();
    }
  });

  document.getElementById("btnRestart").addEventListener("click", async () => {
    if (Exercise.isReviewMode()) {
      const ok = await Exercise.buildReviewBatch();
      if (!ok) { practiceSummary.classList.add("hidden"); practiceIntro.classList.remove("hidden"); refreshReviewCard(); return; }
    } else {
      if (!selectedLevel) return;
      await Exercise.buildBatch(selectedLevel);
    }
    practiceSummary.classList.add("hidden");
    practiceGame.classList.remove("hidden");
    renderQuestion();
  });

  // =========================================================
  // LIBRARY (Biblioteca)
  // =========================================================
  document.getElementById("btnLibSearch").addEventListener("click", () => {
    Library.search(document.getElementById("libSearchInput").value);
  });
  document.getElementById("libSearchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") Library.search(document.getElementById("libSearchInput").value);
  });

  // =========================================================
  // CHAT
  // =========================================================
  function refreshChatSetupVisibility() {
    const has = Chat.hasKey();
    document.getElementById("chatSetup").classList.toggle("hidden", has);
    document.getElementById("chatArea").classList.toggle("hidden", !has);
    if (has) renderChatHistory();
  }

  function addMsgToDOM(role, text, correction) {
    const box = document.getElementById("chatMessages");
    const div = document.createElement("div");
    div.className = "msg " + (role === "user" ? "user" : "ai");
    let html = "";
    if (correction) {
      html += `<span class="correction-label">Corrección</span><span class="correction">${escapeHtml(correction)}</span>`;
    }
    html += escapeHtml(text).replace(/\n/g, "<br>");
    div.innerHTML = html;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function escapeHtml(s) {
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function renderChatHistory() {
    const box = document.getElementById("chatMessages");
    box.innerHTML = "";
    const hist = Chat.loadHistory();
    if (hist.length === 0) {
      addMsgToDOM("ai", "Ciao! Scrivimi qualcosa in italiano e chiacchieriamo un po'. Se sbagli qualcosa, te lo dico subito.");
    }
    hist.forEach(h => addMsgToDOM(h.role, h.text, h.correction));
  }

  async function sendChat() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    input.disabled = true;
    addMsgToDOM("user", text);
    const hist = Chat.loadHistory();
    hist.push({ role: "user", text });
    Chat.saveHistory(hist);

    const thinkingDiv = document.createElement("div");
    thinkingDiv.className = "msg ai";
    thinkingDiv.textContent = "…";
    document.getElementById("chatMessages").appendChild(thinkingDiv);

    try {
      const result = await Chat.send(text, hist.slice(0, -1));
      thinkingDiv.remove();
      addMsgToDOM("ai", result.reply, result.correction);
      hist.push({ role: "assistant", text: result.reply, raw: result.raw, correction: result.correction });
      Chat.saveHistory(hist);
    } catch (err) {
      thinkingDiv.remove();
      let msg = "Hubo un error contactando a Groq. Revisá tu API key en Ajustes.";
      if (String(err.message).startsWith("api-error:401")) msg = "La API key parece inválida. Revisala en Ajustes.";
      if (String(err.message).startsWith("api-error:429")) msg = "Se alcanzó el límite gratuito de Groq por ahora, probá en un rato.";
      addMsgToDOM("ai", msg);
    } finally {
      input.disabled = false;
      input.focus();
    }
  }
  document.getElementById("btnChatSend").addEventListener("click", sendChat);
  document.getElementById("chatInput").addEventListener("keydown", (e) => { if (e.key === "Enter") sendChat(); });

  // =========================================================
  // FLASHCARDS (Tarjetas)
  // =========================================================
  const cardsIntro = document.getElementById("cardsIntro");
  const cardsGame = document.getElementById("cardsGame");
  const flashcard = document.getElementById("flashcard");

  document.querySelectorAll(".card-level-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".card-level-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      Cards.start(btn.dataset.level);
      cardsIntro.classList.add("hidden");
      cardsGame.classList.remove("hidden");
      renderCard();
    });
  });

  function renderCard() {
    flashcard.classList.remove("flipped");
    const c = Cards.current();
    document.getElementById("cardWord").textContent = c.word;
    document.getElementById("cardMeaning").textContent = c.meaning;
    document.getElementById("cardExample").textContent = c.example;
    document.getElementById("cardsProgressLabel").textContent = Cards.position() + " / " + Cards.total();
    document.getElementById("cardsProgressFill").style.width = (Cards.position() / Cards.total() * 100) + "%";
  }
  flashcard.addEventListener("click", () => flashcard.classList.toggle("flipped"));
  document.getElementById("btnCardNext").addEventListener("click", () => { Cards.next(); renderCard(); });
  document.getElementById("btnCardPrev").addEventListener("click", () => { Cards.prev(); renderCard(); });

  // ---------- init ----------
  refreshChatSetupVisibility();
  refreshStreakUI();
  refreshReviewCard();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();
