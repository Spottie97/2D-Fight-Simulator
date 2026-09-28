class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    frameMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frameMax = frameMax;
    this.frameCurrent = 0;
    this.frameElapsed = 0;
    this.framesHold = 20;
    this.offset = offset;
  }

  createSprite() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.frameMax),
      0,
      this.image.width / this.frameMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frameMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.frameElapsed += 1;
    if (this.frameElapsed % this.framesHold === 0) {
      if (this.frameCurrent < this.frameMax - 1) {
        this.frameCurrent += 1;
      } else {
        this.frameCurrent = 0;
      }
    }
  }

  update() {
    this.animateFrames();
  }

  draw() {
    this.createSprite();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    imageSrc,
    scale = 1,
    frameMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    hitbox,
    nativeFacing,
    deathFacing = nativeFacing,
    controls,
  }) {
    super({
      position,
      imageSrc,
      scale,
      frameMax,
      offset,
    });
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey = null;
    this.attackBox = {
      offset: { x: hitbox.offset.x, y: hitbox.offset.y },
      width: hitbox.width,
      height: hitbox.height,
    };
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: hitbox.width,
      height: hitbox.height,
    };
    this.isAttacking = false;
    this.isGrounded = false;
    this.health = 100;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;
    this.nativeFacing = nativeFacing;
    this.deathFacing = deathFacing;
    this.facing = nativeFacing;
    this.controls = controls;
    this.spawn = {
      x: position.x,
      y: position.y,
      velocityY: velocity.y,
    };

    for (const name in this.sprites) {
      this.sprites[name].image = new Image();
      this.sprites[name].image.src = this.sprites[name].imageSrc;
    }

    this.image = this.sprites.idle.image;
    this.frameMax = this.sprites.idle.frameMax;
  }

  // Sprites are mirrored around the drawn frame, which is where the art sits.
  spriteCenterX() {
    const frameWidth = (this.image.width / this.frameMax) * this.scale;
    return this.position.x - this.offset.x + frameWidth / 2;
  }

  currentArtFacing() {
    if (this.image === this.sprites.death.image) return this.deathFacing;
    return this.nativeFacing;
  }

  updateHitbox() {
    const rightX = this.position.x + this.attackBox.offset.x;
    if (this.facing === 1) {
      this.hitbox.position.x = rightX;
    } else {
      const rightEdge = rightX + this.attackBox.width;
      this.hitbox.position.x = this.spriteCenterX() * 2 - rightEdge;
    }
    this.hitbox.position.y = this.position.y + this.attackBox.offset.y;
  }

  update() {
    if (!this.dead) this.animateFrames();

    if (
      this.image === this.sprites.death.image &&
      this.frameCurrent === this.sprites.death.frameMax - 1
    ) {
      this.dead = true;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    const maxX = canvas.width - this.width;
    if (this.position.x < 0) this.position.x = 0;
    else if (this.position.x > maxX) this.position.x = maxX;

    if (this.position.y + this.velocity.y >= GROUND_Y) {
      this.velocity.y = 0;
      this.position.y = GROUND_Y;
      this.isGrounded = true;
    } else {
      this.velocity.y += gravity;
      this.isGrounded = false;
    }

    this.updateHitbox();
  }

  draw() {
    c.save();
    if (this.facing !== this.currentArtFacing()) {
      const centerX = this.spriteCenterX();
      c.translate(centerX, 0);
      c.scale(-1, 1);
      c.translate(-centerX, 0);
    }
    this.createSprite();
    c.restore();
  }

  faceOpponent(opponent) {
    if (this.dead || this.isAttacking) return;
    const myCenter = this.position.x + this.width / 2;
    const theirCenter = opponent.position.x + opponent.width / 2;
    if (theirCenter < myCenter) this.facing = -1;
    else if (theirCenter > myCenter) this.facing = 1;
  }

  jump() {
    if (gameState !== "fighting" || this.dead || !this.isGrounded) return;
    this.velocity.y = -15;
    this.isGrounded = false;
  }

  attack() {
    if (gameState !== "fighting" || this.dead || this.isAttacking) return;
    if (this.isSpriteLocked("attack1") || this.isSpriteLocked("takehit")) return;
    this.applySprite("attack1", true);
    this.isAttacking = true;
  }

  takeHit(damage) {
    this.health = Math.max(0, this.health - damage);
    if (this.health <= 0) this.switchSprites("death");
    else this.switchSprites("takehit");
  }

  isSpriteLocked(name) {
    const sprite = this.sprites[name];
    return (
      this.image === sprite.image && this.frameCurrent < sprite.frameMax - 1
    );
  }

  applySprite(name, restart) {
    const sprite = this.sprites[name];
    if (!sprite) return;
    const sameImage = this.image === sprite.image;
    if (sameImage && !restart) return;
    if (!sameImage && this.image === this.sprites.attack1.image) {
      this.isAttacking = false;
    }
    this.image = sprite.image;
    this.frameMax = sprite.frameMax;
    this.frameCurrent = 0;
    this.frameElapsed = 0;
  }

  switchSprites(name) {
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.frameMax - 1) this.dead = true;
      return;
    }

    if (name !== "death") {
      if (this.isSpriteLocked("attack1")) return;
      if (this.isSpriteLocked("takehit")) return;
    }

    const restart = name === "attack1" || name === "takehit" || name === "death";
    this.applySprite(name, restart);
    if (name === "death") this.isAttacking = false;
  }

  reset() {
    this.position.x = this.spawn.x;
    this.position.y = this.spawn.y;
    this.velocity.x = 0;
    this.velocity.y = this.spawn.velocityY;
    this.health = 100;
    this.dead = false;
    this.isAttacking = false;
    this.isGrounded = false;
    this.facing = this.nativeFacing;
    this.lastKey = null;
    this.applySprite("idle", true);
    this.updateHitbox();
  }
}
