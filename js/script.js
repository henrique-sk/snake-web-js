const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score-value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const speedSelector = document.getElementById("speed-selector");
document.getElementById("speed-selector").addEventListener("change", () => {
  document.getElementById("speed-selector").blur();
});
const difficultySelector = document.getElementById("difficulty-selector");
document.getElementById("difficulty-selector").addEventListener("change", () => {
  document.getElementById("difficulty-selector").blur();
});

const canvasSize = 600;
const audioEat = new Audio("../assets/audioEat.mp3");
const audioGood = new Audio("../assets/coin-upaif-14631.mp3");
const audioBad = new Audio("../assets/pixel-death-66829.mp3");
const audioGameOver = new Audio("../assets/game-over-arcade-6435.mp3");

const savedScore = localStorage.getItem("snakeScore");
if (savedScore !== null) {
  score.innerText = savedScore;
}
const savedHighestScore = localStorage.getItem("highestSnakeScore");
const highestScoreElement = document.querySelector(".highest-score-value");

if (savedHighestScore !== null) {
  highestScoreElement.innerText = savedHighestScore;
}

canvas.height = canvasSize;
canvas.width = canvasSize;

let speedLevels = [500, 400, 300, 150, 75];
let currentSpeedLevel = 2;

let difficultyLevels = ["easy", "normal", "hard"];
let currentDifficultyLevel = "normal";

const segmentSize = 30;
const canvasLimit = canvasSize - segmentSize;
const movement = 300;
const initialSnake = [
  { x: 270, y: 240 },
  { x: 300, y: 240 },
  { x: 330, y: 240 },
];

let snake = [...initialSnake];

let gameOverState = false;

const changeScore = (points) => {
  const currentScore = parseInt(score.innerText, 10);
  const newScore = Math.max(0, currentScore + points);

  score.innerText = newScore;

  const highestScore = localStorage.getItem("highestSnakeScore") || 0;
  if (newScore > highestScore) {
    localStorage.setItem("highestSnakeScore", newScore);
  }

  localStorage.setItem("snakeScore", newScore);
  highestScoreElement.innerText = localStorage.getItem("highestSnakeScore") || 0;

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

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

const specialFood = {
  x: randomPosition(),
  y: randomPosition(),
  colors: ["red", "green", "blue"],
  effects: ["grow", "removePoints", "shrink", "addPoints"],
  timer: 5000,
  segmentsToChange: 0,
  chance: 0,
  chanceOfColor: 0,
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
  console.log(specialFood.timer);
  const { x, y, colors, chanceOfColor } = specialFood;
  if (specialFood.timer <= 0) {
    specialFood.chance = randomNumber(2, 3);
    switch (currentDifficultyLevel) {
      case "easy":
        specialFood.chanceOfColor = randomNumber(1, 2);
        break;
      case "normal":
        specialFood.chanceOfColor = randomNumber(0, 2);
        break;
      case "hard":
        specialFood.chanceOfColor = randomNumber(0, 1);
        break;
    }
  } else if (specialFood.chance === 3) {
    ctx.shadowColor = colors[chanceOfColor];
    ctx.fillStyle = colors[chanceOfColor];
    specialFood.color = colors[chanceOfColor];
    ctx.fillRect(x, y, segmentSize, segmentSize);
  }
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
  snake.shift();
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
    changeScore(10);
    // snake.push(head);
    snake.unshift(snake[0]);
    audioEat.play();

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
    applySpecialEffect(specialFood.color);
    specialFood.x = -30;
    specialFood.y = -30;
  }
};

const applySpecialEffect = (color) => {
  const { effects } = specialFood;
  switch (color) {
    case "red":
      specialFood.effect = effects[randomNumber(0, 1)];
      changeScore(specialFood.effect === "removePoints" ? -30 : 10);
      specialFood.segmentsToChange += specialFood.effect === "grow" ? 3 : 0;
      audioBad.play();
      break;
    case "green":
      specialFood.effect = effects[randomNumber(0, 3)];
      changeScore(
        specialFood.effect === "grow" || specialFood.effect === "shrink"
          ? 10
          : specialFood.effect === "revomePoints"
          ? -30
          : +30
      );
      specialFood.segmentsToChange +=
        specialFood.effect === "grow"
          ? 3
          : specialFood.effect === "shrink"
          ? Math.min(3, Math.max(0, snake.length - 3))
          : 0;
      (specialFood.effect === "grow" || specialFood.effect === "removePoints"
        ? audioBad
        : audioGood
      ).play();
      break;
    case "blue":
      specialFood.effect = effects[randomNumber(2, 3)];
      changeScore(specialFood.effect === "addPoints" ? 30 : 10);
      specialFood.segmentsToChange +=
        specialFood.effect === "shrink"
          ? Math.min(3, Math.max(0, snake.length - 3))
          : 0;
      audioGood.play();
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
    specialFood.timer -= 175;
  } else {
    resetSpecialFood();
  }
};

const changeSegments = () => {
  if (specialFood.effect === "grow") {
    for (let i = 0; i < specialFood.segmentsToChange; i++) {
      snake.unshift(snake[snake.length - 1]);
    }
  }
  if (specialFood.effect === "shrink") {
    for (let i = 0; i < specialFood.segmentsToChange; i++) {
      snake.shift();
    }
  }
  specialFood.segmentsToChange = 0;
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
    if (!gameOverState) {
      gameOverState = true;
      gameOver();
    }
  } else {
    gameOverState = false;
  }
};

const gameOver = () => {
  direction = undefined;

  audioGameOver.play();
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
  changeSegments();
  moveSnake();
  drawSnake();
  checkEat();
  checkSpecialEat();
  checkCollision();
  updateSpecialFoodTimer();

  loopId = setTimeout(() => {
    gameLoop();
  }, speedLevels[currentSpeedLevel]);
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

  localStorage.removeItem("snakeScore");

  snake = [...initialSnake];
});

speedSelector.addEventListener("change", () => {
  currentSpeedLevel = parseInt(speedSelector.value);
});

difficultySelector.addEventListener("change", () => {
  currentDifficultyLevel = difficultySelector.value;
});
