
const NUTRITION_URL = "http://localhost:3000/api/nutrition";

// This class handles meal nutrition requests
export class NutritionAPI {

    // Get nutrition information for a meal
    async analyzeMeal(meal) {

        // Store the meal ingredients
        const ingredients = [];

        // TheMealDB can provide up to 20 ingredients
        for (let i = 1; i <= 20; i++) {

            // Get the ingredient and its measure
            let ingredient = meal["strIngredient" + i];
            let measure = meal["strMeasure" + i];

            // Remove extra spaces from the ingredient
            if (ingredient) {
                ingredient = ingredient.trim();
            }

            // Remove extra spaces from the measure
            if (measure) {
                measure = measure.trim();
            }

            // Add the ingredient if it exists
            if (ingredient) {

                // Start with the ingredient name
                let ingredientText = ingredient;

                // Add the measure before the ingredient
                if (measure) {
                    ingredientText = measure + " " + ingredient;
                }

                // Save the ingredient in the array
                ingredients.push(ingredientText);
            }
        }

        // Send the meal data to the backend
        const response = await fetch(NUTRITION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recipeName: meal.strMeal,
                ingredients: ingredients
            })
        });

        // Convert the backend response to JavaScript data
        const data = await response.json();

        // Check if the request failed
        if (!response.ok) {

            // Set a default error message
            let errorMessage = "Nutrition API error: " + response.status;

            // Use the backend error message if available
            if (data.error && data.error.message) {
                errorMessage = data.error.message;
            }

            // Stop and show the error
            throw new Error(errorMessage);
        }

        // Return the nutrition information
        return data;
    }
}


