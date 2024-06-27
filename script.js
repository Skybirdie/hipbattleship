const gameBoard = document.getElementById('game-board');
const boardSize = 10; // 10x10 board
const optionContainer = document.querySelector('.option-container');
const flipButton = document.querySelector('#flip-button');
const startButton = document.querySelector('#start-button');
const infoDisplay = document.querySelector('#info');
const turnDisplay = document.querySelector('#turn-display');

let angle = 0
// function flip() {
function flip() {
  const optionShips = Array.from(optionContainer.children)
    angle = angle === 0 ? 90 : 0
  optionShips.forEach(optionShip => optionShip.style.transform = 'rotate(${angle}deg)')
  // Example: place a ship at row 2, col 3 of length 3 horizontally
  placeShip(2, 3, 3, true);
  // Add more game logic here (e.g., handling clicks)
}

flipButton.addEventListener('click', flip)


// Initialize game board
function createBoard(color, user) {
    gameBoard.id = user
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

  createBoard('yellow', 'player')
  createBoard('red', 'computer')


//Creating Ships
class Ship {
    constructor(name, length) {
      this.name = name
      this.length = length
    }
}

const smallbird = new Ship('smallbird', 1)
const ttbird = new Ship('ttbird', 1)
const hummingbird = new Ship('hummingbird', 2)
const manatee = new Ship('manatee', 3)

const ships = [smallbird, ttbird, hummingbird, manatee]
let notDropped

function getValidity(allBoardCells, isHorizontal, startIndex, ship) {

   let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex : 
       width * width - shil.length : 
       //handle vertical
   startIndex <= width * width - width * ship.length ? startIndex : 
       startIndex - ship.length * width + width
   let shipCells = []

   for (let row = 0; row < ship.length; row++) {
       if (isHorizontal) {
        shipCells.push(allBoardCells[Number(validStart) + row])
       } else {
        shipCells.push(allBoardCells[Number(validStart) = row * width])
       } 
   }

       Let valid

       if (isHorizontal) {
           ship.Cells.every((_shipCell, index) => 
                valid = shipCell[0].id % width !== width - (shipCells.length - (index +1)))
       } else {
           shipCells.every((shipCell, index) =>
                valid = shipCells[0].id < 90 + (width * index + 1)
       }
   }

       const notTaken = shipCells.every(shipCell => !shipCell.classlist.contains('taken')}

       return {shipCells, valid, notTaken}

}



function addShipPiece(user, ship, startId) {
   const allBoardCells = document.querySelectorAll('#${user} div')
   let randomBoolean = Math.random() < 0.5
   let isHorizontal = user === 'player' ? angle === 0 : randomBoolean
   let randomStartIndex = (Math.floor(Math.random() * width * width)

   let startIndex = startId ? startId : randomStartIndex

   const {shipCells, valid, notTaken} = getValidity(allBoardCells, isHorizontal, startIndex, ship)

       if (valid && notTaken) {
           shipCells.forEach(shipCell => {
                shipCell.classlist.add(ship.name)
                shipCell.classlist.add('taken')
        }
       } else {
           if (user === 'computer') addShipPiece(user, ship, startId)
           if (user === 'player') notDropped = true
       }
   }
ships.forEach(ship => addShipPiece('computer', ship))


//drag player ships
let draggedShip
const optionShips = Array.from(optionContainer.children)
optionShips.forEach(optionShip => optionShip. addEventListener('dragstart', dragstart))

const allPlayerCells = document.querySelectorAll('#player div')
allPlayerCells.forEach(PlayerCell => {
       PlayerCell.addEventListener('dragover', dragover)
       PlayerCell.addEventListener('drop', dropShip)

function dragStart(e) {
    notDropped = false
    draggedShip = e.target
}
function dragOver(e) {
    e.preventDefault()
    const ship = ships[draggedShip.id]
    highlightArea(e.target.id)
}
function dropShip(e) {
    const startId = e.target.id
    const ship = ships[draggedShip.id]
    addShipPiece('player', ship, startId)
    if (!notDropped) {
        draggedShip.remove()
    }
}

// Add highlight
function highlightArea(startIndex, ship) {
     const allBoardCells = document.querySelectorAll('#player div')
     let isHorizontal = angle === o 

     const {shipCells, valid, notTaken} =getValidity(allBoardCells, isHorizontal, startIndex, ship)

     if (valid && notTaken) {
         shipBlocks.forEach(shipCell => {
             shipCell.classlist.add('hover')
             setTimeout(() => shipCell.classlist.remove('hover'), 500)
         })
     }
}

let gameOver = false
let playerTurn


// Start game function
function startGame() {
  if (playerTurn === undefined) {
    if (optinContainer.children.length != 0) {
        infoDisplay.textContent = 'Please place all your pieces first!'
         } else {
             const allBoardCells = document.querySelectorAll('#computer div')
             allBoardCells.forEach(cell => cell.addEventListener('click', handleClick))
            }
         playerTurn = true 
         turnDisplay.textContent = 'your move'
         infoDisplay.textContent = 'The game has started!'      
   }
}

startButton.addEventListener('click', startGame)

Let playerHits = []
Let computerHits = []
const playerSunkShips = []
const computerSunkShips = []

function handleClick(e) {
   if (!gameOver) {
       if (e.target.classList.container('taken')) {
          e.target.classList.add('boom')
          infoDisplay.textContent = 'You hit the enemy ship!'
          let classes = Array.from(e.target.classList)
          classes = classes.filter(className => className !== 'cell')
          classes = classes.filter(className => className !== 'boom')
          classes = classes.filter(className => className !== 'taken')
          playerHits.push(...classes)
          checkScore('player', playerHits, playerSunkShips)

      }
      if (e.target.classList.contain('taken')) {
          infoDisplay.textContent = 'nothing hit this time'
          e.target.classList.add('empty')
      }
      playerTurn = false
      const allBoardCells = document.querySelectorAll('#computer div')
      allBoardCells.forEach(cell => cell.replaceWith(cell.cloneNode(true)))
      setTimeout(computerGo, 3000)
   }
}


//define the computer go
function computerGo() {
       if (!gameOver) {
           turnDisplay.textContent = 'Enemy turn to play'
           infoDisplay.textContent = 'Enemy is thinking...'

           setTimeout(() => {
               let randomGo = Math.floor(Math.random() * width * width)
               const allBoardCells = document.querySelectorAll('#player div')  

               if (allBoardCells[randomGo].classList.contains('taken') &&
                   allBoardCells[randomGo].classList.contains('boom')
               } {
                   computerGo()
                   return
               } else if (
                   allBoardCells[randomGo].classList.contains('taken') &&
                   !allBoardCells[randomGo].classList.contains('boom')
               } {
                   allBoardCells[randomGo].classList.add('boom')
                   infoDisplay.textContent = 'The enemy hit your ship!'
                   let classes = Array.from(allBoardCells[randomGo].classList)
                   classes = classes.filter(className => className !== 'cell')
                   classes = classes.filter(className => className !== 'boom')
                   classes = classes.filter(className => className !== 'taken')
                   computerHits.push(...classes)
                   checkScore('computer', computerHits, computerSunkShips)
               } else if (
                   infoDisplay.textContent = 'nothing hit this time'
                   allBoardCells[randomGo].classList.add('empty')
               }
       }, 3000)
       setTimeout(() => {
               playerTurn = true 
               turnDisplay.textContent = "Your turn"  
               infoDisplay.textContent = 'Please make your play.'  
               const allBoardCells = document.querySelectorAll('#computer div')  
               allBoardCells.forEach(cell => cell.addEventListener('click', handleClick)  
        }, 6000)
    }
}

function checkScore(user, userHits, userSunkShips) {
    function checkShip(shipName, shipLength) {
        if (
            userHits.filter(storedShipName => storedShipName === shipName).length === shipLength
        ) {
            if(user === 'player') {
            infoDisplay.textContent = 'you sunk the enemy's ${shipName}!'
                playerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            if(user === 'computer') {
            infoDisplay.textContent = 'the enemy sunk your ${shipName}!'
                computerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            userSunkShips.push(shipName)
            
        }
    }

    checkShip('smallbird', 1)
    checkShip('ttbird', 1)
    checkShip('hummingbird', 2)
    checkShip('manatee', 3)

    if(playerSunkShips.length === 5) {
    infoDisplay.textContent = 'you sunk all enemy ships! YOU WIN!'
    }

    if(computerSunkShips.length === 5) {
    infoDisplay.textContent = 'the enemy has sunk all your ships... You lose!'
    }
}

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
