'use strict';

const rollDiceBtn = document.querySelector('.btn--roll');
const player1Score = document.querySelector('#score--0');
const player2Score = document.querySelector('#score--1');
const player1CurrentScore = document.querySelector('#current--0');
const player2CurrentScore = document.querySelector('#current--1');
const player1Section = document.querySelector('.player--0');
const player2Section = document.querySelector('.player--1');
const diceImg = document.querySelector('.dice');
// diceImg.style.display = 'none';

// let diceNumber;
// let currentScorePlayer1, currentScorePlayer2;
let currentScore, activePlayer;
const startGame = function() {
    player1Score.textContent = 0;
    player2Score.textContent = 0;
    activePlayer = 0;
    currentScore = 0;
}

startGame();

const switchPlayer = function () {
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    currentScore = 0;
    player1Section.classList.toggle('player--active');
    player2Section.classList.toggle('player--active');
}

const randomNumberGenerator = function() {
    return Math.trunc(Math.random()*6 +1);
}
rollDiceBtn.addEventListener('click', function() {
    const diceNumber = randomNumberGenerator()
    diceImg.setAttribute('src', `dice-${diceNumber}.png`);
    if(diceNumber === 1) {
        switchPlayer();
        return;
    }
    currentScore += diceNumber;
    document.getElementById(`current--${activePlayer}`).textContent = currentScore;
})