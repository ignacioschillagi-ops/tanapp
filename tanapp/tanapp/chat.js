/* chat.js - Conversational practice with an AI over the Groq API.
   The user supplies their own free Groq API key (console.groq.com), stored
   only in this browser's localStorage. Every AI reply may start with a
   correction of the user's Italian (shown in a distinct color) followed by
   the normal continuation of the conversation, ALWAYS in Italian. */
const Chat = (function () {
  const STORAGE_KEY = "tanapp_groq_key";
  const HISTORY_KEY = "tanapp_chat_history";
  const MODEL = "openai/gpt-oss-120b"; // current recommended Groq model (2026)

  const SYSTEM_PROMPT = `Sei "Tanapp", un'insegnante di italiano madrelingua che chiacchiera via chat con uno studente ispanofono per fargli fare pratica di conversazione.

REGOLA DI LINGUA (assoluta, mai violarla): la tua risposta è composta da al massimo due parti, in quest'ordine:
  (1) un blocco di correzione OPZIONALE, scritto SOLO ED ESCLUSIVAMENTE in spagnolo;
  (2) il corpo della conversazione, scritto SEMPRE ED ESCLUSIVAMENTE in italiano.
Non scrivere MAI il corpo della conversazione in spagnolo o in un misto di lingue, nemmeno se lo studente ti scrive in spagnolo, ti chiede di parlare in spagnolo, o commette moltissimi errori: in quel caso rispondi comunque in italiano semplice (livello A2) e, se vuoi, aggiungi nella correzione una piccola nota che lo inviti a scrivere in italiano. L'unico testo in spagnolo ammesso in tutta la risposta è quello dentro il blocco <corr>...</corr>.

Regole fisse per OGNI tua risposta:
1. Se il messaggio dello studente contiene anche un solo errore di italiano (grammatica, coniugazione, genere, preposizioni, ortografia) OPPURE è scritto in spagnolo/altra lingua invece che in italiano, inizia la risposta con un blocco <corr>...</corr> contenente, in SPAGNOLO, una spiegazione breve dell'errore e la forma corretta. Esempio: <corr>Dijiste "io ha mangiato", pero con "io" el verbo "avere" es "ho": la forma correcta es "io ho mangiato".</corr>
2. Se il messaggio è corretto e già in italiano, NON includere il blocco <corr>.
3. Dopo l'eventuale blocco <corr>, continua SEMPRE la conversazione in italiano, in modo naturale, semplice e amichevole, facendo una domanda o un commento per continuare la chiacchierata.
4. Non usare markdown, solo testo semplice.`;

  function getKey() { return localStorage.getItem(STORAGE_KEY) || ""; }
  function setKey(k) { localStorage.setItem(STORAGE_KEY, k.trim()); }
  function hasKey() { return !!getKey(); }

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
  }
  function saveHistory(h) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(-30)));
  }
  function clearHistory() { localStorage.removeItem(HISTORY_KEY); }

  function parseReply(raw) {
    const m = raw.match(/<corr>([\s\S]*?)<\/corr>/i);
    if (!m) return { correction: null, reply: raw.trim() };
    const correction = m[1].trim();
    const reply = raw.replace(m[0], "").trim();
    return { correction, reply };
  }

  async function send(userText, history) {
    const key = getKey();
    if (!key) throw new Error("no-key");
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map(h => ({ role: h.role, content: h.role === "user" ? h.text : h.raw || h.text })),
      { role: "user", content: userText }
    ];
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + key
      },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.6, max_tokens: 400 })
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error("api-error:" + res.status + ":" + errBody);
    }
    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content ?? "";
    return { raw, ...parseReply(raw) };
  }

  return { getKey, setKey, hasKey, loadHistory, saveHistory, clearHistory, send };
})();
