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

const ground = {
    y: 450,
    height: 50
};


const gravity = 0.5;


const goal = { 
  x: 1200,
  y: 380,
  width: 40,
  height:70
  
};



const camera = {
  x: 0
};

let score = 0;
let gameWon = false;

const platforms = [
  { x: 0, y: 450, width: 800, height: 50 }, // ground
  { x: 200, y: 350, width: 150, height: 20 },
  { x: 400, y: 300, width: 150, height: 20 },
  { x: 600, y: 250, width: 150, height: 20 },
  { x: 1000, y: 450, width:300, height: 20 },
];

const coins = [
  { x: 250, y: 300, size: 20, collected: false },
  { x: 450, y: 250, size: 20, collected: false },
  { x: 650, y: 200, size: 20, collected: false }
];

const keys = {
  left: false,
  right: false,
};

document.addEventListener("keydown", (e) => {
  console.log(e);
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
  if (keys.left) player.velocityX -= 0.5;
  else if (keys.right) player.velocityX += 0.5;
  else player.velocityX = 0;

  player.velocityX *= 0.9;

  player.x += player.velocityX;

  player.velocityY += gravity;
  player.y += player.velocityY;

  if (player.y + player.height >= ground.y) {
    player.y = ground.y - player.height;
    player.velocityY = 0;
    onGround = true;
  } else {
    OnGround = false;

    onGround = false;
  }

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

if (
  player.x < goal.x + goal.width &&
  player.x + player.width > goal.x &&
  player.y < goal.y + goal.height &&
  player.y + player.height > goal.y
) {
  gameWon = true;
}

}



for (let coin of coins) {
  if(!coin.collected) {
    const dx = player.x + player.width / 2 - coin.x;
    const dy = player.y + player.height /2 - coin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < coin.size) {
      coin.collected = true;
      score++;
    }
  }
}

function drawGround() {
  for (let platform of platforms) {
    ctx.fillStyle = "green";
    ctx.fillRect(platform.x - camera.x, platform.y, platform.width, platform.height);
  }

}

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x - camera.x, player.y, player.width, player.height);
}


function drawGoal() {
  ctx.fillStyle = "red";
  ctx.fillRect(goal.x - camera.x, goal.y, goal.width, goal.height);
}


function drawCoins() {
    for (let coin of coins) {
      if (!coin.collected) {
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(coin.x - camera.x, coin.y, coin.size / 2, 0, Math.PI * 2);
        ctx.fill();
        for (let coin of coins) {
          if(!coin.collected) {
            const dx = player.x + player.width / 2 - coin.x;
            const dy = player.y + player.height /2 - coin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < coin.size) {
              coin.collected = true;
              score++;
            }
          }
        }
      }
    }
  }

function gameWin(){
  if (gameWon) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("YOU WIN", 300, 200);
  }
}


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    drawCoins();
    drawGround();
    drawPlayer();
    drawGoal();
    camera.x = player.x - canvas.width / 2;

    requestAnimationFrame(gameLoop);
}
gameLoop();