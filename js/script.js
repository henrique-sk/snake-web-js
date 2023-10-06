const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const size = 30;

const snake = [
  { x: 200, y: 200 },
  { x: 230, y: 200 },
];

let direction;

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
    snake.shift();
};

setInterval(() => {
  ctx.clearRect(0, 0, 600, 600);

  moveSnake();
  drawSnake();
}, 300);
