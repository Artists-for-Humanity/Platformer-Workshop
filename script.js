// grab and assign name to the elements from your html
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// set the width and height of the canvas: should appear bigger than before
canvas.width = 800;
canvas.height = 500;

// Player object
const player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    //we'll use these later
    velocityX: 0,
    velocityY: 0,
};

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    drawGround();
    drawPlayer();
    
    requestAnimationFrame(gameLoop);
}

gameLoop();

const ground = {
  y: 450,
  height: 50
};

function drawGround() {
  ctx.fillStyle = "green";
  ctx.fillRect(0, ground.y, canvas.width, ground.height);
}