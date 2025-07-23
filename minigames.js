let snakeLoopID = null;
let pongLoopID = null;
let snakeSounds = [];
let pongSounds = [];

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
  detenerMinijuegos();
  document.getElementById("menu-secreto").style.display = "none";
  document.getElementById("contenedor-juego").innerHTML = "";
}

// Mostrar juego Snake
function mostrarSnake() {
  detenerMinijuegos();
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
  snakeSounds = [eatSound, deadSound];

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

    if (e.key === "a" && dx === 0) {
      dx = -grid; dy = 0;
    } else if (e.key === "w" && dy === 0) {
      dy = -grid; dx = 0;
    } else if (e.key === "d" && dx === 0) {
      dx = grid; dy = 0;
    } else if (e.key === "s" && dy === 0) {
      dy = grid; dx = 0;
    }
  }
}, { passive: false });

  function loop() {
    snakeLoopID = requestAnimationFrame(loop);

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

function mostrarPong() {
  detenerMinijuegos();
  const contenedor = document.getElementById("contenedor-juego");
  contenedor.innerHTML = '<canvas id="pong" width="600" height="400"></canvas>';
  iniciarPong();
}

function iniciarPong() {
  const canvas = document.getElementById("pong");
  const ctx = canvas.getContext("2d");

  const bounceSound = new Audio("assets/sounds/bounce.wav");
  const scoreSound = new Audio("assets/sounds/score.wav");

  const paddleHeight = 60;
  const paddleWidth = 10;
  const ballSize = 10;

  const player = { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
  const ai = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 4 * (Math.random() > 0.5 ? 1 : -1),
    dy: 4 * (Math.random() > 0.5 ? 1 : -1)
  };

  // Controles jugador
  document.addEventListener("keydown", (e) => {
    if (document.getElementById("menu-secreto").style.display === "flex") {
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }
      if (e.key === "w") player.dy = -5;
      if (e.key === "s") player.dy = 5;
      if (e.key === "ArrowUp") player.dy = -5;
      if (e.key === "ArrowDown") player.dy = 5;
    }
  }, { passive: false });

  document.addEventListener("keyup", (e) => {
    if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) player.dy = 0;
  });

  function update() {
    // Mover jugador
    player.y += player.dy;
    player.y = Math.max(0, Math.min(canvas.height - paddleHeight, player.y));

    // IA: sigue la pelota
    if (ball.y < ai.y + paddleHeight / 2 - 5) {
      ai.dy = -3;
    } else if (ball.y > ai.y + paddleHeight / 2 + 5) {
      ai.dy = 3;
    } else {
      ai.dy = 0;
    }
    ai.y += ai.dy;
    ai.y = Math.max(0, Math.min(canvas.height - paddleHeight, ai.y));

    // Mover pelota
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Rebote arriba/abajo
    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
      ball.dy *= -1;
      bounceSound.currentTime = 0;
      bounceSound.play();
    }

    // Rebote jugador
    if (
      ball.x < player.x + paddleWidth &&
      ball.y + ballSize > player.y &&
      ball.y < player.y + paddleHeight
    ) {
      ball.dx *= -1;
      ball.x = player.x + paddleWidth;
      bounceSound.currentTime = 0;
      bounceSound.play();
    }

    // Rebote IA
    if (
      ball.x + ballSize > ai.x &&
      ball.y + ballSize > ai.y &&
      ball.y < ai.y + paddleHeight
    ) {
      ball.dx *= -1;
      ball.x = ai.x - ballSize;
      bounceSound.currentTime = 0;
      bounceSound.play();
    }

    // Gol (reinicio)
    if (ball.x < 0 || ball.x > canvas.width) {
      scoreSound.currentTime = 0;
      scoreSound.play();

      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx *= -1;
      ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(player.x, player.y, paddleWidth, paddleHeight);
    ctx.fillRect(ai.x, ai.y, paddleWidth, paddleHeight);
    ctx.fillRect(ball.x, ball.y, ballSize, ballSize);
  }

  function loop() {
    update();
    draw();
    pongLoopID = requestAnimationFrame(loop);
  }

  loop();
}

function detenerMinijuegos() {
  // Snake
  if (snakeLoopID) cancelAnimationFrame(snakeLoopID);
  snakeLoopID = null;
  snakeSounds.forEach(s => { s.pause(); s.currentTime = 0; });

  // Pong
  if (pongLoopID) cancelAnimationFrame(pongLoopID);
  pongLoopID = null;
  pongSounds.forEach(s => { s.pause(); s.currentTime = 0; });

  // Limpiar canvas
  const contenedor = document.getElementById("contenedor-juego");
  contenedor.innerHTML = "";
}
