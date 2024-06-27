const gamesBoardContainer = document.querySelector('#gamesboard-container');
const optionContainer = document.querySelector('.option-container');
const flipButton = document.querySelector('#flip-button');
const startButton = document.querySelector('#start-button');
const infoDisplay = document.querySelector('#info');
const turnDisplay = document.querySelector('#turn-display');

let angle = 0;
// Function to flip the ships
function flip() {
  const optionShips = Array.from(optionContainer.children);
  angle = angle === 0 ? 90 : 0;
  optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`);
}

flipButton.addEventListener('click', flip);

// Initialize game board
const width = 10; // 10x10 board
function createBoard(color, user) {
  const gameBoardContainer = document.createElement('div');
  gameBoardContainer.classList.add('game-board');
  gameBoardContainer.style.backgroundColor = color;
  gameBoardContainer.id = user;

  for (let i = 0; i < width * width; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.id = i;
    gameBoardContainer.append(cell);
  }
  gamesBoardContainer.append(gameBoardContainer);
}
createBoard('yellow', 'player');
createBoard('pink', 'computer');

// Creating Ships
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

const smallbird = new Ship('smallbird', 1);
const ttbird = new Ship('ttbird', 2);
const hummingbird = new Ship('hummingbird', 2);
const manatee = new Ship('manatee', 3);

const ships = [smallbird, ttbird, hummingbird, manatee];
let notDropped;

function getValidity(allBoardCells, isHorizontal, startIndex, ship) {
  let validStart = isHorizontal
    ? startIndex <= width * width - ship.length ? startIndex : width * width - ship.length
    : startIndex <= width * width - width * ship.length ? startIndex : startIndex - ship.length * width + width;

  let shipCells = [];

  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipCells.push(allBoardCells[Number(validStart) + i]);
    } else {
      shipCells.push(allBoardCells[Number(validStart) + i * width]);
    }
  }

  let valid = shipCells.every((shipCell, index) => {
    return isHorizontal
      ? shipCells[0].id % width !== width - (shipCells.length - (index + 1))
      : shipCells[0].id < 90 + (width * index + 1);
  });

  const notTaken = shipCells.every(shipCell => !shipCell.classList.contains('taken'));

  return { shipCells, valid, notTaken };
}

function addShipPiece(user, ship, startId) {
  const allBoardCells = document.querySelectorAll(`#${user} div`);
  let randomBoolean = Math.random() < 0.5;
  let isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
  let randomStartIndex = Math.floor(Math.random() * width * width);

  let startIndex = startId ? startId : randomStartIndex;

  const { shipCells, valid, notTaken } = getValidity(allBoardCells, isHorizontal, startIndex, ship);

  if (valid && notTaken) {
    shipCells.forEach(shipCell => {
      shipCell.classList.add(ship.name);
      shipCell.classList.add('taken');
    });
  } else {
    if (user === 'computer') addShipPiece(user, ship, startId);
    if (user === 'player') notDropped = true;
  }
}
ships.forEach(ship => addShipPiece('computer', ship));

// Drag player ships
let draggedShip;
const optionShips = Array.from(optionContainer.children);
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart));

const allPlayerCells = document.querySelectorAll('#player div');
allPlayerCells.forEach(playerCell => {
  playerCell.addEventListener('dragover', dragOver);
  playerCell.addEventListener('drop', dropShip);
});

function dragStart(e) {
  notDropped = false;
  draggedShip = e.target;
}
function dragOver(e) {
  e.preventDefault();
  const ship = ships[draggedShip.id];
  highlightArea(e.target.id, ship);
}
function dropShip(e) {
  const startId = e.target.id;
  const ship = ships[draggedShip.id];
  addShipPiece('player', ship, startId);
  if (!notDropped) {
    draggedShip.remove();
  }
}

function highlightArea(startIndex, ship) {
  const allBoardCells = document.querySelectorAll('#player div');
  let isHorizontal = angle === 0;

  const { shipCells, valid, notTaken } = getValidity(allBoardCells, isHorizontal, startIndex, ship);

  if (valid && notTaken) {
    shipCells.forEach(shipCell => {
      shipCell.classList.add('hover');
      setTimeout(() => shipCell.classList.remove('hover'), 500);
    });
  }
}

let gameOver = false;
let playerTurn;

// Start game function
function startGame() {
  if (playerTurn === undefined) {
    if (optionContainer.children.length !== 0) {
      infoDisplay.textContent = 'Please place all your pieces first!';
    } else {
      const allBoardCells = document.querySelectorAll('#computer div');
      allBoardCells.forEach(cell => cell.addEventListener('click', handleClick));
      playerTurn = true;
      turnDisplay.textContent = 'Your move';
      infoDisplay.textContent = 'The game has started!';
    }
  }
}

startButton.addEventListener('click', startGame);

let playerHits = [];
let computerHits = [];
const playerSunkShips = [];
const computerSunkShips = [];

function handleClick(e) {
  if (!gameOver) {
    if (e.target.classList.contains('taken')) {
      e.target.classList.add('boom');
      infoDisplay.textContent = 'You hit the enemy ship!';
      let classes = Array.from(e.target.classList);
      classes = classes.filter(className => className !== 'cell');
      classes = classes.filter(className => className !== 'boom');
      classes = classes.filter(className => className !== 'taken');
      playerHits.push(...classes);
      checkScore('player', playerHits, playerSunkShips);
    }
    if (!e.target.classList.contains('taken')) {
      infoDisplay.textContent = 'Nothing hit this time';
      e.target.classList.add('empty');
    }
    playerTurn = false;
    const allBoardCells = document.querySelectorAll('#computer div');
    allBoardCells.forEach(cell => cell.replaceWith(cell.cloneNode(true)));
    setTimeout(computerGo, 3000);
  }
}

// Define the computer's turn
function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = 'Enemy turn to play';
    infoDisplay.textContent = 'Enemy is thinking...';

    setTimeout(() => {
      let randomGo = Math.floor(Math.random() * width * width);
      const allBoardCells = document.querySelectorAll('#player div');

      if (allBoardCells[randomGo].classList.contains('taken') && allBoardCells[randomGo].classList.contains('boom')) {
        computerGo();
        return;
      } else if (allBoardCells[randomGo].classList.contains('taken') && !allBoardCells[randomGo].classList.contains('boom')) {
        allBoardCells[randomGo].classList.add('boom');
        infoDisplay.textContent = 'The enemy hit your ship!';
        let classes = Array.from(allBoardCells[randomGo].classList);
        classes = classes.filter(className => className !== 'cell');
        classes = classes.filter(className => className !== 'boom');
        classes = classes.filter(className => className !== 'taken');
        computerHits.push(...classes);
        checkScore('computer', computerHits, computerSunkShips);
      } else {
        infoDisplay.textContent = 'Nothing hit this time';
        allBoardCells[randomGo].classList.add('empty');
      }
    }, 3000);

    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = "Your turn";
      infoDisplay.textContent = 'Please make your play.';
      const allBoardCells = document.querySelectorAll('#computer div');
      allBoardCells.forEach(cell => cell.addEventListener('click', handleClick));
    }, 6000);
  }
}

function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if (userHits.filter(storedShipName => storedShipName === shipName).length === shipLength) {
      if (user === 'player') {
        infoDisplay.textContent = `You sunk the enemy's ${shipName}!`;
        playerHits = userHits.filter(storedShipName => storedShipName !== shipName);
      }
      if (user === 'computer') {
        infoDisplay.textContent = `The enemy sunk your ${shipName}!`;
        computerHits = userHits.filter(storedShipName => storedShipName !== shipName);
      }
      userSunkShips.push(shipName);
    }
  }

  checkShip('smallbird', 1);
  checkShip('ttbird', 2);
  checkShip('hummingbird', 2);
  checkShip('manatee', 3);

  if (playerSunkShips.length === ships.length) {
    infoDisplay.textContent = 'You sunk all enemy ships! YOU WIN!';
    gameOver = true;
  }

  if (computerSunkShips.length === ships.length) {
    infoDisplay.textContent = 'The enemy has sunk all your ships... You lose!';
    gameOver = true;
  }
}
