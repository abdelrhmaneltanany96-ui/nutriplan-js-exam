
import { mealDB } from "../api/mealdb.js";
import { renderNutrition } from "./nutritionView.js";


export class MealDetailsView {

    constructor(nutritionService = null) {

        // Get the main page sections
        this.detailsSection = document.getElementById("meal-details");
        this.recipesSection = document.getElementById("all-recipes-section");
        this.categoriesSection = document.getElementById("meal-categories-section");
        this.searchSection = document.getElementById("search-filters-section");

        // Store the current meal and nutrition
        this.currentMeal = null;
        this.currentNutrition = null;

        // Store the nutrition API service
        this.nutritionService = nutritionService;
    }


    // Load and display the selected meal
    async showMeal(mealId) {

        try {

            // Get meal details from the API
            const meal = await mealDB.getMealById(mealId);

            // Check if the meal exists
            if (!meal) {
                throw new Error("Meal not found");
            }

            // Save the current meal
            this.currentMeal = meal;
            this.currentNutrition = null;

            // Display meal information
            this.renderHero(meal);
            this.renderIngredients(meal);
            this.renderInstructions(meal);
            this.renderVideo(meal);

            // Open the meal details page
            this.showDetailsPage();

            // Load nutrition information
            this.loadNutrition(meal);

            console.log("Meal details loaded:", meal);

        } catch (error) {

            console.error("Failed to load meal:", error);
            alert("Unable to load meal details.");
        }
    }


    // Display the meal image, name and badges
    renderHero(meal) {

        // Get the hero elements
        const hero = this.detailsSection.querySelector(".relative.h-80");
        const image = hero.querySelector("img");
        const title = hero.querySelector("h1");
        const badges = hero.querySelector(".flex.items-center.gap-3");

        // Update the meal image
        image.src = meal.strMealThumb;
        image.alt = meal.strMeal;

        // Update the meal name
        title.textContent = meal.strMeal;

        // Remove old badges
        badges.innerHTML = "";

        // Store category and area
        const values = [meal.strCategory, meal.strArea];

        // Create a badge for each available value
        for (let i = 0; i < values.length; i++) {

            const value = values[i];

            if (value) {

                const badge = document.createElement("span");

                badge.className =
                    "px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full";

                badge.textContent = value;

                badges.appendChild(badge);
            }
        }

        // Save the meal ID on the Log Meal button
        document.getElementById("log-meal-btn").dataset.mealId = meal.idMeal;
    }


    // Display all meal ingredients
    renderIngredients(meal) {

        // Get ingredients elements
        const container = document.getElementById("ingredients-list");
        const count = document.getElementById("ingredients-count");

        // Store meal ingredients
        const ingredients = [];

        // TheMealDB provides up to 20 ingredients
        for (let i = 1; i <= 20; i++) {

            let ingredient = meal["strIngredient" + i];
            let measure = meal["strMeasure" + i];

            // Remove extra spaces
            if (ingredient) {
                ingredient = ingredient.trim();
            }

            if (measure) {
                measure = measure.trim();
            }

            // Add valid ingredients
            if (ingredient) {

                ingredients.push({
                    ingredient: ingredient,
                    measure: measure || ""
                });
            }
        }

        // Display the ingredients count
        count.textContent = ingredients.length + " items";

        // Clear old ingredients
        container.replaceChildren();

        // Display each ingredient
        for (let i = 0; i < ingredients.length; i++) {

            const ingredient = ingredients[i].ingredient;
            const measure = ingredients[i].measure;

            // Create ingredient label
            const label = document.createElement("label");

            label.className =
                "flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer";

            // Create ingredient checkbox
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.className =
                "ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300";

            // Create ingredient text
            const text = document.createElement("span");
            text.className = "text-gray-700";

            // Create quantity text
            const quantity = document.createElement("strong");
            quantity.className = "font-medium text-gray-900";

            if (measure) {
                quantity.textContent = measure + " ";
            }

            // Add the quantity and ingredient name
            text.appendChild(quantity);
            text.appendChild(document.createTextNode(ingredient));

            // Add elements to the page
            label.appendChild(checkbox);
            label.appendChild(text);
            container.appendChild(label);
        }
    }


    // Display meal preparation instructions
    renderInstructions(meal) {

        // Get the instructions container
        const container = document.getElementById("instructions-list");

        // Get the meal instructions
        let instructions = meal.strInstructions;

        if (instructions) {
            instructions = instructions.trim();
        } else {
            instructions = "";
        }

        // Split instructions into lines
        const lines = instructions.split(/\r?\n+/);

        // Store valid steps
        const steps = [];

        // Remove empty lines
        for (let i = 0; i < lines.length; i++) {

            const step = lines[i].trim();

            // Skip standalone step numbers like "2", "2." or "Step 2"
            const stepHeading = /^(?:step\s*)?\d+\s*[:.)-]?$/i;

            if (step && !stepHeading.test(step)) {
                steps.push(step);
            }
        }

        // Clear old instructions
        container.replaceChildren();

        // Show a message if there are no instructions
        if (steps.length === 0) {

            const message = document.createElement("p");

            message.className = "text-gray-500";
            message.textContent = "No instructions available.";

            container.appendChild(message);

            return;
        }

        // Display each preparation step
        for (let i = 0; i < steps.length; i++) {

            // Create step row
            const row = document.createElement("div");

            row.className =
                "flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors";

            // Create step number
            const number = document.createElement("div");

            number.className =
                "w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0";

            number.textContent = i + 1;

            // Create step description
            const description = document.createElement("p");

            description.className = "text-gray-700 leading-relaxed pt-2";
            description.textContent = steps[i];

            // Add step elements
            row.appendChild(number);
            row.appendChild(description);

            // Display the step
            container.appendChild(row);
        }
    }


    // Display the meal YouTube video
    renderVideo(meal) {

        // Get the video container
        const container = document.getElementById("video-container");

        // Remove old video
        container.replaceChildren();

        // Get the YouTube link
        const youtubeUrl = meal.strYoutube;

        // Show a message if no video exists
        if (!youtubeUrl) {
            this.showVideoFallback(container);
            return;
        }

        let videoId = "";

        try {

            // Convert the YouTube link to a URL object
            const url = new URL(youtubeUrl);

            // Get the video ID from a normal YouTube link
            if (
                url.hostname === "youtube.com" ||
                url.hostname === "www.youtube.com" ||
                url.hostname === "m.youtube.com"
            ) {

                videoId = url.searchParams.get("v");

            } else if (url.hostname === "youtu.be") {

                // Get the ID from a short YouTube link
                videoId = url.pathname.slice(1);
            }

        } catch (error) {

            // Show a message if the URL is invalid
            this.showVideoFallback(container);
            return;
        }

        // Check if the YouTube video ID is valid
        const videoPattern = /^[a-zA-Z0-9_-]{11}$/;

        if (!videoPattern.test(videoId || "")) {
            this.showVideoFallback(container);
            return;
        }

        // Create the YouTube iframe
        const iframe = document.createElement("iframe");

        iframe.src = "https://www.youtube.com/embed/" + videoId;
        iframe.title = meal.strMeal + " video tutorial";

        iframe.className = "absolute inset-0 w-full h-full";
        iframe.loading = "lazy";

        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

        iframe.allowFullscreen = true;

        // Display the video
        container.appendChild(iframe);
    }


    // Show a message if no video is available
    showVideoFallback(container) {

        // Create a message
        const message = document.createElement("p");

        message.className =
            "flex items-center justify-center h-full text-gray-500 text-center p-6";

        message.textContent =
            "No video tutorial available for this recipe.";

        // Display the message
        container.appendChild(message);
    }


    // Open the meal details page
    showDetailsPage() {

        // Hide the home page sections
        this.recipesSection.classList.add("hidden");
        this.categoriesSection.classList.add("hidden");
        this.searchSection.classList.add("hidden");

        // Show meal details
        this.detailsSection.classList.remove("hidden");

        // Scroll to the top
        window.scrollTo({ top: 0, behavior: "smooth" });
    }


    // Return to the recipes page
    showRecipesPage() {

        // Hide meal details
        this.detailsSection.classList.add("hidden");

        // Show the home page sections
        this.recipesSection.classList.remove("hidden");
        this.categoriesSection.classList.remove("hidden");
        this.searchSection.classList.remove("hidden");

        // Scroll to the top
        window.scrollTo({ top: 0, behavior: "smooth" });
    }


    // Load and display nutrition information
    async loadNutrition(meal) {

        // Reset old nutrition information
        this.currentNutrition = null;
        renderNutrition();

        // Check if the nutrition service exists
        if (!this.nutritionService) {

            console.log("Nutrition service not connected yet");

            return;
        }

        try {

            // Request nutrition information from the backend
            const response = await this.nutritionService.analyzeMeal(meal);

            // Check if the response is valid
            if (!response.success || !response.data) {

                let errorMessage = "Nutrition analysis failed";

                if (response.error && response.error.message) {
                    errorMessage = response.error.message;
                }

                throw new Error(errorMessage);
            }

            // Ignore results from an older meal
            if (!this.currentMeal || this.currentMeal.idMeal !== meal.idMeal) {
                return;
            }

            // Get nutrition information
            const perServing = response.data.perServing;
            const servings = response.data.servings;

            // Save the current meal nutrition
            this.currentNutrition = {
                ...perServing,
                servings: servings,
                basis: "Nutrition per serving"
            };

            // Display nutrition information
            renderNutrition(this.currentNutrition);

            console.log(
                "Nutrition loaded successfully:",
                this.currentNutrition
            );

        } catch (error) {

            // Ignore errors from an older meal
            if (!this.currentMeal || this.currentMeal.idMeal !== meal.idMeal) {
                return;
            }

            console.error("Nutrition analysis failed:", error);

            // Reset nutrition if the request failed
            this.currentNutrition = null;
            renderNutrition();
        }
    }
}
