/**
 * Flappy M - Custom Game Script
 * Integrated with Global SectionManager
 */

(function () {
  // 1. Safe Registration Logic
  // This ensures that the script doesn't crash if it loads before section-manager.js
  function registerWithManager() {
    if (window.sectionManager) {
      window.sectionManager.register(
        'container-flappym',
        () => {
          // Activate: What happens when the section is visible
          console.log('Flappy M: Active');
          // If the intro animation was running, make sure it stays running
          if (window.initFlappyGame && typeof window.startIntroM === 'function') {
            window.startIntroM();
          }
        },
        () => {
          // Deactivate: Kill loops and timers to save CPU/Battery
          console.log('Flappy M: Sleeping');
          if (window.stopFlappyProjectiles) {
            window.stopFlappyProjectiles();
          }
        }
      );
    } else {
      // Retry every 50ms until the manager is found
      setTimeout(registerWithManager, 50);
    }
  }

  registerWithManager();

  // 2. Main Game Initialization
  window.initFlappyGame = function () {
    'use strict';

    // Game configuration
    const gameConfig = {
      gravity: 0.068,
      jumpForce: -3,
      obstacleSpeed: 2,
      obstacleGap: 1800,
      maxObstacleSpeed: 4,
    };

    const gameOverScreen = document.getElementById('game-over');
    if (!gameOverScreen) return;

    // Elements
    const player = document.getElementById('player');
    const gameScreen = document.getElementById('game-screen');
    const gameContainer = document.getElementById('game-container');
    const gameInfo = document.getElementById('game-info');
    const scoreDisplay = document.getElementById('current-score');
    const topScoreDisplay = document.getElementById('top-score-value');
    const topScorerName = document.getElementById('top-scorer-name');
    const finalScoreDisplay = document.getElementById('final-score');
    const startBtn = document.getElementById('start-game');
    const restartBtn = document.getElementById('flappy-restart-btn');
    const countdownDisplay = document.getElementById('countdown');
    const leaderboardEntry = document.getElementById('leaderboard-entry');
    const submitBtn = document.getElementById('submit-initials');
    const resetInfo = gameOverScreen.querySelector('.reset-info');
    const dancingM = document.getElementById('dancing-m');
    const fallenMContainer = document.getElementById('fallen-m-container');
    const fallenM = document.getElementById('fallen-m');
    const finalScoreP = document.getElementById('final-score-p');
    const introM = document.getElementById('intro-m');

    // State
    const gameState = {
      isRunning: false,
      playerY: 150,
      playerVelocity: 0,
      obstacles: [],
      score: 0,
      topScore: 0,
      animationFrame: null,
      svgTimer: null,
      currentSvgIndex: 0,
      lastObstacleTime: 0,
      countdownTimer: null,
      inactivityTimer: null,
      currentLetterIndex: 0,
      letters: ['A', 'A', 'A'],
      isNewHighScore: false,
      isWaitingToStart: false,
      dancingMTimer: null,
      introMTimer: null,
    };

    const svgPaths = [
      'M26.8626 0L40.0039 23.9055L40.0065 23.9081L53.1451 0H65V50H54.0736V21.5064L40.0039 42.8649H39.716L25.7863 21.7191V50H15V0H26.8626Z',
      'M27.5837 0L40.6947 23.8804L40.6973 23.883L53.8056 0H65.633V33L69.25 36.5L73.25 40.5L65.633 48L54.7319 35.7157V21.4838L40.6947 42.82H40.4075L26.5099 21.6963V35.8219L12.25 48L6.75 40.5L15.7485 33V24.9738V0H27.5837Z',
      'M27.0833 0L40.1943 23.8804L40.1969 23.883L53.3052 0H65.1327V31.5H73.25L75.75 40H59.75L54.2315 34V21.4838L40.1943 42.82H39.9071L26.0095 21.6963V34L21.25 40H4.25L6.75 31.5H15.2481V0H27.0833Z',
      'M27.5838 0L40.6948 23.8804L40.6973 23.883L53.8057 0H65.6331V26L74.25 19.5L79.25 29.5L61.25 42.82L54.732 35.7157V21.4838L40.6948 42.82H40.4075L26.51 21.6963V35.8219L20.2497 42L0.75 26.883L7.74704 18.383L15.7485 24.9738V0H27.5838Z',
    ];

    const obstacleLabels = [
      'Strategy',
      'Experience',
      'Creative',
      'Media',
      'Platforms',
      'Performance Marketing',
      'Health',
      'Solutions',
      'Work',
      'Insights',
      'About',
      'Pharma & Medtech',
      'Health Providers',
      'Health Insurance',
      'Financial Services',
      'Retail',
      'Insights',
      'Our Leadership',
      'Careers',
      'Partnerships',
      'Contact us',
    ];

    // 1. Exportable STOP function (Sleep)
    window.pauseFlappyGame = function () {
      gameState.isRunning = false;
      cancelAnimationFrame(gameState.animationFrame);
      clearInterval(gameState.svgTimer);
      clearInterval(gameState.introMTimer);
      clearInterval(gameState.dancingMTimer);
      clearInterval(gameState.inactivityTimer);
      console.log('Flappy Engine: Sleeping (CPU Saved)');
    };

    // 2. Exportable RESUME function (Wake)
    window.resumeFlappyGame = function () {
      // Only resume if we aren't in the middle of a countdown or game over
      if (
        !gameState.isRunning &&
        !gameState.isWaitingToStart &&
        !gameOverScreen.classList.contains('show')
      ) {
        window.startIntroM(); // Restart the title screen animation
        console.log('Flappy Engine: Waking up');
      }
    };

    function updatePlayerSvg() {
      let svg = `<svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${svgPaths[gameState.currentSvgIndex]}" fill="white"/></svg>`;
      player.innerHTML = svg;
    }

    function animateSvg() {
      gameState.currentSvgIndex = (gameState.currentSvgIndex + 1) % svgPaths.length;
      updatePlayerSvg();
    }

    function prepareToStart() {
      stopIntroM();
      gameInfo.className = 'game-info hidden';
      gameContainer.className = 'active';
      leaderboardEntry.className = '';
      gameState.isNewHighScore = false;
      gameState.letters = ['A', 'A', 'A'];
      gameState.currentLetterIndex = 0;
      gameState.isWaitingToStart = true;
      gameOverScreen.className = 'show';
      gameOverScreen.querySelector('h3').style.display = 'none';
      finalScoreP.style.display = 'none';
      restartBtn.style.display = 'none';
      resetInfo.style.display = 'none';
      leaderboardEntry.style.display = 'none';
      countdownDisplay.textContent = 'Press SPACE to start';
    }

    function startCountdownForFirstGame() {
      gameState.isWaitingToStart = false;
      let countdownValue = 3;
      countdownDisplay.textContent = countdownValue;
      gameState.countdownTimer = setInterval(() => {
        countdownValue--;
        if (countdownValue > 0) {
          countdownDisplay.textContent = countdownValue;
        } else {
          countdownDisplay.textContent = 'GO!';
          clearInterval(gameState.countdownTimer);
          setTimeout(() => {
            countdownDisplay.textContent = '';
            gameOverScreen.className = '';
            gameOverScreen.querySelector('h3').style.display = '';
            finalScoreP.style.display = '';
            restartBtn.style.display = '';
            resetInfo.style.display = '';
            leaderboardEntry.style.display = '';
            startGame();
          }, 300);
        }
      }, 1000);
    }

    function startCountdown() {
      if (gameState.countdownTimer) return;
      gameOverScreen.querySelector('h3').style.display = 'none';
      restartBtn.style.display = 'none';
      finalScoreP.style.display = 'none';
      fallenMContainer.style.display = 'none';
      resetInfo.style.display = 'none';
      gameOverScreen.style.backgroundColor = 'transparent';
      gameState.playerY = 150;
      gameState.playerVelocity = 0;
      player.style.top = gameState.playerY + 'px';
      if (gameState.svgTimer) clearInterval(gameState.svgTimer);
      gameState.svgTimer = setInterval(animateSvg, 200);
      stopDancingM();
      if (gameState.inactivityTimer) {
        clearInterval(gameState.inactivityTimer);
        gameState.inactivityTimer = null;
        resetInfo.textContent = 'Auto-resets after 30 seconds';
      }
      let countdownValue = 3;
      countdownDisplay.textContent = countdownValue;
      gameState.countdownTimer = setInterval(() => {
        countdownValue--;
        if (countdownValue > 0) {
          countdownDisplay.textContent = countdownValue;
        } else {
          countdownDisplay.textContent = 'GO!';
          clearInterval(gameState.countdownTimer);
          setTimeout(() => {
            countdownDisplay.textContent = '';
            if (gameState.svgTimer) clearInterval(gameState.svgTimer);
            restartGame();
          }, 300);
        }
      }, 1000);
    }

    function handleKeydown(e) {
      if (e.key === ' ') {
        // If we are over the game section, prevent default scroll
        const rect = gameContainer.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          e.preventDefault();
          if (gameState.isWaitingToStart) startCountdownForFirstGame();
          else if (gameState.isRunning) jump();
          else if (
            gameOverScreen.classList.contains('show') &&
            !gameState.countdownTimer &&
            !gameState.isNewHighScore
          )
            startCountdown();
        }
      }
      if (gameState.isNewHighScore && leaderboardEntry.classList.contains('show')) {
        e.preventDefault();
        switch (e.key) {
          case 'ArrowLeft':
            changeLetterIndex(-1);
            break;
          case 'ArrowRight':
            changeLetterIndex(1);
            break;
          case 'ArrowUp':
            changeLetter(1);
            break;
          case 'ArrowDown':
            changeLetter(-1);
            break;
          case 'Enter':
            submitInitials();
            break;
        }
      }
    }

    function changeLetterIndex(direction) {
      document.getElementById(`letter-${gameState.currentLetterIndex}`).className =
        'initial-letter';
      gameState.currentLetterIndex = (gameState.currentLetterIndex + direction + 3) % 3;
      document.getElementById(`letter-${gameState.currentLetterIndex}`).className =
        'initial-letter active';
    }

    function changeLetter(direction) {
      let charCode = gameState.letters[gameState.currentLetterIndex].charCodeAt(0) + direction;
      if (charCode < 65) charCode = 90;
      if (charCode > 90) charCode = 65;
      gameState.letters[gameState.currentLetterIndex] = String.fromCharCode(charCode);
      document.getElementById(`letter-${gameState.currentLetterIndex}`).textContent =
        gameState.letters[gameState.currentLetterIndex];
    }

    function submitInitials() {
      stopDancingM();
      const initials = gameState.letters.join('');
      localStorage.setItem('flappyM-topScorer', initials);
      localStorage.setItem('flappyM-topScore', gameState.topScore);
      topScorerName.textContent = initials;
      topScoreDisplay.textContent = gameState.topScore;
      leaderboardEntry.className = '';
      gameState.isNewHighScore = false;
      restartBtn.style.display = '';
      countdownDisplay.textContent = '';
      startInactivityCountdown();
    }

    function handleTouch(e) {
      // Only handle if touching inside the game screen
      if (e.target.closest('#game-container') || e.target.closest('#game-info')) {
        if (
          gameState.isRunning ||
          gameState.isWaitingToStart ||
          (gameOverScreen.classList.contains('show') && !gameState.isNewHighScore)
        ) {
          e.preventDefault();
          if (gameState.isWaitingToStart) startCountdownForFirstGame();
          else if (gameState.isRunning) jump();
          else if (
            gameOverScreen.classList.contains('show') &&
            !gameState.countdownTimer &&
            !gameState.isNewHighScore
          )
            startCountdown();
        }
      }
    }

    function startGame() {
      Object.assign(gameState, {
        isRunning: true,
        playerY: 150,
        playerVelocity: 0,
        score: 0,
        obstacles: [],
        lastObstacleTime: Date.now(),
      });
      gameConfig.obstacleSpeed = 2;
      scoreDisplay.textContent = '0';
      gameScreen.querySelectorAll('.obstacle').forEach((el) => el.remove());
      gameState.svgTimer = setInterval(animateSvg, 200);
      gameLoop();
      setTimeout(createObstacle, 1200);
    }

    function restartGame() {
      if (gameState.countdownTimer) {
        clearInterval(gameState.countdownTimer);
        gameState.countdownTimer = null;
      }
      leaderboardEntry.className = '';
      gameState.isNewHighScore = false;
      countdownDisplay.textContent = '';
      gameOverScreen.className = '';
      gameOverScreen.style.backgroundColor = '';
      gameOverScreen.querySelector('h3').style.display = '';
      restartBtn.style.display = '';
      finalScoreP.style.display = '';
      resetInfo.style.display = '';
      startGame();
    }

    function jump() {
      gameState.playerVelocity = gameConfig.jumpForce;
    }

    function createObstacle() {
      if (!gameState.isRunning) return;
      const obstacle = document.createElement('div');
      obstacle.className = 'obstacle';
      obstacle.textContent = obstacleLabels[Math.floor(Math.random() * obstacleLabels.length)];
      const maxY = gameScreen.offsetHeight - 50,
        minY = 20;
      const randomY = Math.floor(Math.random() * (maxY - minY)) + minY;
      obstacle.style.left = gameScreen.offsetWidth + 'px';
      obstacle.style.top = randomY + 'px';
      gameScreen.appendChild(obstacle);
      gameState.obstacles.push({
        element: obstacle,
        x: gameScreen.offsetWidth,
        y: randomY,
        passed: false,
      });
    }

    function gameLoop() {
      if (!gameState.isRunning) return;
      gameState.playerVelocity += gameConfig.gravity;
      gameState.playerY += gameState.playerVelocity;

      if (gameState.playerY < 0) {
        gameState.playerY = 0;
        gameState.playerVelocity = 0;
      }
      if (gameState.playerY > gameScreen.offsetHeight - 60) {
        endGame();
        return;
      }
      player.style.top = gameState.playerY + 'px';

      if (Date.now() - gameState.lastObstacleTime > gameConfig.obstacleGap) {
        createObstacle();
        gameState.lastObstacleTime = Date.now();
      }

      for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
        const obs = gameState.obstacles[i];
        obs.x -= gameConfig.obstacleSpeed;
        obs.element.style.left = obs.x + 'px';

        if (!obs.passed && obs.x + obs.element.offsetWidth < 150) {
          obs.passed = true;
          gameState.score++;
          scoreDisplay.textContent = gameState.score;
          if (
            gameState.score % 10 === 0 &&
            gameConfig.obstacleSpeed < gameConfig.maxObstacleSpeed
          ) {
            gameConfig.obstacleSpeed += 0.2;
          }
        }

        if (checkCollision(obs)) {
          endGame();
          return;
        }
        if (obs.x < -200) {
          obs.element.remove();
          gameState.obstacles.splice(i, 1);
        }
      }
      gameState.animationFrame = requestAnimationFrame(gameLoop);
    }

    function checkCollision(obstacle) {
      const padding = 8;
      const pRect = {
        left: 150 + padding,
        right: 150 + 60 - padding,
        top: gameState.playerY + padding,
        bottom: gameState.playerY + 60 - padding,
      };
      const oRect = {
        left: obstacle.x,
        right: obstacle.x + obstacle.element.offsetWidth,
        top: obstacle.y,
        bottom: obstacle.y + obstacle.element.offsetHeight,
      };
      return !(
        pRect.right < oRect.left ||
        pRect.left > oRect.right ||
        pRect.bottom < oRect.top ||
        pRect.top > oRect.bottom
      );
    }

    function endGame() {
      gameState.isRunning = false;
      cancelAnimationFrame(gameState.animationFrame);
      clearInterval(gameState.svgTimer);
      finalScoreDisplay.textContent = gameState.score;
      gameOverScreen.className = 'show';
      gameOverScreen.querySelector('h3').style.display = '';
      finalScoreP.style.display = 'block';

      if (gameState.score > gameState.topScore) {
        gameState.topScore = gameState.score;
        topScoreDisplay.textContent = gameState.topScore;
        localStorage.setItem('flappyM-topScore', gameState.topScore);
        gameState.isNewHighScore = true;
        fallenMContainer.style.display = 'none';
        leaderboardEntry.className = 'show';
        restartBtn.style.display = 'none';
        startDancingM();
        gameState.letters = ['A', 'A', 'A'];
        gameState.currentLetterIndex = 0;
        for (let i = 0; i < 3; i++) {
          const lEl = document.getElementById(`letter-${i}`);
          if (lEl) {
            lEl.textContent = 'A';
            lEl.className = i === 0 ? 'initial-letter active' : 'initial-letter';
          }
        }
      } else {
        gameState.isNewHighScore = false;
        leaderboardEntry.className = '';
        restartBtn.style.display = '';
        fallenMContainer.style.display = 'block';
        fallenM.innerHTML = `<svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${svgPaths[gameState.currentSvgIndex]}" fill="#CDFF4E"/></svg>`;
        startInactivityCountdown();
      }
    }

    function startInactivityCountdown() {
      clearInterval(gameState.inactivityTimer);
      let countdown = 30;
      resetInfo.textContent = `Auto-resets in ${countdown} seconds`;
      gameState.inactivityTimer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          resetInfo.textContent = `Auto-resets in ${countdown} seconds`;
        } else {
          resetToTitleScreen();
        }
      }, 1000);
    }

    function startDancingM() {
      stopDancingM();
      let danceSvgIndex = 0;
      const updateDanceSvg = () => {
        danceSvgIndex = (danceSvgIndex + 1) % svgPaths.length;
        dancingM.innerHTML = `<svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${svgPaths[danceSvgIndex]}" fill="#CDFF4E"/></svg>`;
      };
      updateDanceSvg();
      gameState.dancingMTimer = setInterval(updateDanceSvg, 200);
    }

    function stopDancingM() {
      clearInterval(gameState.dancingMTimer);
      gameState.dancingMTimer = null;
      if (dancingM) dancingM.innerHTML = '';
    }

    window.startIntroM = function () {
      stopIntroM();
      let introSvgIndex = 0;
      const updateIntroSvg = () => {
        introSvgIndex = (introSvgIndex + 1) % svgPaths.length;
        introM.innerHTML = `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${svgPaths[introSvgIndex]}" fill="#CDFF4E"/></svg>`;
      };
      updateIntroSvg();
      gameState.introMTimer = setInterval(updateIntroSvg, 200);
    };

    function stopIntroM() {
      clearInterval(gameState.introMTimer);
      gameState.introMTimer = null;
    }

    function resetToTitleScreen() {
      window.stopFlappyProjectiles();
      gameInfo.className = 'game-info';
      gameContainer.className = '';
      gameOverScreen.className = '';
      fallenMContainer.style.display = 'none';
      resetInfo.textContent = 'Auto-resets after 30 seconds';
      countdownDisplay.textContent = '';
      Object.assign(gameState, {
        isRunning: false,
        isWaitingToStart: false,
        inactivityTimer: null,
        countdownTimer: null,
        svgTimer: null,
        dancingMTimer: null,
        introMTimer: null,
      });
      window.startIntroM();
    }

    function init() {
      const savedScore = localStorage.getItem('flappyM-topScore');
      const savedName = localStorage.getItem('flappyM-topScorer');
      if (savedScore) {
        gameState.topScore = parseInt(savedScore);
        topScoreDisplay.textContent = gameState.topScore;
      }
      if (savedName) {
        topScorerName.textContent = savedName;
      }

      updatePlayerSvg();
      window.startIntroM();

      startBtn.addEventListener('click', prepareToStart);
      restartBtn.addEventListener('click', startCountdown);
      submitBtn.addEventListener('click', submitInitials);
      document.addEventListener('keydown', handleKeydown);
      document.addEventListener('touchstart', handleTouch, { passive: false });
    }

    init();
  };
})();
