const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const MOVE_SPEED = 4;
const DAMAGE = 20;
const STEP_MS = 1000 / 60;
const MAX_FRAME_DELTA = 250;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./Assets/BackgroundResized.png",
});

const shop = new Sprite({
  position: {
    x: 905,
    y: 430,
  },
  imageSrc: "./Assets/herbCropped.png",
  scale: 1.9,
  frameMax: 5,
});

// Hitboxes are authored facing right. nativeFacing is the direction the
// sheet already faces. Player 2's death sheet is the right-facing strip.
const player1 = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  imageSrc: "./Assets/Player-1/Idle.png",
  frameMax: 4,
  scale: 2.1,
  offset: {
    x: 145,
    y: 120,
  },
  nativeFacing: 1,
  controls: {
    left: "KeyA",
    right: "KeyD",
    jump: "KeyW",
    attack: "Space",
  },
  sprites: {
    idle: {
      imageSrc: "./Assets/Player-1/Idle.png",
      frameMax: 4,
    },
    run: {
      imageSrc: "./Assets/Player-1/Run.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./Assets/Player-1/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./Assets/Player-1/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./Assets/Player-1/Attack1.png",
      frameMax: 4,
      hitFrame: 2,
    },
    takehit: {
      imageSrc: "./Assets/Player-1/Take hit.png",
      frameMax: 3,
    },
    death: {
      imageSrc: "./Assets/Player-1/Death.png",
      frameMax: 7,
    },
  },
  hitbox: {
    offset: {
      x: 90,
      y: 60,
    },
    width: 132,
    height: 50,
  },
});

const player2 = new Fighter({
  position: {
    x: 900,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  imageSrc: "./Assets/Player-2/A/Idle.png",
  frameMax: 8,
  scale: 2.1,
  offset: {
    x: 145,
    y: 105,
  },
  nativeFacing: -1,
  deathFacing: 1,
  controls: {
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "ArrowUp",
    attack: "Enter",
  },
  sprites: {
    idle: {
      imageSrc: "./Assets/Player-2/A/Idle.png",
      frameMax: 8,
    },
    run: {
      imageSrc: "./Assets/Player-2/A/Run.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./Assets/Player-2/A/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./Assets/Player-2/A/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./Assets/Player-2/A/Attack2.png",
      frameMax: 6,
      hitFrame: 1,
    },
    takehit: {
      imageSrc: "./Assets/Player-2/A/Take Hit - white silhouette.png",
      frameMax: 4,
    },
    death: {
      imageSrc: "./Assets/Player-2/D/Death.png",
      frameMax: 6,
    },
  },
  hitbox: {
    offset: {
      x: 115,
      y: 60,
    },
    width: 185,
    height: 50,
  },
});

const pressed = {
  KeyA: false,
  KeyD: false,
  KeyW: false,
  Space: false,
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  Enter: false,
};

const GAME_KEYS = new Set([
  "KeyA",
  "KeyD",
  "KeyW",
  "Space",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "Enter",
  "KeyR",
  "KeyF",
]);

function handleMovement(fighter) {
  fighter.velocity.x = 0;
  if (fighter.dead) return;

  const controls = fighter.controls;
  const left = pressed[controls.left];
  const right = pressed[controls.right];
  let direction = 0;

  if (left && !right) direction = -1;
  else if (right && !left) direction = 1;
  else if (left && right) {
    if (fighter.lastKey === controls.left) direction = -1;
    else if (fighter.lastKey === controls.right) direction = 1;
  }

  if (direction !== 0) {
    fighter.velocity.x = direction * MOVE_SPEED;
    fighter.switchSprites("run");
  } else {
    fighter.switchSprites("idle");
  }

  if (fighter.velocity.y < 0) fighter.switchSprites("jump");
  else if (fighter.velocity.y > 0) fighter.switchSprites("fall");
}

function healthBar(fighter) {
  return fighter === player1 ? "#player1HP" : "#player2HP";
}

function resolveAttack(attacker, defender) {
  const attackSprite = attacker.sprites.attack1;
  if (attacker.image !== attackSprite.image || !attacker.isAttacking) return;
  if (attacker.frameCurrent !== attackSprite.hitFrame) return;

  if (playerCollision({ attacker, defender })) {
    defender.takeHit(DAMAGE);
    gsap.to(healthBar(defender), {
      width: defender.health + "%",
    });
  }

  attacker.isAttacking = false;
}

function update() {
  background.update();
  shop.update();
  player1.update();
  player2.update();

  player1.velocity.x = 0;
  player2.velocity.x = 0;
  if (gameState !== "fighting") return;

  handleMovement(player1);
  handleMovement(player2);
  player1.faceOpponent(player2);
  player2.faceOpponent(player1);
  resolveAttack(player1, player2);
  resolveAttack(player2, player1);
  tickTimer();

  if (timer <= 0 || player1.health <= 0 || player2.health <= 0) endRound();
}

function render() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.draw();
  shop.draw();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player1.draw();
  player2.draw();
}

let lastTime = 0;
let accumulator = 0;

function frame(now) {
  window.requestAnimationFrame(frame);
  if (lastTime === 0) {
    lastTime = now;
    render();
    return;
  }

  let delta = now - lastTime;
  lastTime = now;
  if (delta > MAX_FRAME_DELTA) delta = MAX_FRAME_DELTA;

  accumulator += delta;
  while (accumulator >= STEP_MS) {
    update();
    accumulator -= STEP_MS;
  }
  render();
}

function onKeyDown(event) {
  if (!GAME_KEYS.has(event.code)) return;
  event.preventDefault();
  if (event.repeat) return;

  if (event.code === "KeyR") {
    if (gameState === "over") resetRound();
    return;
  }

  if (event.code === "KeyF") {
    toggleFullscreen();
    return;
  }

  if (gameState !== "fighting") return;
  pressed[event.code] = true;

  for (const fighter of [player1, player2]) {
    if (event.code === fighter.controls.left || event.code === fighter.controls.right) {
      fighter.lastKey = event.code;
    }
    if (event.code === fighter.controls.jump) fighter.jump();
    if (event.code === fighter.controls.attack) fighter.attack();
  }
}

function onKeyUp(event) {
  if (!GAME_KEYS.has(event.code)) return;
  event.preventDefault();
  pressed[event.code] = false;
}

function releaseKeys() {
  for (const code in pressed) pressed[code] = false;
}

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("blur", releaseKeys);

document.querySelector("#restartButton").addEventListener("click", () => {
  if (gameState !== "over") return;
  resetRound();
  document.querySelector("#restartButton").blur();
});

function fitGame() {
  const game = document.querySelector(".game");
  const width = game.offsetWidth;
  const height = game.offsetHeight;
  if (!width || !height) return;
  const scale = Math.min(window.innerWidth / width, window.innerHeight / height);
  game.style.setProperty("--game-scale", String(scale));
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    return;
  }
  const request = document.documentElement.requestFullscreen();
  if (request && request.catch) request.catch(() => {});
}

function syncFullscreenButton() {
  document.querySelector("#fullscreenButton").textContent = document.fullscreenElement
    ? "Exit Fullscreen"
    : "Fullscreen";
}

document.querySelector("#fullscreenButton").addEventListener("click", () => {
  toggleFullscreen();
  document.querySelector("#fullscreenButton").blur();
});

window.addEventListener("resize", fitGame);
document.addEventListener("fullscreenchange", () => {
  syncFullscreenButton();
  fitGame();
});
fitGame();
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fitGame);
}

const images = [background.image, shop.image];
for (const fighter of [player1, player2]) {
  for (const name in fighter.sprites) {
    images.push(fighter.sprites[name].image);
  }
}

loadImages(images)
  .then(startGame)
  .catch((error) => {
    console.error(error);
    startGame();
  });

function startGame() {
  gameState = "fighting";
  document.querySelector("#timer").textContent = String(timer);
  window.requestAnimationFrame(frame);
}
