const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.height = 600;
canvas.width = 600;
const size = 30;
movement = 300;

const snake = [{ x: 270, y: 240 }];

let direction, loopId;

const drawSnake = () => {
  ctx.fillStyle = "#888";
  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "#ddd";
    }

    ctx.fillRect(position.x, position.y, size, size);
  });
};

const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];

  switch (direction) {
    case "right":
      snake.push({ x: head.x + size, y: head.y });
      break;
    case "left":
      snake.push({ x: head.x - size, y: head.y });
      break;
    case "up":
      snake.push({ x: head.x, y: head.y - size });
      break;
    case "down":
      snake.push({ x: head.x, y: head.y + size });
      break;
  }
  snake.shift(); // remove the first element
};

const drawGrid = () => {
  ctx.lineWidth = 0.08;
  ctx.strokeStyle = "#ddd";
  for (let i = 30; i < canvas.height; i += size) {
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

drawGrid();

const gameLoop = () => {
  clearInterval(loopId);
  ctx.clearRect(0, 0, canvas.height, canvas.width);
  drawSnake();
  moveSnake();

  loopId = setTimeout(() => {
    gameLoop();
  }, movement);
};

// gameLoop();

document.addEventListener("keydown", ({ key }) => {
  if (key === "ArrowRight" && direction !== "left") direction = "right";
  if (key === "ArrowLeft" && direction !== "right") direction = "left";
  if (key === "ArrowUp" && direction !== "down") direction = "up";
  if (key === "ArrowDown" && direction !== "up") direction = "down";
});
