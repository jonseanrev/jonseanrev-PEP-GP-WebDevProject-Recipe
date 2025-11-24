/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
let registerForm = document.getElementById('register-form');
let usernameInput = document.getElementById('username-input');
let emailInput = document.getElementById('email-input');
let passwordInput = document.getElementById('password-input');
let repeatPasswordInput = document.getElementById('repeat-password-input');
let registerButton = document.getElementById('register-button');
let errorMessage = document.getElementById('error-message');


let checkPass = () =>{
    //add any password checking to this method
    return (repeatPasswordInput.value === passwordInput.value)
}
let formValid = () =>{
    //make custom form validation checks here 
    if(!checkPass()){
        return false;
    }
    if(!registerForm.checkValidity()){
        return false;
    }
    return true;
}

//Prevent form from default submission and call processRegistration instead.
registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    processRegistration();
});

/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
// This is redundant because the form event listener already handles it.
// registerButton.addEventListener("click", processRegistration);

/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    console.log("processRegisteration() called");

    if(!formValid()){
        console.log("Form not valid");
        if(!checkPass()){
            errorMessage.textContent = "Passwords Must Match!"
        }else{
            errorMessage.textContent = "Form not Valid!";
        }
        errorMessage.style.visibility = 'visible';
        return
    }
    let username = usernameInput.value ;
    let email = emailInput.value;
    let pass = passwordInput.value;
    const registerBody = { username: username,  email: email, password: pass };
    
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            //"Access-Control-Allow-Origin": "*",
            //"Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(registerBody)
    };
    // await fetch(...)
    try {
        const response = await fetch(`${BASE_URL}/register`, requestOptions);
        if(response.status == 409){
            console.log("Conflict 409");
            alert("Alert that user/email already exists");
            errorMessage.textContent = "Alert that user/email already exists";
            errorMessage.style.visibility = 'visible';
            return
        }
        else if(!response.ok){
            alert("Alert something went wrong!");
            errorMessage.textContent = "Alert something went wrong!";
            errorMessage.style.visibility = 'visible';
            return
        }
        let data = await response.json();
        console.log(data)
    } catch (error) {
        console.log("error occurred ")
        console.log(error);
        
    }
    
}
