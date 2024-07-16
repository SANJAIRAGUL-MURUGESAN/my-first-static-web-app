const WORDS = ['APPLE', 'BRAVE', 'CRISP', 'DRINK', 'EAGLE', 'FAITH', 'GRACE', 'HEART', 'IDEAL', 'JOKER']; 
let WORD = WORDS[Math.floor(Math.random() * WORDS.length)]; 
console.log(WORD)
let currentGuess = '';
let currentRow = 0;
let gameEnded = false;

const board = document.querySelector('.board');
const keyboard = document.querySelector('.keyboard');
const messageDiv = document.getElementById('message');
const keyboardButtons = document.querySelectorAll('.keyboard button');


for (let i = 0; i < 30; i++) {
    const cell = document.createElement('div');
    board.appendChild(cell);
}

keyboard.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && !gameEnded) {
        const key = e.target.textContent;
        handleKeyPress(key);
    }
});

document.addEventListener('keydown', (e) => {
    if (!gameEnded && (e.key === 'Enter' || e.key === 'Backspace' || /^[a-zA-Z]$/.test(e.key))) {
        handleKeyPress(e.key);
    }
});

async function handleKeyPress(key) {
    if (key === 'Enter' || key === 'Enter'.toUpperCase()) {
        if (currentGuess.length === 5) {
            checkGuess();
            updateKeyboardColors();
            if (currentGuess === WORD) {
                await showMessage('Congratulations! You guessed the word!');
                gameEnded = true;
            } else if (currentRow === 5) {
                await showMessage(`Game over! The word was: ${WORD}`);
                gameEnded = true;
            } else {
                let atLeastOnePresent = false;
                currentGuess.split('').forEach(letter => {
                    if (WORD.includes(letter)) {
                        atLeastOnePresent = true;
                    }
                });
                if (atLeastOnePresent) {
                    currentGuess = '';
                    currentRow++;
                } else {
                    showMessage('Not in word list!');
                }
            }
        }else{
            showMessage('Not Enough Letters!')
        }
    } else if (key === 'Back' || key === 'Backspace') {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateBoard();
        }
    } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 5) {
        currentGuess += key.toUpperCase();
        updateBoard();
    }
}

function updateBoard() {
    const rowCells = Array.from(board.children).slice(currentRow * 5, (currentRow + 1) * 5);
    rowCells.forEach((cell, i) => {
        cell.textContent = currentGuess[i] || '';
        cell.classList.remove('correct', 'present', 'absent'); 
    });
}

function checkGuess() {
    const rowCells = Array.from(board.children).slice(currentRow * 5, (currentRow + 1) * 5);
    currentGuess.split('').forEach((letter, i) => {
        if (letter === WORD[i]) {
            rowCells[i].classList.add('correct');
        } else if (WORD.includes(letter)) {
            rowCells[i].classList.add('present');
        } else {
            rowCells[i].classList.add('absent');
        }
    });
}

function updateKeyboardColors() {
    keyboardButtons.forEach(button => {
        const letter = button.textContent;
        if (currentGuess.includes(letter)) {
            if(WORD.includes(letter)){
                if (currentGuess.indexOf(letter) === WORD.indexOf(letter)) {
                    button.classList.add('correct');
                } else if (currentGuess.indexOf(letter) != WORD.indexOf(letter)) {
                    button.classList.add('present');
                }
            }else{
                button.classList.add('absent');
            }
        }else{
            button.classList.remove('correct', 'present');
        }
    });
}

async function showMessage(message) {
    messageDiv.textContent = message;
    setTimeout(() => {
        messageDiv.textContent = ''; 
      }, 2000);
}

async function resetGame() {
    currentGuess = '';
    currentRow = 0;
    gameEnded = false;

    // Clear board cells and remove classes
    const allCells = Array.from(board.children);
    allCells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('correct', 'present', 'absent');
    });

    // Clear keyboard button classes
    keyboardButtons.forEach(button => {
        button.classList.remove('correct', 'present', 'absent');
    });

    // Generate a new random word
    WORD = WORDS[Math.floor(Math.random() * WORDS.length)];

}
