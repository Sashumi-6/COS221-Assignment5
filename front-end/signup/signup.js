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
    
}