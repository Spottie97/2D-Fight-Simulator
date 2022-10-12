class Sprite {
    constructor({ position }) {
      this.position = position;
      this.height = 150;
      this.width = 50;
  
    }
  
    //Create Player/Character class
    createSprite(){}
  
    //Update Class
    update() {
      this.createSprite()
    }
  }
//Fighter Class
class Fighter {
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
    
      //Create Player/Character class
      createSprite() {
        //Character
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    
        //Create Hitbox here
        if (this.isAttacking) {
          c.fillStyle = "green";
          c.fillRect(
            this.hitbox.position.x,
            this.hitbox.position.y,
            this.hitbox.width,
            this.hitbox.height
          );
        }
      }
    
      //Update Class
      update() {
        this.createSprite();
        this.hitbox.position.x = this.position.x + this.hitbox.offset.x;
        this.hitbox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
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