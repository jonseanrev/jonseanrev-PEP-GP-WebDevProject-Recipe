/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL


/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
let ingredientList = document.getElementById("ingredient-list");
let addIngredientNameInput = document.getElementById("add-ingredient-name-input");
let addIngredientSubmitButton = document.getElementById("add-ingredient-submit-button");
let deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input"); 
let deleteIngredientSubmitButton = document.getElementById("delete-ingredient-submit-button");
/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientSubmitButton.addEventListener('click', addIngredient);
deleteIngredientSubmitButton.addEventListener('click', deleteIngredient);

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
document.addEventListener('DOMContentLoaded', getIngredients);
console.log(`Admin: ${sessionStorage.getItem("is-admin")}`);
console.log(`token: ${sessionStorage.getItem("auth-token")}`);


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    console.log("addIngredient() called");
    // Implement add ingredient logic here
    let ingredientName = addIngredientNameInput.value.trim();
    if(!ingredientName){
        alert("Please enter an ingredient name!");
        return;
    }
    let target = `${BASE_URL}/ingredients`;
    const requestBody = { name: ingredientName};
    
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(requestBody)
    };
    try{
        let response = await fetch(target, requestOptions);
        let status = await response.status;
        console.log(status);
        if(status === 201){ 
            getIngredients();
        }else{
            alert(`Something went wrong. code:${status}`);
        }
    }catch(error){
        alert("Something went wrong!");
        console.error(`Error adding ingredient: ${error}`);
    }

}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    
        let target = `${BASE_URL}/ingredients`;
        try{
            let ingredientsResponse = await fetch(target, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",}
            });
            ingredients = await ingredientsResponse.json();
            refreshIngredientList();
            return;
        }catch(error){
            console.error("Error fetching ingredients:", error);
            alert("Error fetching ingredients.");
        }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    console.log("deleteIngredient() called");
    // Implement delete ingredient logic here
    let ingredientName = deleteIngredientNameInput.value.trim();
    let ingredientToDelete = ingredients.find(ingredient => ingredient.name.toLowerCase() === ingredientName.toLowerCase());
    if(!ingredientToDelete){
        alert("No such ingredient found!");
        return;
    }
    let target = `${BASE_URL}/ingredients/${ingredientToDelete.id}`;
    const requestOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    };
    try{
        let response = await fetch(target, requestOptions);
        let status = response.status;
        if(status === 204){
            getIngredients();
        }
        else{
            alert(`Something unexpected happened. Code:${status}`);
        }
    }catch(error){
        alert("Something went wrong!");
        console.log(`Error deleting ingredient: ${error}`);
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientList.innerHTML = "";
    ingredients.forEach( ingredient =>{
        let li = document.createElement("li");
        let p = document.createElement("p");
        p.textContent = `${ingredient.name}`;
        li.appendChild(p);
        ingredientList.appendChild(li);
    });
}
