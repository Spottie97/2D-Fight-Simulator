const gravity = 0.7;
const GROUND_Y = 378;
const ROUND_TIME = 60;
const STEPS_PER_SECOND = 60;

let gameState = "loading";
let timer = ROUND_TIME;
let timerSteps = 0;

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

function endRound() {
  if (gameState !== "fighting") return;
  gameState = "over";
  standDown(player1);
  standDown(player2);

  const title = document.querySelector("#resultTitle");
  if (player1.health === player2.health) {
    title.textContent = "Tie";
  } else if (player1.health > player2.health) {
    title.textContent = "Player 1 Wins";
  } else {
    title.textContent = "Player 2 Wins";
  }

  document.querySelector("#result").style.display = "flex";
}

function resetRound() {
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

  gameState = "fighting";
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
