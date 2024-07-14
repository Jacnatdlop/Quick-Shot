let score = 0;
let lives = 5;
let timerStarted = false;
let timerInterval;
const gameContainer = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const livesContainer = document.getElementById('lives-container');
const gameOverDisplay = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');
const playButton = document.getElementById('play-button');
const homepage = document.getElementById('homepage');
const gameWrapper = document.getElementById('game-container');
const pauseButton = document.getElementById('pause-button');
const timerDisplay = document.getElementById('timer');
let currentTarget = null;
let targetTimeout;
let timeLeft = 180; // Initial game time set to 3 minutes (180 seconds)
let paused = false;
let backgroundInterval;

const backgroundImages = [
    'Images/Range.jpg',
    'Images/Aimlabs.jpg',
    'Images/Acheron.png',
    'Images/Aim-Botz-CS2.jpg',
    'Images/Sumeru.png',
];

// Function to change background image randomly
function changeBackground() {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    gameWrapper.style.backgroundImage = `url(${backgroundImages[randomIndex]})`;
}

// Function to get a random position for the target within the game container
function getRandomPosition(targetSize) {
    const gameWidth = gameContainer.clientWidth;
    const gameHeight = gameContainer.clientHeight;

    const posX = Math.random() * (gameWidth - targetSize);
    const posY = Math.random() * (gameHeight - targetSize);

    return { x: posX, y: posY };
}

// Function to create a new target
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
            updateLivesDisplay();
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

// Function called when game is over
function gameOver() {
    gameOverDisplay.style.display = 'block';
    gameContainer.style.pointerEvents = 'none';
    clearInterval(timerInterval);
    if (currentTarget) {
        currentTarget.remove();
    }
    clearTimeout(targetTimeout);
    clearInterval(backgroundInterval);
}

// Function to reset the game
function resetGame() {
    paused = false;
    hidePauseMenu();
    score = 0;
    lives = 5;
    timeLeft = 180; // Reset time to 3 minutes (180 seconds)
    timerStarted = false;
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = formatTime(timeLeft);
    gameOverDisplay.style.display = 'none';
    gameContainer.style.pointerEvents = 'auto';
    updateLivesDisplay();
    createTarget();
    changeBackground();
    backgroundInterval = setInterval(changeBackground, 60000);
}

// Function to update lives display
function updateLivesDisplay() {
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('img');
        heart.src = 'Images/Heart.png';
        livesContainer.appendChild(heart);
    }
}

// Function to format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to update timer every second
function updateTimer() {
    if (!paused) {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            gameOver();
        }
    }
}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

// Event listener for play button to start the game
playButton.addEventListener('click', () => {
    homepage.style.display = 'none';
    gameWrapper.style.display = 'block';
    resetGame();
});

// Event listener for document ready
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

// Event listener for restart button to reset the game
restartButton.addEventListener('click', resetGame);

// Initialize timer display with 180 seconds (3 minutes)
timerDisplay.textContent = formatTime(timeLeft);

// Function to toggle pause/resume game
function togglePause() {
    paused = !paused;
    if (paused) {
        clearInterval(timerInterval);
        clearTimeout(targetTimeout);
        gameContainer.classList.add('paused');
        if (currentTarget) {
            currentTarget.classList.add('paused');
        }
    } else {
        startTimer();
        targetTimeout = setTimeout(() => {
            if (currentTarget) {
                currentTarget.remove();
            }
            createTarget();
        }, 2000);
        gameContainer.classList.remove('paused');
        if (currentTarget) {
            currentTarget.classList.remove('paused');
        }
    }
}

// Event listener for pause button to toggle pause/resume game
pauseButton.addEventListener('click', () => {
    togglePause();
    if (paused) {
        showPauseMenu();
    } else {
        hidePauseMenu();
    }
});

// Function to show pause menu
function showPauseMenu() {
    const pauseMenu = document.createElement('div');
    pauseMenu.id = 'pause-menu';
    pauseMenu.innerHTML = `
        <div class="pause-menu-item" onclick="resumeGame()">RESUME</div>
        <div class="pause-menu-item" onclick="resetGame()">RESTART</div>
        <div class="pause-menu-item" onclick="quitGame()">QUIT</div>
    `;
    gameWrapper.appendChild(pauseMenu);
}

// Function to hide pause menu
function hidePauseMenu() {
    const pauseMenu = document.getElementById('pause-menu');
    if (pauseMenu) {
        pauseMenu.remove();
    }
}

// Function to resume game from pause menu
function resumeGame() {
    hidePauseMenu();
    togglePause();
}

// Function to quit game and go back to homepage
function quitGame() {
    hidePauseMenu();
    clearInterval(backgroundInterval);
    clearInterval(timerInterval);
    clearTimeout(targetTimeout);
    gameWrapper.style.display = 'none';
    homepage.style.display = 'flex';
    homepage.style.justifyContent = 'center';
    homepage.style.alignItems = 'center';
    paused = false;
}
