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

const camera = {
    x: 0
  };

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


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


let onGround = false;

// ground object
const ground = {
    y: 450,
    height: 50,
};

const platforms = [
    { x: 0, y: 450, width: 800, height: 50 }, // ground
    { x: 200, y: 350, width: 150, height: 20 },
    { x: 400, y: 300, width: 150, height: 20 },
    { x: 600, y: 250, width: 150, height: 20 }
  ];

  
  const coins = [
    { x: 250, y: 300, size: 20, collected: false },
    { x: 450, y: 250, size: 20, collected: false },
    { x: 650, y: 200, size: 20, collected: false },
    { x: 1000, y: 450, width:300, height: 20 }

  ];
  
const keys = {
    left: false,
    right: false,
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'a') {
   
        keys.left = true;
    }
    if (e.key === 'd') {
        keys.right = true;
    }
    if (e.key === 'w' && onGround) {
        player.velocityY = -12; 
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'a') {
        keys.left = false;
    }
    if (e.key === 'd') {
        keys.right = false;
    }
});


// gravity 
const gravity = 0.5;

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
      ctx.fillStyle = "gray";
      ctx.fillRect(platform.x - camera.x, platform.y, platform.width, platform.height);
     }
  }

  function drawCoins() {
    for (let coin of coins) {
      if (!coin.collected) {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(coin.x - camera.x, coin.y, coin.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawGoal() {
    ctx.fillStyle = "red";
    ctx.fillRect(goal.x - camera.x, goal.y, goal.width, goal.height);
  }
  
  function gameWin(){
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

  camera.x = player.x - canvas.width / 8;


  
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    updatePlayer(); 

drawGround(); 
drawPlayer(); 
drawCoins();
showScore();

    requestAnimationFrame(gameLoop); 
}

function updatePlayer() {
    // horizontal movement based on key presses
    if (keys.left) player.velocityX -= 0.5;
    if (keys.right) player.velocityX += 0.5;
    
    player.velocityX *= 0.9; // friction

    player.x += player.velocityX; 

    player.velocityY += gravity; 
    player.y += player.velocityY; 

    if (
        player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y
      ) {
        gameWon = true;
      }
      

    // colision  with the ground
    let gameWon = false;

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

    let score = 0;
    
    const goal = {
        x: 1200,
        y: 380,
        width: 40,
        height: 70
      };
    
      
gameLoop(); 