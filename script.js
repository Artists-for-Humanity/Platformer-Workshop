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

const platforms = [
  { x: 0, y: 450, width: 800, height: 50 }, // ground
  { x: 200, y: 350, width: 150, height: 20 },
  { x: 400, y: 300, width: 150, height: 20 },
  { x: 600, y: 250, width: 150, height: 20 }
];

// to check if you are actually on the ground when the player jumps
let onGround = false;

function drawPlayer() {
    ctx.fillStyle = "blue"
    ctx.fillRect(player.x, player.y, player.width, player.height)
}

function drawGround() {
  ctx.fillStyle = "green";
  ctx.fillRect(0, ground.y, canvas.width, ground.height);

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
    player.velocityY += gravity;
    player.y += player.velocityY;
}


function updatePlayer() {
  // horizontal movement
  if (keys.left) player.velocityX = -5;
  else if (keys.right) player.velocityX = 5;
  else player.velocityX = 0;

  player.x += player.velocityX;

  // gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

  // ground collision
  if (player.y + player.height >= ground.y) {
    player.y = ground.y - player.height;
    player.velocityY = 0;
    onGround = true;
  } else {
    onGround = false;
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

// so you don't gain speed as you move side to side, can change if you want
