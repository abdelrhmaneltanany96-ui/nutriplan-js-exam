
export class FoodLog {

    constructor() {

        // Set the LocalStorage key
        this.storageKey = "nutriplan-food-log";

        // Load saved food entries
        this.entries = this.load();
    }


    // Load saved entries from LocalStorage
    load() {

        try {

            // Get saved data
            const saved = localStorage.getItem(this.storageKey);

            // Return an empty array if nothing is saved
            if (!saved) {
                return [];
            }

            // Convert JSON text to JavaScript data
            const parsed = JSON.parse(saved);

            // Make sure the saved data is an array
            if (Array.isArray(parsed)) {
                return parsed;
            }

            return [];

        } catch (error) {

            // Handle invalid saved data
            console.error("Food Log loading error:", error);

            return [];
        }
    }


    // Save all entries to LocalStorage
    save() {

        // Convert the entries array to JSON text
        const data = JSON.stringify(this.entries);

        // Save the data
        localStorage.setItem(this.storageKey, data);
    }


    // Add a meal to the Food Log
    addMeal(meal, nutrition = null) {

        // Check if the meal is valid
        if (!meal || !meal.idMeal) {
            throw new Error("Invalid meal");
        }

        // Create a new food entry
        const entry = {
            id: crypto.randomUUID(),
            mealId: meal.idMeal,
            name: meal.strMeal,
            image: meal.strMealThumb,
            loggedAt: new Date().toISOString(),
            nutrition: nutrition
        };

        // Add the meal to the entries array
        this.entries.push(entry);

        // Save the updated entries
        this.save();

        // Return the added entry
        return entry;
    }


    // Get all saved food entries
    getAll() {

        // Create a new array
        const allEntries = [];

        // Copy all entries into the new array
        for (let i = 0; i < this.entries.length; i++) {
            allEntries.push(this.entries[i]);
        }

        // Return the copied array
        return allEntries;
    }


    // Get today's food entries
    getToday() {

        // Get today's date
        const today = new Date().toDateString();

        // Store today's entries
        const todayEntries = [];

        // Check all saved entries
        for (let i = 0; i < this.entries.length; i++) {

            const entry = this.entries[i];

            // Get the date when this entry was added
            const entryDate = new Date(entry.loggedAt).toDateString();

            // Add the entry if it belongs to today
            if (entryDate === today) {
                todayEntries.push(entry);
            }
        }

        // Return today's entries
        return todayEntries;
    }


    // Remove one food entry
    removeMeal(entryId) {

        // Store entries that should remain
        const remainingEntries = [];

        // Check all saved entries
        for (let i = 0; i < this.entries.length; i++) {

            const entry = this.entries[i];

            // Keep entries with a different ID
            if (entry.id !== entryId) {
                remainingEntries.push(entry);
            }
        }

        // Update the entries array
        this.entries = remainingEntries;

        // Save the changes
        this.save();
    }


    // Remove all entries added today
    clearToday() {

        // Get today's date
        const today = new Date().toDateString();

        // Store entries from other days
        const remainingEntries = [];

        // Check all saved entries
        for (let i = 0; i < this.entries.length; i++) {

            const entry = this.entries[i];

            // Get the entry date
            const entryDate = new Date(entry.loggedAt).toDateString();

            // Keep entries that are not from today
            if (entryDate !== today) {
                remainingEntries.push(entry);
            }
        }

        // Update the entries array
        this.entries = remainingEntries;

        // Save the changes
        this.save();
    }


    // Calculate today's nutrition totals
    getTodayTotals() {

        // Start all nutrition values at zero
        const totals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        };

        // Get today's food entries
        const todayEntries = this.getToday();

        // Loop through today's entries
        for (let i = 0; i < todayEntries.length; i++) {

            const entry = todayEntries[i];

            // Skip entries without nutrition information
            if (!entry.nutrition) {
                continue;
            }

            // Add nutrition values to today's totals
            totals.calories += Number(entry.nutrition.calories) || 0;
            totals.protein += Number(entry.nutrition.protein) || 0;
            totals.carbs += Number(entry.nutrition.carbs) || 0;
            totals.fat += Number(entry.nutrition.fat) || 0;
        }

        // Return today's nutrition totals
        return totals;
    }


    // Add a custom food or product
    addCustomEntry(name, nutrition) {

        // Remove extra spaces from the food name
        const cleanName = name.trim();

        // Check if the food name is empty
        if (!cleanName) {
            throw new Error("Food name is required");
        }

        // Store the nutrition values
        const values = {};

        // List of required nutrition values
        const keys = ["calories", "protein", "carbs", "fat"];

        // Check each nutrition value
        for (let i = 0; i < keys.length; i++) {

            const key = keys[i];

            // Convert the value to a number
            const value = Number(nutrition[key]);

            // Check if the value is valid
            if (!Number.isFinite(value) || value < 0) {
                throw new Error("Invalid " + key + " value");
            }

            // Save the valid value
            values[key] = value;
        }

        // Create a new custom entry
        const entry = {
            id: crypto.randomUUID(),
            mealId: null,
            name: cleanName,
            image: null,
            loggedAt: new Date().toISOString(),
            nutrition: values,
            type: "custom"
        };

        // Add the custom entry
        this.entries.push(entry);

        // Save the updated entries
        this.save();

        // Return the new entry
        return entry;
    }
}