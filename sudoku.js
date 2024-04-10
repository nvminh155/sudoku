// Mảng lưu trữ bảng Sudoku
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
// Hàm được gọi khi trang web được tải
window.onload = function () {
  setGame();
};
// Hàm tạo bảng Sudoku
function setGame() {
  // Xóa nội dung bảng Sudoku hiện có
  document.getElementById("board").innerHTML = "";
  // Lặp qua từng ô trong bảng Sudoku
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.createElement("div");
      let tile_input = document.createElement("input");
      // Đặt ID cho ô và input tương ứng
      tile.id = r.toString() + "-" + c.toString();
      tile_input.classList.add(r.toString() + "-" + c.toString());
      tile_input.type = "number";
      tile_input.min = 1;
      tile_input.max = 9;
      // Kiểm tra nếu ô không phải là ô trống
      if (board[r][c] !== 0) {
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
      // Thêm các class cho ô
      if (r === 2 || r === 5) {
        tile.classList.add("horizontal-line");
      }
      if (c === 2 || c === 5) {
        tile.classList.add("vertical-line");
      }
      // Gắn input vào ô và thêm vào phần hiển thị bảng
      tile.appendChild(tile_input);
      tile.classList.add("tile");
      document.getElementById("board").append(tile);
    }
  }
}
// Biến lưu trữ thời gian và interval
let currentTime;
let interval;
// Hàm thiết lập thời gian chạy
function setTime() {
  currentTime = Date.now();
  interval = setInterval(() => {
    let time = Date.now() - currentTime;
    let seconds = Math.floor(time / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    // Hiển thị thời gian đã trôi qua
    document.getElementById("time").innerText =
      (Math.floor(minutes / 10) === 0 ? "0".concat(minutes) : minutes) +
      ":" +
      (Math.floor(seconds / 10) === 0 ? "0".concat(seconds) : seconds);
  }, 1000);
}
// Hàm kiểm tra bảng Sudoku
function checkBoard(board) {
  // Lặp qua từng ô trong bảng
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      // Nếu ô không trống
      if (board[i][j] !== 0) {
        let num = board[i][j];
        // Xóa giá trị ô
        board[i][j] = 0;
        // Kiểm tra giá trị hiện tại của ô đã phù hợp với ràng buộc chưa
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
// Hàm kiểm tra ràng buộc bảng hiện tại
function checkGrid(grid, row, col, num) {
  // Kiểm tra hàng và cột
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num || grid[row][i] === num) {
      return false;
    }
  }
  // Kiểm tra ô trong vùng 3x3
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
// Hàm cập nhật giá trị ô
function updateCell(row, col, num) {
  // Xóa màu nền của các ô
  let listInput = document.getElementsByTagName("input");
  for (let i = 0; i < listInput.length; i++) {
    listInput[i].style.backgroundColor = "white";
  }
  // Tìm ô cần cập nhật và cập nhật giá trị
  let tile_input = document.getElementsByClassName(
    row.toString() + "-" + col.toString()
  );
  // Thay đổi giá trị và đánh dấu ô được cập nhật màu nền
  tile_input[0].value = num;
  tile_input[0].style.backgroundColor = "lightgreen";
}
// Hàm triển khai giải thuật Backtrack
async function BackTrack(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Nếu ô trống
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          // Kiểm tra giá trị mới có phù hợp với ràng buộc không
          if (checkGrid(grid, row, col, num)) {
            grid[row][col] = num;
            updateCell(row, col, num);
            // Đợi 50ms vì ngôn ngữ chạy khá nhanh nên sẽ không hiển thị rõ được trên giao diện
            await new Promise((resolve) => setTimeout(resolve, 50));
            // Nếu giải được bảng thì trả về true
            // Nếu không giải được thì trả về false và thử giá trị khác
            if (await BackTrack(grid)) {
              return true;
            } else {
              grid[row][col] = 0;
            }
          }
        }
        // Nếu không có giá trị nào phù hợp thì trả về false
        return false;
      }
    }
  }
  // Sau các bước kiểm tra trên nếu không còn ô trống thì trả về true (có đáp án)
  return true;
}
// Hàm giải Sudoku bằng phương pháp Backtrack
async function SolveBackTrack() {
  // Bắt đầu đếm thời gian
  setTime();
  // Kiểm tra bảng Sudoku và giải bằng Backtrack
  if (checkBoard(board) && (await BackTrack(board))) {
    // Nếu tìm thấy giải pháp, cập nhật lại giao diện bảng Sudoku
    setGame();
    alert("Solution found");
  } else {
    // Nếu không tìm thấy giải pháp thì thông báo
    alert("No solution");
  }
  // Dừng đếm thời gian
  clearInterval(interval);
}
// Hàm reset bảng Sudoku
function Reset() {
  // Đặt lại giá trị của bảng Sudoku
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
  // Tạo lại giao diện bảng Sudoku
  setGame();
  // Dừng đếm thời gian
  clearInterval(interval);
  // Reset thời gian hiển thị
  document.getElementById("time").innerText = "00:00";
}

// Hàm giải Sudoku bằng phương pháp Backtrack với hàm Heuristic
async function SolveBackTrackHeuristic() {
  // Bắt đầu đếm thời gian
  setTime();
  // Kiểm tra bảng Sudoku và giải bằng Backtrack Heuristic
  if (checkBoard(board) && (await solve(board, true))) {
    // Nếu tìm thấy giải pháp, cập nhật lại giao diện bảng Sudoku
    setGame();
    alert("Solution found");
  } else {
    // Nếu không tìm thấy giải pháp thì thông báo
    alert("No solution");
  }
  // Dừng đếm thời gian
  clearInterval(interval);
}
// Hàm triển khai giải thuật Backtrack Heuristic
async function solve(board, checkRandom) {
  // Tìm ô trống
  let emptySpot = findEmptySpot(board);
  // Nếu không còn ô trống thì trả về true
  if (!emptySpot) {
    return true;
  }
  // Lấy hàng và cột của ô trống
  const [row, col] = emptySpot;
  // Thử từng giá trị từ 1 đến 9
  for (let num = 1; num <= 9; num++) {
    // Nếu giá trị thử này phù hợp với ràng buộc thì gán giá trị và thử giá trị tiếp theo
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      updateCell(row, col, num);
      // Đợi 50ms vì ngôn ngữ chạy khá nhanh nên sẽ không hiển thị rõ được trên giao diện
      if (checkRandom) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      // Nếu giải được bảng thì trả về true
      if (await solve(board, checkRandom)) {
        return true;
      }
      board[row][col] = 0;
    }
  }
  // Nếu không có giá trị nào phù hợp thì trả về false
  return false;
}
// Hàm tìm ô trống có ít lựa chọn nhất
function findEmptySpot(board) {
  // Khởi tạo số lựa chọn nhỏ nhất và ô trống
  let minOptions = 10;
  let minSpot = null;
  // Lặp qua từng ô trong bảng
  // Tìm số lựa chọn của ô trống nhỏ nhất
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      // Nếu ô trống
      if (board[i][j] === 0) {
        // Tìm số lựa chọn của ô trống
        let options = findOptions(board, i, j);
        // Nếu số lựa chọn nhỏ hơn số lựa chọn nhỏ nhất thì cập nhật lại
        if (options.length < minOptions) {
          minOptions = options.length;
          minSpot = [i, j];
        }
      }
    }
  }
  // Trả về ô trống có ít lựa chọn nhất
  return minSpot;
}
// Hàm tìm các lựa chọn của ô trống
function findOptions(board, row, col) {
  let options = [];
  // Thử từng giá trị từ 1 đến 9
  for (let num = 1; num <= 9; num++) {
    // Nếu giá trị thử này phù hợp với ràng buộc thì thêm vào mảng lựa chọn
    if (isValid(board, row, col, num)) {
      options.push(num);
    }
  }
  // Trả về mảng lựa chọn
  return options;
}
// Hàm kiểm tra giá trị của ô có phù hợp với ràng buộc không
function isValid(board, row, col, num) {
  // Kiểm tra hàng và cột
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }
  // Kiểm tra ô trong vùng 3x3
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  // Nếu không có vấn đề gì thì trả về true
  return true;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function removeCells(board) {
  const numToRemove = Math.floor(Math.random() * (81 - 40) + 40); // Số ô cần loại bỏ
  const emptyCells = []; // Lưu trữ vị trí của các ô trống
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      emptyCells.push([i, j]);
    }
  }
  shuffle(emptyCells); // Xáo trộn vị trí của các ô trống
  for (let i = 0; i < numToRemove; i++) {
    const [row, col] = emptyCells[i];
    board[row][col] = 0;
  }
}

async function randomSudoku() {
  // Dừng đếm thời gian
  clearInterval(interval);
  // Đặt lại giá trị của bảng Sudoku
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
  await solve(board, false);
  removeCells(board);
  setGame();
}
