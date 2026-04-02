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

function gameWin(){
  if (gameWon) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("YOU WIN", 300, 200);
  }
}
// grab and assign name to the elements from your html
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// sets canvas width and height: should appear bigger than before
canvas.width = 800;
canvas.height = 500;

let score = 0;

let gameWon = false;

const goal = {
  x: 1200,
  y: 380,
  width: 40,
  height: 70
};

const camera = {
  x: 0
};

const coins = [
  { x: 250, y: 300, size: 20, collected: false },
  { x: 450, y: 250, size: 20, collected: false },
  { x: 650, y: 200, size: 20, collected: false }
];


//player object 
const player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    // we'll use these later 
    velocityX: 0,
    velocityY: 0,
}
const  gravity = 0.5;


const keys = {
  left: false,
  right: false,
};

const ground = {
  y: 450,
  height: 50
};

const platforms = [
    
  { x: 0, y: 450, width: 800, height: 50 }, // ground
  { x: 1000, y: 450, width: 300, height: 20 },
  { x: 200, y: 350, width: 150, height: 20 },
  { x: 400, y: 300, width: 170, height: 20 },
  { x: 600, y: 250, width: 150, height: 20 }
];

// to check if you are actually on the ground when the player jumps
let onGround = false;


function showScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Coins: " + score, 20, 30);
}

function drawGoal() {
  ctx.fillStyle = "red";
  ctx.fillRect(goal.x - camera.x, goal.y, goal.width, goal.height);
}

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x - camera.x, player.y, player.width, player.height);
}

function drawGround() {
  for (let platform of platforms) {
    ctx.fillStyle = "green";
    ctx.fillRect(platform.x - camera.x, platform.y, platform.width, platform.height);
  }
}

function updatePlayer() {
    player.velocityY += gravity;
    player.y += player.velocityY;
}

function gameWin(){
  if (gameWon) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("YOU WIN", 300, 200);
  }
}

function drawCoins() {
    for (let coin of coins) {
      if (!coin.collected) {
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(coin.x - camera.x, coin.y, coin.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }


document.addEventListener("keyup", (e) => {
  if (e.key === "a") keys.left = false;
  if (e.key === "d") keys.right = false;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "a") keys.left = true;
  if (e.key === "d") keys.right = true;

   if (e.key === "w" && onGround) {
    player.velocityY = -12;
  }
});




function updatePlayer() {
  // horizontal movement
  if (keys.left) player.velocityX -= 0.5;
  else if (keys.right) player.velocityX += 0.5;
  player.velocityX *= 0.9; // friction

  player.x += player.velocityX;

  // gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

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
  // ground collision
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
console.log(gameWon);
if (
  player.x < goal.x + goal.width &&
  player.x + player.width > goal.x &&
  player.y < goal.y + goal.height &&
  player.y + player.height > goal.y
) {
  gameWon = true;
}



}




function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    camera.x = player.x - canvas.width / 2;

    updatePlayer();
    drawCoins();
    drawGround();
    drawPlayer();
    drawGoal();
    showScore();
    gameWin();

    requestAnimationFrame(gameLoop);
}

gameLoop();

// so you don't gain speed as you move side to side, can change if you want
