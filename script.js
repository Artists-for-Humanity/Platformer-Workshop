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


function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();

  requestAnimationFrame(gameLoop);
}


function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGround();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

const ground = {
    y: 450,
    height: 50
};


function drawGround() {
    ctx.fillStyle = "green";
    ctx.fillRect(0, ground.y, canvas.width, ground.height);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGround();
    drawPlayer();

    requestAnimationFrame(gameLoop)
}


const gravity = 0.5;

function updatePlayer() {
    player.velocityY += gravity;
    player.y += player.velocityY;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();

    drawGround();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}
gameLoop();

function updatePlayer() {
player.velocityY += gravity;
player.y += player. velocityY;


if (player.y + player.height >= ground.y) {
    player.y = ground.y - player.height;
    player.velocityY = 0;
  }
}

const keys = {
  left: false,
  right: false,
};

document.addEventListener("keydown", (e) => {
  if (e.key === "a") keys.left = true;
  if (e.key === "d") keys.right = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "a") keys.left = false;
  if (e.key === "d") keys.right = false;
});

function updatePlayer() {

    if (keys.left) player.velocityX = -5;
  if (keys.right) player.velocityX = 5;
  else player.velocityX = 0;

  player.x += player.velocityX;

   player.velocityY += gravity;
  player.y += player.velocityY;

  if (player.y + player.height >= ground.y) {
    player.y = ground.y - player.height;
    player.velocityY = 0;
  }
}