// this file is the big and most important file js in thid project 


// Get meal data from TheMealDB API
import { mealDB } from "./api/mealdb.js";

// Display meals and categories on the page
import { renderMeals, renderCategories } from "./ui/mealsView.js";

// Handle meal search and filters
import { MealsFilter } from "./features/mealsFilter.js";

// Display meal details
import { MealDetailsView } from "./ui/mealDetailsView.js";

// Get nutrition information
import { NutritionAPI } from "./api/nutritionApi.js";

// Save and manage logged food
import { FoodLog } from "./features/foodLog.js";

// Search products and barcodes
import { productsAPI } from "./api/productsApi.js";










async function initApp() {

    try {

        // Get meal categories from the API
        const categories = await mealDB.getCategories();
        // Get meals from the API
        const meals = await mealDB.searchMeals("");
        // Get meal areas from the API
        const areas = await mealDB.getAreas();


        renderCategories(categories);
        renderMeals(meals);

        const filters = new MealsFilter(meals);



        const nutritionService = new NutritionAPI();
        const mealDetailsView = new MealDetailsView(nutritionService);
        const foodLog = new FoodLog();








        // Get the Log This Meal button from HTML
        const logMealBtn = document.getElementById("log-meal-btn");
        // Check if the button exists
        if (logMealBtn) {

            // Run this function when the user clicks the button
            logMealBtn.addEventListener("click", function () {

                // Get the currently selected meal
                const meal = mealDetailsView.currentMeal;

                // Get the nutrition facts of this meal
                const nutrition = mealDetailsView.currentNutrition;

                // Make sure the user selected a meal
                if (!meal) {
                    alert("Please select a meal first.");
                    return;
                }

                // Make sure the nutrition facts are loaded
                if (!nutrition) {
                    alert("Please wait for nutrition facts to load.");
                    return;
                }

                // Add the meal and its nutrition facts to Food Log
                const entry = foodLog.addMeal(meal, {
                    calories: nutrition.calories,
                    protein: nutrition.protein,
                    carbs: nutrition.carbs,
                    fat: nutrition.fat
                });

                // Update the Food Log display
                renderFoodLog();

                // Show the saved meal in the console
                console.log("Meal logged successfully:", entry);

                // Tell the user that the meal was added
                alert(meal.strMeal + " added to your Food Log!");
            });
        }







        const navigationTargets = [
            "all-recipes-section",
            "products-section",
            "foodlog-section"
        ];
        const navigationLinks = document.querySelectorAll(
            "#sidebar .nav-link"
        );
        const mealSections = [
            "search-filters-section",
            "meal-categories-section",
            "all-recipes-section"
        ];





        function showPage(pageId) {


            // Check if the user opened the Meals page
            const isMealsPage = pageId === "all-recipes-section";
            // Loop through all Meals page sections
            for (let i = 0; i < mealSections.length; i++) {

                // Get the current section from HTML
                const section = document.getElementById(mealSections[i]);

                // Check if the section exists
                if (section) {

                    if (isMealsPage) {

                        // Show the section on the Meals page
                        section.classList.remove("hidden");

                    } else {

                        // Hide the section on other pages
                        section.classList.add("hidden");
                    }
                }
            }



            // Get the Meal Details section from HTML
            const mealDetailsSection = document.getElementById("meal-details");
            // Hide Meal Details when changing pages
            if (mealDetailsSection) {
                mealDetailsSection.classList.add("hidden");
            }
            // Get the Products section
            const productsSection = document.getElementById("products-section");
            // Show Products only when the user opens Products
            if (productsSection) {

                if (pageId === "products-section") {
                    productsSection.classList.remove("hidden");
                } else {
                    productsSection.classList.add("hidden");
                }
            }
            // Get the Food Log section
            const foodLogSection = document.getElementById("foodlog-section");
            // Show Food Log only when the user opens Food Log
            if (foodLogSection) {

                if (pageId === "foodlog-section") {
                    foodLogSection.classList.remove("hidden");
                } else {
                    foodLogSection.classList.add("hidden");
                }
            }



            // Loop through all sidebar navigation links
            for (let i = 0; i < navigationLinks.length; i++) {
                // Get the current navigation link
                const link = navigationLinks[i];
                // Get the page connected to this link
                const linkPage = navigationTargets[i];
                // Check if this link belongs to the current page
                if (linkPage === pageId) {

                    // Add active link colors
                    link.classList.add("bg-emerald-50");
                    link.classList.add("text-emerald-700");

                    // Remove the normal text color
                    link.classList.remove("text-gray-600");

                } else {

                    // Remove active link colors
                    link.classList.remove("bg-emerald-50");
                    link.classList.remove("text-emerald-700");

                    // Add the normal text color
                    link.classList.add("text-gray-600");
                }
            }




            // Store the page name that will appear in the URL
            let route = "";
            // Check which page the user opened
            if (pageId === "all-recipes-section") {
                route = "meals";
            } else if (pageId === "products-section") {
                route = "products";
            } else if (pageId === "foodlog-section") {
                route = "foodlog";
            }
            // Create the new hash for the URL
            const newHash = "#" + route;
            // Update the URL only if the hash is different
            if (route !== "" && window.location.hash !== newHash) {
                // Change the URL without reloading the page
                history.pushState(null, "", newHash);
            }
            // Move the user to the top of the page
            window.scrollTo(0, 0);
        }






        // Loop through all sidebar navigation links
        for (let i = 0; i < navigationLinks.length; i++) {

            // Make sure this link has a matching page
            if (i < navigationTargets.length) {

                // Get the current sidebar link
                const link = navigationLinks[i];

                // Get the page connected to this link
                const pageId = navigationTargets[i];

                // Run this function when the user clicks the link
                link.addEventListener("click", function (event) {

                    // Stop the link from navigating normally
                    event.preventDefault();

                    // Show the selected page
                    showPage(pageId);
                });
            }
        }







        // Open the correct page using the URL
        function showPageFromURL() {
            // Get the hash from the URL
            const hash = window.location.hash;
            // Set Meals as the default page
            let pageId = "all-recipes-section";
            // Check if the URL is for Products
            if (hash === "#products") {
                pageId = "products-section";
                // Check if the URL is for Food Log
            } else if (hash === "#foodlog") {
                pageId = "foodlog-section";
                // Check if the URL is for Meals
            } else if (hash === "#meals") {
                pageId = "all-recipes-section";
            }
            // Open the selected page
            showPage(pageId);
        }
        window.addEventListener("popstate", showPageFromURL);
        window.addEventListener("hashchange", showPageFromURL);
        // Open the correct page when the website loads
        showPageFromURL();








        // Get the Quick Log Meal button from HTML
        const quickLogMealBtn = document.getElementById("quick-log-meal");
        // Check if the button exists
        if (quickLogMealBtn) {
            // Open the Meals page when the button is clicked
            quickLogMealBtn.addEventListener("click", function () {
                showPage("all-recipes-section");
            });
        }
        // Get the Quick Scan Product button from HTML
        const quickScanProductBtn = document.getElementById("quick-scan-product");
        // Check if the button exists
        if (quickScanProductBtn) {
            // Open the Products page when the button is clicked
            quickScanProductBtn.addEventListener("click", function () {
                showPage("products-section");
            });
        }







        // Get the product search input from HTML
        const productSearchInput = document.getElementById("product-search-input");

        // Get the Search button from HTML
        const searchProductBtn = document.getElementById("search-product-btn");

        // Get the container where products will appear
        const productsGrid = document.getElementById("products-grid");

        // Get the element that shows the number of products
        const productsCount = document.getElementById("products-count");








        // Create and display one product card
        function createProductCard(product) {

            // Create the main card
            const card = document.createElement("div");
            card.className = "bg-white rounded-xl p-4 shadow-sm";

            // Create the product image
            const image = document.createElement("img");
            image.className = "w-full h-40 object-contain mb-3";

            if (product.image_front_url) {
                image.src = product.image_front_url;
            } else if (product.image_url) {
                image.src = product.image_url;
            } else {
                image.src = "https://placehold.co/300x200?text=No+Image";
            }

            image.alt = product.product_name || "Product";
            image.loading = "lazy";


            // Create the product name
            const name = document.createElement("h3");
            name.className = "font-bold text-gray-900";

            if (product.product_name) {
                name.textContent = product.product_name;
            } else {
                name.textContent = "Unknown product";
            }


            // Create the product brand
            const brand = document.createElement("p");
            brand.className = "text-sm text-gray-500 mt-1";

            if (Array.isArray(product.brands)) {
                brand.textContent = product.brands.join(", ");
            } else if (product.brands) {
                brand.textContent = product.brands;
            } else {
                brand.textContent = "Unknown brand";
            }


            // Get nutrition information
            let nutrients = {};

            if (product.nutriments) {
                nutrients = product.nutriments;
            }


            // Format nutrition numbers
            function formatValue(value, unit) {

                // Check if the value is missing
                if (value == null || value === "") {
                    return "N/A";
                }

                // Convert the value into a number
                const number = Number(value);

                // Check if the number is valid
                if (!Number.isFinite(number)) {
                    return "N/A";
                }

                // Return the number with one decimal place
                return number.toFixed(1) + unit;
            }


            // Create the calories text
            const calories = document.createElement("p");
            calories.className =
                "text-sm font-semibold text-orange-600 my-3";

            calories.textContent =
                "Calories: " +
                formatValue(nutrients["energy-kcal_100g"], " kcal") +
                " / 100g";


            // Create a container for protein, carbs and fat
            const macros = document.createElement("div");
            macros.className = "grid grid-cols-3 gap-2 text-center";


            // Store the nutrition values and their CSS classes
            const macroData = [
                {
                    label: "Protein",
                    value: nutrients.proteins_100g,
                    color: "bg-emerald-50 text-emerald-700"
                },
                {
                    label: "Carbs",
                    value: nutrients.carbohydrates_100g,
                    color: "bg-blue-50 text-blue-700"
                },
                {
                    label: "Fat",
                    value: nutrients.fat_100g,
                    color: "bg-purple-50 text-purple-700"
                }
            ];


            // Create a box for each nutrition value
            for (let i = 0; i < macroData.length; i++) {

                const item = macroData[i];

                // Create the colored box
                const box = document.createElement("div");
                box.className = "rounded-lg p-2 " + item.color;

                // Create the nutrition amount
                const amount = document.createElement("p");
                amount.className = "text-sm font-bold";
                amount.textContent = formatValue(item.value, "g");

                // Create the nutrition label
                const title = document.createElement("p");
                title.className = "text-xs";
                title.textContent = item.label;

                // Add the amount and label to the box
                box.appendChild(amount);
                box.appendChild(title);

                // Add the box to the card's nutrition section
                macros.appendChild(box);
            }


            // Get the product Nutri-Score
            let grade = "";

            if (product.nutriscore_grade) {
                grade = String(product.nutriscore_grade).toUpperCase();
            }


            // Create the Nutri-Score badge
            const gradeBadge = document.createElement("span");

            let gradeColor = "bg-gray-500";

            // Choose a color based on the Nutri-Score
            if (grade === "A") {
                gradeColor = "bg-green-600";
            } else if (grade === "B") {
                gradeColor = "bg-lime-600";
            } else if (grade === "C") {
                gradeColor = "bg-yellow-500";
            } else if (grade === "D") {
                gradeColor = "bg-orange-500";
            } else if (grade === "E") {
                gradeColor = "bg-red-600";
            }

            gradeBadge.className =
                "inline-block mt-3 px-3 py-1 rounded-lg " +
                "text-xs font-bold text-white " + gradeColor;

            // Show the Nutri-Score or a default message
            if (
                grade === "A" ||
                grade === "B" ||
                grade === "C" ||
                grade === "D" ||
                grade === "E"
            ) {
                gradeBadge.textContent = "Nutri-Score " + grade;
            } else {
                gradeBadge.textContent = "Nutri-Score N/A";
            }


            // Create the Log Product button
            const logProductBtn = document.createElement("button");
            logProductBtn.type = "button";

            logProductBtn.className =
                "w-full mt-4 bg-emerald-600 hover:bg-emerald-700 " +
                "text-white font-semibold py-2 rounded-lg transition";

            logProductBtn.textContent = "Log Product";


            // Run when the user clicks Log Product
            logProductBtn.addEventListener("click", function () {

                // Ask the user to enter the quantity in grams
                const input = prompt(
                    "Enter quantity in grams (e.g. 50 or 100):",
                    "100"
                );

                // Stop if the user clicks Cancel
                if (input === null) {
                    return;
                }

                // Convert the quantity into a number
                const grams = Number(input.trim());

                // Check if the quantity is valid
                if (!Number.isFinite(grams) || grams <= 0) {
                    alert("Please enter a valid quantity greater than 0.");
                    return;
                }


                // Get the product nutrition data
                let productNutrients = {};

                if (product.nutriments) {
                    productNutrients = product.nutriments;
                }


                // Connect our nutrition names to the API names
                const nutrientKeys = {
                    calories: "energy-kcal_100g",
                    protein: "proteins_100g",
                    carbs: "carbohydrates_100g",
                    fat: "fat_100g"
                };

                // Store the calculated nutrition values
                const nutrition = {};


                // Loop through the required nutrition values
                for (let key in nutrientKeys) {

                    // Get the name used by the API
                    const sourceKey = nutrientKeys[key];

                    // Get the nutrition value from the product
                    const rawValue = productNutrients[sourceKey];

                    // Stop if the nutrition value is missing
                    if (rawValue == null || rawValue === "") {
                        alert(
                            "Cannot log this product: " +
                            key + " data is missing."
                        );
                        return;
                    }

                    // Convert the value into a number
                    const value = Number(rawValue);

                    // Stop if the nutrition value is invalid
                    if (!Number.isFinite(value) || value < 0) {
                        alert(
                            "Cannot log this product: invalid " +
                            key + " value."
                        );
                        return;
                    }

                    // Calculate nutrition for the selected grams
                    const result = value * grams / 100;

                    // Save the calculated nutrition value
                    nutrition[key] = Number(result.toFixed(2));
                }


                try {

                    // Get the product name
                    let productName = "Unknown product";

                    if (product.product_name) {
                        productName = product.product_name;
                    }

                    // Add the product to Food Log
                    foodLog.addCustomEntry(
                        productName + " (" + grams + "g)",
                        nutrition
                    );

                    // Update the Food Log display
                    renderFoodLog();

                    // Tell the user the product was added
                    alert(
                        productName + " (" + grams +
                        "g) added to Food Log!"
                    );

                } catch (error) {

                    // Show any error in the console
                    console.error("Log product error:", error);

                    // Show the error to the user
                    alert(error.message);
                }
            });


            // Add all product elements to the card
            card.appendChild(image);
            card.appendChild(name);
            card.appendChild(brand);
            card.appendChild(calories);
            card.appendChild(macros);
            card.appendChild(gradeBadge);
            card.appendChild(logProductBtn);

            // Return the completed product card
            return card;
        }








        let currentProducts = [];
        let selectedNutriScore = "all";


        // Display products based on the selected Nutri-Score
        function renderFilteredProducts() {

            // Store the products that match the filter
            let filteredProducts = [];

            // Loop through all products
            for (let i = 0; i < currentProducts.length; i++) {

                // Get the current product
                const product = currentProducts[i];

                // Set a default Nutri-Score
                let grade = "";

                // Check if the product has a Nutri-Score
                if (product.nutriscore_grade) {
                    grade = String(product.nutriscore_grade).toUpperCase();
                }

                // Show all products if the selected filter is "all"
                if (selectedNutriScore === "all") {

                    filteredProducts.push(product);

                } else if (grade === selectedNutriScore) {

                    // Add the product if its grade matches the filter
                    filteredProducts.push(product);
                }
            }

            // Remove the old products from the page
            productsGrid.replaceChildren();

            // Update the number of matching products
            productsCount.textContent =
                filteredProducts.length + " products found";

            // Show a message if no products match
            if (filteredProducts.length === 0) {

                productsGrid.textContent =
                    "No products match this Nutri-Score filter.";

                return;
            }

            // Display each matching product
            for (let i = 0; i < filteredProducts.length; i++) {

                // Create a card for the current product
                const card = createProductCard(filteredProducts[i]);

                // Add the card to the products container
                productsGrid.appendChild(card);
            }
        }






        // Nutri-Score filter buttons
        const nutriScoreButtons = document.querySelectorAll(".nutri-score-filter");
        for (let i = 0; i < nutriScoreButtons.length; i++) {
            const button = nutriScoreButtons[i];
            button.addEventListener("click", function () {
                let value = button.dataset.grade;
                if (!value) {
                    value = button.dataset.score;
                }
                if (!value) {
                    value = button.textContent.trim();
                }
                if (value.toLowerCase() === "all") {
                    selectedNutriScore = "all";
                } else {
                    selectedNutriScore = value.toUpperCase();
                }
                renderFilteredProducts();
            });
        }





        // Search products by name
        async function handleProductSearch() {
            const query = productSearchInput.value.trim();
            if (query === "") {
                alert("Please enter a product name");
                return;
            }

            searchProductBtn.disabled = true;
            searchProductBtn.textContent = "Searching...";
            productsGrid.replaceChildren();
            productsCount.textContent = "Loading products...";

            try {
                const products = await productsAPI.searchProducts(query);
                console.log("Products received:", products.length);
                currentProducts = products;
                renderFilteredProducts();
            } catch (error) {
                console.error("Product search error:", error);
                productsCount.textContent = "Search failed";
                productsGrid.textContent = "Could not load products. Please try again.";
            } finally {
                searchProductBtn.disabled = false;
                searchProductBtn.textContent = "Search";
            }
        }




        // Find one product using its barcode
        const barcodeInput = document.getElementById("barcode-input");
        const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");




        async function handleBarcodeLookup() {
            const barcode = barcodeInput.value.trim();
            if (barcode === "") {
                alert("Please enter a barcode");
                return;
            }

            lookupBarcodeBtn.disabled = true;
            lookupBarcodeBtn.textContent = "Looking up...";
            productsCount.textContent = "Looking up product...";
            productsGrid.replaceChildren();

            try {
                const product = await productsAPI.getProductByBarcode(barcode);
                if (!product) {
                    productsCount.textContent = "Product not found";
                    productsGrid.textContent = "No product found for this barcode.";
                    return;
                }
                console.log("Barcode lookup result:", product);
                // Keep barcode results separate from the name-search results
                currentProducts = [product];
                selectedNutriScore = "all";
                productsCount.textContent = "1 product found";
                productsGrid.appendChild(createProductCard(product));
            } catch (error) {
                console.error("Barcode lookup error:", error);
                productsCount.textContent = "Lookup failed";
                productsGrid.textContent = "Could not find product. Please try again.";
            } finally {
                lookupBarcodeBtn.disabled = false;
                lookupBarcodeBtn.textContent = "Lookup";
            }
        }





        if (lookupBarcodeBtn) {
            lookupBarcodeBtn.addEventListener("click", handleBarcodeLookup);
        }
        if (barcodeInput) {
            barcodeInput.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    handleBarcodeLookup();
                }
            });
        }






        // Search by product category
        const productCategoryButtons = document.querySelectorAll(
            "#product-categories .product-category-btn"
        );





        for (let i = 0; i < productCategoryButtons.length; i++) {
            const button = productCategoryButtons[i];
            button.addEventListener("click", async function () {
                const category = button.dataset.category;
                if (!category) {
                    return;
                }

                // Highlight the selected category and disable buttons while loading
                for (let j = 0; j < productCategoryButtons.length; j++) {
                    productCategoryButtons[j].classList.remove("ring-2", "ring-emerald-500");
                    productCategoryButtons[j].disabled = true;
                }
                button.classList.add("ring-2", "ring-emerald-500");
                productsGrid.replaceChildren();
                productsCount.textContent = "Loading " + category + "...";

                try {
                    const products = await productsAPI.searchProducts(category);
                    currentProducts = products;
                    selectedNutriScore = "all";
                    renderFilteredProducts();
                } catch (error) {
                    console.error("Category search error:", error);
                    productsCount.textContent = "Category search failed";
                    productsGrid.textContent = "Could not load products. Please try again.";
                } finally {
                    for (let j = 0; j < productCategoryButtons.length; j++) {
                        productCategoryButtons[j].disabled = false;
                    }
                }
            });
        }






        // Search button and Enter key
        if (searchProductBtn) {
            searchProductBtn.addEventListener("click", handleProductSearch);
        }
        if (productSearchInput) {
            productSearchInput.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    handleProductSearch();
                }
            });
        }







        // Display today's logged foods
        function renderFoodLog() {
            const container = document.getElementById("logged-items-list");
            const clearBtn = document.getElementById("clear-foodlog");
            const entries = foodLog.getToday();

            renderDailyProgress();
            renderWeeklyChart();
            if (!container) {
                return;
            }

            const heading = container.parentElement.querySelector("h4");
            if (heading) {
                heading.textContent = "Logged Items (" + entries.length + ")";
            }
            if (clearBtn) {
                if (entries.length > 0) {
                    clearBtn.style.display = "block";
                } else {
                    clearBtn.style.display = "none";
                }
            }

            container.replaceChildren();
            if (entries.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
                        <p class="font-medium">No meals logged today</p>
                        <p class="text-sm">Add meals from the Meals page or scan products</p>
                    </div>
                `;
                return;
            }

            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const card = document.createElement("div");
                card.className = "flex items-center gap-3 p-3 bg-gray-50 rounded-xl";

                const img = document.createElement("img");
                if (entry.image) {
                    img.src = entry.image;
                } else {
                    img.src = "https://placehold.co/100x100?text=Food";
                }
                img.alt = entry.name;
                img.className = "w-14 h-14 object-cover rounded-lg";

                const info = document.createElement("div");
                info.className = "flex-1 min-w-0";
                const name = document.createElement("p");
                name.className = "font-semibold text-gray-900 truncate";
                name.textContent = entry.name;

                const nutrition = document.createElement("p");
                nutrition.className = "text-xs text-gray-500 mt-1";
                if (entry.nutrition) {
                    const n = entry.nutrition;
                    nutrition.textContent =
                        Math.round(Number(n.calories) || 0) + " kcal · " +
                        "P: " + (Number(n.protein) || 0).toFixed(1) + "g · " +
                        "C: " + (Number(n.carbs) || 0).toFixed(1) + "g · " +
                        "F: " + (Number(n.fat) || 0).toFixed(1) + "g";
                } else {
                    nutrition.textContent = "Nutrition unavailable";
                }

                info.appendChild(name);
                info.appendChild(nutrition);
                const removeBtn = document.createElement("button");
                removeBtn.type = "button";
                removeBtn.className = "text-red-500 hover:text-red-700 p-2";
                removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
                removeBtn.addEventListener("click", function () {
                    foodLog.removeMeal(entry.id);
                    renderFoodLog();
                });

                card.appendChild(img);
                card.appendChild(info);
                card.appendChild(removeBtn);
                container.appendChild(card);
            }
        }






        // Update today's nutrition progress bars
        function renderDailyProgress() {

            // Get today's nutrition totals
            const totals = foodLog.getTodayTotals();

            // Set daily nutrition goals
            const goals = {
                calories: 2000,
                protein: 50,
                carbs: 250,
                fat: 65
            };

            // Get the Today's Nutrition section
            const container = document.getElementById("foodlog-today-section");

            // Stop if the section does not exist
            if (!container) {
                return;
            }

            // Get all nutrition cards
            const progressCards = container.querySelectorAll(".grid > div");

            // Store nutrition information
            const nutrients = [
                { key: "calories", unit: "kcal" },
                { key: "protein", unit: "g" },
                { key: "carbs", unit: "g" },
                { key: "fat", unit: "g" }
            ];

            // Loop through all nutrition cards
            for (let i = 0; i < nutrients.length; i++) {

                const nutrient = nutrients[i];
                const card = progressCards[i];

                // Check if the card exists
                if (!card) {
                    continue;
                }

                // Get the current nutrition value
                const value = Number(totals[nutrient.key]) || 0;

                // Get the daily goal
                const goal = goals[nutrient.key];

                // Calculate the progress percentage
                let percentage = (value / goal) * 100;

                // Keep the progress between 0% and 100%
                if (percentage > 100) {
                    percentage = 100;
                }

                if (percentage < 0) {
                    percentage = 0;
                }

                // Get the nutrition value text
                const valueText = card.querySelector(".text-gray-500");

                // Get the gray background of the progress bar
                const progressTrack = card.querySelector(
                    ".w-full.bg-gray-200"
                );

                // Get the colored bar inside the gray background
                let progressBar = null;

                if (progressTrack) {
                    progressBar = progressTrack.firstElementChild;
                }

                // Update the displayed nutrition numbers
                if (valueText) {

                    valueText.textContent =
                        Math.round(value) + " / " +
                        goal + " " + nutrient.unit;
                }

                // Update the colored progress bar
                if (progressBar) {

                    progressBar.style.width = percentage + "%";
                    progressBar.style.transition = "width 0.5s ease";
                }
            }
        }







        // Display the weekly calories chart
        function renderWeeklyChart() {

            // Get the chart container from HTML
            const container = document.getElementById("weekly-chart");

            // Check if the container and Plotly exist
            if (!container || typeof Plotly === "undefined") {
                console.warn("Weekly chart not found");
                return;
            }

            // Get all food log entries
            const entries = foodLog.getAll();

            // Create arrays for days and calories
            const days = [];
            const calories = [];

            // Get the last 7 days
            for (let i = 6; i >= 0; i--) {

                const date = new Date();

                date.setHours(12, 0, 0, 0);
                date.setDate(date.getDate() - i);

                // Get the current date as text
                const dayKey = date.toDateString();

                // Start calories from zero
                let dailyCalories = 0;

                // Check all logged food entries
                for (let j = 0; j < entries.length; j++) {

                    const entry = entries[j];

                    // Check if the entry belongs to this day
                    if (new Date(entry.loggedAt).toDateString() === dayKey) {

                        if (entry.nutrition) {

                            dailyCalories +=
                                Number(entry.nutrition.calories) || 0;
                        }
                    }
                }

                // Add the day name
                days.push(
                    date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                    })
                );

                // Add daily calories
                calories.push(Math.round(dailyCalories));
            }

            // Set a fixed chart height
            container.style.height = "256px";
            container.style.width = "100%";
            container.style.overflow = "hidden";

            // Remove the old chart and placeholder
            Plotly.purge(container);
            container.innerHTML = "";

            // Prepare chart data
            const chartData = [
                {
                    x: days,
                    y: calories,
                    type: "bar",
                    marker: {
                        color: "#10b981"
                    },
                    hovertemplate: "%{y} kcal<extra></extra>"
                }
            ];

            // Prepare chart layout
            const chartLayout = {

                height: 256,

                margin: {
                    t: 15,
                    r: 15,
                    b: 50,
                    l: 60
                },

                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",

                font: {
                    family: "Arial, sans-serif"
                },

                yaxis: {
                    title: {
                        text: "Calories (kcal)"
                    },
                    rangemode: "tozero",
                    gridcolor: "#e5e7eb"
                },

                xaxis: {
                    type: "category",
                    tickangle: -30
                },

                showlegend: false,
                autosize: false
            };

            // Chart settings
            const chartConfig = {
                responsive: true,
                displayModeBar: false
            };

            // Draw the chart
            Plotly.newPlot(
                container,
                chartData,
                chartLayout,
                chartConfig
            );
        }






        // Clear only today's food log after confirmation
        const clearFoodLogBtn = document.getElementById("clear-foodlog");
        if (clearFoodLogBtn) {
            clearFoodLogBtn.addEventListener("click", function () {
                const confirmed = confirm("Are you sure you want to clear today's food log?");
                if (!confirmed) {
                    return;
                }
                foodLog.clearToday();
                renderFoodLog();
            });
        }





        // Show saved food log entries on startup
        renderFoodLog();






        // Add a food entry manually
        const quickActionButtons = document.querySelectorAll("#foodlog-section .quick-log-btn");
        const customEntryBtn = quickActionButtons[2];
        if (customEntryBtn) {
            customEntryBtn.addEventListener("click", function () {
                const name = prompt("Enter food name:");
                if (name === null) {
                    return;
                }
                const calories = prompt("Calories (kcal):");
                if (calories === null) {
                    return;
                }
                const protein = prompt("Protein (g):");
                if (protein === null) {
                    return;
                }
                const carbs = prompt("Carbs (g):");
                if (carbs === null) {
                    return;
                }
                const fat = prompt("Fat (g):");
                if (fat === null) {
                    return;
                }

                try {
                    // All four nutrition fields must contain a value
                    if (calories.trim() === "" || protein.trim() === "" ||
                        carbs.trim() === "" || fat.trim() === "") {
                        throw new Error("All nutrition values are required");
                    }
                    foodLog.addCustomEntry(name, {
                        calories: calories,
                        protein: protein,
                        carbs: carbs,
                        fat: fat
                    });
                    renderFoodLog();
                    alert("Custom food added successfully!");
                } catch (error) {
                    alert(error.message);
                }
            });
        }







        // Open meal details when a meal card is clicked
        const recipesGrid = document.getElementById("recipes-grid");
        if (recipesGrid) {
            recipesGrid.addEventListener("click", async function (event) {
                const card = event.target.closest("[data-meal-id]");
                if (!card) {
                    return;
                }
                const mealId = card.dataset.mealId;
                await mealDetailsView.showMeal(mealId);
            });
        }







        // Go back from meal details to the recipes
        const backToMealsBtn = document.getElementById("back-to-meals-btn");
        if (backToMealsBtn) {
            backToMealsBtn.addEventListener("click", function () {
                mealDetailsView.showRecipesPage();
            });
        }







        // Filter meals while typing in the search input
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
            searchInput.addEventListener("input", function (event) {
                const searchText = event.target.value;
                console.log("Searching for:", searchText);
                filters.setSearch(searchText);
            });
        } else {
            console.error("Search input not found!");
        }







        // Filter meals when a category card is clicked
        const categoriesGrid = document.getElementById("categories-grid");
        if (categoriesGrid) {

            categoriesGrid.addEventListener("click", function (event) {

                // Get the clicked category card
                const card = event.target.closest("[data-category]");

                if (!card) {
                    return;
                }

                // Get all category cards
                const cards = categoriesGrid.querySelectorAll("[data-category]");

                // Remove active style from all category cards
                for (let i = 0; i < cards.length; i++) {
                    cards[i].classList.remove("border-emerald-600", "ring-2", "ring-emerald-500");
                    cards[i].classList.add("border-emerald-200");
                }

                // Add active style to the clicked category
                card.classList.remove("border-emerald-200");
                card.classList.add("border-emerald-600", "ring-2", "ring-emerald-500");

                // Apply the selected category filter
                filters.setCategory(card.dataset.category);
            });
        }









        // Create area filter buttons without map, spread or destructuring
        const areaContainer = document.querySelector("#search-filters-section .overflow-x-auto");
        const areaButtonClass =
            "px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all";



        function renderAreaButtons() {
            if (!areaContainer) {
                return;
            }
            areaContainer.replaceChildren();

            // First button shows all recipes
            const allButton = document.createElement("button");
            allButton.type = "button";
            allButton.className = areaButtonClass + " bg-gray-100 text-gray-700 hover:bg-gray-200";
            allButton.dataset.area = "";
            allButton.textContent = "All Recipes";
            areaContainer.appendChild(allButton);

            // Add one button for each area from the API
            for (let i = 0; i < areas.length; i++) {
                const area = areas[i];
                const button = document.createElement("button");
                button.type = "button";
                button.className = areaButtonClass + " bg-gray-100 text-gray-700 hover:bg-gray-200";
                button.dataset.area = area;
                button.textContent = area;
                areaContainer.appendChild(button);
            }
        }

        renderAreaButtons();





        if (areaContainer) {

            areaContainer.addEventListener("click", function (event) {

                // Get the clicked area button
                const button = event.target.closest("[data-area]");

                if (!button) {
                    return;
                }

                // Get all area buttons
                const buttons = areaContainer.querySelectorAll("[data-area]");

                // Remove active style from all buttons
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].classList.remove("bg-emerald-600", "text-white");
                    buttons[i].classList.add("bg-gray-100", "text-gray-700");
                }

                // Add active style to the clicked button
                button.classList.remove("bg-gray-100", "text-gray-700");
                button.classList.add("bg-emerald-600", "text-white");

                // Apply the selected area filter
                if (button.dataset.area === "") {
                    filters.setArea("");
                } else {
                    filters.setArea(button.dataset.area);
                }
            });
        }




        console.log("NutriPlan ready!");
    } catch (error) {
        console.error("App initialization failed:", error);
        const recipesGrid = document.getElementById("recipes-grid");
        if (recipesGrid) {
            recipesGrid.innerHTML = `
                <p class="text-red-500 text-center py-8">Failed to load recipes.</p>
            `;
        }
    } finally {
        // Hide the loading overlay whether startup succeeds or fails
        const loadingOverlay = document.getElementById("app-loading-overlay");
        if (loadingOverlay) {
            loadingOverlay.classList.add("hidden");
        }
    }
}

initApp();

