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

coaché par **Sylvain Coudert**

<FooterImage />
---

# Plan

- Introduction
   - Pourquoi ce talk au tremplin ?
   - Musique et rythme
   - Séquenceurs et boites à rythmes
- Création d'une boîte à rythme
  - Problématique
  - Simpliste
  - Précise
- Conclusion

<Footer />
---

# Introduction
Pourquoi ce talk au tremplin ?

- Développeur + musicien
- Participation à Snowcamp en tant que spectateur
- Sylvain et Punkindev

<Footer />
---

# Introduction
Musique et rythme

### Qu'est ce que la musique ?

Combiner sons et silences au cours du temps.

Paramètres principaux : 
- **rythme**
- hauteur
- nuances
- timbre

<!--
Définitions de wikipedia
https://fr.wikipedia.org/wiki/Rythme_(musique)
https://fr.wikipedia.org/wiki/Musique
-->
<Footer />
---
layout: image-right
image: 8beat_example.jpg
backgroundSize: 90%
---

#  Introduction
Musique et rythme

### Qu'est ce que le rythme ?

Le rythme en musique est l'organisation dans le temps des événements musicaux.

<Footer />
---
layout: image-right
image: TR08.avif
backgroundSize: 90%
---

#  Introduction
Séquenceurs et boîte à rythme

**Boîte à rythme** : Machine ou logiciel qui génère des boucles de batterie/percussions répétitives et utilise en interne un **séquenceur**

- DAW
- Jeu vidéo

<Footer />
---
layout: image-right
image: 8beat_example.jpg
backgroundSize: 90%
---

# Construction d'une boite à rythme
Problématique

- Pas minimal entre deux notes : quart de croche
  - 117ms à un tempo de 128
  - 75ms à un tempo de 200
- Besoin de précision
- Modelisation 

```json
"hihat" : ["X", "X", "X", "X", "X", "X", "X", "X"],
"snare" : [" ", " ", "X", " ", " ", "X", " ", " "],
"kick"  : ["X", " ", " ", "X", "X", " ", " ", "X"]
```

<Footer />
---
layout: image-right
image: JSClockDelay.png
backgroundSize: 50%
---

# Construction d'une boite à rythme
Simpliste - Horloge JavaScript

## SetTimeout()
- permet de déclencher une fonction après un certain temps
- davantage utilisé que SetInterval() qui elle est répétitive

```javascript
function repeat() {
  console.log("Runs every ~2 seconds");
  setTimeout(repeat, 2000);
}
repeat();
```

<Footer />
---

# Construction d'une boite à rythme
Simpliste - Horloge JavaScript

## Code
```ts
const pattern: string[] = ["X"," "," "," ","X"," "," "," ","X"," "," "," ","X"," "," "," "];
const audio: HTMLAudioElement = new Audio("kick.wav");

const bpm: number = 120;
const stepTime: number = (60 / bpm) / 4 * 1000; // duration of a 16th note in ms

let step: number = 0;

(function loop(): void {
  if (pattern[step] === "X") {
    audio.currentTime = 0;
    audio.play();
  }

  step = (step + 1) % pattern.length;
  setTimeout(loop, stepTime);
})();
```

<Footer />
---

# Construction d'une boite à rythme
Simpliste - Horloge JavaScript

## Démonstration
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
Simpliste - Horloge JavaScript

## Inconvénients
- Précision à la milliseconde
  - Relativement peu précis pour de l'audio
- Horloge JavaScript qui dépend beaucoup de ce qui se passe sur le thread JavaScript principale
  - UI
  - Garbage collector
- Conséquence : Pas utilisable pour des applications audios complexes

<Footer />
---

# Construction d'une boite à rythme
Précise - Synchronisation d'horloges

💡 Au lieu de déclencher les sons au dernier moment, on planifie les événements à l’avance.

📖 A Tales of two clock - Chris Wilson - 2013

## Synchronisation JS & WebAudioAPI
- horloge JavaScript
  - setTimeout()
  - setInterval()
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

# Conclusion
Résumé

Notions :
- timer
- horloges

Solution :
- synchronisation d'horloge JavaScript avec horloges tierces (WebAudioAPI)

Cette solution est utilisée dans de nombreuses applications web

<Footer />
---

# Conclusion
Ouverture

Synchronisation avec l'UI : utilisation d'une troisième horloge avec **requestAnimationFrame()**

Changement de tempo et **TimeStretch**

<Footer />
---