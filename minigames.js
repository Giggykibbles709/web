// Código Konami
const konamiCode = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];

let input = [];

window.addEventListener("keydown", (e) => {
  input.push(e.key);
  input.splice(-konamiCode.length - 1, input.length - konamiCode.length);
  if (input.join("") === konamiCode.join("")) {
    activarMenuSecreto();
  }
});

// Mostrar menú secreto
function activarMenuSecreto() {
  document.getElementById("menu-secreto").style.display = "flex";
  const sonido = new Audio("assets/sounds/powerup.wav");
  sonido.play();
}

// Cerrar menú secreto
function cerrarMenuSecreto() {
  document.getElementById("menu-secreto").style.display = "none";
  document.getElementById("contenedor-juego").innerHTML = "";
}

// Mostrar juego Snake
function mostrarSnake() {
  const contenedor = document.getElementById("contenedor-juego");
  contenedor.innerHTML = '<canvas id="snake" width="400" height="400"></canvas>';
  iniciarSnake();
}

// Lógica del juego Snake
function iniciarSnake() {
  const canvas = document.getElementById("snake");
  const ctx = canvas.getContext("2d");

  const grid = 20;
  let count = 0;
  let snake = { x: 160, y: 160, cells: [], maxCells: 4 };
  let apple = { x: 320, y: 320 };
  let dx = grid;
  let dy = 0;

  let eatSound = new Audio("assets/sounds/eat.wav");
  let deadSound = new Audio("assets/sounds/dead.wav");

  document.addEventListener("keydown", function (e) {
  if (document.getElementById("menu-secreto").style.display === "flex") {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === "ArrowLeft" && dx === 0) {
      dx = -grid; dy = 0;
    } else if (e.key === "ArrowUp" && dy === 0) {
      dy = -grid; dx = 0;
    } else if (e.key === "ArrowRight" && dx === 0) {
      dx = grid; dy = 0;
    } else if (e.key === "ArrowDown" && dy === 0) {
      dy = grid; dx = 0;
    }
  }
}, { passive: false });

  function loop() {
    requestAnimationFrame(loop);

    if (++count < 10) return;
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += dx;
    snake.y += dy;

    // Wrap
    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;
    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.height) snake.y = 0;

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    // Apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Snake
    ctx.fillStyle = 'lime';
    snake.cells.forEach((cell, index) => {
      ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

      // Comida
      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        apple.x = Math.floor(Math.random() * 20) * grid;
        apple.y = Math.floor(Math.random() * 20) * grid;
        eatSound.play();
      }

      // Choque
      for (let i = index + 1; i < snake.cells.length; i++) {
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          snake.x = 160;
          snake.y = 160;
          snake.cells = [];
          snake.maxCells = 4;
          dx = grid;
          dy = 0;
          deadSound.play();
        }
      }
    });
  }

  loop();
}
