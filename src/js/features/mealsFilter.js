
import { mealDB } from "../api/mealdb.js";
import { renderMeals } from "../ui/mealsView.js";


export class MealsFilter {

    constructor(initialMeals) {

        // Store the original meals
        this.initialMeals = initialMeals;

        // Store filter values
        this.search = "";
        this.category = "";
        this.area = "";

        // Track the latest filter request
        this.requestId = 0;
    }


    // Apply all active filters
    async applyFilters() {

        // Create a new request number
        this.requestId++;
        const currentRequest = this.requestId;

        // Get the meals container
        const grid = document.getElementById("recipes-grid");

        // Show that meals are loading
        grid.setAttribute("aria-busy", "true");

        try {

            // Store API requests
            const requests = [];

            // Add search request if needed
            if (this.search) {
                requests.push(mealDB.searchMeals(this.search));
            }

            // Add category request if needed
            if (this.category) {
                requests.push(mealDB.filterByCategory(this.category));
            }

            // Add area request if needed
            if (this.area) {
                requests.push(mealDB.filterByArea(this.area));
            }

            // Store the final meals
            let meals = [];

            // Show original meals if no filters are selected
            if (requests.length === 0) {

                meals = this.initialMeals;

            } else {

                // Wait for all API requests
                const results = await Promise.all(requests);

                // Get meals from the first result
                const firstGroup = results[0];

                // Check every meal in the first group
                for (let i = 0; i < firstGroup.length; i++) {

                    const meal = firstGroup[i];

                    // Assume the meal matches all filters
                    let matchesAll = true;

                    // Check the remaining filter results
                    for (let j = 1; j < results.length; j++) {

                        const group = results[j];

                        // Check if this meal exists in the group
                        let found = false;

                        for (let k = 0; k < group.length; k++) {

                            if (group[k].idMeal === meal.idMeal) {
                                found = true;
                                break;
                            }
                        }

                        // Stop if the meal does not match a filter
                        if (!found) {
                            matchesAll = false;
                            break;
                        }
                    }

                    // Add meals that match all filters
                    if (matchesAll) {
                        meals.push(meal);
                    }
                }
            }

            // Ignore old requests
            if (currentRequest !== this.requestId) {
                return;
            }

            // Display the filtered meals
            renderMeals(meals);

        } catch (error) {

            // Ignore errors from old requests
            if (currentRequest !== this.requestId) {
                return;
            }

            // Show an error message
            console.error("Filtering failed:", error);

            grid.innerHTML = `
                <p class="col-span-full text-center text-red-500 py-8">
                    Failed to load recipes. Please try again.
                </p>
            `;

        } finally {

            // Remove loading state for the latest request
            if (currentRequest === this.requestId) {
                grid.removeAttribute("aria-busy");
            }
        }
    }


    // Update the search text
    setSearch(value) {

        // Remove extra spaces
        this.search = value.trim();

        // Apply the new filter
        return this.applyFilters();
    }


    // Update the selected category
    setCategory(value) {

        this.category = value;

        // Apply the new filter
        return this.applyFilters();
    }


    // Update the selected area
    setArea(value) {

        this.area = value;

        // Apply the new filter
        return this.applyFilters();
    }


    // Reset all filters
    reset() {

        // Clear all filter values
        this.search = "";
        this.category = "";
        this.area = "";

        // Clear the search input
        document.getElementById("search-input").value = "";

        // Show the original meals
        return this.applyFilters();
    }
}
