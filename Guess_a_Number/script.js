'use strict';

// query selectors
const count = document.querySelector('.score');
const highscore = document.querySelector('.highscore');
const number = document.querySelector('.number');
const guess = document.querySelector('.guess');

// functions
const randomNumberGenerator = () => Math.trunc(Math.random()*20+1);
const messageToSet = msg => document.querySelector('.message').textContent = msg;
const msgAndColorToSet = (msg, color) => {
    messageToSet(msg);
    count.innerHTML = countToDecrease = 20;
    document.querySelector('body').style.backgroundColor = color;
}

// setting variables
let randomNum = randomNumberGenerator();
let countToDecrease = Number(count.innerHTML);
let highestScore = Number(highscore.innerHTML);

// event handlers
document.querySelector('.check').addEventListener('click', function() {
    const guessedNumber = Number(guess.value);
    if(guessedNumber < 1 || guessedNumber > 20) {
        console.log('Enter Valid number between 1 to 20');
        return;
    }
    if(randomNum === guessedNumber) {
        if(highestScore < countToDecrease) {
            highscore.innerHTML = countToDecrease;
        }
        msgAndColorToSet('Winner!!!!!!!', '#60b347');
        number.innerHTML = randomNum;
    } else {
        if(!(countToDecrease>1)) {
            msgAndColorToSet('💥 You lost the game!', '#222');
            return;
        }
        countToDecrease--;
        messageToSet((randomNum > guessedNumber) ? '📉 Too Low!' : '📈 Too High!');
        count.innerHTML = countToDecrease;
    }
});
document.querySelector('.again').addEventListener('click', function() {
    msgAndColorToSet('Start guessing...', '#222');
    guess.innerHTML = '';
    number.innerHTML = '?';
    randomNum = randomNumberGenerator();
})