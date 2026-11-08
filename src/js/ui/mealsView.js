
// Get the main page elements
const recipesGrid = document.getElementById("recipes-grid");
const categoriesGrid = document.getElementById("categories-grid");
const recipesCount = document.getElementById("recipes-count");


// Convert special characters into safe HTML text
function escapeHTML(value = "") {

    // Convert the value to a string
    let text = String(value);

    // Replace special HTML characters
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/"/g, "&quot;");
    text = text.replace(/'/g, "&#39;");

    return text;
}


// Display meal cards on the Home page
export function renderMeals(meals) {

    // Update the recipes count
    recipesCount.textContent = "Showing " + meals.length + " recipes";

    // Show a message if there are no meals
    if (meals.length === 0) {

        recipesGrid.innerHTML = `
            <p class="col-span-full text-center text-gray-500 py-12">
                No recipes found
            </p>
        `;

        return;
    }

    // Store all meal cards HTML
    let cardsHTML = "";

    // Loop through all meals
    for (let i = 0; i < meals.length; i++) {

        const meal = meals[i];

        // Prepare safe meal information
        const mealId = escapeHTML(meal.idMeal);
        const mealName = escapeHTML(meal.strMeal);
        const mealImage = escapeHTML(meal.strMealThumb);

        // Set default category and area
        let category = meal.strCategory;
        let area = meal.strArea;

        if (!category) {
            category = "Meal";
        }

        if (!area) {
            area = "International";
        }

        // Make category and area safe for HTML
        category = escapeHTML(category);
        area = escapeHTML(area);

        // Create one meal card
        cardsHTML += `
            <div
                class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-meal-id="${mealId}"
            >
                <div class="relative h-48 overflow-hidden">

                    <img
                        src="${mealImage}"
                        alt="${mealName}"
                        loading="lazy"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div class="absolute bottom-3 left-3 flex gap-2">

                        <span class="px-2 py-1 bg-white/90 rounded-full text-xs font-semibold">
                            ${category}
                        </span>

                        <span class="px-2 py-1 bg-emerald-500 rounded-full text-xs font-semibold text-white">
                            ${area}
                        </span>

                    </div>
                </div>

                <div class="p-4">

                    <h3 class="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                        ${mealName}
                    </h3>

                    <p class="text-xs text-gray-600 mb-3">
                        Delicious recipe to try!
                    </p>

                    <div class="flex items-center justify-between text-xs">

                        <span class="font-semibold text-gray-900">
                            ${category}
                        </span>

                        <span class="font-semibold text-gray-500">
                            ${area}
                        </span>

                    </div>
                </div>
            </div>
        `;
    }

    // Display all meal cards
    recipesGrid.innerHTML = cardsHTML;
}


// Display meal categories on the Home page
export function renderCategories(categories) {

    // Store all category cards HTML
    let categoriesHTML = "";

    // Loop through all categories
    for (let i = 0; i < categories.length; i++) {

        const category = categories[i];

        // Make the category name safe for HTML
        const categoryName = escapeHTML(category.strCategory);

        // Create one category card
        categoriesHTML += `
            <div
                class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all"
                data-category="${categoryName}"
            >
                <div class="flex items-center gap-2.5">

                    <div class="text-white w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-utensils"></i>
                    </div>

                    <h3 class="text-sm font-bold text-gray-900">
                        ${categoryName}
                    </h3>

                </div>
            </div>
        `;
    }

    // Display all category cards
    categoriesGrid.innerHTML = categoriesHTML;
}
