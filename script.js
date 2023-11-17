const gameArea = document.querySelector('.game-area');
const snake = document.getElementById('snake');
const food = document.getElementById('food');
const tailContainer = document.getElementById('tail');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
let xDown = null;
let yDown = null;
let gameRunning = false;
let gamePaused = false;

let snakeX = 150;
let snakeY = 150;
let foodX;
let foodY;
let snakeSpeedX = 10;
let snakeSpeedY = 0;
const snakeSize = 10;
const foodSize = 10;
let score = 0;
let tail = [];
let tailLength = 2;

function randomFoodPosition() {
  foodX = Math.floor(Math.random() * 29) * 10;
  foodY = Math.floor(Math.random() * 29) * 10;
  food.style.left = `${foodX}px`;
  food.style.top = `${foodY}px`;
  food.style.display = 'block';
}

function createTailSegments() {
  tailContainer.innerHTML = '';

  for (let i = 0; i < tail.length; i++) {
    const segment = document.createElement('div');
    segment.className = 'segment';
    segment.style.left = `${tail[i].x}px`;
    segment.style.top = `${tail[i].y}px`;
    tailContainer.appendChild(segment);
  }
}
function handleTouchStart(event) {
  const firstTouch = event.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}
function handleTouchMove(event) {
  if (!xDown || !yDown) {
    return;
  }
const xUp = event.touches[0].clientX;
  const yUp = event.touches[0].clientY;
  
  
  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      // Swipe left
      if (snakeSpeedX !== snakeSize) {
        snakeSpeedX = -snakeSize;
        snakeSpeedY = 0;
      }
    } else {
      // Swipe right
      if (snakeSpeedX !== -snakeSize) {
        snakeSpeedX = snakeSize;
        snakeSpeedY = 0;
      }
    }
  } else {
    if (yDiff > 0) {
      // Swipe up
      if (snakeSpeedY !== snakeSize) {
        snakeSpeedX = 0;
        snakeSpeedY = -snakeSize;
      }
    } else {
      // Swipe down
      if (snakeSpeedY !== -snakeSize) {
        snakeSpeedX = 0;
        snakeSpeedY = snakeSize;
      }
    }
  }

  xDown = null;
  yDown = null;
}
document.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case 37: //Going West
      if (snakeSpeedX !== snakeSize) {
        snakeSpeedX = -snakeSize;
        snakeSpeedY = 0;
      }
      break;
    case 38: //Go North
      if (snakeSpeedY !== snakeSize) {
        snakeSpeedX = 0;
        snakeSpeedY = -snakeSize;
      }
      break;
    case 39: //Go East
      if (snakeSpeedX !== -snakeSize) {
        snakeSpeedX = snakeSize;
        snakeSpeedY = 0;
      }
      break;
    case 40: //Go South
      if (snakeSpeedY !== -snakeSize) {
        snakeSpeedX = 0;
        snakeSpeedY = snakeSize;
      }
      break;
  }
});

function moveSnake() {
  snakeX += snakeSpeedX;
  snakeY += snakeSpeedY;

  if (snakeX >= 300 || snakeX < 0 || snakeY >= 300 || snakeY < 0) {
    gameOver();
    return;
  }

  snake.style.left = `${snakeX}px`;
  snake.style.top = `${snakeY}px`;

  tail.unshift({ x: snakeX, y: snakeY });

  if (tail.some((segment, index) => index !== 0 && segment.x === snakeX && segment.y === snakeY)) {
    gameOver();
    return;
  }

  if (snakeX === foodX && snakeY === foodY) {
    score += 10;
    tailLength++;
    randomFoodPosition();
  } else {
    if (tail.length > tailLength) {
      tail.pop();
    }
  }

  createTailSegments();
}

function gameOver() {
  alert(`Game Over! Your Score: ${score}`);
  snakeX = 150;
  snakeY = 150;
  snakeSpeedX = 10;
  snakeSpeedY = 0;
  score = 0;
  tail = [];
  tailLength = 2;
  randomFoodPosition();
}

function startGame() {
  if (!gameRunning) {
    gameRunning = true;
    randomFoodPosition();
    snake.style.display = 'block';
    gameLoop();
  }
}

function pauseGame() {
  gamePaused = !gamePaused;
  if (gamePaused) {
    clearTimeout(gameLoop);
  } else {
    gameLoop();
  }
}

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);

function gameLoop() {
  if (gameRunning && !gamePaused) {
    moveSnake();
    setTimeout(gameLoop, 100);
  }
}
