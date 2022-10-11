const canvas = document.querySelector('canvas')
// * c will be used a lot so we make it short.
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7
class Sprite{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.lastKey
        this.hitbox = {
            position: this.position,
            width: 100,
            height: 50
        }
    }

    createSprite() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, this.height)
        c.fillStyle = 'green'
        //Create Hitbox here
        c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
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
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }

} 
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
    player2.velocity.x = 0
    //Player1 movement
    if(keys.a.pressed && player1.lastKey === 'a'){
        player1.velocity.x = -4
    } else if (keys.d.pressed && player1.lastKey === 'd'){
        player1.velocity.x = 4
    }
    //Player2 movment
    if(keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft'){
        player2.velocity.x = -4
    } else if (keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight'){
        player2.velocity.x = 4
    }
}
animate()
//Moving Player based on Key Down and Key Up
window.addEventListener('keydown', (event)=> {
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player1.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player1.lastKey = 'a'
            break
        case 'w':
            player1.velocity.y = -20
            break
        
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            player2.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            player2.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            player2.velocity.y = -20
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
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
    console.log(event.key);
})
