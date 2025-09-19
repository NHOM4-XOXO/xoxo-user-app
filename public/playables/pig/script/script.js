'use strict';

// selecting element 
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.querySelector('#score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNewEl = document.querySelector('.btn--new');
const btnRollEl = document.querySelector('.btn--roll');
const btnHoldEl = document.querySelector('.btn--hold');

let scores, currentScore, activePlayer, playing;

// Starting score - một đoạn mã để tái sd 
const init = function () {
    scores = [0, 0];
    currentScore = 0; // Current score to be is outside, bz when click btnRoll currentscore cant restart = 0 
    activePlayer = 0; // activePlayer = 0 tức là player 1 trong thực tế , activePlayer = 1 tức là player 2 trong thực tế 
    playing = true; // lưu trạng thái player 

    current0El.textContent = 0;
    current1El.textContent = 0;
    score0El.textContent = 0;
    score1El.textContent = 0;

    player0El.classList.add('player--active');
    player1El.classList.remove('player--active');
    player0El.classList.remove('player--winner');
    player1El.classList.remove('player--winner');
    diceEl.classList.add('hidden');
};
init();


// switches player 
const switchPlayer = function () {
    document.querySelector(`#current--${activePlayer}`).textContent = 0; //reset current score current player = 0 
    currentScore = 0; // make sure current score = 0 
    activePlayer = activePlayer === 0 ? 1 : 0;  //switch to next player 

    player0El.classList.toggle('player--active');
    player1El.classList.toggle('player--active');
}

// Rolling dice function 
btnRollEl.addEventListener('click', function () {
    if (playing) {
        // 1. Generating a random dice roll
        const dice = Math.trunc(Math.random() * 6) + 1;
        // console.log(dice);

        // 2. Display dice
        diceEl.classList.remove('hidden');
        diceEl.src = `upload/dice-${dice}.png`;

        // 3. Check for rolled1:
        if (dice !== 1) {
            // Add dice to current score 
            currentScore += dice;
            document.getElementById(`current--${activePlayer}`).textContent = currentScore;
        }
        else {
            //switch to next player 
            switchPlayer();
        }
    }
})

// Button Hold 
btnHoldEl.addEventListener('click', function () {
    if (playing) {
        // 1. Add current score to active player's score
        scores[activePlayer] += currentScore;
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

        // 2. check score , if player's score is >= 100 
        if (scores[activePlayer] >= 100) {
            playing = false;
            // Finish the game 
            document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
            document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
            currentScore = 0;
            diceEl.classList.add('hidden');

        } else {
            // 3. Swith the next player 
            switchPlayer();
        }
    }

})

// gán callback, chỉ chạy chi click btnNewEl
btnNewEl.addEventListener('click', init) 