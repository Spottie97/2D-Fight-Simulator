class Sprite {
  constructor({ position, imageSrc, scale = 1, frameMax = 1 }) {
    this.position = position
    this.height = 150
    this.width = 50
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.frameMax = frameMax
    this.frameCurrent = 0
    this.frameElapsed = 0
    this.framesHold = 5
  }

  //Create Player/Character class
  createSprite() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.frameMax),
      0,
      this.image.width / this.frameMax,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.frameMax ) * this.scale,
      this.image.height * this.scale
    )
  }

  //Update Class
  update() {
    this.createSprite();
    this.frameElapsed++
    if(this.frameElapsed % this.framesHold === 0){
      if(this.frameCurrent < this.frameMax -1){
        this.frameCurrent++
      }else {
        this.frameCurrent = 0
      }
    }
  }
}
//Fighter Class
class Fighter extends Sprite{
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

 
  

  //Update Class
  update() {
    this.createSprite();
    this.hitbox.position.x = this.position.x + this.hitbox.offset.x;
    this.hitbox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 48) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }
  //Attacking Class
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}
