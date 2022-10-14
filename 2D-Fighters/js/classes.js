//Element Creation
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

  //create Background Elements
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
    this.frameElapsed++;
    if (this.frameElapsed % this.framesHold === 0) {
      if (this.frameCurrent < this.frameMax - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }

  //Update Class
  update() {
    this.createSprite();
    this.animateFrames();
  }
}
//Fighter Class
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    frameMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    hitbox = { offset: {}, width: undefined, height: undefined },
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
    this.lastKey;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: hitbox.offset,
      width: hitbox.width,
      height: hitbox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.frameCurrent = 0;
    this.frameElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  //Update Class
  update() {
    this.createSprite();
    if (!this.dead) {
      this.animateFrames();
    }
    this.hitbox.position.x = this.position.x + this.hitbox.offset.x;
    this.hitbox.position.y = this.position.y + this.hitbox.offset.y;
    //draw the attackbox
    /*c.fillRect(
      this.hitbox.position.x,
      this.hitbox.position.y,
      this.hitbox.width,
      this.hitbox.height
    );*/

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 48) {
      this.velocity.y = 0;
      this.position.y = 378;
    } else this.velocity.y += gravity;
  }
  //Attacking Class
  attack() {
    this.switchSprites("attack1");
    this.isAttacking = true;
  }
  takehit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprites("death");
    } else {
      this.switchSprites("takehit");
    }
  }
  switchSprites(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.frameMax - 1) {
        this.dead = true;
      }
      return;
    }

    //Overwrite all other animations with attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.frameCurrent < this.sprites.attack1.frameMax - 1
    ) {
      return;
    }

    //override when player gets hit
    if (
      this.image === this.sprites.takehit.image &&
      this.frameCurrent < this.sprites.takehit.frameMax - 1
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frameMax = this.sprites.idle.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frameMax = this.sprites.run.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frameMax = this.sprites.jump.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frameMax = this.sprites.fall.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.frameMax = this.sprites.attack1.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "takehit":
        if (this.image !== this.sprites.takehit.image) {
          this.image = this.sprites.takehit.image;
          this.frameMax = this.sprites.takehit.frameMax;
          this.frameCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.frameMax = this.sprites.death.frameMax;
          this.frameCurrent = 0;
        }
        break;
    }
  }
}
