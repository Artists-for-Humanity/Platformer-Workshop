// grab and assign name to the elements from your html
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// sets canvas width and height: should appear bigger than before
canvas.width = 800;
canvas.height = 500;

const gravity = 0.5;

let onGround = false;

let score = 0;
let gameWon = false;

/********************
 Assets
********************/

const playerSprite = new Image();
playerSprite.src = "./assets/player.png";

const groundTile = new Image();
groundTile.src = "./assets/ground.png";

const backgroundImage = new Image();
backgroundImage.src = "./assets/background.png";

const coinSprite = new Image();
coinSprite.src = "./assets/coin.png";

const goalSprite = new Image();
goalSprite.src = "./assets/flag.png";


const goal = {
  x: 1200,
  y: 380,
  width: 70,
  height: 70
};

const keys = {
  left: false,
  right: false,
};

// Player object
const player = {
  x: 100,
  y: 100,
  width: 75,
  height: 75,
  velocityX: 0,
  velocityY: 0,
};

const camera = {
  x: 0
};

// const ground = {
//   y: 450,
//   height: 50
// };

const platforms = [
  { x: 0, y: 450, width: 800, height: 50 }, // ground
  { x: 200, y: 350, width: 150, height: 20 },
  { x: 400, y: 300, width: 150, height: 20 },
  { x: 600, y: 250, width: 150, height: 20 },
  { x: 1000, y: 450, width:300, height: 20 }
];

const coins = [
  { x: 250, y: 300, size: 40, collected: false },
  { x: 450, y: 250, size: 40, collected: false },
  { x: 650, y: 200, size: 40, collected: false }
];

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

function updatePlayer() {
  // horizontal movement
  if (keys.left) player.velocityX -= 0.5;
  if (keys.right) player.velocityX += 0.5;

  player.velocityX *= 0.9; // friction
  player.x += player.velocityX;

  // gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

  // platform collision
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

  // coin collision
  for (let coin of coins) {
    if (!coin.collected) {
      const dx = player.x + player.width / 2 - coin.x;
      const dy = player.y + player.height / 2 - coin.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < coin.size) {
        coin.collected = true;
        score++;
      }
    }
  }

  // goal collision
  if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    gameWon = true;
  }
}
function drawPlayer() {
ctx.drawImage(
  playerSprite,
  player.x - camera.x,
  player.y,
  player.width,
  player.height
);
}

function drawCoins() {
for (let coin of coins) {
  if (!coin.collected) {
    ctx.drawImage(
      coinSprite,
      coin.x - camera.x - coin.size / 2,
      coin.y - coin.size / 2,
      coin.size ,
      coin.size 
    );
  }
}
}


// function drawGround() {
//   ctx.fillStyle = "green";
//   ctx.fillRect(0, ground.y, canvas.width, ground.height);
// }

function drawGoal() {
  ctx.drawImage(
    goalSprite,
    goal.x - camera.x,
    goal.y,
    goal.width,
    goal.height
  );
}

function drawGround() {
  for (let platform of platforms) {
    for (let x = platform.x; x < platform.x + platform.width; x += 32) {
    ctx.drawImage(
      groundTile,
      x - camera.x,
      platform.y,
      32,
      32
    );
  }
  }
}

function gameWin(){
  if (gameWon) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("YOU WIN", 300, 200);
    console.log("YOU WIN");
  }
}

function showScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Coins: " + score, 20, 30);
}

function drawBackground() {
  const bgWidth = canvas.width;

  let offset = (-camera.x * 0.2) % bgWidth;

  for (let x = offset - bgWidth; x < canvas.width; x += bgWidth) {
    ctx.drawImage(backgroundImage, x, 0, bgWidth, canvas.height);
  }
}

function gameLoop() {
  camera.x = player.x - canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  updatePlayer();
  drawGround();
  drawPlayer();
  drawCoins();
  drawGoal();
  gameWin();
  showScore();

  requestAnimationFrame(gameLoop);
}

playerSprite.onload = () => {
  gameLoop();
};