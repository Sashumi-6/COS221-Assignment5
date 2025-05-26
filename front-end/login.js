$(document).ready(function () {
    // Redirect to signup page on "Sign Up" button click
    $('#signup-button').click(function () {
        window.location.href = 'signup/signup.html';
    });

    // Handle login on "Login" button click
    $('#login-button').click(function () {
        const username = $('#username-input').val().trim();
        const password = $('#password-input').val().trim();

        if (username === '' || password === '') {
            alert('Please enter both username and password.');
            return;
        }

        if (!isValidPassword(password)) {
            alert('Password must be at least 8 characters long and include uppercase, lowercase, a number, and a symbol.');
            return;
        }
        // Construct the login request payload
        const requestData = {
            type: 'Login',
            username: username,
            password: password
        };

        $.ajax({
            //TODO replace with actual api url
            url: 'https://your-api-endpoint.com/api.php',
            type: 'POST',
            data: JSON.stringify(requestData),
            contentType: 'application/json',
            success: function (response) {
                if (response.status) {
                    // Save API key and user type to sessionStorage
                    sessionStorage.setItem('apikey', response.message.apikey);
                    sessionStorage.setItem('userType', response.message.userType);


                    // Redirect based on user type
                    if (response.message.userType === 'Admin') {
                        window.location.href = 'admin/admin.html';
                    } else {
                        window.location.href = 'user/user.html';
                    } 
                } else {
                    alert(response.message || 'Login failed.');
                }
            },
            error: function (xhr) {
                if (xhr.status === 401) {
                    alert('Invalid username or password.');
                } else {
                    alert('An error occurred during login.');
                }
            }
        });
    });

    function isValidPassword(password) {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password); // you can adjust symbol set as needed

        return (
            password.length >= minLength &&
            hasUppercase &&
            hasLowercase &&
            hasNumber &&
            hasSymbol
        );
    }

});
