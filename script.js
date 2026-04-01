const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

const player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  velocityX: 0,
  velocityY: 0,
};

const platforms = [
  { x: 0, y: 450, width: 800, height: 50 },
  { x: 200, y: 350, width: 100, height: 20 },
  { x: 400, y: 300, width: 100, height: 20 },
  { x: 600, y: 250, width: 100, height: 20 },
];

const gravity = 0.5;

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

function drawGround() {
  for (let platform of platforms) {
    ctx.fillStyle = "green";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  }
}

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
  //horizontal movement
  if (keys.left) player.velocityX -= 0.5;
  else if (keys.right) player.velocityX += 0.5;
  else player.velocityX *= 0.9; //friction

  player.x += player.velocityX;

  //gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

  //collision with ground
  onGround = false;
  for (let platform of platforms) {
    const isLanding =
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + platform.height &&
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width &&
      player.velocityY >= 0;

    if (isLanding) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      onGround = true;
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  drawGround();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

gameLoop();
