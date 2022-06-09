'use strict';

const message = document.querySelector('.message');
const count = document.querySelector('.score');
const highscore = document.querySelector('.highscore');
const number = document.querySelector('.number');
const guess = document.querySelector('.guess');
// guess.value = '12'

const randomNumberGenerator = function() {
    return Math.floor(Math.random()*20-1);
}
let randomNum = randomNumberGenerator();
let countToDecrease = Number(count.innerHTML);
let highestScore = Number(highscore.innerHTML);
document.querySelector('.check').addEventListener('click', function(e) {
    e.preventDefault();
    const toGuessNumber = randomNum;
    const guessedNumber = Number(guess.value);
    if(guessedNumber < 1 || guessedNumber > 20) {
        console.log('Enter Valid number between 1 to 20');
        return;
    }
    if(toGuessNumber === guessedNumber) {
        message.innerHTML = 'Winner!!!!!!!'
        count.innerHTML = 20;
        if(highestScore < countToDecrease) {
            highscore.innerHTML = countToDecrease;
        }
        document.querySelector('body').style.backgroundColor = '#60b347';
        number.innerHTML = randomNum;
    } else if(toGuessNumber > guessedNumber) {
        countToDecrease--;
        message.innerHTML = 'Too Low!'
        count.innerHTML = countToDecrease;
    } else if(toGuessNumber < guessedNumber) {
        countToDecrease--;
        message.innerHTML = 'Too High!'
        count.innerHTML = countToDecrease;
    }
});
document.querySelector('.again').addEventListener('click', function(e) {
    e.preventDefault();
    message.innerHTML = 'Start guessing...';
    document.querySelector('body').style.backgroundColor = '#222';  
    count.innerHTML = '20';
    highscore.innerHTML = '0';
    guess.innerHTML = '';
    randomNum = randomNumberGenerator();
    number.innerHTML = '?';
})