document.addEventListener('DOMContentLoaded', function(){
    const signupForm = document.getElementById('signup-container');
    const goBackButton = document.getElementById('goback-button');

    signupForm.addEventListener('submit', function(event){
        event.preventDefault(); //prevents default form submission

        if(validateForm()){
            submitForm();
        }

    });

    goBackButton.addEventListener('click', function () {
        window.history.back();
    });
});

function validateForm(){
    const fname = document.getElementById('name-input').value.trim();
    const surname = document.getElementById('surname-input').value.trim();
    const username = document.getElementById('username-input').value.trim();
    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value;
    const type = document.getElementById('user-selector').value;
    const errorEl = document.getElementById('signup-error');

    errorEl.textContent = '';

    if(!fname ||!surname|| !username || !email || !password || !type){
        errorEl.textContent = 'Please fill out all fields.';
        return false;
    }

    const emRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
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
  const requestData = {
    type: "Register",
    name: document.getElementById('name-input').value.trim(),
    surname: document.getElementById('surname-input').value.trim(),
    username: document.getElementById('username-input').value.trim(),
    email: document.getElementById('email-input').value.trim(),
    password: document.getElementById('password-input').value,
    user_type: document.getElementById('user-selector').value
  };

  ajaxRequest(requestData)
    .done(function(response) {
      if (response.status === 'success') {
        // Save API key and userType
        sessionStorage.setItem('apikey', response.data.apikey);
        sessionStorage.setItem('userType', response.data.userType);

        // Redirect
        if (response.data.userType === 'Admin') {
          window.location.href = '../admin/admin.html';
        } else {
          window.location.href = '../index.html';
        }
      } else {
        document.getElementById('signup-error').textContent = response.data || 'Signup failed.';
      }
    })
    .fail(function(xhr) {
      let msg = 'An error occurred during signup.';
      if (xhr.status === 401) {
        msg = 'Unauthorized – check your credentials.';
      } else if (xhr.responseJSON?.data) {
        msg = xhr.responseJSON.data;
      }
      document.getElementById('signup-error').textContent = msg;
    });
}


function ajaxRequest(input) {
    const username = "u24845061", password = "Carbon123";
    return $.ajax({
        url: "https://wheatley.cs.up.ac.za/u24845061/COS221APITesting/api.php",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(username + ":" + password)
        },
        data: JSON.stringify(input)
    });
}
