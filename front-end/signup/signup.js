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

    const emRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
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

function submitForm(){
    const data = {
        type: "Register",
        name: document.getElementById('name-input').value.trim(),
        surname: document.getElementById('surname-input').value.trim(),
        username: document.getElementById('username-input').value.trim(),
        email: document.getElementById('email-input').value.trim(),
        password: document.getElementById('password-input').value,
        user_type: document.getElementById('user-selector').value
    };
    //TODO add api address
    fetch("https://", {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(async response=>{
        const contentType = response.headers.get("content-type");
        const isJson = contentType && contentType.includes("application/json");
        
        if (!response.ok) {
            // Response status is NOT 2xx (e.g. 400, 409)
            let errorData = isJson ? await response.json() : { data: "An unknown error occurred." };
            throw new Error(errorData.data || 'Unknown server error');
        }
    
        // Handle 2xx responses
        return isJson ? response.json() : { status: "error", data: "Invalid JSON returned" };
    })
    .then(result =>{
      if (result.status === 'success') {
            //alert("Signup successful! Your API Key is: " + result.data.apikey);
            const userType = result.data.userType;

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
