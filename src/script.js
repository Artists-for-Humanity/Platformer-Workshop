const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameWon = false;
const camera = {
  x: 0,
};

const goal = {
  x: 1200,
  y: 380,
  with: 40,
  height: 70,
};

const coins = [
  { x: 200, y: 225, size: 40, collected: false },
  { x: 475, y: 325, size: 40, collected: false },
  { x: 575, y: 125, size: 40, collected: false },
];
const player = {
  x: 50,
  y: 300,
  width: 50,
  height: 50,

  velocityY: 0,
  velocityX: 0,
};

const platforms = [
  { x: 0, y: 450, width: 800, height: 50 },
  { x: 100, y: 250, width: 250, height: 20 },
  { x: 400, y: 350, width: 150, height: 20 },
  { x: 500, y: 150, width: 150, height: 20 },
  { x: 1000, y: 450, width: 300, height: 20 },
];
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
  for (let platform of platforms) {
    ctx.fillStyle = "#540808";
    ctx.fillRect(
      platform.x - camera.x,
      platform.y,
      platform.width,
      platform.height,
    );
  }
}

function drawCoins() {
  for (coin of coins) {
    if (!coin.collected) {
      ctx.fillStyle = "gold";
      ctx.beginPath();
      ctx.arc(coin.x - camera.x, coin.y, coin.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawGoal() {
  ctx.fillStyle = "cyan";
  ctx.fillRect(goal.x - camera.x, goal.y, goal.with, goal.height);
}

function drawPlayer() {
  ctx.fillStyle = "green";
  ctx.fillRect(player.x - camera.x, player.y, player.width, player.height);
}

function Win() {
  if (gameWon) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("YOU WIN", 300, 200);
  }
}

function showScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Coins: " + score, 20, 30);
}

function updatePlayer() {
  // Movement
  if (key.left) player.velocityX -= 0.5;
  else if (key.right) player.velocityX += 0.5;

  player.velocityX *= 0.9;

  player.x += player.velocityX;

  // Gravity
  player.velocityY += gravity;
  player.y += player.velocityY;
  // collision
  onGround = false;

  for (let platform of platforms) {
    const isLanding =
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + platform.height &&
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width &&
      player.velocityY >= 0;
    {
      gameWon = false;
    }

    if (isLanding) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      onGround = true;
    }
  }

  for (let coin of coins) {
    if (!coin.collected) {
      const dx = player.x + player.width / 2 - coin.x;
      const dy = player.y + player.height / 2 - coin.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < coin.size) {
        coin.collected = true;
        score++;
        console.log(score);
      }
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  drawPlayer();
  drawGoal();
  drawCoins();
  drawGround();
  showScore();
  camera.x = player.x - canvas.width / 2;
  requestAnimationFrame(gameLoop);
}

gameLoop();
