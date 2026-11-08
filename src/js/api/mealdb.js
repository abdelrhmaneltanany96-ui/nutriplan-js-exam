
import { ApiService } from "../core/ApiService.js";

// This class gets meal data from TheMealDB API
class MealDB extends ApiService {

  constructor() {

    // Set the main API URL
    super("https://www.themealdb.com/api/json/v1/1/");
  }

  // Get all meal categories
  async getCategories() {

    const data = await this.get("categories.php");

    if (data.categories) {
      return data.categories;
    }

    return [];
  }

  // Search for meals by name
  async searchMeals(query = "") {

    const data = await this.get("search.php", { s: query });

    if (data.meals) {
      return data.meals;
    }

    return [];
  }

  // Get the details of one meal using its ID
  async getMealById(id) {

    const data = await this.get("lookup.php", { i: id });

    if (data.meals && data.meals.length > 0) {
      return data.meals[0];
    }

    return null;
  }

  // Filter meals by category
  async filterByCategory(category) {

    const data = await this.get("filter.php", { c: category });

    if (data.meals) {
      return data.meals;
    }

    return [];
  }

  // Filter meals by country or area
  async filterByArea(area) {

    const data = await this.get("filter.php", { a: area });

    if (data.meals) {
      return data.meals;
    }

    return [];
  }

  // Get one random meal
  async getRandomMeal() {

    const data = await this.get("random.php");

    if (data.meals && data.meals.length > 0) {
      return data.meals[0];
    }

    return null;
  }

  // Get the list of meal areas
  async getAreas() {

    const data = await this.get("list.php", { a: "list" });

    let areas = [];

    if (data.meals) {

      for (let i = 0; i < data.meals.length; i++) {
        areas.push(data.meals[i].strArea);
      }
    }

    return areas;
  }
}

// Create one object to use in the application
export const mealDB = new MealDB();







