# Oda Clan Wars

Oda Clan Wars is a local two-player browser fighting game, inspired by titles such as Tekken and Mortal Kombat. Empty your opponent's health bar, or have more health left when the timer runs out.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/live-demo-brightgreen)](https://oda-clan-wars.netlify.app/)

## Preview

![Updated visuals and animations](https://user-images.githubusercontent.com/65610257/195808880-038db662-9f22-4fb4-8b34-fddb39656565.png)

Earlier looks during development:

![First visuals](https://user-images.githubusercontent.com/65610257/195394169-fffa0d53-834b-4bef-816d-cea2a8f1a475.png)
![Early stages of development](https://user-images.githubusercontent.com/65610257/195808948-587c5f12-702b-45e7-8bc1-4debdd37bc2b.png)

## About

This is a two-player game played on one keyboard. There are no AI opponents. Each fighter starts with 100 health. A hit deals 20 damage. The round ends when a health bar reaches 0, or when the 60-second timer expires. If time runs out, the fighter with more health wins. Equal health is a tie. Press R or the Restart button to play the round again.

## Features

- Local two-player fights on a single keyboard
- Movement, a single jump from the ground, and a basic attack
- Fighters turn to face each other, including after they cross sides
- Sprite animations for idle, run, jump, fall, attack, take hit, and death
- Health bars animated with GSAP
- A 60-second round timer and a win or tie overlay
- Restart with R or the on-screen button
- The game scales to fit the browser window, and F or the Fullscreen button enters fullscreen
- A forest background with an animated shop
- Gameplay locked to 60 updates per second, so speed stays the same on high-refresh displays

Planned, and not in the game yet:

- Defend (block)
- Combo attack
- Character selection

## Controls

| Action | Player 1 | Player 2 |
| --- | --- | --- |
| Move left | A | Left arrow |
| Move right | D | Right arrow |
| Jump | W | Up arrow |
| Attack | Space | Enter |
| Restart after the round | R | R |
| Fullscreen | F | F |

The move, attack, restart, and fullscreen controls are shown under the fight.

## Getting started

No install or build step is required. The page loads [GSAP](https://greensock.com/gsap/) from a CDN for the health-bar animation, so you need a network connection the first time the bars animate.

1. Clone the repository:

   ```bash
   git clone https://github.com/Spottie97/2D-Fight-Simulator.git
   cd 2D-Fight-Simulator
   ```

2. Open `2D-Fighters/index.html` in a browser.

You can also play the hosted build: [live demo](https://oda-clan-wars.netlify.app/).

## Project layout

```text
2D-Fighters/
  index.html        Page, health bars, timer, result overlay, and controls
  css/style.css     Layout and HUD styles
  index.js          Canvas setup, fighters, input, and the game loop
  js/classes.js     Sprite and Fighter behavior
  js/utilities.js   Collision, round timer, and win or restart flow
  Assets/           Background, shop, and fighter sprites
```

## Credits

The game was built while learning JavaScript, HTML, and CSS, with research from YouTube and Stack Overflow and original adaptations on top of that. [This video](https://youtu.be/vyqbNFMDRGQ) covers the fundamentals used here.

## License

Released under the [MIT License](LICENSE). Copyright (c) 2022 Reinhardt Erasmus.
