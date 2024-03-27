var numSelected = null;
var tileSelected = null;

var errors = 0;

var board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

var solution = [
  "387491625",
  "241568379",
  "569327418",
  "758619234",
  "123784596",
  "496253187",
  "934176852",
  "675832941",
  "812945763",
];

window.onload = function () {
  setGame();
};

function setGame() {
  document.getElementById("board").innerHTML = "";
  // Board 9x9
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.createElement("div");
      let tile_input = document.createElement("input");

      tile.id = r.toString() + "-" + c.toString();
      tile_input.classList.add(r.toString() + "-" + c.toString());
      tile_input.type = "number";
      tile_input.min = 1;
      tile_input.max = 9;

      if (board[r][c] !== 0) {
        // tile.innerText = board[r][c];
        tile_input.value = board[r][c];
        tile_input.style.cursor = "not-allowed";
        tile_input.setAttribute("readonly", true);

        tile.classList.add("tile-start");
      } else {
        tile_input.addEventListener("change", function (e) {
          board[r][c] = Number(e.target.value);
        });

        tile.classList.add("tile-start");
      }
      if (r == 2 || r == 5) {
        tile.classList.add("horizontal-line");
      }
      if (c == 2 || c == 5) {
        tile.classList.add("vertical-line");
      }
      tile.appendChild(tile_input);
      tile.classList.add("tile");
      document.getElementById("board").append(tile);
    }
  }
}

function selectNumber() {
  if (numSelected != null) {
    numSelected.classList.remove("number-selected");
  }
  numSelected = this;
  numSelected.classList.add("number-selected");
}
let currentTime;
let interval;
function setTime() {
  currentTime = Date.now();
  interval = setInterval(() => {
    let time = Date.now() - currentTime;
    let seconds = Math.floor(time / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    document.getElementById("time").innerText =
      (Math.floor(minutes / 10) === 0 ? "0".concat(minutes) : minutes) +
      ":" +
      (Math.floor(seconds / 10) === 0 ? "0".concat(seconds) : seconds);
  }, 1000);
}
function checkBoard(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== 0) {
        let num = board[i][j];
        board[i][j] = 0;
        if (!checkGrid(board, i, j, num)) {
          board[i][j] = num;
          return false;
        }
        board[i][j] = num;
      }
    }
  }
  return true;
}
function checkGrid(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num || grid[row][i] === num) {
      return false;
    }
  }
  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (i !== row && j !== col && grid[i][j] === num) {
        return false;
      }
    }
  }
  return true;
}
function updateCell(row, col, num) {
  let tile_input = document.getElementsByClassName(
    row.toString() + "-" + col.toString()
  );
  tile_input[0].value = num;
}
async function BackTrack(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (checkGrid(grid, row, col, num)) {
            grid[row][col] = num;
            updateCell(row, col, num);
            await new Promise((resolve) => setTimeout(resolve, 50));
            if (await BackTrack(grid)) {
              return true;
            } else {
              grid[row][col] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}
async function SolveBackTrack() {
  setTime();
  if (checkBoard(board) && (await BackTrack(board))) {
    setGame();
    alert("Solution found");
  } else {
    alert("No solution");
  }
  clearInterval(interval);
}
function Reset() {
  board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  setGame();
  clearInterval(interval);
  document.getElementById("time").innerText = "00:00";
}

async function SolveBackTrackHeuristic() {
  setTime();
  if (checkBoard() && (await solve(board))) {
    setGame();
    alert("Solution found");
  } else {
    alert("No solution");
  }
  clearInterval(interval);
}

async function solve(board) {
  let emptySpot = findEmptySpot(board);
  if (!emptySpot) {
    return true; // Nếu không còn chỗ trống nào thì bảng đã được giải
  }

  const [row, col] = emptySpot;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      updateCell(row, col, num);
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (await solve(board)) {
        return true;
      }
      board[row][col] = 0; // Nếu không thể giải, đặt lại ô này thành 0 và thử giá trị khác
    }
  }
  return false; // Trả về false nếu không có giải pháp nào hoạt động
}

function findEmptySpot(board) {
  let minOptions = 10; // Khởi tạo số lựa chọn tối thiểu là 10 (lớn hơn 9)
  let minSpot = null;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        let options = findOptions(board, i, j);
        if (options.length < minOptions) {
          minOptions = options.length;
          minSpot = [i, j];
        }
      }
    }
  }
  return minSpot;
}
function findOptions(board, row, col) {
  let options = [];
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      options.push(num);
    }
  }
  return options;
}

function isValid(board, row, col, num) {
  // Kiểm tra hàng và cột
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  // Kiểm tra ô 3x3
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }

  return true; // Trả về true nếu giá trị num hợp lệ ở hàng, cột và ô 3x3
}
