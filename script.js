//CONSTANTS + LET
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const player = {
    x: 120,
    y: 191,
    width: 40,
    height: 63.7,

    velocityX: 0,
    velocityY: 0,
};

const ground = {
    y: 450,
    height: 100
};

const camera = {
    x: 0
};

const platforms = [
  { x: 0, y: 450, width: 800, height: 50 }, // ground
  { x: 200, y: 350, width: 150, height: 20 },
  { x: 400, y: 300, width: 150, height: 20 },
  { x: 600, y: 250, width: 150, height: 20 },
  { x: 800, y: 300, width: 150, height: 20},
  { x: 980, y: 370, width: 150, height: 20},
  { x: 1100, y: 450, width: 300, height: 20}
];


const coins = [
    { x: 250, y: 310, size: 20, collected: false },
    { x: 450, y: 260, size: 20, collected: false },
    { x: 650, y: 210, size: 20, collected: false},
    { x: 860, y: 250, size: 20, collected: false},
    { x: 1050, y: 330, size: 20, collected: false},
];

const goal = {
    x: 1350,
    y: 380,
    width: 40,
    height: 70
};

const gravity = 0.5;

const keys = {
    left: false,
    right: false,
};


const playerSprite = new Image();
playerSprite.src = "./assets/tutorial-images/player.png";

const groundTile = new Image();
groundTile.src = "./assets/tutorial-images/ground_grass_small.png";

const bgImage = new Image();
bgImage.src = "./assets/tutorial-images/bg_layer2.png";

const coinSprite = new Image();
coinSprite.src = "./assets/tutorial-images/coin_gold.png";

const goalSprite = new Image();
goalSprite.src = "./assets/tutorial-images/portal_yellowParticle.png";


let onGround = false;
let score = 0;
let gameWon = false;

canvas.width = 800;
canvas.height = 500;




//KEYS
document.addEventListener("keydown", (e) => {
    if (e.key === "a") keys.left = true;
    if (e.key === "d") keys.right = true;
});

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


//FUNCTIONS
function drawPlayer() {
    ctx.drawImage(
        playerSprite,
        player.x - camera.x,
        player.y,
        player.width,
        player.height
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


function drawCoins() {
    for (let coin of coins) {
      if (!coin.collected) {
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(coin.x - camera.x, coin.y, coin.size / 2, 0, Math.PI * 2);
        ctx.fill();
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
        }
    }
    }
  }

  function drawGoal() {
    ctx.fillStyle = "red";
    ctx.fillRect(goal.x - camera.x, goal.y, goal.width, goal.height);
  }

function updatePlayer() {
    if (keys.left) player.velocityX -= 0.5;
    else if (keys.right) player.velocityX += 0.5;
    else player.velocityX = 0.9;

    player.x += player.velocityX;

    player.velocityY += gravity;
    player.y += player.velocityY;


for (let platform of platforms) {
  const isLanding =
        player.y + player.height >= platform.y &&
        player.y + player.height <= platform.y + platform.height &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width &&
        player.velocityY >= 0;
    console.log(isLanding);
  if (isLanding) {
    player.y = platform.y - player.height;
    player.velocityY = 0;
    onGround = true;
  }
}


if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y + player.height > goal.y
)   {
    gameWon = true;
}
}

function gameWin() {
    if (gameWon) {
        ctx.fillStyle = "black";
        ctx.font = "40px Arial"
        ctx.fillText("YOU WIN", 300, 200);
    }
}

function showScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Pixelify Sans";
    ctx.fillText("Coins: " + score, 20, 30);
}



function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    camera.x = player.x - canvas.width / 2;
    updatePlayer();
    drawCoins();
    drawGoal();
    drawGround();
    drawPlayer();
    gameWin();
    showScore();
    
    requestAnimationFrame(gameLoop);
}

//START
playerSprite.onload = () => {
    gameLoop();
};