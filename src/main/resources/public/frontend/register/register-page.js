/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
let usernameInput = document.getElementById('username-input');
let emailInput = document.getElementById('email-input');
let passwordInput = document.getElementById('password-input');
let repeatPasswordInput = document.getElementById('repeat-password-input');
let registerButton = document.getElementById('register-button');


let checkPass = () =>{
    //add any password checking to this method
    return (repeatPasswordInput.value === passwordInput.value)
}
let formValid = () =>{
    //make custom form validation checks here 
    if(!checkPass()){
        return false;
    }
    if(!emailInput.value || !usernameInput.value || !passwordInput.value){
        return false;
    }
    return true;
}


/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.addEventListener("click", processRegistration);

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
            alert("Passwords must match!");
        }else{
            alert("Form not valid!");
        }
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
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(registerBody)
    };
    // await fetch(...)
    try {
        const response = await fetch(`${BASE_URL}/register`, requestOptions);
        let status = response.status;
        if(status == 201){
            console.log("Registration Successful");
            window.location.href = `../login/login-page.html`;
            return
        }
        else if(status == 409){
            console.log("Conflict 409");
            alert("Alert that user/email already exists");
            return
        }
        else{
            alert("Alert something went wrong!");
            return
        }
    } 
    catch (error) {
        console.log("error occurred ")
        console.log(error);
        
    }
    
}
