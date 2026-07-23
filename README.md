# Tanapp

App web (funciona en el navegador y se puede instalar como PWA en el celular)
para practicar conjugación de verbos italianos, con biblioteca de conjugación,
chat con IA (Groq) y tarjetas de vocabulario.

## Qué incluye

- **Conjugar**: tandas de 10 verbos distintos, con una frase de contexto y un
  espacio para completar. El infinitivo aparece arriba. Al responder te dice
  si está bien o mal y te explica el tiempo verbal. 3 niveles:
  - Fácil (A1/A2): presente, passato prossimo, imperfetto, futuro semplice.
  - Normal (B1/B2): condizionale, congiuntivo presente, trapassato prossimo, imperativo.
  - Difícil (C1/C2): congiuntivo imperfetto/trapassato, condizionale passato,
    passato remoto, futuro anteriore.
  Cubre 120 verbos (40 por nivel), elegidos por frecuencia de uso real.
- **Biblioteca**: escribís cualquier verbo en infinitivo y ves todas sus
  conjugaciones. Usa un dataset local (offline) para los 120 verbos
  curados, y si escribís otro verbo hace una estimación local + consulta en
  vivo la API abierta [verbe.cc](https://verbe.cc) (proyecto open source
  `verbecc`, licencia LGPL-3.0, basado en Verbiste).
- **Chat IA**: charla libre, siempre en italiano de parte de la IA (nunca te
  va a hablar en español). Si cometés un error (o le escribís en español), la
  respuesta empieza con una corrección en rojo, y después sigue la charla en
  italiano.
- **Tarjetas**: vocabulario poco común en 3 niveles, 10 palabras por sesión
  (se renuevan cada vez), con significado en español y un ejemplo.
- **Racha y repaso**: cada respuesta correcta suma a tu racha (🔥, visible
  arriba a la derecha); un error la reinicia. Además hay un sistema de
  repaso espaciado (tipo Leitner): los verbos/tiempos que fallaste vuelven a
  aparecer más seguido hasta que los domines, y aparece una tarjeta de
  "Repaso pendiente" cuando hay algo esperando.

## Cómo usarla ahora mismo (sin instalar nada)

Simplemente abrí `index.html` con doble clic, o arrastralo a una pestaña de
Chrome/Safari/Firefox. Funciona offline excepto el Chat IA y las búsquedas en
vivo de la biblioteca (que necesitan internet).

## Cómo conseguir tu API key gratis de Groq (para el Chat IA)

1. Entrá a **console.groq.com** y creá una cuenta gratis (podés entrar con Google).
2. En el menú lateral andá a **API Keys**.
3. Tocá **Create API Key**, ponele un nombre (por ejemplo "italiano-app") y confirmá.
4. Copiá la key que empieza con `gsk_...` (ojo: solo se muestra una vez).
5. Abrí la app, tocá el ícono ⚙️ arriba a la derecha, pegá la key en el campo
   correspondiente y tocá "Guardar API key".

La key se guarda **solo en tu navegador** (localStorage), nunca se envía a
ningún servidor propio: las llamadas van directo de tu navegador a la API de
Groq. Groq tiene un nivel gratuito con límites de uso por minuto/día; si te
quedás sin cupo, la app te avisa y podés reintentar más tarde.

## Cómo instalarla como app en el celular (PWA)

Para que el celular te deje "Agregar a pantalla de inicio" como una app real
(con ícono, pantalla completa, funcionamiento offline), el navegador exige que
la página esté servida por **HTTPS** — abrirla como archivo local (`file://`)
no alcanza para esa parte, aunque para USARLA en la compu con abrir el
`index.html` es más que suficiente.

La forma más simple y gratuita de darle una URL https es **GitHub Pages**:

1. Creá una cuenta gratis en **github.com** si no tenés.
2. Creá un repositorio nuevo (puede ser público), por ejemplo `tanapp`.
3. Subí todos los archivos de esta carpeta (`index.html`, `style.css`, todos
   los `.js`, la carpeta `data/` y la carpeta `icons/`) a ese repositorio —
   podés arrastrarlos directo en la web de GitHub, sección "Add file > Upload
   files", o con git si lo usás.
4. Andá a **Settings > Pages** del repositorio, y en "Branch" elegí `main` y
   la carpeta raíz (`/`), guardá.
5. En un minuto te da una URL tipo `https://tu-usuario.github.io/tanapp/`.
6. Abrí esa URL desde el navegador del celular y elegí **"Agregar a la
   pantalla de inicio"** (Chrome/Android) o **"Añadir a pantalla de inicio"**
   (Safari/iOS). Va a quedar instalada con su propio ícono.

Alternativa igual de fácil sin necesitar cuenta de GitHub: **Netlify Drop**
(app.netlify.com/drop) — arrastrás la carpeta entera a la página y te da una
URL https al instante, sin necesidad de crear un repositorio.

## Fuentes de datos usadas

- Conjugaciones: motor propio (reglas de conjugación italiana + tabla de
  verbos irregulares), verificado cruzando datos contra la API abierta
  [verbe.cc](https://github.com/bretttolbert/verbecc) (LGPL-3.0). Esto
  permite que la app funcione 100% offline para los 120 verbos incluidos.
- Chat IA: [Groq](https://groq.com) (modelo `openai/gpt-oss-120b`).

## Estructura de archivos

```
index.html          shell principal, navegación entre pantallas
style.css            estilos (paleta bandera italiana)
app.js               wiring de navegación, ajustes, eventos
conjugator.js        motor de conjugación + acceso a datos
stats.js             racha y repaso espaciado (localStorage)
exercise.js          lógica del juego "Conjugar"
library.js           lógica de la "Biblioteca"
chat.js              integración con Groq
cards.js             lógica de las tarjetas de vocabulario
data/verbs120.json   120 verbos conjugados y verificados
data/sentences.js    banco de frases de ejercicio + explicaciones de cada tiempo
data/vocab.js        palabras de vocabulario para las tarjetas
manifest.json, sw.js configuración PWA (instalable + funciona offline)
icons/               íconos de la app
```
