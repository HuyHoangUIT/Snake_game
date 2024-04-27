// Get canvas and its context
let canvas = document.getElementById('canvas');
let canvas_ctx = canvas.getContext('2d');

// Get score elements and initialize current score
let score_ele = document.getElementById('score');
let best_score_ele = document.getElementById('best-score');
let cur_score = 0;

// Direction of the snake
let dir = '';

// Configuration settings
const config = {
  sizeCell: 24, // Size of each cell in the grid
  sizeFood: 24, // Size of the food
  step: 0, // Current step count
  stepMax: 7, // Maximum step count for animation
};

// Snake object
const snake = {
  x: config.sizeCell, // Initial x position of the snake
  y: config.sizeCell, // Initial y position of the snake
  dirX: 0, // Initial direction along the x-axis
  dirY: 0, // Initial direction along the y-axis
  body: [], // Array to store snake body segments
  maxBodySize: 1, // Initial size of the snake
};

// Load snake head image
const snake_images = [new Image()]; 
snake_images[0].src = 'head.svg'; 

// Food object
const food_object = {
  x: randomInt(0, canvas.width / config.sizeCell) * config.sizeCell, // Random initial x position of the food
  y: randomInt(0, canvas.height / config.sizeCell) * config.sizeCell, // Random initial y position of the food
};

// Load food image
let food_img = new Image();
food_img.src = 'circle.svg'; 

// Event listener for when the window is loaded
window.addEventListener('load', (e) => {
  // Set canvas dimensions and background
  canvas.width = 600;
  canvas.height = 480;
  canvas_ctx.fillStyle = '#000000';
  canvas_ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Set initial configuration settings
  config.sizeCell = 24;
  config.sizeFood = 24;
  // Set background pattern
  canvas.style.backgroundImage = 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJibGFjayIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjNTE0OTQ5Ii8+Cjwvc3ZnPgo=")';
  // Start the game
  restart();
});

// Function to update the score
function score() {
  cur_score++;
  update_best_score();
  draw_score();
}

// Function to draw the score
function draw_score() {
  score_ele.innerHTML = cur_score;
}

// Function to update the best score
function update_best_score() {
  // Check if best score exists in local storage, initialize if not
  if (!localStorage.getItem('best')) {
    localStorage.setItem('best', 0);
  }
  // Update best score if current score is higher
  if (cur_score > localStorage.getItem('best')) {
    localStorage.setItem('best', cur_score);
  }
  // Display best score
  best_score_ele.innerHTML = localStorage.getItem('best');
}

// Main game loop
function gameLoop() {
  setTimeout(() => {
    requestAnimationFrame(gameLoop);
    // Execute game logic every step
    if (++config.step < config.stepMax) return;
    config.step = 0;
    // Clear canvas
    canvas_ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw food and snake
    draw_food();
    draw_snake();
  }, 10); 
}

// Start the game loop
gameLoop();

// Function to check if the snake hits the border
function check_border() {
  // Wrap snake around if it hits the border
  if (snake.x < 0) {
    snake.x = canvas.width - config.sizeCell;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  if (snake.y < 0) {
    snake.y = canvas.height - config.sizeCell;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
}

// Variable to track game over state
let gameOver = false;

// Function to restart the game
function restart() {
  // Reset game state
  gameOver = false;
  config.stepMax = 6;
  cur_score = 0;
  draw_score();
  // Reset snake position and size
  snake.x = config.sizeCell;
  snake.y = config.sizeCell;
  snake.body = [];
  snake.maxBodySize = 1;
  snake.dirX = 0;
  snake.dirY = 0;
  dir = '';
  // Generate new food
  random_food();
  // Hide game over message and restart button
  document.getElementById('game-over').style.display = 'none';
}

// Function to draw the snake
function draw_snake() {
  if (gameOver) {
    return; // Stop drawing the snake if the game is over
  }
  // Move the snake
  snake.x += snake.dirX;
  snake.y += snake.dirY;
  // Check if snake hits the border
  check_border();
  // Add new segment to the snake's body
  snake.body.unshift({ x: snake.x, y: snake.y });
  // Remove last segment if snake is too long
  if (snake.body.length > snake.maxBodySize) {
    snake.body.pop();
  }
  // Draw each segment of the snake
  snake.body.forEach((e, index) => {
    // Draw head with different style
    snake_style(e, index);
    // Check if snake eats food
    if (e.x === food_object.x && e.y === food_object.y) {
      score();
      random_food();
      snake.maxBodySize++;
    }
    // Check for collision with own body
    for (let i = index + 1; i < snake.body.length; i++) {
      if (e.x === snake.body[i].x && e.y === snake.body[i].y) {
        // Set game over flag to true
        gameOver = true;
        // Show game over message and restart button
        document.getElementById('game-over').style.display = 'block';
        return; // Stop drawing the snake
      }
    }
  });
}

// Function to draw the snake's segments
function snake_style(e, index) {
  if (index === 0) {
    // Draw snake head with image
    canvas_ctx.drawImage(snake_images[0], e.x, e.y, config.sizeCell, config.sizeCell);
  } else {
    // Draw snake body segment with rectangle
    canvas_ctx.fillStyle = '#3f51b5';
    canvas_ctx.strokeStyle = '#071510';
    canvas_ctx.lineWidth = 1;
    canvas_ctx.fillRect(e.x, e.y, config.sizeCell, config.sizeCell);
    canvas_ctx.strokeRect(e.x, e.y, config.sizeCell - 1, config.sizeCell - 1);
  }
}

// Function to draw the food
function draw_food() {
  canvas_ctx.drawImage(food_img, food_object.x, food_object.y, config.sizeFood, config.sizeFood);
}

// Event listener to update best score when the document is loaded
document.addEventListener('load', update_best_score());

// Functions to handle snake direction changes
function turn_up() {
  if (dir != 'down') {
    dir = 'up';
    snake.dirY = -config.sizeCell;
    snake.dirX = 0;
  }
}
function turn_left() {
  if (dir != 'right') {
    dir = 'left';
    snake.dirX = -config.sizeCell;
    snake.dirY = 0;
  }
}
function turn_down() {
  if (dir != 'up') {
    dir = 'down';
    snake.dirY = config.sizeCell;
    snake.dirX = 0;
  }
}
function turn_right() {
  if (dir != 'left') {
    dir = 'right';
    snake.dirX = config.sizeCell;
    snake.dirY = 0;
  }
}

// Event listener to handle keyboard input for snake direction changes
document.addEventListener('keydown', (e) => {
  if (e.keyCode == 87 || e.keyCode == 38) {
    turn_up();
  } else if (e.keyCode == 65 || e.keyCode == 37) {
    turn_left();
  } else if (e.keyCode == 83 || e.keyCode == 40) {
    turn_down();
  } else if (e.keyCode == 68 || e.keyCode == 39) {
    turn_right();
  }
});

// Function to generate random integer within a range
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Function to generate random position for food
function random_food() {
  // Draw food image at random position
  canvas_ctx.drawImage(food_img, food_object.x, food_object.y, config.sizeFood, config.sizeFood);
  // Generate new random position for food
  food_object.x = randomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
  food_object.y = randomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
  // Redraw food at new position
  draw_food();
}