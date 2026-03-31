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
const ground = {
    y:450,
    height: 50,
};
const gravity = 0.5;
function drawPlayer() {
    ctx.fillStyle + "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();


function drawGround() {
    ctx.fillStyle = "green";
    ctx.fillRect(0, ground.y, canvas.width, ground.height);
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

function updatePlayer() {
    player.velocityY += gravity;
    player.y += player.velocityY;

    //collision with ground
    if (player.y + player.height >= ground.y) {
        player.y = ground.y - player.height;
        player.velocityY = 0;
    }
}

