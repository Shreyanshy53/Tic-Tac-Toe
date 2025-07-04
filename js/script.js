'use strict'

const statusDisplay = document.getElementById('status')
const countField = document.getElementById('numberTurns')
const startBox = document.getElementById('startBox')
const playField = document.getElementById('field')
const player1_name = document.getElementById('player1_name')
const player2_name = document.getElementById('player2_name')
const player1 = document.getElementById('player1')
const player2 = document.getElementById('player2')

let gameActive = true
let currentPlayer = 'X'
let gameState = []
let cols, rows, steps, counter = 0

const winnMessage = () => `${currentPlayer} has won!`
const nobodyWinsMessage = () => `It's a draw!`

let checkInput = (input) => {
    input = +input
    input = (input < 3) ? 3 : (input > 10) ? 10 : input
    return input
}

let createMatrix = () => {
    for (let i = 0; i < rows; i++) {
        gameState[i] = []
        for (let j = 0; j < cols; j++) {
            gameState[i][j] = 0
        }
    }
}

let drawField = () => {
    let cellSize = Math.min(window.innerHeight, window.innerWidth) * 0.6 / cols
    let box = document.createElement('div')
    box.setAttribute('id', 'container')

    for (let i = 0; i < rows; i++) {
        let row = document.createElement('div')
        row.className = 'row'
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('div')
            cell.setAttribute('id', `${i}_${j}`)
            cell.className = 'cell'
            cell.style.width = cell.style.height = cell.style.lineHeight = `${cellSize}px`
            cell.style.fontSize = `${cellSize / 12}em`
            row.appendChild(cell)
        }
        box.appendChild(row)
    }
    playField.appendChild(box)
}

let handleStart = () => {
    player1.innerHTML = player1_name.value === '' ? "Player 'X'" : player1_name.value
    player2.innerHTML = player2_name.value === '' ? "Player 'O'" : player2_name.value
    cols = checkInput(document.getElementById('columns').value)
    rows = checkInput(document.getElementById('rows').value)
    steps = checkInput(document.getElementById('steps').value)
    createMatrix()
    drawField()
    startBox.className = 'hidden'
    handlePlayerSwitch()
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleClick))
}

let isWinning = (y, x) => {
    let winner = currentPlayer === 'X' ? 1 : 2,
        length = steps * 2 - 1,
        radius = steps - 1,
        countWinnMoves, winnCoordinates

    const directions = [
        { dy: 0, dx: 1 },
        { dy: 1, dx: 0 },
        { dy: 1, dx: 1 },
        { dy: 1, dx: -1 }
    ]

    for (let { dy, dx } of directions) {
        countWinnMoves = 0
        winnCoordinates = []
        for (let k = 0; k < length; k++) {
            let i = y - radius + dy * k
            let j = x - radius + dx * k
            if (i >= 0 && i < rows && j >= 0 && j < cols &&
                gameState[i][j] === winner && gameActive) {
                winnCoordinates[countWinnMoves++] = [i, j]
                if (countWinnMoves === steps) {
                    winnActions(winnCoordinates)
                    return
                }
            } else {
                countWinnMoves = 0
                winnCoordinates = []
            }
        }
    }
}

let handlePlayerSwitch = () => {
    if (currentPlayer === 'X') {
        player1.style.background = '#8458B3'
        player2.style.background = '#d0bdf4'
    } else {
        player1.style.background = '#d0bdf4'
        player2.style.background = '#8458B3'
    }
}

let isMovesLeft = () => {
    if (counter === cols * rows) {
        statusDisplay.innerHTML = nobodyWinsMessage()
        gameActive = false
    }
}

let handleClick = (event) => {
    let [i, j] = event.target.getAttribute('id').split('_').map(Number)
    if (gameState[i][j] !== 0 || !gameActive) return

    gameState[i][j] = (currentPlayer === 'X') ? 1 : 2
    event.target.innerHTML = currentPlayer
    countField.innerHTML = `${++counter}`
    isWinning(i, j)
    isMovesLeft()
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X'
    handlePlayerSwitch()
}

function winnActions(winner) {
    gameActive = false
    statusDisplay.innerHTML = winnMessage()
    statusDisplay.style.color = '#139de2'
    for (let [i, j] of winner) {
        document.getElementById(`${i}_${j}`).style.color = '#139de2'
    }
}

let handlePlayAgain = () => {
    gameActive = true
    currentPlayer = 'X'
    counter = 0
    countField.innerHTML = '0'
    statusDisplay.innerHTML = ''
    statusDisplay.style.color = 'black'
    player1.style.background = player2.style.background = '#d0bdf4'
    playField.removeChild(document.getElementById('container'))
    handleStart()
}

let handleRestart = () => {
    gameActive = true
    currentPlayer = 'X'
    counter = 0
    countField.innerHTML = '0'
    statusDisplay.innerHTML = ''
    statusDisplay.style.color = 'black'
    player1.style.background = player2.style.background = '#d0bdf4'
    player1_name.value = player2_name.value = ''
    player1.innerHTML = player2.innerHTML = '-'
    startBox.className = 'sidebar'
    playField.removeChild(document.getElementById('container'))
}

document.querySelector('#start').addEventListener('click', handleStart)
document.querySelector('#playAgain').addEventListener('click', handlePlayAgain)
document.querySelector('#restart').addEventListener('click', handleRestart)
