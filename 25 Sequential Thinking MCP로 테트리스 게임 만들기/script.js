(() => {
  const COLS = 10;
  const ROWS = 20;
  const CELL = 30;
  const NEXT_CELL = 24;
  const BEST_KEY = "tetris-best-score";

  const COLORS = {
    I: "#00e5ff",
    O: "#ffd166",
    T: "#c77dff",
    S: "#06d6a0",
    Z: "#ef476f",
    J: "#4cc9f0",
    L: "#f4a261",
  };

  const SHAPES = {
    I: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    O: [
      [1, 1],
      [1, 1],
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  };

  const LINE_SCORES = [0, 100, 300, 500, 800];

  const boardCanvas = document.getElementById("board");
  const nextCanvas = document.getElementById("next");
  const boardCtx = boardCanvas.getContext("2d");
  const nextCtx = nextCanvas.getContext("2d");

  const scoreEl = document.getElementById("score");
  const levelEl = document.getElementById("level");
  const linesEl = document.getElementById("lines");
  const bestEl = document.getElementById("best");
  const pauseBtn = document.getElementById("pauseBtn");
  const restartBtn = document.getElementById("restartBtn");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");

  let board = createEmptyBoard();
  let bag = [];
  let current = null;
  let nextType = null;
  let score = 0;
  let lines = 0;
  let level = 1;
  let best = Number(localStorage.getItem(BEST_KEY) || 0);
  let paused = false;
  let gameOver = false;
  let dropInterval = 1000;
  let lastDrop = 0;
  let animId = 0;
  let softDropping = false;

  bestEl.textContent = String(best);

  function createEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  function cloneMatrix(matrix) {
    return matrix.map((row) => row.slice());
  }

  function rotateMatrix(matrix) {
    const size = matrix.length;
    const rotated = Array.from({ length: size }, () => Array(size).fill(0));
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        rotated[x][size - 1 - y] = matrix[y][x];
      }
    }
    return rotated;
  }

  function shuffle(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function refillBag() {
    bag = shuffle(Object.keys(SHAPES));
  }

  function takeFromBag() {
    if (bag.length === 0) refillBag();
    return bag.pop();
  }

  function createPiece(type) {
    const matrix = cloneMatrix(SHAPES[type]);
    const width = matrix[0].length;
    return {
      type,
      matrix,
      x: Math.floor((COLS - width) / 2),
      y: 0,
    };
  }

  function collide(piece, offsetX = 0, offsetY = 0, matrix = piece.matrix) {
    for (let y = 0; y < matrix.length; y += 1) {
      for (let x = 0; x < matrix[y].length; x += 1) {
        if (!matrix[y][x]) continue;
        const nx = piece.x + x + offsetX;
        const ny = piece.y + y + offsetY;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
    }
    return false;
  }

  function merge(piece) {
    for (let y = 0; y < piece.matrix.length; y += 1) {
      for (let x = 0; x < piece.matrix[y].length; x += 1) {
        if (!piece.matrix[y][x]) continue;
        const by = piece.y + y;
        const bx = piece.x + x;
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          board[by][bx] = piece.type;
        }
      }
    }
  }

  function clearLines() {
    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y -= 1) {
      if (board[y].every((cell) => cell)) {
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(null));
        cleared += 1;
        y += 1;
      }
    }
    return cleared;
  }

  function updateLevel() {
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 1000 - (level - 1) * 80);
  }

  function addScore(cleared, softPoints = 0) {
    score += LINE_SCORES[cleared] * level + softPoints;
    if (score > best) {
      best = score;
      localStorage.setItem(BEST_KEY, String(best));
      bestEl.textContent = String(best);
    }
    updateHud();
  }

  function updateHud() {
    scoreEl.textContent = String(score);
    levelEl.textContent = String(level);
    linesEl.textContent = String(lines);
  }

  function spawn() {
    const type = nextType || takeFromBag();
    nextType = takeFromBag();
    current = createPiece(type);
    if (collide(current)) {
      endGame();
    }
  }

  function move(dx, dy) {
    if (!current || paused || gameOver) return false;
    if (!collide(current, dx, dy)) {
      current.x += dx;
      current.y += dy;
      return true;
    }
    return false;
  }

  function rotate() {
    if (!current || paused || gameOver || current.type === "O") return;
    const rotated = rotateMatrix(current.matrix);
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      if (!collide(current, kick, 0, rotated)) {
        current.matrix = rotated;
        current.x += kick;
        return;
      }
    }
  }

  function softDrop() {
    if (!current || paused || gameOver) return;
    if (move(0, 1)) {
      addScore(0, 1);
    } else {
      lockPiece();
    }
  }

  function hardDrop() {
    if (!current || paused || gameOver) return;
    let dropped = 0;
    while (!collide(current, 0, 1)) {
      current.y += 1;
      dropped += 1;
    }
    addScore(0, dropped * 2);
    lockPiece();
  }

  function ghostY() {
    if (!current) return 0;
    let gy = current.y;
    while (!collide({ ...current, y: gy }, 0, 1)) {
      gy += 1;
    }
    return gy;
  }

  function lockPiece() {
    merge(current);
    const cleared = clearLines();
    if (cleared > 0) {
      lines += cleared;
      updateLevel();
      addScore(cleared);
    } else {
      updateHud();
    }
    spawn();
    lastDrop = performance.now();
  }

  function endGame() {
    gameOver = true;
    paused = false;
    showOverlay("GAME OVER", `점수 ${score}점 · R 키 또는 다시 하기로 재시작`);
    pauseBtn.textContent = "다시 하기";
  }

  function showOverlay(title, text) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    overlay.hidden = false;
  }

  function hideOverlay() {
    overlay.hidden = true;
  }

  function togglePause() {
    if (gameOver) {
      resetGame();
      return;
    }
    paused = !paused;
    if (paused) {
      showOverlay("PAUSED", "P 키 또는 재개 버튼을 누르세요");
      pauseBtn.textContent = "재개";
    } else {
      hideOverlay();
      pauseBtn.textContent = "일시정지";
      lastDrop = performance.now();
    }
  }

  function resetGame() {
    board = createEmptyBoard();
    bag = [];
    refillBag();
    nextType = takeFromBag();
    score = 0;
    lines = 0;
    level = 1;
    dropInterval = 1000;
    paused = false;
    gameOver = false;
    softDropping = false;
    hideOverlay();
    pauseBtn.textContent = "일시정지";
    updateHud();
    spawn();
    lastDrop = performance.now();
  }

  function drawCell(ctx, x, y, color, cellSize, alpha = 1) {
    const pad = 1.5;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize + pad, y * cellSize + pad, cellSize - pad * 2, cellSize - pad * 2);

    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(x * cellSize + pad, y * cellSize + pad, cellSize - pad * 2, 4);

    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(
      x * cellSize + pad,
      y * cellSize + cellSize - pad - 4,
      cellSize - pad * 2,
      4
    );
    ctx.globalAlpha = 1;
  }

  function drawBoard() {
    boardCtx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);

    boardCtx.fillStyle = "#050b14";
    boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

    boardCtx.strokeStyle = "rgba(120, 190, 220, 0.08)";
    boardCtx.lineWidth = 1;
    for (let x = 0; x <= COLS; x += 1) {
      boardCtx.beginPath();
      boardCtx.moveTo(x * CELL, 0);
      boardCtx.lineTo(x * CELL, ROWS * CELL);
      boardCtx.stroke();
    }
    for (let y = 0; y <= ROWS; y += 1) {
      boardCtx.beginPath();
      boardCtx.moveTo(0, y * CELL);
      boardCtx.lineTo(COLS * CELL, y * CELL);
      boardCtx.stroke();
    }

    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        const type = board[y][x];
        if (type) drawCell(boardCtx, x, y, COLORS[type], CELL);
      }
    }

    if (current && !gameOver) {
      const gy = ghostY();
      for (let y = 0; y < current.matrix.length; y += 1) {
        for (let x = 0; x < current.matrix[y].length; x += 1) {
          if (!current.matrix[y][x]) continue;
          drawCell(boardCtx, current.x + x, gy + y, COLORS[current.type], CELL, 0.22);
        }
      }

      for (let y = 0; y < current.matrix.length; y += 1) {
        for (let x = 0; x < current.matrix[y].length; x += 1) {
          if (!current.matrix[y][x]) continue;
          const by = current.y + y;
          if (by < 0) continue;
          drawCell(boardCtx, current.x + x, by, COLORS[current.type], CELL);
        }
      }
    }
  }

  function drawNext() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextCtx.fillStyle = "#050b14";
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (!nextType) return;
    const matrix = SHAPES[nextType];
    const w = matrix[0].length;
    const h = matrix.length;
    const offsetX = Math.floor((nextCanvas.width / NEXT_CELL - w) / 2);
    const offsetY = Math.floor((nextCanvas.height / NEXT_CELL - h) / 2);

    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        if (!matrix[y][x]) continue;
        drawCell(nextCtx, offsetX + x, offsetY + y, COLORS[nextType], NEXT_CELL);
      }
    }
  }

  function tick(now) {
    if (!paused && !gameOver && current) {
      const interval = softDropping ? Math.min(dropInterval, 50) : dropInterval;
      if (now - lastDrop >= interval) {
        if (!move(0, 1)) {
          lockPiece();
        }
        lastDrop = now;
      }
    }
    drawBoard();
    drawNext();
    animId = requestAnimationFrame(tick);
  }

  function handleAction(action) {
    switch (action) {
      case "left":
        move(-1, 0);
        break;
      case "right":
        move(1, 0);
        break;
      case "down":
        softDrop();
        break;
      case "rotate":
        rotate();
        break;
      case "drop":
        hardDrop();
        break;
      default:
        break;
    }
  }

  document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "p" || key === "P") {
      event.preventDefault();
      togglePause();
      return;
    }
    if (key === "r" || key === "R") {
      event.preventDefault();
      resetGame();
      return;
    }
    if (paused || gameOver) return;

    if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(key)) {
      event.preventDefault();
    }

    if (key === "ArrowLeft") move(-1, 0);
    else if (key === "ArrowRight") move(1, 0);
    else if (key === "ArrowDown") {
      softDropping = true;
      softDrop();
    } else if (key === "ArrowUp" || key === "x" || key === "X") rotate();
    else if (key === " ") hardDrop();
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowDown") softDropping = false;
  });

  pauseBtn.addEventListener("click", togglePause);
  restartBtn.addEventListener("click", resetGame);

  document.querySelectorAll(".touch-controls [data-action]").forEach((button) => {
    const action = button.dataset.action;
    let repeatId = 0;

    const start = (event) => {
      event.preventDefault();
      handleAction(action);
      if (action === "left" || action === "right" || action === "down") {
        repeatId = window.setInterval(() => handleAction(action), 80);
      }
    };

    const stop = () => {
      if (repeatId) {
        clearInterval(repeatId);
        repeatId = 0;
      }
    };

    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointerleave", stop);
    button.addEventListener("pointercancel", stop);
  });

  resetGame();
  animId = requestAnimationFrame(tick);

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animId);
  });
})();
