// grab and assign name to the elements from your html
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// sets canvas width and height: should appear bigger than before
canvas.width = 800;
canvas.height = 500;

// Player object
const player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  // we'll use these later
  velocityX: 0,
  velocityY: 0,
}; 
const ground = {
    y: 450,
    height: 50
  };
 const gravity = 0.5;


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



function drawPlayer() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
      
     drawPlayer();
    drawGround();

    requestAnimationFrame(gameLoop);
  }

  function drawGround() {
    ctx.fillStyle = "green";
    ctx.fillRect(0, ground.y, canvas.width, ground.height);
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //add your functions
    updatePlayer();

    drawGround();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

function updatePlayer() {
    // horizontal movement
    if (keys.left) player.velocityX = -5;
    if (keys.right) player.velocityX = 5;
    else if (player.velocityX = 0) player.velocityX = 0;
  
    player.x += player.velocityX;
  
    // gravity
    player.velocityY += gravity;
    player.y += player.velocityY;
  
    // ground collision
    if (player.y + player.height >= ground.y) {
      player.y = ground.y - player.height;
      player.velocityY = 0;
    }
  }
  
gameLoop();
