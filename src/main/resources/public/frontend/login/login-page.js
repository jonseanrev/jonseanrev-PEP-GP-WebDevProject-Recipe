/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */
let usernameInput = document.getElementById('login-input');
let passwordInput = document.getElementById('password-input');
let loginButton = document.getElementById('login-button');
let logoutButton = document.getElementById('logout-button');

/* 
 * TODO: Add click event listener to login button
 * - Call processLogin on click
 */

loginButton.addEventListener("click", processLogin);
logoutButton.addEventListener("click", processLogout);
/**
 * TODO: Process Login Function
 * 
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 * 
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 */
async function processLogin() {
    console.log("processLogin() called");
    // TODO: Retrieve username and password from input fields
    // - Trim input and validate that neither is empty
    let username = usernameInput.value.trim();
    let password = passwordInput.value.trim();
    console.log(`user: ${username} , pass:${password}`);
    // TODO: Create a requestBody object with username and password
    const requestBody = { username: username, password: password };
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
        body: JSON.stringify(requestBody)
    };
    try {
        // TODO: Send POST request to http://localhost:8081/login using fetch with requestOptions
        const response = await fetch(`${BASE_URL}/login`, requestOptions);
        console.log(response.status)
        // TODO: If response status is 200
        // - Read the response as text
        // - Response will be a space-separated string: "token123 true"
        // - Split the string into token and isAdmin flag
        // - Store both in sessionStorage using sessionStorage.setItem()
        // TODO: Optionally show the logout button if applicable
        if(response.status == 200){
            console.log("login 200");
            const responseText = (await response.text()).split(' ');
            console.log(responseText);
            logoutButton.style = "visibility:visible;";
            sessionStorage.setItem("token", responseText[0]);
            sessionStorage.setItem("isAdmin", responseText[1]);
            // TODO: Add a small delay (e.g., 500ms) using setTimeout before redirecting
            // - Use window.location.href to redirect to the recipe page
            setTimeout(() => {
                window.location.href = "../recipe/recipe-page.html";
            }, 500);
        }

        // TODO: If response status is 401
        // - Alert the user with "Incorrect login!"
        else if(response.status == 401){
            console.log("login 401");
            alert("Incorrect login!");
        }

        // TODO: For any other status code
        // - Alert the user with a generic error like "Unknown issue!"
        else{
            console.log("login error other");
            alert("Unknown issue!");
        }

    } catch (error) {
        // TODO: Handle any network or unexpected errors
        // - Log the error and alert the user
        console.error("Error during login:", error);
    }
}

async function processLogout() {
    console.log("processLogout() called");
    // Clear session storage
    sessionStorage.clear();
    // Hide logout button
    logoutButton.style = "visibility:hidden;";
    alert("Logged out");
}
