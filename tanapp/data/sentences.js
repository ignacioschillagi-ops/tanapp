/* data/sentences.js
   Sentence templates for the fill-in-the-blank conjugation exercise.
   IMPORTANT: each template is tagged with the specific verb(s) it was
   written for (the "verbs" array), so the surrounding sentence always makes
   real semantic sense with the verb shown in the infinitive badge above it
   -- the exercise engine never substitutes a random unrelated verb into a
   template written for a different meaning.
   person: 0=io,1=tu,2=lui/lei,3=noi,4=voi,5=loro. gender only matters for
   compound tenses with auxiliary "essere".
*/

const TENSE_LABELS = {
  presente: "Presente indicativo",
  passato_prossimo: "Passato prossimo",
  imperfetto: "Imperfetto",
  futuro: "Futuro semplice",
  condizionale: "Condizionale presente",
  congiuntivo_presente: "Congiuntivo presente",
  trapassato_prossimo: "Trapassato prossimo",
  imperativo: "Imperativo",
  congiuntivo_imperfetto: "Congiuntivo imperfetto",
  congiuntivo_trapassato: "Congiuntivo trapassato",
  condizionale_passato: "Condizionale passato",
  passato_remoto: "Passato remoto",
  futuro_anteriore: "Futuro anteriore"
};

const TENSE_EXPLANATIONS = {
  presente: "El presente indicativo describe acciones habituales, verdades generales o cosas que pasan ahora mismo. Es el tiempo más básico y el primero que se aprende.",
  passato_prossimo: "El passato prossimo (aux. essere/avere + participio pasado) se usa para acciones puntuales y terminadas en el pasado, sobre todo en el habla cotidiana. Equivale a nuestro pretérito perfecto compuesto ('he hablado').",
  imperfetto: "El imperfetto describe acciones habituales o en desarrollo en el pasado, descripciones de fondo, o algo que pasaba 'siempre' o 'de niño'. No indica cuándo terminó la acción.",
  futuro: "El futuro semplice expresa acciones que van a pasar, predicciones, o también una suposición sobre el presente ('estará ocupado').",
  condizionale: "El condizionale presente expresa deseos, cortesía, consejos o hipótesis ('me gustaría', 'deberías'). Equivale a nuestro condicional simple.",
  congiuntivo_presente: "El congiuntivo presente se usa después de verbos de opinión, duda, deseo o emoción ('penso che...', 'voglio che...'), y en muchas subordinadas. Expresa algo subjetivo, no un hecho certero.",
  trapassato_prossimo: "El trapassato prossimo (aux. imperfetto + participio) indica una acción pasada que ocurrió ANTES que otra acción pasada. Equivale a nuestro pluscuamperfecto ('había hablado').",
  imperativo: "El imperativo se usa para dar órdenes, consejos o invitaciones directas. No tiene forma para 'io'.",
  congiuntivo_imperfetto: "El congiuntivo imperfetto aparece en subordinadas cuando el verbo principal está en pasado o condicional, y expresa duda, deseo o hipótesis referidas al pasado ('volevo che tu venissi').",
  congiuntivo_trapassato: "El congiuntivo trapassato (aux. congiuntivo imperfetto + participio) expresa una acción pasada anterior a otra, dentro de una subordinada con verbo de opinión/duda ('pensavo che fosse già partito').",
  condizionale_passato: "El condizionale passato (aux. condizionale presente + participio) expresa una acción que habría pasado, o el futuro visto desde el pasado ('avrei parlato', 'ha detto che sarebbe venuto').",
  passato_remoto: "El passato remoto describe acciones completamente terminadas en un pasado lejano, sin conexión con el presente. Se usa mucho en narrativa literaria y, en algunas regiones (sur de Italia), también al hablar.",
  futuro_anteriore: "El futuro anteriore (aux. futuro + participio) indica una acción futura que se completará antes que otra acción futura, o una suposición sobre el pasado reciente ('sarà arrivato tardi')."
};

const SENTENCE_BANK = {
  presente: [
    {verbs:["essere"], person:0, before:"Io", after:"stanco oggi, ho lavorato molto."},
    {verbs:["avere"], person:1, before:"Tu", after:"sempre ragione, lo ammetto."},
    {verbs:["parlare"], person:1, before:"Tu", after:"molto bene l'italiano."},
    {verbs:["mangiare"], person:3, before:"Noi", after:"la pizza ogni venerdì sera."},
    {verbs:["dormire"], person:2, gender:"m", before:"Il bambino", after:"otto ore ogni notte."},
    {verbs:["potere"], person:0, before:"Purtroppo io non", after:"venire alla festa stasera."},
    {verbs:["sapere"], person:2, gender:"m", before:"Lui", after:"parlare tre lingue."},
    {verbs:["uscire"], person:0, before:"Il sabato io", after:"sempre con gli amici."},
    {verbs:["pensare"], person:1, before:"Tu", after:"troppo alle cose negative."},
    {verbs:["vivere"], person:5, before:"I miei cugini", after:"in campagna, lontano dalla città."},
    {verbs:["essere"], person:3, before:"Noi", after:"felici di essere qui."},
    {verbs:["avere"], person:0, before:"Io", after:"due fratelli e una sorella."}
  ],
  passato_prossimo: [
    {verbs:["andare"], person:2, gender:"f", before:"Ieri Anna", after:"al cinema con un'amica.", gender:"f"},
    {verbs:["fare"], person:0, before:"Stamattina io", after:"colazione molto presto.", gender:"m"},
    {verbs:["bere"], person:5, before:"I ragazzi", after:"troppo caffè oggi.", gender:"m"},
    {verbs:["volere"], person:1, before:"Tu", after:"sempre venire con noi.", gender:"m"},
    {verbs:["vedere"], person:3, before:"Ieri sera noi", after:"un film bellissimo.", gender:"m"},
    {verbs:["prendere"], person:0, before:"Stamattina io", after:"l'autobus delle otto.", gender:"m"},
    {verbs:["capire"], person:1, before:"Finalmente tu", after:"il problema, vero?", gender:"m"},
    {verbs:["finire"], person:2, gender:"f", before:"Lei", after:"il progetto ieri notte."},
    {verbs:["aprire"], person:4, before:"Voi", after:"già i regali di Natale?", gender:"m"},
    {verbs:["arrivare"], person:2, gender:"m", before:"Marco", after:"tardi alla riunione."},
    {verbs:["andare"], person:0, before:"Ieri io", after:"dal dottore per un controllo.", gender:"m"},
    {verbs:["fare"], person:3, before:"Noi", after:"una lunga passeggiata al parco.", gender:"m"}
  ],
  imperfetto: [
    {verbs:["stare"], person:0, before:"Da bambino io", after:"sempre a casa dei nonni d'estate."},
    {verbs:["dare"], person:2, gender:"m", before:"Mio nonno mi", after:"sempre dei consigli utili."},
    {verbs:["mettere"], person:1, before:"Da piccolo tu", after:"sempre i giocattoli sotto il letto."},
    {verbs:["chiudere"], person:2, gender:"f", before:"Prima di uscire, lei", after:"sempre tutte le finestre."},
    {verbs:["sentire"], person:0, before:"Da lontano io", after:"la musica della festa."},
    {verbs:["lavorare"], person:5, before:"I miei genitori", after:"in fabbrica quando erano giovani."},
    {verbs:["studiare"], person:3, before:"Da studenti noi", after:"insieme in biblioteca ogni sera."},
    {verbs:["comprare"], person:4, before:"Ogni domenica voi", after:"il pane fresco dal fornaio."},
    {verbs:["guardare"], person:1, before:"Da bambino tu", after:"sempre i cartoni animati la mattina."},
    {verbs:["giocare"], person:2, gender:"m", before:"Mio fratello", after:"sempre a calcio dopo la scuola."}
  ],
  futuro: [
    {verbs:["dovere"], person:1, before:"Domani tu", after:"partire molto presto."},
    {verbs:["venire"], person:5, before:"I miei amici", after:"a trovarmi il mese prossimo."},
    {verbs:["aiutare"], person:0, before:"Domani io ti", after:"a finire il trasloco."},
    {verbs:["chiamare"], person:2, gender:"f", before:"Appena arriva, lei ti", after:"subito."},
    {verbs:["tornare"], person:3, before:"Il prossimo weekend noi", after:"al nostro paese natale."},
    {verbs:["cominciare"], person:4, before:"Voi", after:"il nuovo lavoro lunedì prossimo."},
    {verbs:["aspettare"], person:0, before:"Io ti", after:"davanti al cinema alle otto."},
    {verbs:["credere"], person:1, before:"Con il tempo tu", after:"di più in te stesso."},
    {verbs:["cercare"], person:3, before:"Domani noi", after:"un appartamento più grande."},
    {verbs:["ascoltare"], person:5, before:"Alla conferenza loro", after:"attentamente ogni intervento."}
  ],

  condizionale: [
    {verbs:["chiedere"], person:0, before:"Al posto tuo io", after:"scusa subito."},
    {verbs:["rispondere"], person:1, before:"Tu", after:"volentieri a questa domanda, no?"},
    {verbs:["decidere"], person:2, gender:"f", before:"Al posto tuo, lei", after:"diversamente."},
    {verbs:["promettere"], person:0, before:"Io ti", after:"il mio aiuto, se me lo chiedessi."},
    {verbs:["sembrare"], person:0, before:"Senza occhiali, io", after:"un'altra persona."},
    {verbs:["diventare"], person:3, before:"Con più pratica, noi", after:"davvero bravi."},
    {verbs:["rimanere"], person:4, before:"Se poteste, voi", after:"qui per sempre, vero?"},
    {verbs:["scegliere"], person:5, before:"Al posto nostro, loro", after:"la stessa strada."},
    {verbs:["spiegare"], person:1, before:"Tu mi", after:"meglio la situazione, per favore?"},
    {verbs:["ricordare"], person:2, gender:"m", before:"Lui non", after:"mai una data così importante."}
  ],
  congiuntivo_presente: [
    {verbs:["dimenticare"], person:0, before:"Ho paura che io", after:"le chiavi di nuovo."},
    {verbs:["riuscire"], person:1, before:"Spero che tu", after:"a risolvere il problema."},
    {verbs:["evitare"], person:2, gender:"f", before:"È meglio che lei", after:"quella strada trafficata."},
    {verbs:["considerare"], person:3, before:"Voglio che noi", after:"tutte le opzioni prima di decidere."},
    {verbs:["ottenere"], person:1, before:"Spero che tu", after:"presto una risposta."},
    {verbs:["permettere"], person:2, gender:"m", before:"Non credo che il capo", after:"questo cambiamento."},
    {verbs:["raggiungere"], person:5, before:"Spero che loro", after:"l'accordo entro oggi."},
    {verbs:["mantenere"], person:4, before:"È importante che voi", after:"la calma in ogni situazione."},
    {verbs:["contenere"], person:2, gender:"m", before:"Dubito che questo pacco", after:"tutto quello che serve."},
    {verbs:["appartenere"], person:0, before:"Sento che io non", after:"a questo posto."}
  ],
  trapassato_prossimo: [
    {verbs:["costruire"], person:5, before:"I romani", after:"già quella strada duemila anni fa.", gender:"m"},
    {verbs:["produrre"], person:3, before:"Prima della crisi noi", after:"molto di più.", gender:"m"},
    {verbs:["ridurre"], person:2, gender:"f", before:"L'azienda", after:"già i costi quando è arrivato il nuovo direttore."},
    {verbs:["tradurre"], person:0, before:"Quando è uscito il libro, io", after:"già metà del testo.", gender:"m"},
    {verbs:["condurre"], person:2, gender:"m", before:"Fino a quel momento, lui", after:"sempre una vita tranquilla."},
    {verbs:["proporre"], person:1, before:"Tu", after:"già quell'idea l'anno prima.", gender:"m"},
    {verbs:["supporre"], person:0, before:"Io", after:"già che le cose sarebbero andate così.", gender:"m"},
    {verbs:["opporre"], person:5, before:"I cittadini", after:"resistenza già da tempo.", gender:"m"},
    {verbs:["comporre"], person:2, gender:"m", before:"Il musicista", after:"quella melodia molti anni prima."},
    {verbs:["imporre"], person:4, before:"Voi", after:"già le vostre condizioni prima dell'incontro.", gender:"m"}
  ],
  imperativo: [
    {verbs:["esporre"], person:4, before:"Per favore,", after:"chiaramente le vostre ragioni."},
    {verbs:["disporre"], person:1, before:"Marco,", after:"pure di questa stanza come vuoi."},
    {verbs:["scomparire"], person:1, before:"Dai,", after:"per un attimo dietro l'albero, facciamo uno scherzo!"},
    {verbs:["comparire"], person:4, before:"Per favore,", after:"in aula puntuali domani mattina."},
    {verbs:["apparire"], person:1, before:"Su,", after:"all'improvviso e sorprendili tutti!"},
    {verbs:["sparire"], person:1, before:"Dai,", after:"per qualche minuto, così organizziamo la sorpresa!"},
    {verbs:["preferire"], person:2, formal:true, before:"Signora,", after:"pure un tavolo vicino alla finestra, se vuole."},
    {verbs:["offrire"], person:1, before:"Dai,", after:"un caffè agli ospiti, per favore!"},
    {verbs:["soffrire"], person:4, before:"Non", after:"in silenzio, parlatene con qualcuno!"},
    {verbs:["coprire"], person:1, before:"Fa freddo,", after:"bene i bambini prima di uscire!"}
  ],

  congiuntivo_imperfetto: [
    {verbs:["sopravvivere"], person:0, before:"Non pensavo che io", after:"a un viaggio così duro."},
    {verbs:["prevedere"], person:2, gender:"m", before:"Nessuno pensava che lui", after:"un simile risultato."},
    {verbs:["presumere"], person:1, before:"Non credevo che tu", after:"così tanto sulle tue capacità."},
    {verbs:["ostentare"], person:2, gender:"f", before:"Mi dava fastidio che lei", after:"sempre la sua ricchezza."},
    {verbs:["prescindere"], person:3, before:"Era necessario che noi", after:"da questi dettagli per decidere."},
    {verbs:["discernere"], person:0, before:"Vorrei che io", after:"meglio il vero dal falso."},
    {verbs:["esplicare"], person:2, gender:"m", before:"Volevo che il professore", after:"meglio quel concetto."},
    {verbs:["delineare"], person:5, before:"Era importante che loro", after:"con chiarezza il progetto."}
  ],
  congiuntivo_trapassato: [
    {verbs:["comportare"], person:2, gender:"f", before:"Non pensavo che quella scelta", after:"tante conseguenze.", gender:"f"},
    {verbs:["auspicare"], person:0, before:"Pensavo che io", after:"un finale diverso, in fondo.", gender:"m"},
    {verbs:["precludere"], person:2, gender:"m", before:"Credevo che quell'errore gli", after:"ogni possibilità.", gender:"m"},
    {verbs:["procrastinare"], person:1, before:"Sospettavo che tu", after:"di nuovo la decisione.", gender:"m"},
    {verbs:["plasmare"], person:5, before:"Sembrava che quegli eventi", after:"il suo carattere per sempre.", gender:"m"},
    {verbs:["conseguire"], person:2, gender:"f", before:"Pensavo che lei", after:"già la laurea l'anno scorso."},
    {verbs:["sancire"], person:5, before:"Credevo che le nuove leggi", after:"già quel diritto.", gender:"f"},
    {verbs:["propendere"], person:0, before:"Non pensavo che io", after:"per quella soluzione fin dall'inizio.", gender:"m"}
  ],
  condizionale_passato: [
    {verbs:["esulare"], person:0, before:"Io", after:"volentieri da questo argomento, ma era necessario parlarne.", gender:"m"},
    {verbs:["retrocedere"], person:2, gender:"f", before:"Senza quell'errore, la squadra non", after:"in classifica."},
    {verbs:["sovvertire"], person:5, before:"Senza il loro intervento, i ribelli", after:"l'intero sistema.", gender:"m"},
    {verbs:["arginare"], person:3, before:"Con più risorse, noi", after:"il problema in tempo.", gender:"m"},
    {verbs:["circoscrivere"], person:2, gender:"m", before:"Con più attenzione, il medico", after:"subito l'infezione."},
    {verbs:["comprovare"], person:1, before:"Con altre prove, tu", after:"facilmente la tua tesi.", gender:"m"},
    {verbs:["disattendere"], person:5, before:"Senza quella scusa, loro non", after:"l'accordo.", gender:"m"},
    {verbs:["equivalere"], person:2, gender:"f", before:"In un altro contesto, quella somma", after:"a molto di più."}
  ],
  passato_remoto: [
    {verbs:["sopperire"], person:2, gender:"m", before:"Lo Stato", after:"alla mancanza di fondi con un prestito."},
    {verbs:["sospingere"], person:5, before:"Le onde ci", after:"verso la riva."},
    {verbs:["tralasciare"], person:2, gender:"f", before:"L'autrice", after:"volutamente quel dettaglio nel romanzo."},
    {verbs:["vagliare"], person:5, before:"I giudici", after:"con cura ogni prova presentata."},
    {verbs:["ravvivare"], person:2, gender:"m", before:"Quel discorso", after:"l'entusiasmo del pubblico."},
    {verbs:["ridimensionare"], person:5, before:"Dopo la crisi, gli investitori", after:"le proprie aspettative."},
    {verbs:["riscontrare"], person:2, gender:"m", before:"L'ispettore", after:"diverse irregolarità nel bilancio."},
    {verbs:["presagire"], person:2, gender:"f", before:"Una strana calma", after:"la tempesta che sarebbe arrivata."}
  ],
  futuro_anteriore: [
    {verbs:["paventare"], person:2, gender:"m", before:"A quest'ora il direttore", after:"già le conseguenze della notizia."},
    {verbs:["decretare"], person:5, before:"Entro domani i giudici", after:"già la sentenza definitiva."},
    {verbs:["esibire"], person:1, before:"Prima dell'esame tu", after:"già tutti i documenti richiesti."},
    {verbs:["esordire"], person:2, gender:"f", before:"A quest'ora l'attrice", after:"già sul palco."},
    {verbs:["divulgare"], person:5, before:"Entro sera i giornalisti", after:"già la notizia."},
    {verbs:["scaturire"], person:2, gender:"f", before:"Da questa riunione", after:"già qualche idea utile, immagino."},
    {verbs:["conferire"], person:0, before:"Prima di sera io", after:"già con l'avvocato."},
    {verbs:["alimentare"], person:2, gender:"f", before:"Quella voce, a quest'ora,", after:"già altri pettegolezzi."}
  ]
};

const LEVEL_TENSES = {
  facil: ["presente","passato_prossimo","imperfetto","futuro"],
  normal: ["condizionale","congiuntivo_presente","trapassato_prossimo","imperativo"],
  dificil: ["congiuntivo_imperfetto","congiuntivo_trapassato","condizionale_passato","passato_remoto","futuro_anteriore"]
};

const COMPOUND_TENSES = new Set([
  "passato_prossimo","trapassato_prossimo","congiuntivo_trapassato","condizionale_passato","futuro_anteriore"
]);
const COMPOUND_AUX_TENSE = {
  passato_prossimo: "presente",
  trapassato_prossimo: "imperfetto",
  congiuntivo_trapassato: "cong_imp",
  condizionale_passato: "condizionale",
  futuro_anteriore: "futuro"
};
