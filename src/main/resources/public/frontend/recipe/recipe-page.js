/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    let adminLink = document.getElementById("admin-link");
    let logoutButton = document.getElementById("logout-button");   
    let loginButton = document.getElementById("login-button");
    
    let searchInput = document.getElementById("search-input");
    let searchButton = document.getElementById("search-button");
    let recipeList = document.getElementById("recipe-list");

    let addRecipeNameInput = document.getElementById("add-recipe-name-input");
    let addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    let addRecipeButton = document.getElementById("add-recipe-submit-input");

    let updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    let updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    let updateRecipeButton = document.getElementById("update-recipe-submit-input");

    let deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
    let deleteRecipeButton = document.getElementById("delete-recipe-submit-input");
    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.style.visibility = "visible";
        loginButton.style.visibility = "hidden";
    }else{
        logoutButton.style.visibility = "hidden";
        loginButton.style.visibility = "visible";
    }
    logoutButton.addEventListener("click", processLogout);
    loginButton.addEventListener("click", loginRedirect);
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    console.log(`Admin: ${sessionStorage.getItem("is-admin")}`);
    console.log(`token: ${sessionStorage.getItem("token")}`);
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.visibility = "visible";
    }
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    searchButton.addEventListener("click", searchRecipes);
    addRecipeButton.addEventListener("click", addRecipe);
    updateRecipeButton.addEventListener("click", updateRecipe);
    deleteRecipeButton.addEventListener("click", deleteRecipe);
    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        console.log("searchRecipes() called");
        // Implement search logic here
        let searchTerm = searchInput.value.toLowerCase().trim();
        if(!searchTerm){
            getRecipes();
            return;
        }
        let target = `${BASE_URL}/recipes?name=${searchTerm}`;
        try{
            let recipeList = await fetch(target, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",},
            });
            recipes = await recipeList.json();
            refreshRecipeList();
            return;
        }catch(error){
            console.error("Error fetching recipes:", error);
            alert("No such recipe found.");
        }
    }
    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        console.log("addRecipe() called");
        // Implement add logic here

        let name = addRecipeNameInput.value.trim();
        let instructions = addRecipeInstructionsInput.value.trim();
        if(!name || !instructions){
            alert("Please provide both name and instructions for the recipe.");
            return;
        }
        const requestBody = { name: name, instructions: instructions };
        const requestOptions = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            },
            body: JSON.stringify(requestBody)
        };
        try {
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);
            if (response.ok) {
                addRecipeNameInput.value = '';
                addRecipeInstructionsInput.value = '';
                await getRecipes();
            } else {
                alert("Failed to add recipe.");
            }
        } catch (error) {
            console.error("Error adding recipe:", error);
            alert("Error adding recipe.");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        console.log("updateRecipe() called");
        // Implement update logic here
        let name = updateRecipeNameInput.value.trim();
        let instructions = updateRecipeInstructionsInput.value.trim();
        if(!name || !instructions){
            alert("Provide both name and updated instructions for the recipe.");
            return;
        }
        // Find recipe by name to get its ID
        await getRecipes(); // Ensure we have the latest recipes
        let recipeToUpdate = recipes.find(recipe => recipe.name.toLowerCase() === name.toLowerCase());
        if (!recipeToUpdate) {
            alert("Recipe not found.");
            return;
        }
        const requestBody = { name: name, instructions: instructions };
        const requestOptions = {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            },
            body: JSON.stringify(requestBody)
        };
        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipeToUpdate.id}`, requestOptions);
            if (response.ok) {
                updateRecipeNameInput.value = '';
                updateRecipeInstructionsInput.value = '';
                await getRecipes();
            } else {
                alert("Failed to update recipe.");
            }
        } catch (error) {
            console.error("Error updating recipe:", error);
            alert("Error updating recipe.");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        console.log("deleteRecipe() called");
        // Implement delete logic here

        let name = deleteRecipeNameInput.value;
        await getRecipes();
        let recipeToDelete = recipes.find(recipe => recipe.name.toLowerCase() === name.toLowerCase());
        if(!recipeToDelete){
            alert("Recipe not found.");
            return;
        }
        const requestOptions = {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`,
            }
        };
        try{
            const response = await fetch(`${BASE_URL}/recipes/${recipeToDelete.id}`, requestOptions);
            if(response.ok){
                await getRecipes();
            }else{
                alert(`Failed to delete recipe. Code ${response.status}`);
            }
        }
        catch(error){
            console.error("Error deleting recipe:", error);
            alert("Error deleting recipe.");
        }

    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        let target = `${BASE_URL}/recipes`;
        try{
            let recipeList = await fetch(target, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",}
            });
            recipes = await recipeList.json();
            refreshRecipeList();
            return;
        }catch(error){
            console.error("Error fetching recipes:", error);
            alert("Error fetching recipes.");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeList.innerHTML = "";
        recipes.forEach(recipe => {
            let li = document.createElement("li");
            li.textContent = `${recipe.name}: ${recipe.instructions}`;
            recipeList.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        sessionStorage.clear();
        window.location.href = `../login/login-page.html`;
    }

    async function loginRedirect(){
        window.location.href = `../login/login-page.html`;
    }

});
