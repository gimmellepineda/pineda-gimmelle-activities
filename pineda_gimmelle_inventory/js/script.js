function checkUser() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let message = document.getElementById("message");

    if (username === "pineda" && password === "gimmelle123") {
        message.style.color = "green";
        message.textContent = "Login successful!";
        setTimeout(() => {
            window.location.href = "inventory.html"; 
        }, 1000);
    } else {
        message.style.color = "red";
        message.textContent = "Invalid username or password";
    }
}
