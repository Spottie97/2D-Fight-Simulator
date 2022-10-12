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
function winConditions({ player1, player2, timerID }) {
  clearTimeout(timerID);
  document.querySelector("#EndTextTie").style.display = "flex";
  if (player1.health === player2.health) {
    document.querySelector("#EndTextTie").innerHTML = "Tie";
  } else if (player1.health > player2.health) {
    document.querySelector("#EndTextTie").innerHTML = "Player 1 Wins";
  } else if (player1.health < player2.health) {
    document.querySelector("#EndTextTie").innerHTML = "Player 2 Wins";
  }
}

//Timer function
let timer = 60;
let timerID;
function decreaseTimer() {
  if (timer > 0) {
    timerID = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    winConditions({ player1, player2, timerID });
  }
}
