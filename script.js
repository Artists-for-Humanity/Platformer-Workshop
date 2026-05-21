const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const platforms = [
  {x: 0, y: 450, width: 20000, height: 50 },
  {x: 200, y: 350, width: 150, height: 20 },
  {x: 20, y: 250, width: 150, height: 20 },
  {x: 300, y: 180, width: 150, height: 20 },
  {x: 1000, y: 450, width: 300, height: 20 },
];
const gravity = 0.5;
const keys = {left:false , right:false, };
const camera = { x: 0 };
const coins = [
  {x: 250, y:300, size:20, collected: false},
  {x: 50, y:250, size:20, collected: false},
  {x: 650, y:200, size:20, collected: false}
]
const player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  velocityX: 0,
  velocityY: 0,
};
const goal = {x: 1200, y: 380, width: 40, height: 70};


let score = 0;
let onGround = false;
let gameWon = false;


canvas.width = 800;
canvas.height = 500;

const playerSprite = new Image();
playerSprite.src = './assets/player.png';

const groundTile = new Image();
groundTile.src = '../assets/tutorial-images/ground.png'; 


const backgoundImage = new Image();
backgoundImage.src = './assets/background.png';

const coinSprite = new Image();
coinSprite.src = './assets/coin.png';

goalSprite = new Image();
goalSprite.src = './assets/flag.png';




function updatePlayer() {

  if (keys.left) player.velocityX -= .5;
  else if (keys.right) player.velocityX += .5;
  else player.velocityX *= 0.9;

  
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

  if (isLanding) {
    player.y = platform.y - player.height;
    player.velocityY = 0;
    onGround = true;
  }

  for (let coin of coins) {
    if (!coin.collected) {
      const dx = player.x + player.width / 2 - coin.x;
      const dy = player.y + player.height / 2 - coin.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < coin.size){
        coin.collected = true;
        score++;
        console.log("Score: " + score);
      }
    }
  }

  if (player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    gameWon = true;
  }
}


}
  
function drawGround() {
  for (let platform of platforms) {
    ctx.fillStyle = 'green';
    ctx.fillRect(platform.x - camera.x, platform.y, platform.width, platform.height);  
  }
}

function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x -camera.x, player.y, player.width, player.height);
}

function drawCoins() {
  for (let coin of coins) {
    if (!coin.collected) {
      ctx.fillStyle = 'gold';
      ctx.beginPath();
      ctx.arc(coin.x - camera.x, coin.y, coin.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
} 

function drawGoal() {
  ctx.fillStyle = 'red';
  ctx.fillRect(goal.x - camera.x, goal.y, goal.width, goal.height);
}

function gameWin(){
  if (gameWon) {

    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText('You Win!', canvas.width / 2 - 100, canvas.height / 2);
  }
}
function showScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Coins: ' + score, 10, 30);
}

function gameloop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  drawGround();
  drawPlayer();
  drawGoal();
  requestAnimationFrame(gameloop);
  camera.x = player.x - canvas.width / 2;
  drawCoins();
  gameWin();
  showScore();
}










playerSprite.onload = () => {  
  gameloop();
}


document.addEventListener('keydown', (e) => {
  if (e.key === "a") keys.left = true;
  if (e.key === "d") keys.right = true;
  if (e.key === "w" && onGround) player.velocityY = -12;
});

document.addEventListener('keyup', (e) => {
  if (e.key === "a") keys.left = false;
  if (e.key === "d") keys.right = false;
});

