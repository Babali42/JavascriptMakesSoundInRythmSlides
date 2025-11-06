---
theme: meetup
layout: intro
lineNumbers: true
themeConfig:
  title: Javascript fait du bruit... ...mais en rythme
  github: babali42/drumbeatrepo
---

# Javascript fait du bruit (mais en rythme)

## Tremplin de Snowcamp 2026 : UX & Frontend

**Baptiste Lyet**

---

# Plan

- Définitions
- Construction d'une boîte à rythme naïve
- Construction d'une boîte à rythme précise
- Synchronisation avec les interfaces graphiques


---

# Définitions
Musique et rythme

### Qu'est ce que la musique ?

Combiner sons et silences au cours du temps.


<v-click>

- **rythme**
- hauteur
- nuances
- timbre

</v-click>


<!--
Définitions de wikipedia
https://fr.wikipedia.org/wiki/Rythme_(musique)
https://fr.wikipedia.org/wiki/Musique
-->
---

# Définitions
Musique et rythme

### Qu'est ce que le rythme ?

Le rythme en musique est l'organisation dans le temps des événements musicaux.

<div class="flex flex-col items-center">
  <div class="flex justify-center gap-12">
    <img src="./images/comment-lire-partition-batterie.png" class="max-w-60 h-auto rounded-lg shadow-lg object-contain" />
    <img src="./images/score.png" class="max-w-100 h-auto rounded-lg shadow-lg object-contain" />
  </div>
  <p class="mt-4 text-gray-500 text-sm">Comment lire une partition de batterie</p>
</div>

---

# Définitions
Séquenceurs et boite à rythme

### Boite à rythme / Drum Machine

<img src="./TR08.avif" class="max-w-100 h-auto rounded-lg shadow-lg object-contain" />

### Usages

- Musique assistée par ordinateur
- Jeux vidéos

<!--
Machine ou logiciel qui génère des boucles de batterie/percussions répétitives et utilise en interne un **séquenceur**
- En musique comme en **frontend**, tout dépend de la **synchronisation**
- Les UIs modernes réagissent en temps réel : **animations**, **streams**, **events**
- Avec **RxJS** ou la **programmation réactive**, on orchestre les événements  
  👉 comme une **partition musicale** : chaque action doit tomber juste.
-->
---

# Construction d'une boite à rythme
Problématique

### Schéma rythmique
```json
"hihat" : [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
"snare" : [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
"kick"  : ["X", " ", " ", " ", "X", " ", " ", " ", "X", " ", " ", " ", "X", " ", " ", " "]
```

### Vitesse de lecture
- 85 ms pour passer d'une case à l'autre avec un tempo de 176
- https://toolstud.io/music/bpm.php?bpm=176&bpm_unit=4%2F4&base=16

---

# Construction d'une boite à rythme
Version naïve : minuteur JS

## SetTimeout()
- déclenche une fonction après un certain temps

```javascript
function loop(){
    console.log("Case suivante");
}

console.log("Début");
setTimeout(loop, 85);
console.log("Fin");
```

```
> Début
> Fin
> Case suivante
```

<!--
permet de déclencher une fonction après un certain temps
-->
---

# Construction d'une boite à rythme
Version naïve : minuteur JS

## SetTimeout()
- Appel récursif
  - permet de déclencher une fonction à interval de temps régulier

```javascript
function loop(){
    console.log("Case suivante");
    setTimeout(loop, 85);
}

loop()
```

```
> Case suivante
> Case suivante
> Case suivante
> ...
```
<!--
J'ai fouillé dans la documentation JS et j'ai vu qu'il y a une fonction pour déclencher un évènement après un temps précis
SetInterval()

Ensuite j'ai vu des débats et beaucoup d'utilisation de SetTimeout() en récursif

De toute façon le récursif ça ne me fait pas peur je fonce
-->

---

# Construction d'une boite à rythme
Version naïve : minuteur JS

```ts
const pattern = ["X"," "," "," ","X"," "," "," ","X"," "," "," ","X"," "," "," "];
const audio = new Audio("kick.wav");

const stepTime = 85;
let step = 0;

function loop(): void {
  if (pattern[step] === "X") {
    audio.currentTime = 0;
    audio.play();
  }

  step = (step + 1) % pattern.length;
  setTimeout(loop, stepTime);
}

loop();
```

---

# Construction d'une boite à rythme
Version naïve : minuteur JS - Démo

<SlidevVideo v-click autoplay controls>
  <!-- Anything that can go in an HTML video element. -->
  <source src="/videos/lag.mov" type="video/mp4" />
  <p>
    Your browser does not support videos. You may download it
    <a href="/myMovie.mp4">here</a>.
  </p>
</SlidevVideo>

---

# Construction d'une boite à rythme
Version naïve : minuteur JS

```mermaid
gantt
    dateFormat  HH:mm:ss
    axisFormat  %S.%L s

    section Sans surcharge processeur
    1 : vert, v1, 00:00:00, 0.000s
    setTimeout :active, des1, after v1, 0.085s
    2 : vert, v2, after des1, 0.000s
    setTimeout :des2, after des1, 0.085s
    3 : vert, v3, after des2, 0.000s
    setTimeout :des3, after des2, 0.085s
    4 : vert, v4, after des3, 0.000s

    section Avec surcharge processeur
    setTimeout :active, des4, 00:00:00, 0.085s
    setTimeout retardé :crit, des5, after des4, 0.105s
    setTimeout :crit, des6, after des5, 0.085s
```

## Inconvénients
- Précision à la milliseconde
- Interférences avec thread JavaScript principal

---

# Construction d'une boite à rythme
Version synchronisée : WebAudioAPI

💡 Au lieu de déclencher les sons au dernier moment, on planifie les événements à l’avance.

## Synchronisation JS & WebAudioAPI
- horloge JavaScript
  - setTimeout()
- hardware audio
  - WebAudioAPI
  - context.currentTime()

---

# Construction d'une boite à rythme précise
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
        Scheduler->>Audio: scheduleNote(currentNote, nextNoteTime)
        Audio->>Speaker: Play click at nextNoteTime
        Scheduler->>Scheduler: nextNoteTime += beatDuration currentNote+= 1
    else Not yet
        Scheduler-->>JS: Wait for next tick
    end
    JS->>Scheduler: Next Tick
```

---

# Construction d'une boite à rythme précise
Code

---

# Construction d'une boite à rythme
Version synchronisée : WebAudioAPI - Démo

<SlidevVideo v-click autoplay controls>
  <!-- Anything that can go in an HTML video element. -->
  <source src="/videos/good.mov" type="video/mp4" />
  <p>
    Your browser does not support videos. You may download it
    <a href="/myMovie.mp4">here</a>.
  </p>
</SlidevVideo>

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

</v-click>

---

# Sources
_

📖 SetTimeout() : https://developer.mozilla.org/fr/docs/Web/API/Window/setTimeout

📖 A Tales of two clock - Chris Wilson - 2013 : https://web.dev/articles/audio-scheduling

🖼️ Roland 808 - 1980 : https://www.roland.com/fr/products/tr-08/

</> DrumBeatRepo : https://www.github.com/babali42/drumbeatrepo







<style>
html {
  font-size: 17px; /* 16 → 17px = 1.10× scale environ*/
}
</style>