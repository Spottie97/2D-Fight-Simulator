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
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        }else
        this.velocity.y += gravity
    }
    
}
//Calling Sprite to specify spawn of player 1
const player1 = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    }
})
//Calling Sprite to specifu spawn of player 2
const player2 = new Sprite({
    position: {
        x: 900,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
} 
let lastKey
//Animate characters and Background
function animate(){
    window.requestAnimationFrame(animate)
    //console.log('animate');
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player1.update()
    player2.update()
    //Set player velocity based on key presses, this will help smooth out the movement
    player1.velocity.x = 0

    if(keys.a.pressed && lastKey === 'a'){
        player1.velocity.x = -1
    } else if (keys.d.pressed && lastKey === 'd'){
        player1.velocity.x = 1
    }
}
animate()
//Moving Player based on Key Down and Key Up
window.addEventListener('keydown', (event)=> {
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
            
    }
    console.log(event.key);
})
window.addEventListener('keyup', (event)=> {
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
    console.log(event.key);
})
