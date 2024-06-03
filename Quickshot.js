// Variables
let score = 0;
let lives = 5;
let timerStarted = false;
let timerInterval;
const gameContainer = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameOverDisplay = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');
const playButton = document.getElementById('play-button');
const homepage = document.getElementById('homepage');
const gameWrapper = document.getElementById('game-container');
let currentTarget = null;
let targetTimeout;
let timeLeft = 300;
const timerDisplay = document.getElementById('timer');

// Function to generate random coordinates
function getRandomPosition(targetSize) {
    const gameWidth = window.innerWidth;
    const gameHeight = window.innerHeight;

    const posX = Math.random() * (gameWidth - targetSize);
    const posY = Math.random() * (gameHeight - targetSize);

    return { x: posX, y: posY };
}

// Function to create a target
function createTarget() {
    // Remove current target if exists
    if (currentTarget) {
        currentTarget.remove();
    }

    const target = document.createElement('div');
    target.className = 'target';

    const targetSize = 30 + Math.random() * 70; // Target size between 30px and 100px
    target.style.width = `${targetSize}px`;
    target.style.height = `${targetSize}px`;

    const isRed = Math.random() < 0.8; // 80% chance for red, 20% for blue
    if (isRed) {
        target.classList.add('red');
        target.addEventListener('click', () => {
            if (!timerStarted) {
                startTimer();
                timerStarted = true;
            }
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            clearTimeout(targetTimeout); // Clear the timeout if clicked
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
            clearTimeout(targetTimeout); // Clear the timeout if clicked
            target.remove();
            createTarget();
            if (lives <= 0) {
                gameOver();
            }
        });
    }

    const pos = getRandomPosition(targetSize);
    target.style.left = `${pos.x}px`;
    target.style.top = `${pos.y}px`;

    gameContainer.appendChild(target);
    currentTarget = target;

    // Set timeout to remove target if not clicked within 2 seconds
    targetTimeout = setTimeout(() => {
        target.remove();
        createTarget();
    }, 2000);
}

// Function to handle game over
function gameOver() {
    gameOverDisplay.style.display = 'block';
    gameContainer.style.pointerEvents = 'none'; // Disable clicking targets
    clearInterval(timerInterval); // Stop the timer
    if (currentTarget) {
        currentTarget.remove(); // Remove the current target
    }
    clearTimeout(targetTimeout); // Clear the timeout for target creation
}

// Function to reset the game
function resetGame() {
    score = 0;
    lives = 5;
    timeLeft = 300;
    timerStarted = false;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    timerDisplay.textContent = formatTime(timeLeft);
    gameOverDisplay.style.display = 'none';
    gameContainer.style.pointerEvents = 'auto'; // Enable clicking targets
    createTarget();
}

// Function to format the time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to update the timer
function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
        gameOver();
    }
}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

// Event listener for the play button
playButton.addEventListener('click', () => {
    homepage.style.display = 'none';
    gameWrapper.style.display = 'block';
    resetGame();
});

// Event listener for the restart button
restartButton.addEventListener('click', resetGame);

// Initial setup
timerDisplay.textContent = formatTime(timeLeft);
