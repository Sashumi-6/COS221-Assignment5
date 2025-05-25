document.addEventListener('DOMContentLoaded', function(){
    const signupForm = document.getElementById('signup-container');

    signupForm.addEventListener('signup-button', function(event){
        event.preventDefault(); //prevents default form submission

        if(validateForm()){
            submitForm();
        }

    });
});

function validateForm(){
    const name = document.getElementById('name-input').value.trim();
    const username = document.getElementById('username-input').value.trim();
    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value;
    const type = document.getElementById('user-type').value;
    const errorEl = document.getElementById('signup-error');

    errorEl.textContent = '';

    if(!name || !username || !email || !password || !type){
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