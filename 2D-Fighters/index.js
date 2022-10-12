const canvas = document.querySelector("canvas");
//c will be used a lot so we make it short.
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

//Gravity Element
const gravity = 0.7;
//Add Background
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/BackgroundResized.png'
})

//Calling Sprite to specify spawn of player 1
const player1 = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
});
//Calling Sprite to specifu spawn of player 2
const player2 = new Fighter({
  position: {
    x: 900,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

//Default starting status of keys
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};
//Collision Function with parameters/conditions incase of collision/contact.
function playerCollision({ player1HitBox, player2HitBox }) {
  return (
    player1HitBox.hitbox.position.x + player1HitBox.hitbox.width >=
      player2HitBox.position.x &&
    player1HitBox.hitbox.position.x <=
      player2HitBox.position.x + player2HitBox.width &&
    player1HitBox.hitbox.position.y + player1HitBox.hitbox.height >=
      player2HitBox.position.y &&
    player1HitBox.hitbox.position.y <=
      player2HitBox.position.y + player2HitBox.height
  );
}
//Win condition function
function winConditions({
    player1, player2, timerID
}){
    clearTimeout(timerID)
    document.querySelector('#EndTextTie').style.display = 'flex'
    if(player1.health === player2.health){
        document.querySelector('#EndTextTie').innerHTML = 'Tie'
    } else if(player1.health > player2.health){
        document.querySelector('#EndTextTie').innerHTML = 'Player 1 Wins'
    } else if(player1.health < player2.health){
        document.querySelector('#EndTextTie').innerHTML = 'Player 2 Wins'
    }
}

//Timer function
let timer = 60
let timerID
function decreaseTimer(){
   if(timer > 0){
     timerID = setTimeout(decreaseTimer, 1000)
     timer--
     document.querySelector('#timer').innerHTML = timer
   } 
   if(timer === 0){
        winConditions({player1, player2, timerID})
    }   
}
decreaseTimer()

//Animate characters and Background
function animate() {
  window.requestAnimationFrame(animate);
  //console.log('animate');
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update()
  player1.update()
  player2.update()

  //Set player velocity based on key presses, this will help smooth out the movement
  player1.velocity.x = 0;
  player2.velocity.x = 0;

  //Player1 movement
  if (keys.a.pressed && player1.lastKey === "a") {
    player1.velocity.x = -4;
  } else if (keys.d.pressed && player1.lastKey === "d") {
    player1.velocity.x = 4;
  }

  //Player2 movment
  if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
    player2.velocity.x = -4;
  } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
    player2.velocity.x = 4;
  }

  //Detect Collision of Players 1
  if (
    playerCollision({ player1HitBox: player1, player2HitBox: player2 }) &&
    player1.isAttacking
  ) {
    player1.isAttacking = false;
    player2.health -= 20;
    document.querySelector("#player2HP").style.width = player2.health + "%";
  }

  //Detect Collision of Players 2
  if (
    playerCollision({ player1HitBox: player2, player2HitBox: player1 }) &&
    player2.isAttacking
  ) {
    player2.isAttacking = false;
    player1.health -= 20;
    document.querySelector("#player1HP").style.width = player1.health + "%";
  }

  //End of Game conditions
  if(player2.health <= 0 || player1.health <= 0)
  {
    winConditions({player1, player2, timerID})
  }
}
animate();

//Moving Player 1 based on KeyDown
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player1.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player1.lastKey = "a";
      break;
    case "w":
      player1.velocity.y = -20;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      player2.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      player2.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      player2.velocity.y = -20;
      break;
    case " ":
      player1.attack();
      break;
    case "Enter":
      player2.attack();
      break;
  }
  //console.log(event.key);
});

//Moving Player 2 based on KeyUp
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
  //console.log(event.key);
});
