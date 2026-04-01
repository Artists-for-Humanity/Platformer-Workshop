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

const ground = {
  y: 450,
  height: 50
};

const gravity = 0.5;

// so you don't gain speed as you move side to side, can change if you want

const keys = {
  left: false,
  right: false,
};
   

document.addEventListener("keydown", (e) => {
  if (e.key === "a") keys.left = true;
  if (e.key === "d") keys.right = true;

  if (e.key === "w" && onGround) {
    player.velocityY = -12;
  }
});
document.addEventListener("keyup", (e) => {
  if (e.key === "a") keys.left = false;
  if (e.key === "d") keys.right = false;
});

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawGround() {
  ctx.fillStyle = "green";
  ctx.fillRect(0, ground.y, canvas.width, ground.height);
}

function updatePlayer() {
  // horizontal movement
  if (keys.left) player.velocityX = -5;
  else if (keys.right) player.velocityX = 5;
  else player.velocityX = 0;
  
  player.x += player.velocityX;
  
  // gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

// collision with ground
  if (player.y + player.height >= ground.y) {
    player.y = ground.y - player.height;
    player.velocityY = 0;
  }
}

if (player.y + player.height >= ground.y) {
  player.y = ground.y - player.height;
  player.velocityY = 0;
  onGround = true;
} else {
  onGround = false;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    // add functions
    updatePlayer();

    drawGround();
    drawPlayer();
    
    requestAnimationFrame(gameLoop);
}


gameLoop();
