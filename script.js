/********************
 Assets
********************/
const playerSprite = new Image();
// replace ./assets/player.png with the character PNG you added to the assets folder
playerSprite.src = "./assets/player.png";

const groundTile = new Image();
groundTile.src = "./assets/ground.png";

const backgroundImage = new Image();
// replace ./assets/background.png with the background PNG you added to the assets folder
backgroundImage.src = "./assets/background.png";

const coinSprite = new Image();
coinSprite.src = "./assets/coin.png";

const goalSprite = new Image();
goalSprite.src = "./assets/flag.png";

/********************
 Canvas + world
********************/
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// make pixel art crisp
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

canvas.width = 800;
canvas.height = 500;

// camera
const camera = { x: 0 };

// player (adjust visual size if needed)
const player = {
  x: 100,
  y: 100,
  width: 48,
  height: 48,
  velocityX: 0,
  velocityY: 0,
};

const platforms = [
  { x: 0, y: 450, width: 800, height: 50 },
  { x: 200, y: 350, width: 150, height: 20 },
  { x: 400, y: 300, width: 150, height: 20 },
  { x: 600, y: 250, width: 150, height: 20 },
  { x: 1000, y: 450, width: 300, height: 20 } // platform for goal
];

const gravity = 0.5;

// coins
const coins = [
  { x: 250, y: 320, size: 24, collected: false },
  { x: 450, y: 270, size: 24, collected: false },
  { x: 650, y: 220, size: 24, collected: false }
];

let score = 0;

// goal
const goal = {
  x: 1200,
  y: 380,
  width: 40,
  height: 70
};

let gameWon = false;

// input state
const keys = {
  left: false,
  right: false,
  jump: false,
};

let onGround = false;

// compute world width from level objects for camera clamping
const worldWidth = Math.max(
  ...platforms.map(p => p.x + p.width),
  ...coins.map(c => c.x + (c.size || 0)),
  goal.x + goal.width,
  canvas.width
);

// keyboard
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
  // horizontal acceleration + friction (smoother movement)
  if (keys.left) player.velocityX -= 0.5;
  if (keys.right) player.velocityX += 0.5;
  player.velocityX *= 0.9; // friction
  // clamp horizontal speed
  const maxSpeed = 7;
  if (player.velocityX > maxSpeed) player.velocityX = maxSpeed;
  if (player.velocityX < -maxSpeed) player.velocityX = -maxSpeed;

  player.x += player.velocityX;

  // allow jumping when onGround (onGround comes from previous frame)
  if (keys.jump && onGround) {
    player.velocityY = -12;
    onGround = false;
    keys.jump = false; // avoid re-trigger while holding
  }

  // gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

  // platform collision (check all platforms, only land when coming from above)
  onGround = false;
  for (let platform of platforms) {
    const playerBottom = player.y + player.height;
    const prevBottom = playerBottom - player.velocityY; // approximate previous bottom
    const platformTop = platform.y;
    const platformBottom = platform.y + platform.height;
    const playerLeft = player.x;
    const playerRight = player.x + player.width;
    const platformLeft = platform.x;
    const platformRight = platform.x + platform.width;

    const isHorizOverlap = playerRight > platformLeft && playerLeft < platformRight;
    const isComingFromAbove = prevBottom <= platformTop && playerBottom >= platformTop;
    const notFromBelow = playerBottom <= platformBottom; // avoid sticking when inside

    if (isHorizOverlap && isComingFromAbove && notFromBelow && player.velocityY >= 0) {
      player.y = platformTop - player.height;
      player.velocityY = 0;
      onGround = true;
      break;
    }
  }

  // keep player inside world horizontally (left and right)
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > worldWidth) player.x = worldWidth - player.width;

  // keep player from falling through bottom (safety)
  if (player.y + player.height > canvas.height * 5) { // large world bottom guard
    player.y = canvas.height * 5 - player.height;
    player.velocityY = 0;
    onGround = true;
  }

  // coin collision (distance check)
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

  // goal collision (AABB)
  if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    gameWon = true;
  }
}

function drawBackground() {
  // only draw background if the image is loaded
  if (!(backgroundImage && backgroundImage.complete && backgroundImage.naturalWidth !== 0)) return;

  const bgWidth = canvas.width;
  // parallax offset at 20% of camera
  let offset = (-camera.x * 0.2) % bgWidth;
  for (let x = offset - bgWidth; x < canvas.width; x += bgWidth) {
    ctx.drawImage(backgroundImage, x, 0, bgWidth, canvas.height);
  }
}

function drawPlayer() {
  if (playerSprite.complete && playerSprite.naturalWidth !== 0) {
    ctx.drawImage(
      playerSprite,
      player.x - camera.x,
      player.y,
      player.width,
      player.height
    );
  } else {
    // fallback rectangle while sprite loads or if missing
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x - camera.x, player.y, player.width, player.height);
  }
}

function drawPlatforms() {
  for (let platform of platforms) {
    // tile the ground with 32px tiles across platform width
    for (let x = platform.x; x < platform.x + platform.width; x += 32) {
      if (groundTile.complete && groundTile.naturalWidth !== 0) {
        ctx.drawImage(groundTile, x - camera.x, platform.y, 32, 32);
      } else {
        ctx.fillStyle = "green";
        ctx.fillRect(x - camera.x, platform.y, Math.min(32, platform.x + platform.width - x), platform.height);
      }
    }
  }
}

function drawCoins() {
  for (let coin of coins) {
    if (!coin.collected) {
      if (coinSprite.complete && coinSprite.naturalWidth !== 0) {
        ctx.drawImage(
          coinSprite,
          coin.x - camera.x - coin.size / 2,
          coin.y - coin.size / 2,
          coin.size,
          coin.size
        );
      } else {
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(coin.x - camera.x, coin.y, coin.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawGoal() {
  if (goalSprite.complete && goalSprite.naturalWidth !== 0) {
    ctx.drawImage(
      goalSprite,
      goal.x - camera.x,
      goal.y,
      goal.width,
      goal.height
    );
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(goal.x - camera.x, goal.y, goal.width, goal.height);
  }
}

function showScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Coins: " + score, 20, 30);
}

function gameWin() {
  if (gameWon) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("YOU WIN", canvas.width / 2 - 80, 200);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw background first (parallax)
  drawBackground();

  updatePlayer();

  // update camera to follow player (keep centered) and clamp to world
  camera.x = player.x - canvas.width / 2;
  camera.x = Math.max(0, camera.x);
  camera.x = Math.min(camera.x, Math.max(0, worldWidth - canvas.width));

  drawPlatforms();
  drawCoins();
  drawGoal();
  drawPlayer();
  showScore();
  gameWin();

  requestAnimationFrame(gameLoop);
}

// Log missing images so you can see 404s in the console
playerSprite.onerror = () => console.warn("player sprite failed to load:", playerSprite.src);
groundTile.onerror = () => console.warn("ground tile failed to load:", groundTile.src);
backgroundImage.onerror = () => console.warn("background failed to load:", backgroundImage.src);
coinSprite.onerror = () => console.warn("coin sprite failed to load:", coinSprite.src);
goalSprite.onerror = () => console.warn("goal sprite failed to load:", goalSprite.src);

// Start the game loop immediately so fallback rectangles/tiles show even if sprites are missing
gameLoop();