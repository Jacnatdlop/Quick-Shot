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

function getRandomPosition(targetSize) {
    const gameWidth = gameContainer.clientWidth; // Use clientWidth of gameContainer
    const gameHeight = gameContainer.clientHeight; // Use clientHeight of gameContainer

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
            clearTimeout(targetTimeout); 
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

    const patterns = ['pattern1', 'pattern2'];
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    target.classList.add(randomPattern);

    const movementPatterns = ['moving-square', 'moving-circle', 'moving-triangle', 'moving-zigzag'];
    if (Math.random() < 0.5) {
        const movementClass = movementPatterns[Math.floor(Math.random() * movementPatterns.length)];
        target.classList.add('moving', movementClass);

        const moveSpeed = (Math.random() * 1 + 1) + 's'; 
        target.style.setProperty('--move-speed', moveSpeed);
    }

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
    if (currentTarget) {
        currentTarget.remove(); 
    }
    clearTimeout(targetTimeout); 
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

playButton.addEventListener('click', () => {
    homepage.style.display = 'none';
    gameWrapper.style.display = 'block';
    resetGame();
});

document.addEventListener('DOMContentLoaded', function() {
    const aboutButton = document.getElementById('about-button');
    const aboutSection = document.getElementById('about-section');
    const closeAboutButton = document.getElementById('close-about-button');

    aboutButton.addEventListener('click', function() {
        aboutSection.style.display = 'block';
    });

    closeAboutButton.addEventListener('click', function() {
        aboutSection.style.display = 'none';
    });
});

restartButton.addEventListener('click', resetGame);

timerDisplay.textContent = formatTime(timeLeft);
