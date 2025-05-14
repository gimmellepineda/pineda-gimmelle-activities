function login() {
    const username = $('#username').val();
    const password = $('#password').val();

    if (!username || !password) {
        $("#message")
            .text("Please enter both username and password")
            .css("color", "red")
            .removeClass("d-none");
        return;
    }
 
    $.ajax({
        url: '/check-user',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password }),
        success: function(response) {
            if (response.success === true) {
                $("#message")
                    .text("Success")
                    .css("color", "green")
                    .removeClass("d-none");
                    
                window.location.href = "/dashboard";
            } else {
                $("#message")
                    .text("Invalid username or password")
                    .css("color", "red")
                    .removeClass("d-none");
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            $("#message")
                .text("Invalid username or password.")
                .css("color", "red")
                .removeClass("d-none");
        }
    }); 
}
function register() {
    const username = $('#username').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirm_password').val();

    // Clear previous error messages
    $('#message').text('').removeClass('d-block').addClass('d-none');

    // Validate inputs
    if (!username || !password || !confirmPassword) {
        $('#message').text('Please fill in all fields').removeClass('d-none').addClass('d-block');
        return;
    }

    if (password !== confirmPassword) {
        $('#message').text('Passwords do not match').removeClass('d-none').addClass('d-block');
        return;
    }

    // Send registration request
    $.ajax({
        url: '/register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password }),
        success: function(response) {
            if (response.success) {
                alert('Registration successful! Please login.');
                window.location.href = '/';
            } else {
                $('#message').text(response.message).removeClass('d-none').addClass('d-block');
            }
        },
        error: function(xhr, status, error) {
            $('#message').text('Error during registration: ' + error).removeClass('d-none').addClass('d-block');
        }
    });
}

function clearRegisterForm() {
    $('#reg_username').val('');
    $('#reg_password').val('');
    $('#confirm_password').val('');
    $('#register_message').text('');
}