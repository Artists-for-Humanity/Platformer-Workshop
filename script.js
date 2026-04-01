// grab and assign name to the elements from your html
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
// sets canvas width and height: should appear bigger than before
canvas.width = 800;
canvas.height = 500;

//player object
const player = {
    x: 100,
    y: 100,
    width: 50,
    height:50,
    //we'll use these later
    velocityX: 0,
    velocityY: 0,
};
const platforms = [
    { x: 0, y: 450, width: 800, height: 50, }, // ground
    { x: 100, y: 350, width: 100, height: 20 },
    { x: 250, y: 300, width: 100, height: 20}, 
    { x: 400, y: 250, width: 100, height: 20 }
];

const gravity = 0.5;
const keys = { 
    left: false,
    right: false,
};

const camera = {
    x: 0
};
camera.x = player.x - camera.width / 2;

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

document.addEventListener("keydown", (e) => {
if (e.key === "a") keys.left = true;
if (e.key === "d") keys.right = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "a") keys.left = false;
    if (e.key === "d") keys.right = false;

    if (e.key === "w" && onGround) {
        player.velocityY =  -12;
    }
});

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x - camera.x, player.y, player.width, player.height);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();


function drawGround() {
    for (let platform of platforms) {
        ctx.fillStyle = "green";
    ctx.fillRect(platform.x - camera.x, platform.y, platform.width, platform.height);
   }
}

function updatePlayer(){
    player.velocityY += gravity;
    player.y += player.velocityY;
}
    
function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //add your functions
    updatePlayer();

    drawGround();
    drawPlayer();
     requestAnimationFrame(gameLoop);
}

function updatePlayer() {} 
    // horizontal movement
    if (keys.left) player.velocityX -= -5;
    else if (keys.right) player.velocityX = 5;
    else player.velocityX *= 0.9; // friction
    
    player.x += player.velocityX;

    // gravity
    player.velocityY += gravity;
    player.y += player.velocityY;

    // ground collision
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


