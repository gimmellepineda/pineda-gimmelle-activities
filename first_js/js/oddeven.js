function oddEven() {
    const inputValue = document.getElementById('oddeven').value;
    const number = parseInt(inputValue);

    if (isNaN(number)) {
        document.getElementById('message').textContent = "Please enter a valid number!";
        return;
    }

    if (number % 2 === 0) {
        document.getElementById('message').textContent = "Even";
    } else {
        document.getElementById('message').textContent = "Odd";
    }
}