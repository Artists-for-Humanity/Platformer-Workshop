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





function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}



function drawGround() {
  for (let platform of platforms) {
    ctx.fillStyle = "green";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  }
}

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
}

const platforms = [
  { x: 0, y: 450, width: 800, height: 50 },
  { x: 200, y: 350, width: 150, height: 20 },
  { x: 400, y: 300, width: 150, height: 20 },
  { x: 600, y: 250, width: 150, height: 20 }
];



function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();

    drawGround();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}
gameLoop();





