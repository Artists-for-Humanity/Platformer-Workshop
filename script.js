// assign the canvas element and its context to variables for easy access
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// set canvas width and height
canvas.width = 800;
canvas.height = 500;

//player object
const player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    // we will use these properties to control the player's movement speed
    velocityX: 0,
    velocityY: 0,
};

// tocheck if the player is on the ground or not, we can use this variable to prevent double jumping
let onGround = false;

// ground object
const ground = {
    y: 450,
    height: 50,
};

// keys object to keep track of which keys are currently pressed
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
        player.velocityY = -12; // set the player's vertical velocity to a negative value to make it jump
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


// gravity constant to control how fast the player falls
const gravity = 0.5;

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawGround() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, ground.y, canvas.width, ground.height);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas for the next frame

    updatePlayer(); // update the player's position and velocity based on gravity

    drawGround(); // draw the ground on the canvas
    drawPlayer(); // draw the player on the canvas

    requestAnimationFrame(gameLoop); // call gameLoop again for the next frame
}

function updatePlayer() {
    // horizontal movement based on key presses
    if (keys.left) {
        player.velocityX = -5; // move left
    } else if (keys.right) {
        player.velocityX = 5; // move right
    } else {
        player.velocityX = 0; // stop horizontal movement when no keys are pressed
    }

    player.x += player.velocityX; // update the player's horizontal position based on its velocity

    player.velocityY += gravity; // apply gravity to the player's vertical velocity
    player.y += player.velocityY; // update the player's vertical position based on its velocity

    // colision detection with the ground
    if (player.y + player.height >= ground.y) {
        player.y = ground.y - player.height; // reset the player's position to be on top of the ground
        player.velocityY = 0; // reset the player's vertical velocity to 0 when it hits the ground
        onGround = true; // set onGround to true when the player is on the ground
    } else {
        onGround = false; // set onGround to false when the player is in the air
    }
}

gameLoop(); // start the game loop