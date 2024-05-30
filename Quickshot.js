
let score = 0;
let lives = 5;
let timerStarted = false;
const gameContainer = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameOverDisplay = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');
let currentTarget = null;
let targetTimeout;
let timeLeft = 300;
const timerDisplay = document.createElement('div'); 


timerDisplay.id = 'timer';
document.body.appendChild(timerDisplay);


function getRandomPosition(targetSize) {
    const gameWidth = window.innerWidth;
    const gameHeight = window.innerHeight;

    const posX = Math.random() * (gameWidth - targetSize);
    const posY = Math.random() * (gameHeight - targetSize);

    return { x: posX, y: posY };
}


function createTarget() {
   
    if (currentTarget) {
        currentTarget.remove();
    }

    const target = document.createElement('div');
    target.className = 'target';

    const targetSize = 30 + Math.random() * 70; 
    target.style.width = `${targetSize}px`;
    target.style.height = `${targetSize}px`;

    const isRed = Math.random() < 0.8; 
    if (isRed) {
        target.classList.add('red');
        target.addEventListener('click', () => {
            if (!timerStarted) {
                startTimer();
                timerStarted = true;
            }
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            clearTimeout(targetTimeout);
            target.remove();
            createTarget();
        });
    } else {
        target.classList.add('blue');
        target.addEventListener('click', () => {
            if (!timerStarted) {
                startTimer();
                timerStarted = true;
            }
            lives--;
            livesDisplay.textContent = `Lives: ${lives}`;
            clearTimeout(targetTimeout); d
            target.remove();
            createTarget();
        });
    }

    const pos = getRandomPosition(targetSize);
    target.style.left = `${pos.x}px`;
    target.style.top = `${pos.y}px`;

    gameContainer.appendChild(target);
    currentTarget = target;


    targetTimeout = setTimeout(() => {
        target.remove();
        createTarget();
    }, 2000);
}

function gameOver() {
    gameOverDisplay.style.display = 'block';
    gameContainer.style.pointerEvents = 'none'; 
    clearInterval(timerInterval); 
}

function resetGame() {
    score = 0;
    lives = 5;
    timeLeft = 300;
    timerStarted = false;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    timerDisplay.textContent = formatTime(timeLeft);
    gameOverDisplay.style.display = 'none';
    gameContainer.style.pointerEvents = 'auto'; 
    createTarget();
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
        gameOver();
    }
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

restartButton.addEventListener('click', resetGame);

createTarget();
timerDisplay.textContent = formatTime(timeLeft);
