function ajaxRequest(input) {
    let username = "u24845061", password = "Carbon123";
    let settings = {
        url: "https://wheatley.cs.up.ac.za/u24845061/COS221APITesting/api.php",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: JSON.stringify(input),
    };

    return $.ajax(settings);
}

//Check if password valid
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

function loginFunction() {
    const username = $('#username-input').val().trim();
    const password = $('#password-input').val().trim();

    if (username === '' || password === '') {
        alert('Please enter both username and password.');
        return;
    }

    if (username.length <= 2) {
        alert('Please enter a username longer than 2 characters');
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

    ajaxRequest(requestData)
    .done(function (response) {
        if (response.status) {
            sessionStorage.setItem('apikey', response.data.apikey);
            sessionStorage.setItem('userType', response.data.userType);

            // Redirect based on userType
            if (response.data.userType === 'Admin') {
                window.location.href = 'admin/admin.html';
            } else {
                window.location.href = 'user/user.html';
            }
        } else {
            alert(response.data || 'Login failed.');
        }
    })
    .fail(function (xhr) {
        if (xhr.status === 401) {
            alert('Invalid username or password.');
        } else {
            alert('An error occurred during login.');
        }
    });
}

$(document).ready(function () {
    // Redirect to signup page on "Sign Up" button click
    $('#signup-button').click(function () {
        window.location.href = 'signup/signup.html';
    });

    // Handle login on "Login" button click
    $('#login-button').click(loginFunction);
});