const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const canvasSize = 600;
const audio = new Audio("../assets/audio.mp3");
canvas.height = canvasSize;
canvas.width = canvasSize;

/*
 * Mudanças em relação ao tutorial
 *
 * 1. Criação de variáveis para valores ou cálculos que são usados mais de uma vez:
 * 1.1. canvasLimit: valor máximo que a cobra pode andar no eixo x e y. Retirada do escopo de função para o escopo global.
 * 
 * 2. Decisão de alterações pontuais no código:
 * 2.1. No while da função checkEat, foi alterado o método some (que retorna booleano) para find (que retorna o valor), apesar de ambas estarem corretas, preferi o retorno booleano visto que o valor não será usado.
 */

// const h1 = document.querySelector("h1");

const segmentSize = 30;
const canvasLimit = canvasSize - segmentSize;
const movement = 300;

const snake = [
  { x: 270, y: 240 },
  { x: 300, y: 240 },
];

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - segmentSize);
  return Math.round(number / segmentSize) * segmentSize;
};

const randomColor = () => {
  const rgbColors = Array.from({ length: 3 }, () => randomNumber(0, 255));
  return `rgb(${rgbColors.join(", ")})`;
};

// h1.innerText = randomColor();

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

let direction, loopId;

const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, segmentSize, segmentSize);
  ctx.shadowBlur = 0;
};

const drawSnake = () => {
  ctx.fillStyle = "#888";
  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "#ddd";
    }

    ctx.fillRect(position.x, position.y, segmentSize, segmentSize);
  });
};

const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];

  switch (direction) {
    case "right":
      snake.push({ x: head.x + segmentSize, y: head.y });
      break;
    case "left":
      snake.push({ x: head.x - segmentSize, y: head.y });
      break;
    case "up":
      snake.push({ x: head.x, y: head.y - segmentSize });
      break;
    case "down":
      snake.push({ x: head.x, y: head.y + segmentSize });
      break;
  }
  snake.shift(); // remove the first element
};

const drawGrid = () => {
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "#191919";
  for (let i = 30; i < canvas.height; i += segmentSize) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
};

const checkEat = () => {
  const head = snake[snake.length - 1];
  if (head.x === food.x && head.y === food.y) {
    snake.push(head);
    // snake.unshift(head);
    audio.play();

    let x = randomPosition();
    let y = randomPosition();

    while (snake.some((position) => position.x === x && position.y === y)) {
      x = randomPosition();
      y = randomPosition();
    }

    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};

const checkCollision = () => {
  const head = snake[snake.length - 1];
  const neckIndex = snake.length - 2;

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x === head.x && position.y === head.y;
  });

  if (wallCollision || selfCollision) {
    gameOver();
    // alert("Game Over!");
  }
};

const gameOver = () => {
  direction = undefined;
};

const gameLoop = () => {
  clearInterval(loopId);
  ctx.clearRect(0, 0, canvas.height, canvas.width);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkCollision();

  loopId = setTimeout(() => {
    gameLoop();
  }, movement);
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
  if (key === "ArrowRight" && direction !== "left") direction = "right";
  if (key === "ArrowLeft" && direction !== "right") direction = "left";
  if (key === "ArrowUp" && direction !== "down") direction = "up";
  if (key === "ArrowDown" && direction !== "up") direction = "down";
});
