'use strict';
// Selecting Elements & veriable declearation
const player1Section = document.querySelector('.player--0');
const player2Section = document.querySelector('.player--1');
const diceImg = document.querySelector('.dice');
let currentScore, activePlayer, playing;

// Functions
const startGame = function() {
    document.querySelector('#score--0').textContent = 0;
    document.querySelector('#score--1').textContent = 0;
    activePlayer = 0;
    currentScore = 0;
    playing = true;
    diceImg.classList.add('hidden');
    player1Section.classList.remove('player--winner');
    player2Section.classList.remove('player--winner');
    player1Section.classList.add('player--active');
    player2Section.classList.remove('player--active');
}

const randomNumberGenerator = function() {
    return Math.trunc(Math.random()*6 +1);
}

const switchPlayer = function () {
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    currentScore = 0;
    player1Section.classList.toggle('player--active');
    player2Section.classList.toggle('player--active');
}

const hold = function() {
    if(!playing) return;
    let score = document.getElementById(`score--${activePlayer}`).textContent
    score = Number(score) + currentScore;
    document.getElementById(`score--${activePlayer}`).textContent = score;
    if(score >= 100) {
        player1Section.classList.add('player--winner');
        player1Section.classList.remove('player--active');
        playing = false;
        return;
    }
    switchPlayer();
}

const rollDices = function() {
    if(!playing) return;
    const diceNumber = randomNumberGenerator();
    diceImg.classList.remove('hidden');
    diceImg.setAttribute('src', `dice-${diceNumber}.png`);
    if(diceNumber === 1) {
        switchPlayer();
        return;
    }
    currentScore += diceNumber;
    document.getElementById(`current--${activePlayer}`).textContent = currentScore;
}

// Add Eventlistener to buttons
document.querySelector('.btn--roll').addEventListener('click', rollDices);

document.querySelector('.btn--hold').addEventListener('click', hold);

document.querySelector('.btn--new').addEventListener('click', startGame);

// STARTGAME
startGame();