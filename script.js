const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileCount = 20;
const tileSize = canvas.width / tileCount;

let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;

let playerName = prompt("Ingresa tu nombre:");

// Establece el nombre del jugador en el marcador
document.getElementById("playerName").textContent = playerName;

// Antes de iniciar el juego, obtén la puntuación máxima almacenada en el almacenamiento local
let maxScore = localStorage.getItem("maxScore");
if (maxScore === null) {
  maxScore = 0;
} else {
  maxScore = parseInt(maxScore);
}

// Actualiza el marcador de puntuación máxima
document.getElementById("maxScore").textContent = maxScore;

const mileiWord = "I N G. A"; 
let mileiIndex = 0;
let mileiVisible = false;

let lastTime = 0;
let deltaTime = 0;
const frameRate = 15;

function drawSnake() {
  ctx.fillStyle = "#00FF00";
  snake.forEach(segment => ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize));
}

function drawApple() {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);
}

function drawMilei() {
  if (mileiVisible) {
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.fillText(mileiWord.substring(0, mileiIndex + 1), 10, 30);
  }
}

function changeBackgroundWithImage(imageUrl) {
  document.body.style.backgroundImage = `url("${imageUrl}")`;
  document.body.style.backgroundSize = '100% 100%'; // Set background size to cover the entire body
  document.body.style.backgroundRepeat = 'no-repeat';
}

function update(currentTime) {
  deltaTime += (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (deltaTime > 1 / frameRate) {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
      score += 10;
      mileiVisible = true;
      mileiIndex++;

      if (mileiIndex >= mileiWord.length) {
        if (score >= 80) {
          changeBackgroundWithImage("https://i.ibb.co/hHw81kG/ssss.jpg");
        } else {
          changeBackground();
        }
      }

      spawnApple();
    } else {
      snake.pop();
    }

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      gameOver();
      return;
    }

    snake.forEach(segment => {
      if (segment !== head && segment.x === head.x && segment.y === head.y) {
        gameOver();
      }
    });

    deltaTime = 0;
  }
}

function spawnApple() {
  apple = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
}

function gameOver() {
  if (score > maxScore) {
    maxScore = score;
    localStorage.setItem("maxScore", maxScore);
    document.getElementById("maxScore").textContent = maxScore;
  }

  alert(`Que pue ${playerName}, perdiste? el inge ayala esta desepcionado de vos, toma tu puntaje pue: ${score}`);
  snake = [{ x: 10, y: 10 }];
  apple = { x: 15, y: 15 };
  score = 0;
  mileiIndex = 0;
  mileiVisible = false;
}

document.addEventListener("keydown", event => {
  switch (event.key) {
    case "ArrowUp":
      if (dy !== 1) { dx = 0; dy = -1; }
      break;
    case "ArrowDown":
      if (dy !== -1) { dx = 0; dy = 1; }
      break;
    case "ArrowLeft":
      if (dx !== 1) { dx = -1; dy = 0; }
      break;
    case "ArrowRight":
      if (dx !== -1) { dx = 1; dy = 0; }
      break;
  }
});

function gameLoop(currentTime) {
  update(currentTime);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawApple();
  drawMilei();
  requestAnimationFrame(gameLoop);
}

spawnApple();
gameLoop(performance.now());
