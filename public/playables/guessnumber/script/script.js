'use strict';


let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

const displayMessage = function (message) {
    document.querySelector('.message').textContent = message;
}

document.querySelector('.check').addEventListener('click', function () {
    const guess = Number(document.querySelector('.guess').value);
    console.log(guess, typeof guess);

    // When no input or input word
    if (!guess) {
        displayMessage('⭕️ No Number');
    }
    // When player win
    else if (guess === secretNumber) {
        displayMessage('🎉 Correct Number!');

        document.querySelector('body').style.backgroundColor = "#60b437";
        document.querySelector('.number').style.width = "30rem";
        document.querySelector('.number').textContent = secretNumber;

        if (score > highscore) {
            highscore = score;
            document.querySelector('.highscore').textContent = highscore;
        }
    }
    // when guess is wrong
    else if (guess !== secretNumber) {
        if (score > 0) {
            displayMessage(guess > secretNumber ? "📈 Too High" : "📉 To Low");
            score--;
            document.querySelector('.score').textContent = score;
        } else {
            displayMessage('💥 You lost the game');
            document.querySelector('.score').textContent = 0;
        }
    }
})

// Active Button Again 
document.querySelector('.again').addEventListener('click', function () {
    score = 20;
    secretNumber = Math.trunc(Math.random() * 20) + 1;
    displayMessage('Start guessing...');
    document.querySelector('body').style.backgroundColor = "#222";
    document.querySelector('.number').style.width = "15rem";
    document.querySelector('.number').textContent = '?';
    document.querySelector('.score').textContent = score;
    document.querySelector('.guess').value = '';
})