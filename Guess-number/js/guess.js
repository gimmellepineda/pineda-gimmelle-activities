const random = Math.floor(Math.random() * 100) + 1;
let tries = 5; 

function checkNumber() {
    const num = parseInt(document.getElementById('guess').value);
    const message = document.getElementById('message');
    const triesDisplay = document.getElementById('tries');
    const guessBtn = document.getElementById('guessBtn');

    if (tries > 0) {
        if (num === random) {
            message.innerHTML = "Correct! You guessed the number.";
            guessBtn.disabled = true; 
        } else if (num < random) {
            message.innerHTML = 'Higher!';
            tries--;
        } else if (num > random) {
            message.innerHTML = 'Lower!';
            tries--;
        }

        triesDisplay.innerHTML = `Tries: ${tries}`;

        if (tries <= 0) {
             message.innerHTML = `The number was ${random}.`;
            guessBtn.disabled = true;
        }
    }
}