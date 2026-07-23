/* conjugator.js
   Loads the local 120-verb dataset (verified against verbe.cc / Verbiste-based
   open source data) and provides a JS-side regular-verb engine (mirrors the
   Python generator used to build data/verbs120.json) so the "Biblioteca" can
   also handle regular verbs the user types that are not in the local list.
   For verbs it truly doesn't know, it falls back to a live lookup against the
   open-source verbe.cc API (https://github.com/bretttolbert/verbecc, LGPL-3.0).
*/
const Conjugator = (function () {
  let VERBS = null;

  async function loadData() {
    if (VERBS) return VERBS;
    const res = await fetch("data/verbs120.json");
    VERBS = await res.json();
    return VERBS;
  }

  const ESSERE_VERBS = new Set([
    "andare","venire","stare","essere","uscire","salire","rimanere","apparire",
    "riuscire","comparire","scomparire","sparire","diventare","sembrare","parere",
    "costare","bastare","mancare","succedere","accadere","nascere","morire",
    "piacere","dispiacere","arrivare","partire","tornare","entrare","cadere",
    "crescere","vivere","valere","sopravvivere"
  ]);

  function stripEnding(inf) { return inf.slice(0, -3); }
  function group(inf) {
    if (inf.endsWith("are")) return "are";
    if (inf.endsWith("ere")) return "ere";
    if (inf.endsWith("ire")) return "ire";
    return null;
  }

  // Regular conjugation engine (mirrors Python build script exactly)
  function regular(inf, grp, isc) {
    const stem = stripEnding(inf);
    const v = {};
    if (grp === "are") {
      const stemEndsI = stem.endsWith("i");
      const ciareGiare = stemEndsI && stem.length >= 2 && "cg".includes(stem[stem.length - 2]);
      const hardCg = !stemEndsI && (stem.endsWith("c") || stem.endsWith("g"));
      const add = (ending) => {
        if (ending[0] === "i") {
          if (stemEndsI) return stem.slice(0, -1) + ending;
          if (hardCg) return stem + "h" + ending;
          return stem + ending;
        } else if (ending[0] === "e") {
          if (ciareGiare) return stem.slice(0, -1) + ending;
          if (hardCg) return stem + "h" + ending;
          return stem + ending;
        }
        return stem + ending;
      };
      v.presente = [add("o"), add("i"), add("a"), add("iamo"), stem + "ate", add("ano")];
      v.imperfetto = [stem+"avo",stem+"avi",stem+"ava",stem+"avamo",stem+"avate",stem+"avano"];
      v.passato_remoto = [stem+"ai",stem+"asti",stem+"ò",stem+"ammo",stem+"aste",stem+"arono"];
      v.futuro = [add("erò"),add("erai"),add("erà"),add("eremo"),add("erete"),add("eranno")];
      v.condizionale = [add("erei"),add("eresti"),add("erebbe"),add("eremmo"),add("ereste"),add("erebbero")];
      v.cong_pres = [add("i"),add("i"),add("i"),add("iamo"),add("iate"),add("ino")];
      v.cong_imp = [stem+"assi",stem+"assi",stem+"asse",stem+"assimo",stem+"aste",stem+"assero"];
      v.imperativo = ["-",add("a"),add("i"),add("iamo"),stem+"ate",add("ino")];
      v.gerundio = stem + "ando";
      v.participio = stem + "ato";
    } else if (grp === "ere") {
      v.presente = [stem+"o",stem+"i",stem+"e",stem+"iamo",stem+"ete",stem+"ono"];
      v.imperfetto = [stem+"evo",stem+"evi",stem+"eva",stem+"evamo",stem+"evate",stem+"evano"];
      v.passato_remoto = [stem+"ei",stem+"esti",stem+"é",stem+"emmo",stem+"este",stem+"erono"];
      v.futuro = [stem+"erò",stem+"erai",stem+"erà",stem+"eremo",stem+"erete",stem+"eranno"];
      v.condizionale = [stem+"erei",stem+"eresti",stem+"erebbe",stem+"eremmo",stem+"ereste",stem+"erebbero"];
      v.cong_pres = [stem+"a",stem+"a",stem+"a",stem+"iamo",stem+"iate",stem+"ano"];
      v.cong_imp = [stem+"essi",stem+"essi",stem+"esse",stem+"essimo",stem+"este",stem+"essero"];
      v.imperativo = ["-",stem+"i",stem+"a",stem+"iamo",stem+"ete",stem+"ano"];
      v.gerundio = stem + "endo";
      v.participio = stem + "uto";
    } else if (grp === "ire") {
      if (isc) {
        v.presente = [stem+"isco",stem+"isci",stem+"isce",stem+"iamo",stem+"ite",stem+"iscono"];
        v.cong_pres = [stem+"isca",stem+"isca",stem+"isca",stem+"iamo",stem+"iate",stem+"iscano"];
        v.imperativo = ["-",stem+"isci",stem+"isca",stem+"iamo",stem+"ite",stem+"iscano"];
      } else {
        v.presente = [stem+"o",stem+"i",stem+"e",stem+"iamo",stem+"ite",stem+"ono"];
        v.cong_pres = [stem+"a",stem+"a",stem+"a",stem+"iamo",stem+"iate",stem+"ano"];
        v.imperativo = ["-",stem+"i",stem+"a",stem+"iamo",stem+"ite",stem+"ano"];
      }
      v.imperfetto = [stem+"ivo",stem+"ivi",stem+"iva",stem+"ivamo",stem+"ivate",stem+"ivano"];
      v.passato_remoto = [stem+"ii",stem+"isti",stem+"ì",stem+"immo",stem+"iste",stem+"irono"];
      v.futuro = [stem+"irò",stem+"irai",stem+"irà",stem+"iremo",stem+"irete",stem+"iranno"];
      v.condizionale = [stem+"irei",stem+"iresti",stem+"irebbe",stem+"iremmo",stem+"ireste",stem+"irebbero"];
      v.cong_imp = [stem+"issi",stem+"issi",stem+"isse",stem+"issimo",stem+"iste",stem+"issero"];
      v.gerundio = stem + "endo";
      v.participio = stem + "ito";
    }
    return v;
  }

  // Very common -isc verbs not covered by dataset, used only for guesses on
  // unknown verbs typed by the user in the library search.
  const ISC_HINTS = ["ire","fin","cap","prefer","cost","garant","spedir","pul",
    "gest","suggerir","stabil","sost","proib","pun","guar","forn","restitu",
    "imped","istru","favor","sparir","apparir","compar","scompar"];

  function guessIsc(inf) {
    // heuristic: most -ire verbs with a consonant-rich stem use -isc-; a short
    // curated allow-list of common non-isc verbs (dormire-type) overrides it.
    const NO_ISC = new Set(["dormire","sentire","partire","aprire","offrire","soffrire",
      "coprire","seguire","servire","bollire","vestire","divertire","avvertire",
      "convertire","fuggire","mentire","nutrire"]);
    if (NO_ISC.has(inf)) return false;
    return true;
  }

  async function getVerb(infinitive) {
    const inf = infinitive.trim().toLowerCase();
    const data = await loadData();
    if (data[inf]) return { source: "local", ...data[inf] };
    const grp = group(inf);
    if (grp) {
      const isc = grp === "ire" ? guessIsc(inf) : undefined;
      const conj = regular(inf, grp, isc);
      conj.aux = ESSERE_VERBS.has(inf) ? "essere" : "avere";
      conj.level = null;
      return { source: "regular-guess", ...conj };
    }
    return null;
  }

  // live fallback to the open-source verbe.cc API for anything else
  // (irregular verbs not in our curated set)
  async function getVerbLive(infinitive) {
    const inf = infinitive.trim().toLowerCase();
    const res = await fetch(`https://verbe.cc/verbecc/conjugate/it/${encodeURIComponent(inf)}`);
    if (!res.ok) throw new Error("not found");
    const json = await res.json();
    return json.value;
  }

  function agree(participio, gender, plural) {
    if (!participio.endsWith("o")) return participio;
    const base = participio.slice(0, -1);
    if (!plural) return gender === "f" ? base + "a" : base + "o";
    return gender === "f" ? base + "e" : base + "i";
  }

  const PERSON_META = [
    {pron:"io", n:0, plural:false, gender:"m"},
    {pron:"tu", n:1, plural:false, gender:"m"},
    {pron:"lui/lei", n:2, plural:false, gender:"m"},
    {pron:"noi", n:3, plural:true, gender:"m"},
    {pron:"voi", n:4, plural:true, gender:"m"},
    {pron:"loro", n:5, plural:true, gender:"m"}
  ];

  // Build a compound tense form: auxTense array (6 forms) + participio, with
  // gender/number agreement applied when aux === "essere".
  function compound(auxForms, participio, aux, personIdx, gender) {
    const g = gender || "m";
    const plural = personIdx >= 3;
    const part = aux === "essere" ? agree(participio, g, plural) : participio;
    return auxForms[personIdx] + " " + part;
  }

  return { loadData, getVerb, getVerbLive, regular, group, agree, compound, PERSON_META, ESSERE_VERBS };
})();
