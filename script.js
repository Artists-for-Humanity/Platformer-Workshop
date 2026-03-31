const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

// player
const player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  velocityX: 0,
  velocityY: 0,
};

const ground = {
  y: 450,
  height: 50,
};

const gravity = 0.5;

// input state now includes jump
const keys = {
  left: false,
  right: false,
  jump: false,
};

let onGround = false;

// use e.code (KeyA / KeyD / KeyW) — more reliable than e.key
window.addEventListener("keydown", (e) => {
  const code = e.code;
  if (code === "KeyA" || code === "ArrowLeft") keys.left = true;
  if (code === "KeyD" || code === "ArrowRight") keys.right = true;
  if (code === "KeyW" || code === "ArrowUp" || code === "Space") keys.jump = true;
});

window.addEventListener("keyup", (e) => {
  const code = e.code;
  if (code === "KeyA" || code === "ArrowLeft") keys.left = false;
  if (code === "KeyD" || code === "ArrowRight") keys.right = false;
  if (code === "KeyW" || code === "ArrowUp" || code === "Space") keys.jump = false;
});

function updatePlayer() {
  // horizontal movement
  if (keys.left) {
    player.velocityX = -5;
  } else if (keys.right) {
    player.velocityX = 5;
  } else {
    player.velocityX = 0;
  }

  player.x += player.velocityX;

  // jump handled in update so it respects onGround reliably
  if (keys.jump && onGround) {
    player.velocityY = -12;
    onGround = false;
    // optional: prevent holding jump from retriggering immediately
    keys.jump = false;
  }

  // gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

  // ground collision and onGround flag
  if (player.y + player.height >= ground.y) {
    player.y = ground.y - player.height;
    player.velocityY = 0;
    onGround = true;
  } else {
    onGround = false;
  }

  // keep player inside canvas horizontally
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawGround() {
  ctx.fillStyle = "green";
  ctx.fillRect(0, ground.y, canvas.width, ground.height);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayer();
  drawGround();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

gameLoop();