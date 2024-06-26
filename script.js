const gameBoard = document.getElementById('game-board');
const boardSize = 10; // 10x10 board

// Initialize game board
function createBoard() {
  gameBoard.innerHTML = '';
  for (let row = 0; row < boardSize; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    for (let col = 0; col < boardSize; col++) {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'cell';
      cellDiv.dataset.row = row;
      cellDiv.dataset.col = col;
      rowDiv.appendChild(cellDiv);
    }
    gameBoard.appendChild(rowDiv);
  }
}

// Start game function
function startGame() {
  createBoard();
  // Example: place a ship at row 2, col 3 of length 3 horizontally
  placeShip(2, 3, 3, true);
  // Add more game logic here (e.g., handling clicks)
}

// Place ship function (example)
function placeShip(row, col, length, horizontal) {
  for (let i = 0; i < length; i++) {
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col + (horizontal ? i : 0)}']`);
    if (cell) {
      cell.classList.add('ship');
    }
  }
}

// Add event listeners for shooting
gameBoard.addEventListener('click', (event) => {
  if (event.target.classList.contains('cell')) {
    handleShot(event.target);
  }
});

function handleShot(cell) {
  if (cell.classList.contains('ship')) {
    cell.classList.add('hit');
  } else {
    cell.classList.add('miss');
  }
}

startGame();
