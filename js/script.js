const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const canvasSize = 600;
const audio = new Audio("../assets/audio.mp3");
canvas.height = canvasSize;
canvas.width = canvasSize;

// const h1 = document.querySelector("h1");

const segmentSize = 30;
const canvasLimit = canvasSize - segmentSize;
const movement = 300;
const initialSnake = [
  { x: 270, y: 240 },
  { x: 300, y: 240 },
  { x: 330, y: 240 },
];

let snake = [...initialSnake];

const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// h1.innerText = randomColor();

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

const specialFood = {
  x: randomPosition(),
  y: randomPosition(),
  color: "orange",
  effect: "grow",
  timer: 5000,
  additionalSegments: 0,
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

const drawSpecialFood = () => {
  const { x, y, color } = specialFood;

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
    incrementScore();
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

const checkSpecialEat = () => {
  const head = snake[snake.length - 1];
  if (head.x === specialFood.x && head.y === specialFood.y) {
    applySpecialEffect(specialFood.effect);
    resetSpecialFood();
  }
};

const applySpecialEffect = (effect) => {
  switch (effect) {
    case "grow":
      specialFood.additionalSegments += 3;
      break;
  }
};

const resetSpecialFood = () => {
  specialFood.x = randomPosition();
  specialFood.y = randomPosition();
  specialFood.timer = 5000;
};

const updateSpecialFoodTimer = () => {
  if (specialFood.timer > 0) {
    specialFood.timer -= movement;
  } else {
    resetSpecialFood();
  }
};

const addAdditionalSegments = () => {
  for (let i = 0; i < specialFood.additionalSegments; i++) {
    snake.push(snake[snake.length - 1]);
  }
  specialFood.additionalSegments = 0;
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
  }
};

const gameOver = () => {
  direction = undefined;

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(4px)";
};

const gameLoop = () => {
  clearInterval(loopId);
  ctx.clearRect(0, 0, canvas.height, canvas.width);
  drawGrid();
  drawFood();
  drawSpecialFood();
  addAdditionalSegments();
  moveSnake();
  drawSnake();
  checkEat();
  checkSpecialEat();
  checkCollision();
  updateSpecialFoodTimer();

  loopId = setTimeout(() => {
    gameLoop();
  }, movement);
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
  const head = snake[snake.length - 1];
  const neck = snake[snake.length - 3] || false;

  const xAprove = head.y !== neck.y || !neck;
  const yAprove = head.x !== neck.x || !neck;

  if (
    (neck.x === initialSnake[0].x && neck.y === initialSnake[0].y) ||
    (key === "ArrowRight" && xAprove && direction !== "left")
  ) {
    direction = "right";
  }

  if (key === "ArrowLeft" && xAprove && direction !== "right") {
    direction = "left";
  }

  if (key === "ArrowDown" && yAprove && direction !== "up") {
    direction = "down";
  }

  if (key === "ArrowUp" && yAprove && direction !== "down") {
    direction = "up";
  }
});

buttonPlay.addEventListener("click", () => {
  menu.style.display = "none";
  canvas.style.filter = "none";
  score.innerText = "00";

  snake = [...initialSnake];
});
