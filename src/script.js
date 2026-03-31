const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

const player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,

  velocityY: 0,
  velocityX: 0,
};

const ground = {
  y: 450,
  height: 50,
};

const gravity = 0.5;

const key = {
  left: false,
  right: false,
};

let onGround = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "a") key.left = true;
  if (e.key === "d") key.right = true;

  if (e.key === "w" && onGround) {
    player.velocityY = -12;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "a") key.left = false;
  if (e.key === "d") key.right = false;
});

function drawGround() {
  ctx.fillStyle = "green";
  ctx.fillRect(0, ground.y, canvas.width, ground.height);
}

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
  // Movement
  if (key.left) player.velocityX = -5;
  else if (key.right) player.velocityX = 5;
  else player.velocityX = 0;

  player.x += player.velocityX;

  // Gravity
  player.velocityY += gravity;
  player.y += player.velocityY;
  // coillision
  if (player.y + player.height >= ground.y) {
    player.y = ground.y - player.height;
    player.velocityY = 0;
    onGround = true;
  } else {
    onGround = false;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();

  drawPlayer();
  drawGround();

  requestAnimationFrame(gameLoop);
}

gameLoop();
