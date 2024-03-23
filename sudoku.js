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
function BackTrack(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (checkGrid(grid, row, col, num)) {
            grid[row][col] = num;
            if (BackTrack(grid)) {
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
function SolveBackTrack() {
  setTime();
  BackTrack(board);
  setGame();
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
