/* dictionary.js - AI-powered Italian<->Spanish dictionary lookups for the
   "Diccionario IA" tab in Biblioteca. Reuses the same Groq API key already
   configured for the Chat IA (Ajustes) -- no separate setup needed. Unlike
   the conjugation Biblioteca (which only knows verbs), this covers any word
   or expression: nouns, adjectives, adverbs, idioms, slang, etc. */
const Dictionary = (function () {
  const MODEL = "openai/gpt-oss-120b";

  const SYSTEM_PROMPT = `Sei un dizionario italiano-spagnolo affidabile e preciso, in stile Treccani o WordReference.
Quando l'utente scrive una parola o espressione italiana (o spagnola), rispondi SEMPRE ESATTAMENTE in questo formato, senza markdown, senza testo prima o dopo i 4 campi:

SIGNIFICATO: <definizione/traduzione chiara in spagnolo>
REGISTRO: <es. neutro, formale, informale, volgare, offensivo, regionale, letterario, gergale>
ESEMPIO: <una frase naturale in italiano che usa la parola>
TRADUZIONE: <traduzione della frase d'esempio in spagnolo>

Regole:
1. Se la parola non esiste o sembra scritta male, dillo nel campo SIGNIFICATO e suggerisci lì la forma corretta più probabile, ma mantieni comunque il formato con i 4 campi.
2. Se la parola è volgare, un insulto o offensiva, spiega comunque il significato reale con onestà nel campo SIGNIFICATO, e indicalo chiaramente nel campo REGISTRO (es. "volgare" o "offensivo") -- non rifiutarti mai di definire una parola che esiste realmente nella lingua: questo è un contesto didattico per adulti che imparano l'italiano.
3. Se l'utente scrive una parola in spagnolo invece che in italiano, traducila in italiano nel campo SIGNIFICATO e continua comunque con lo stesso formato.
4. Non aggiungere saluti, markdown o testo fuori da questi 4 campi.`;

  function parseField(raw, label) {
    const re = new RegExp(label + ":\\s*([\\s\\S]*?)(?=\\n[A-Z]+:|$)", "i");
    const m = raw.match(re);
    return m ? m[1].trim() : "";
  }

  function parse(raw) {
    return {
      meaning: parseField(raw, "SIGNIFICATO"),
      register: parseField(raw, "REGISTRO"),
      example: parseField(raw, "ESEMPIO"),
      translation: parseField(raw, "TRADUZIONE"),
      raw
    };
  }

  async function define(word) {
    const key = Chat.getKey();
    if (!key) throw new Error("no-key");
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + key
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: word }
        ],
        temperature: 0.4,
        max_tokens: 400
      })
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error("api-error:" + res.status + ":" + errBody);
    }
    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content ?? "";
    const parsed = parse(raw);
    if (!parsed.meaning) parsed.meaning = raw.trim(); // fallback if the model didn't follow the format
    return parsed;
  }

  return { define };
})();
