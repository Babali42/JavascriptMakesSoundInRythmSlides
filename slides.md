---
theme: default
---
<script setup>
import Footer from './components/Footer.vue'
</script>


# Javascript fait du bruit (mais en rythme)

## Tremplin de Snowcamp

**Baptiste Lyet**

coaché par **Sylvain Coudert**

---

# Plan

- Introduction
   - Musique et rythme
   - Séquenceurs et boites à rythmes
- Création d'un séquenceur en JavaScript
  - Utilisation du timing JavaScript
  - Utilisation de la WebAudioAPI et de la synchronisation d'horloges
- Conclusion

<Footer />
---

# Introduction
Musique et rythme

### Qu'est ce que la musique ?

La musique est un art et une activité culturelle consistant à **combiner sons et silences au cours du temps**.

Les paramètres principaux sont le **rythme** (façon de combiner les sons dans le temps), la hauteur (combinaison dans les fréquences), les nuances et le timbre.

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
image: 8beat_example.jpg
backgroundSize: 90%
---

#  Introduction
Séquenceurs et boîte à rythme

<Footer />
---

# Construction d'une boite à rythme simpliste
Horloge JavaScript

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

# Construction d'une boite à rythme simpliste
Horloge JavaScript

## Démonstration

<Footer />
---

# Construction d'une boite à rythme simpliste
Horloge JavaScript

## Inconvénients
- Précision à la milliseconde
  - Relativement peu précis pour de l'audio
- Horloge JavaScript qui dépend beaucoup de ce qui se passe sur le thread JavaScript principale
  - UI
  - Garbage collector
- Conséquence : Pas utilisable pour des applications audios complexes

<Footer />
---

# Construction d'une boite à rythme précise
Synchronisation d'horloges

## A Tales of two clock - Chris Wilson - 2013

Document de référence qui introduit le concept

## JS --- WebAudioAPI
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

<Footer />
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

- Synchronisation avec l'UI :
  - Utilisation d'une troisième horloge avec requestAnimationFrame()
- Changement de tempo :
  - TimeStretch

<Footer />
---