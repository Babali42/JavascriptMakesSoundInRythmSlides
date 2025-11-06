---
theme: default
---
<script setup>
import Footer from './components/Footer.vue';
import FooterImage from './components/FooterImage.vue'
</script>


# Javascript fait du bruit (mais en rythme)

## Tremplin de Snowcamp 2026 : UX & Frontend

**Baptiste Lyet**

<FooterImage />
---

# Plan


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
<Footer />
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

<Footer />
---
layout: image-right
image: TR08.avif
backgroundSize: 90%
---

# Définitions
Séquenceurs et boite à rythme

### Boite à rythme / Drum Machine
Machine ou logiciel qui génère des boucles de batterie/percussions répétitives et utilise en interne un **séquenceur**

### Usages

- Musique assistée par ordinateur
- Jeux vidéos

---

# Pourquoi parler de rythme en JavaScript ? 🥁

<v-clicks>

- En musique comme en **frontend**, tout dépend de la **synchronisation**
- Les UIs modernes réagissent en temps réel : **animations**, **streams**, **events**
- Avec **RxJS** ou la **programmation réactive**, on orchestre les événements  
  👉 comme une **partition musicale** : chaque action doit tomber juste.

</v-clicks>

<Footer />
---
layout: image-right
image: 8beat_example.jpg
backgroundSize: 50%
---

# Construction d'une boite à rythme
Problématique

### Schéma rythmique
```json
"hihat" : ["X", " ", "X", " ", "X", " ", "X", " "],
"snare" : [" ", " ", " ", " ", "X", " ", " ", " "],
"kick"  : ["X", " ", " ", " ", " ", " ", "X", " "]
```

### Vitesse de lecture
- n ms pour passer d'une case à l'autre
- https://toolstud.io/music/bpm.php?bpm=176&bpm_unit=4%2F4&base=16
- avec n > 75ms et n < 150ms

<Footer />
---

# Construction d'une boite à rythme
Version naïve : minuteur JS

## SetTimeout()
- permet de déclencher une fonction après un certain temps

```javascript
function loop(){
    console.log("Sample is played");
}

console.log("Start");
setTimeout(loop, 75);
console.log("End");
```

```
> Start
> End
> Sample is played
```

<Footer />
---

# Construction d'une boite à rythme
Version naïve : minuteur JS

## SetTimeout()
- Appel récursif
  - permet de déclencher une fonction à interval de temps régulier

```javascript
function loop(){
    console.log("Sample is played");
    setTimeout(loop, 75);
}

loop()
```

```
> Sample is played
> Sample is played
> Sample is played
> ...
```


<Footer />
---

# Construction d'une boite à rythme
Version naïve : minuteur JS

```ts
const pattern: string[] = ["X"," "," "," ","X"," "," "," ","X"," "," "," ","X"," "," "," "];
const audio: HTMLAudioElement = new Audio("kick.wav");

const bpm: number = 120;
const stepTime: number = (60 / bpm) / 4 * 1000; // duration of a 16th note in ms

let step: number = 0;

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

<Footer />
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

<Footer />
---

# Construction d'une boite à rythme
Version naïve : minuteur JS

## Inconvénients
- Précision à la milliseconde
  - peu précis pour de l'audio
- Interférences avec thread JavaScript principal
  - UI
  - Garbage collector
- Non utilisable pour des applications complexes

<Footer />
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

<Footer />
---
layout: image

image: /settimeout-audio-event-4e03219617f57_1920.png
backgroundSize: 50%
---

# Construction d'une boite à rythme précise
Code

<Footer />
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

<Footer />
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

<Footer />
---

# Sources
_

📖 SetTimeout() : https://developer.mozilla.org/fr/docs/Web/API/Window/setTimeout

📖 A Tales of two clock - Chris Wilson - 2013 : https://web.dev/articles/audio-scheduling

🖼️ Roland 808 - 1980 : https://www.roland.com/fr/products/tr-08/

</> DrumBeatRepo : https://www.github.com/babali42/drumbeatrepo

<Footer />
---