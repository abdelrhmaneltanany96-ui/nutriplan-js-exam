
export function renderNutrition(nutrition = null) {

    // Get nutrition elements
    const container = document.getElementById("nutrition-facts-container");
    const heroCalories = document.getElementById("hero-calories");
    const heroServings = document.getElementById("hero-servings");

    if (!container) {
        return;
    }

    // Clear old nutrition information
    container.replaceChildren();

    // Reset old values
    if (heroCalories) {
        heroCalories.textContent = "Calories unavailable";
    }

    if (heroServings) {
        heroServings.textContent = "Servings unavailable";
    }

    // Show a message if nutrition data is missing
    if (!nutrition) {

        const message = document.createElement("div");

        message.className = "p-5 bg-gray-50 rounded-xl text-center";

        message.innerHTML = `
            <i class="fa-solid fa-chart-pie text-3xl text-gray-400 mb-3"></i>

            <h3 class="font-semibold text-gray-700 mb-2">
                Nutrition Information
            </h3>

            <p class="text-sm text-gray-500">
                Verified nutrition data is not available
                for this meal yet.
            </p>
        `;

        container.appendChild(message);
        return;
    }

    // Nutrients to display
    const nutrients = [
        { label: "Calories", key: "calories", unit: "kcal" },
        { label: "Protein", key: "protein", unit: "g" },
        { label: "Carbs", key: "carbs", unit: "g" },
        { label: "Fat", key: "fat", unit: "g" }
    ];

    // Show nutrition description
    const heading = document.createElement("p");

    heading.className = "text-sm text-gray-500 mb-4";
    heading.textContent = nutrition.basis || "Nutrition information";

    container.appendChild(heading);

    // Create a row for each nutrient
    for (let i = 0; i < nutrients.length; i++) {

        const nutrient = nutrients[i];

        const row = document.createElement("div");
        row.className = "flex items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg";

        const name = document.createElement("span");
        name.className = "font-medium text-gray-700";
        name.textContent = nutrient.label;

        const value = document.createElement("span");
        value.className = "font-bold text-emerald-600";

        const amount = nutrition[nutrient.key];

        // Display valid numbers only
        if (typeof amount === "number" && Number.isFinite(amount)) {

            const roundedAmount = Math.round(amount * 10) / 10;

            value.textContent = `${roundedAmount} ${nutrient.unit}`;

        } else {

            value.textContent = "N/A";
        }

        row.appendChild(name);
        row.appendChild(value);

        container.appendChild(row);
    }

    // Update calories in meal header
    if (
        typeof nutrition.calories === "number" &&
        Number.isFinite(nutrition.calories) &&
        heroCalories
    ) {
        heroCalories.textContent = `${Math.round(nutrition.calories)} kcal`;
    }

    // Update servings in meal header
    if (
        Number.isInteger(nutrition.servings) &&
        nutrition.servings > 0 &&
        heroServings
    ) {
        heroServings.textContent = `${nutrition.servings} servings`;
    }
}
