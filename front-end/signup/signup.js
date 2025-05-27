document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-container');
    const goBackButton = document.getElementById('goback-button');

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        if (validateForm()) {
            submitForm();
        }
    });
});

function validateForm() {
    const fname = document.getElementById('name-input').value.trim();
    const surname = document.getElementById('surname-input').value.trim();
    const username = document.getElementById('username-input').value.trim();
    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value;
    const type = document.getElementById('user-type').value;
    const errorEl = document.getElementById('signup-error');

    errorEl.textContent = '';

    if (!fname || !surname || !username || !email || !password || !type) {
        errorEl.textContent = 'Please fill out all fields.';
        return false;
    }

    const emRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emRegex.test(email)) {
        errorEl.textContent = 'Invalid email format.';
        return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!passwordRegex.test(password)) {
        errorEl.textContent = 'Password must be 8+ chars with upper/lowercase, digit & symbol.';
        return false;
    }

    return true;
}

function submitForm() {
    const data = {
        type: "Register",
        name: document.getElementById('name-input').value.trim(),
        surname: document.getElementById('surname-input').value.trim(),
        username: document.getElementById('username-input').value.trim(),
        email: document.getElementById('email-input').value.trim(),
        password: document.getElementById('password-input').value,
        user_type: document.getElementById('user-type').value
    };

    ajaxRequest(data)
        .done(function (response) {
            if (response.status === 'success') {
                const userType = response.data.userType;
                sessionStorage.setItem('apikey', response.data.apikey);
                sessionStorage.setItem('userType', userType);

                if (userType === 'Admin') {
                    window.location.href = '../admin/admin.html';
                } else {
                    window.location.href = '../index.html';
                }
            } else {
                document.getElementById('signup-error').textContent = response.data || 'Signup failed.';
            }
        })
        .fail(function (xhr) {
            let errorMsg = 'An error occurred while signing up.';

            if (xhr.responseText) {
                try {
                    const json = JSON.parse(xhr.responseText);
                    if (json.message) {
                        errorMsg = json.message;
                    } else if (json.data) {
                        errorMsg = json.data;
                    }
                } catch (e) {
                    console.warn('Response was not valid JSON:', xhr.responseText);
                    // Keep default errorMsg
                }
            }

            document.getElementById('signup-error').textContent = errorMsg;
        });

}

function ajaxRequest(input) {
    const username = "u24845061", password = "Carbon123 ";
    return $.ajax({
        url: "https://wheatley.cs.up.ac.za/u24772756/HA/api.php",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: JSON.stringify(input)
    });
}
