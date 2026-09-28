const gravity = 0.7;
const GROUND_Y = 378;
const ROUND_TIME = 60;
const STEPS_PER_SECOND = 60;
const ROUNDS_TO_WIN = 2;
const ROUND_INTRO_STEPS = 60;
const ROUND_BREAK_STEPS = 150;

let gameState = "loading";
let timer = ROUND_TIME;
let timerSteps = 0;
let roundNumber = 1;
let roundWins = { player1: 0, player2: 0 };
let phaseSteps = 0;

function playerCollision({ attacker, defender }) {
  const box = attacker.hitbox;
  return (
    box.position.x + box.width >= defender.position.x &&
    box.position.x <= defender.position.x + defender.width &&
    box.position.y + box.height >= defender.position.y &&
    box.position.y <= defender.position.y + defender.height
  );
}

function tickTimer() {
  if (gameState !== "fighting" || timer <= 0) return;
  timerSteps += 1;
  if (timerSteps < STEPS_PER_SECOND) return;
  timerSteps = 0;
  timer -= 1;
  document.querySelector("#timer").textContent = String(timer);
}

function standDown(fighter) {
  if (fighter.health <= 0 || fighter.image === fighter.sprites.death.image) return;
  fighter.isAttacking = false;
  if (fighter.image !== fighter.sprites.idle.image) {
    fighter.applySprite("idle", true);
  }
}

function announce(text) {
  const announcer = document.querySelector("#announcer");
  gsap.killTweensOf(announcer);
  announcer.textContent = text;
  gsap.set(announcer, { opacity: 1 });
  return announcer;
}

function renderRoundWins() {
  for (const id of ["player1", "player2"]) {
    const pips = document.querySelectorAll("#" + id + "Wins .round-pip");
    for (let index = 0; index < pips.length; index += 1) {
      pips[index].classList.toggle("won", index < roundWins[id]);
    }
  }
}

function roundWinner() {
  if (player1.health > player2.health) return "player1";
  if (player2.health > player1.health) return "player2";
  return null;
}

function endRound() {
  if (gameState !== "fighting") return;
  standDown(player1);
  standDown(player2);

  const winner = roundWinner();
  if (winner) roundWins[winner] += 1;
  renderRoundWins();

  if (winner && roundWins[winner] >= ROUNDS_TO_WIN) {
    gameState = "over";
    document.querySelector("#resultTitle").textContent =
      winner === "player1" ? "Player 1 Wins" : "Player 2 Wins";
    document.querySelector("#resultScore").textContent =
      roundWins.player1 + " - " + roundWins.player2;
    document.querySelector("#result").style.display = "flex";
    announce("");
    return;
  }

  gameState = "roundOver";
  phaseSteps = ROUND_BREAK_STEPS;
  if (!winner) {
    announce("Draw");
    return;
  }
  const name = winner === "player1" ? "Player 1" : "Player 2";
  announce(name + " Wins Round " + roundNumber);
}

function startRound(number) {
  roundNumber = number;
  timer = ROUND_TIME;
  timerSteps = 0;
  document.querySelector("#timer").textContent = String(timer);
  document.querySelector("#result").style.display = "none";

  player1.reset();
  player2.reset();

  gsap.killTweensOf("#player1HP");
  gsap.killTweensOf("#player2HP");
  gsap.set("#player1HP", { width: "100%" });
  gsap.set("#player2HP", { width: "100%" });

  releaseKeys();
  gameState = "intro";
  phaseSteps = ROUND_INTRO_STEPS;
  announce("Round " + number);
}

function startMatch() {
  roundWins.player1 = 0;
  roundWins.player2 = 0;
  renderRoundWins();
  startRound(1);
}

function tickPhase() {
  if (gameState !== "intro" && gameState !== "roundOver") return;
  if (phaseSteps <= 0) return;
  phaseSteps -= 1;
  if (phaseSteps > 0) return;

  if (gameState === "roundOver") {
    startRound(roundNumber + 1);
    return;
  }

  gameState = "fighting";
  gsap.to(announce("Fight!"), { opacity: 0, duration: 0.6, delay: 0.4 });
}

function loadImages(images) {
  return Promise.all(
    images.map((image) => {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve, reject) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener(
          "error",
          () => reject(new Error("Failed to load " + image.src)),
          { once: true }
        );
      });
    })
  );
}
