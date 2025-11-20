---
theme: meetup
layout: intro
lineNumbers: true
themeConfig:
  title: Javascript fait du bruit... ...mais en rythme
  github: babali42/drumbeatrepo
---

# Javascript fait du bruit
(mais en rythme)

## Tremplin de Snowcamp 2026 : UX & Frontend

**Baptiste Lyet**

<!--
Aujourd'hui on va parler de javascript et de rythme
-->

---

# Plan

- Présentation de DrumBeatRepo
- Définitions
- Construction d'une boîte à rythme
  - **naïve**
  - **synchronisée**


---

# Présentation de DrumBeatRepo

  https://www.drumbeatrepo.com

<!--
C'est beau ça marche mais il y a eu des problèmes.

Je vais vous présenter un des écueils et comment je suis passé dessus
-->
---

# Définitions
Musique et rythme

### Qu'est ce que la musique ?

<v-click>

Caractéristiques :
- hauteur
- nuance
- timbre
- **rythme**

</v-click>


<!--
Définitions de wikipedia

Combiner sons et silences au cours du temps
-->
---

# Définitions
Musique et rythme

### Qu'est ce que le rythme ?

<v-click>

<div class="flex flex-col items-center">
  <div class="flex justify-center gap-12">
    <img src="./images/comment-lire-partition-batterie.png" class="max-w-60 h-auto rounded-lg shadow-lg object-contain" />
    <img src="./images/scorepunk.png" class="max-w-100 h-auto rounded-lg shadow-lg object-contain" />
  </div>
  <p class="mt-4 text-gray-500 text-sm">Comment lire une partition de batterie</p>
</div>

</v-click>

<!--
Définitions de wikipedia

Organisation dans le temps des évènements musicaux
-->

---

# Définitions
Séquenceurs et boite à rythme

### Roland 808

<img src="./TR08.avif" class="max-w-100 h-auto rounded-lg shadow-lg object-contain" />

<!--
Machine ou logiciel qui génère des boucles de batterie/percussions répétitives et utilise en interne un **séquenceur**

- Musique assistée par ordinateur
- Jeux vidéos

Il y en a des analogiques, des numériques et aussi des versions logicielles. Ensemble on va voir comment en coder une en JS
-->
---

# Construction d'une boite à rythme
Problématique

### Schéma rythmique
```json
"charleston"   : [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
"caisseClaire" : [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
"grosseCaisse" : ["X", " ", " ", " ", "X", " ", " ", " ", "X", " ", " ", " ", "X", " ", " ", " "]
```

<img src="./images/score.png" class="max-w-100 h-auto rounded-lg shadow-lg object-contain" />

---

# Construction d'une boite à rythme
Problématique

### Vitesse de lecture
- 85 ms pour passer d'une case à l'autre avec un tempo de 176
- https://toolstud.io/music/bpm.php?bpm=176&bpm_unit=4%2F4&base=16

<img src="./images/score.png" class="max-w-100 h-auto rounded-lg shadow-lg object-contain" />

<!--
85 ms
-->

---

# Construction d'une boite à rythme - naïve
_
## SetTimeout()
- déclenche une fonction après un certain temps

```typescript  {monaco-run} {autorun:false}
function scheduler(){
    console.log("Case suivante");
}

console.log("Début");
setTimeout(scheduler, 85);
console.log("Fin");
```

<!--
permet de déclencher une fonction après un certain temps
-->
---

# Construction d'une boite à rythme - naïve
_
## SetTimeout() récursif
- déclenche une fonction à interval de temps régulier

```typescript  {monaco-run} {autorun:false}
function scheduler(){
    console.log("Case suivante");
    setTimeout(scheduler, 85);
}

scheduler()
```
<!--
De toute façon le récursif ça ne me fait pas peur je fonce
-->

---

# Construction d'une boite à rythme - naïve

```ts {monaco-run} {autorun:false}
const pattern = ["X"," "," "," ","X"," "," "," ","X"," "," "," ","X"," "," "," "];
const audio = new Audio('https://soundcamp.org/sounds/381/kick/B/acoustic-kick-drum-one-shot-b-key-201-ywK.wav');

let step = 0;

function scheduler(): void {
    if (pattern[step] === "X") {
        audio.currentTime = 0;
        audio.play();
        console.log(step);
    }

    step = (step + 1) // % pattern.length;
    setTimeout(scheduler, 85); //85 ms
}

scheduler();
```

---

# Construction d'une boite à rythme - naïve

<div class="w-full max-w-3xl mx-auto">
  <SlidevVideo controls class="w-full rounded-xl">
    <source src="/videos/lag.mov" type="video/mp4" />
  </SlidevVideo>
</div>

---

# Construction d'une boite à rythme - naïve

<img src="./images/setTimeoutSchema.png" class="h-auto object-contain" />

## Inconvénients
- Précision à la milliseconde
- Interférences avec thread JavaScript principal
- Dérive d’horloge

---

<!--
Ne pas confondre avec un jitter ou avec une latence

Dérive d’horloge → décalage progressif dans le temps (long terme).
Jitter → fluctuations aléatoires d’un tick à l’autre (court terme).
-->

# Construction d'une boite à rythme - synchronisée

💡 Au lieu de déclencher les sons au dernier moment, on planifie les événements à l’avance.



## Synchronisation JS & WebAudioAPI

```ts {monaco-run} {autorun:false}
var context = new AudioContext();
console.log(context.currentTime);

setTimeout(() => console.log(context.currentTime), 500);

```

---

# Construction d'une boite à rythme - synchronisée

<img src="./images/schema_v1.png" class="max-h-100 h-auto rounded-lg shadow-lg object-contain" />
---

# Construction d'une boite à rythme - synchronisée
```mermaid
sequenceDiagram
    autonumber
    participant JS as JavaScript Timer
    participant Scheduler as scheduler()
    participant Audio as AudioContext
    participant Speaker as Output
    
    JS->>Scheduler: Tick (every 25ms)
    Scheduler->>Audio: Check nextNoteTime < currentTime + lookahead
    alt Time to schedule
        Scheduler->>Audio: scheduleNote(step, nextNoteTime)
        Audio->>Speaker: Play sample at nextNoteTime
        Scheduler->>Scheduler: nextNoteTime += 0.085,    step+= 1
    else Not yet
        Scheduler-->>JS: Wait for next tick
    end
    JS->>Scheduler: Next Tick
```

---

# Construction d'une boite à rythme - synchronisée

<div style="max-height: 400px; overflow:auto;">

```ts {monaco-run} {autorun:false}
const pattern = ["X"," "," "," ","X"," "," "," ","X"," "," "," ","X"," "," "," "];
const lookahead = 0.100; // 100ms

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
let kickBuffer: AudioBuffer, nextNoteTime = audioContext.currentTime, step = 0;

fetch("https://corsproxy.io/?" + encodeURIComponent("https://soundcamp.org/sounds/381/kick/B/acoustic-kick-drum-one-shot-b-key-201-ywK.wav"))
    .then(r => r.arrayBuffer())
    .then(buf => audioContext.decodeAudioData(buf))
    .then(buffer => { kickBuffer = buffer });

function scheduler() {
    while (nextNoteTime < audioContext.currentTime + lookahead) {
        scheduleNote(step, nextNoteTime);
        setNextNote();
    }
    setTimeout(scheduler, 25); // 25ms
}

function scheduleNote(step: number, time: number) {
  if (pattern[step] === "X" && kickBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = kickBuffer;
    source.connect(audioContext.destination);
    source.start(time);
  }
}

function setNextNote() {
  nextNoteTime += 0.085; //85 ms
  step = (step + 1);// % pattern.length;
}

scheduler();
```

</div>


<!--
**fetch()
Web Audio API (decodeAudioData)
Using it in a <canvas>
Reading metadata**

Avec ce second exemple j'ai besoin de décoder du coup j'ai eu un problème de CORS

J'ai utilisé CorsProxy pour pouvoir fetch le .wav et contourner les restrictions de mon navigateur web

J'utilise la fonction audio buffer qui me permet de stocker en mémoire le sample, échantillon
-->
---

# Construction d'une boite à rythme - synchronisée

<div class="w-full max-w-3xl mx-auto">
  <SlidevVideo controls class="w-full rounded-xl">
    <source src="/videos/good.mov" type="video/mp4" />
  </SlidevVideo>
</div>

---

# Conclusion
_

### Notions
- minuteur / timer
- horloges / clock

<v-click>

### Solution
- synchronisation d'horloge JavaScript avec horloge tierce (WebAudioAPI)

</v-click>

<v-click>

### Aller plus loin
- UI - **requestAnimationFrame()**
- Changement de tempo et **TimeStretch**
- Synchroniser plusieurs séquenceurs ?

</v-click>

---

# Merci !

--> **Baptiste Lyet** - Développeur .NET/Angular @Sogilis

</> DrumBeatRepo : https://www.github.com/babali42/drumbeatrepo
<img src="./images/qrcode.png" class="max-w-50 h-auto rounded-lg shadow-lg object-contain" />

Source : A tales of two clocks - Chris Wilson - 2013




<style>
html {
  font-size: 17px; /* 16 → 17px = 1.10× scale environ*/
}
</style>