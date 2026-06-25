const COLS = 17;
const ROWS = 10;
const TARGET_SUM = 10;

const boardEl = document.getElementById("board");
const boardWrap = document.getElementById("boardWrap");
const scoreEl = document.getElementById("score");
const remainingEl = document.getElementById("remaining");
const bestEl = document.getElementById("best");
const selectionSumEl = document.getElementById("selectionSum");
const messageEl = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");

let grid = [];
let score = 0;
let best = Number(localStorage.getItem("appleGameBest") || 0);
let isDragging = false;
let startCell = null;
let selectedKeys = new Set();

bestEl.textContent = best;

function randomNumber() {
  return Math.floor(Math.random() * 9) + 1;
}

function key(row, col) {
  return `${row},${col}`;
}

function createGrid() {
  grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      value: randomNumber(),
      removed: false,
    }))
  );
}

function renderBoard() {
  boardEl.innerHTML = "";
  let remaining = 0;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = grid[row][col];
      const btn = document.createElement("button");
      const cellKey = key(row, col);

      btn.type = "button";
      btn.className = "apple";
      btn.dataset.row = row;
      btn.dataset.col = col;

      if (cell.removed) {
        btn.classList.add("empty");
        btn.textContent = "";
        btn.disabled = true;
      } else {
        remaining++;
        btn.textContent = cell.value;
        if (selectedKeys.has(cellKey)) {
          btn.classList.add("selected");
        }
      }

      boardEl.appendChild(btn);
    }
  }

  remainingEl.textContent = remaining;
  updateSelectionSum();
}

function updateSelectionHighlight() {
  boardEl.querySelectorAll(".apple").forEach((btn) => {
    if (btn.classList.contains("empty")) return;
    const cellKey = key(Number(btn.dataset.row), Number(btn.dataset.col));
    btn.classList.toggle("selected", selectedKeys.has(cellKey));
  });
  updateSelectionSum();
}

function getLineSelection(start, end) {
  const dRow = end.row - start.row;
  const dCol = end.col - start.col;
  const absRow = Math.abs(dRow);
  const absCol = Math.abs(dCol);
  const keys = new Set();

  if (absCol > absRow) {
    const row = start.row;
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);
    for (let col = minCol; col <= maxCol; col++) {
      if (!grid[row][col].removed) {
        keys.add(key(row, col));
      }
    }
  } else if (absRow > absCol) {
    const col = start.col;
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    for (let row = minRow; row <= maxRow; row++) {
      if (!grid[row][col].removed) {
        keys.add(key(row, col));
      }
    }
  } else {
    const stepRow = dRow === 0 ? 0 : (dRow > 0 ? 1 : -1);
    const stepCol = dCol === 0 ? 0 : (dCol > 0 ? 1 : -1);
    const steps = Math.max(absRow, absCol);

    for (let i = 0; i <= steps; i++) {
      const row = start.row + stepRow * i;
      const col = start.col + stepCol * i;
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) continue;
      if (!grid[row][col].removed) {
        keys.add(key(row, col));
      }
    }
  }

  return keys;
}

function sumOfKeys(keys) {
  let sum = 0;
  keys.forEach((cellKey) => {
    const [row, col] = cellKey.split(",").map(Number);
    sum += grid[row][col].value;
  });
  return sum;
}

function updateSelectionSum() {
  let sum = 0;
  selectedKeys.forEach((cellKey) => {
    const [row, col] = cellKey.split(",").map(Number);
    sum += grid[row][col].value;
  });
  selectionSumEl.textContent = sum;
}

function setSelection(keys) {
  selectedKeys = keys;
  updateSelectionHighlight();
}

function clearSelection() {
  selectedKeys = new Set();
  updateSelectionHighlight();
}

function getCellFromTarget(target) {
  const btn = target.closest(".apple");
  if (!btn || btn.classList.contains("empty")) return null;
  return {
    row: Number(btn.dataset.row),
    col: Number(btn.dataset.col),
  };
}

function getCellFromPoint(clientX, clientY) {
  const el = document.elementFromPoint(clientX, clientY);
  if (!el) return null;
  return getCellFromTarget(el);
}

function tryRemoveSelection() {
  if (selectedKeys.size === 0) return;

  let sum = 0;
  selectedKeys.forEach((cellKey) => {
    const [row, col] = cellKey.split(",").map(Number);
    sum += grid[row][col].value;
  });

  if (sum !== TARGET_SUM) {
    messageEl.textContent = `합이 ${sum}입니다. 10이 되도록 다시 선택해 보세요.`;
    clearSelection();
    return;
  }

  const removingButtons = [];
  selectedKeys.forEach((cellKey) => {
    const [row, col] = cellKey.split(",").map(Number);
    grid[row][col].removed = true;
    const index = row * COLS + col;
    removingButtons.push(boardEl.children[index]);
  });

  removingButtons.forEach((btn) => btn.classList.add("removing"));

  score += selectedKeys.size;
  scoreEl.textContent = score;

  if (score > best) {
    best = score;
    bestEl.textContent = best;
    localStorage.setItem("appleGameBest", String(best));
  }

  messageEl.textContent = `${selectedKeys.size}개의 사과를 없앴습니다! 🎉`;
  selectedKeys = new Set();

  setTimeout(() => {
    renderBoard();
    checkGameOver();
  }, 320);
}

function hasValidMove() {
  for (let r1 = 0; r1 < ROWS; r1++) {
    for (let c1 = 0; c1 < COLS; c1++) {
      if (grid[r1][c1].removed) continue;

      for (let c2 = c1; c2 < COLS; c2++) {
        const keys = getLineSelection({ row: r1, col: c1 }, { row: r1, col: c2 });
        if (keys.size > 0 && sumOfKeys(keys) === TARGET_SUM) return true;
      }

      for (let r2 = r1; r2 < ROWS; r2++) {
        const keys = getLineSelection({ row: r1, col: c1 }, { row: r2, col: c1 });
        if (keys.size > 0 && sumOfKeys(keys) === TARGET_SUM) return true;
      }

      for (let r2 = 0; r2 < ROWS; r2++) {
        for (let c2 = 0; c2 < COLS; c2++) {
          if (Math.abs(r2 - r1) !== Math.abs(c2 - c1)) continue;
          const keys = getLineSelection({ row: r1, col: c1 }, { row: r2, col: c2 });
          if (keys.size > 0 && sumOfKeys(keys) === TARGET_SUM) return true;
        }
      }
    }
  }
  return false;
}

function checkGameOver() {
  const remaining = grid.flat().filter((cell) => !cell.removed).length;
  if (remaining === 0) {
    messageEl.textContent = "축하합니다! 모든 사과를 없앴습니다! 🏆";
    return;
  }

  if (!hasValidMove()) {
    messageEl.textContent = "더 이상 합이 10이 되는 조합이 없습니다. 다시 하기를 눌러 주세요.";
  }
}

function resetGame() {
  score = 0;
  scoreEl.textContent = "0";
  messageEl.textContent = "";
  selectedKeys = new Set();
  createGrid();
  renderBoard();
}

boardWrap.addEventListener("pointerdown", (event) => {
  const cell = getCellFromPoint(event.clientX, event.clientY);
  if (!cell) return;

  event.preventDefault();
  isDragging = true;
  startCell = cell;
  setSelection(getLineSelection(cell, cell));
  boardWrap.setPointerCapture(event.pointerId);
});

boardWrap.addEventListener("pointermove", (event) => {
  if (!isDragging || !startCell) return;
  const cell = getCellFromPoint(event.clientX, event.clientY);
  if (!cell) return;
  setSelection(getLineSelection(startCell, cell));
});

function endDrag(event) {
  if (!isDragging) return;
  isDragging = false;
  if (event?.pointerId != null && boardWrap.hasPointerCapture(event.pointerId)) {
    boardWrap.releasePointerCapture(event.pointerId);
  }
  tryRemoveSelection();
  startCell = null;
}

boardWrap.addEventListener("pointerup", endDrag);
boardWrap.addEventListener("pointercancel", endDrag);

resetBtn.addEventListener("click", resetGame);

createGrid();
renderBoard();
