const canvas = document.querySelector('canvas')
// * c will be used a lot so we make it short.
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.2
class Sprite{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.height = 150
    }

    createSprite() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, this.height)
    }

    update() {
        this.createSprite()
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        }else
        this.velocity.y += gravity
    }
    
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    }
})

const enemy = new Sprite({
    position: {
        x: 900,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    }
})

function animate(){
    window.requestAnimationFrame(animate)
    //console.log('animate');
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
}
animate()
