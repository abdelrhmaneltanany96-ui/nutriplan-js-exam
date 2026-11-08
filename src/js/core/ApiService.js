
export class ApiService {

  // This runs when we create a new object from the class
  constructor(baseURL) {

    // Save the main API URL
    this.baseURL = baseURL;
  }

  // Get data from the API
  async get(endpoint, params = {}) {

    // Combine the base URL with the endpoint
    let url = this.baseURL + endpoint;

    // Check if we are adding the first parameter
    let firstParam = true;

    // Loop through the parameters
    for (let key in params) {

      // Skip empty or missing values
      if (params[key] != null) {

        // Add ? before the first parameter
        if (firstParam) {
          url += "?";
          firstParam = false;
        } else {

          // Add & before the other parameters
          url += "&";
        }

        // Add the parameter name and its value to the URL
        url += encodeURIComponent(key);
        url += "=";
        url += encodeURIComponent(params[key]);
      }
    }

    try {

      // Send a request to the API and wait for the response
      const response = await fetch(url);

      // Check if the request failed
      if (!response.ok) {
        throw new Error("HTTP Error: " + response.status);
      }

      // Convert the JSON response into JavaScript data
      const data = await response.json();

      // Return the data
      return data;

    } catch (error) {

      // Show the error in the console
      console.error("API Request Failed:", error);

      // Send the error back to the code that called get()
      throw error;
    }
  }
}









// Example usage:

// this.get("search.php", {
//   s: "chicken",
//   f: "c"
// });

// let url = this.baseURL + endpoint;

// https://www.themealdb.com/api/json/v1/1/search.php


// let firstParam = true;



// key = "s";
// params[key] = "chicken";


// بما إن firstParam قيمته true، الكود هيضيف ? وبعدها s=chicken.
// الرابط بعد أول Parameterhttps://www.themealdb.com/api/json/v1/1/search.php?s=chicken

// وبعدين:
// firstParam = false;


// الخطوة 3 — ثاني Parameter
// الـ Loop تلف تاني:
// key = "f";
// params[key] = "c";


// بما إن firstParam بقت false، الكود هيضيف & بدل ?.
// الرابط النهائيhttps://www.themealdb.com/api/json/v1/1/search.php?s=chicken&f=c
