
export class ProductsAPI {

    constructor() {

        // Open Food Facts API URL
        this.baseURL = "https://world.openfoodfacts.org";
    }


    // Search for products by name
    async searchProducts(query) {

        // Prepare the search URL
        const url = "http://localhost:3000/api/products/search?q=" + encodeURIComponent(query);

        // Send the search request
        const response = await fetch(url);

        // Check if the request failed
        if (!response.ok) {
            throw new Error("Product search failed: " + response.status);
        }

        // Convert the response to JavaScript data
        const data = await response.json();

        // Return the products array
        if (data.products) {
            return data.products;
        }

        // Return an empty array if no products exist
        return [];
    }


    // Find a product using its barcode
    async getProductByBarcode(barcode) {

        // Convert barcode to text and remove spaces
        const cleanBarcode = String(barcode).trim();

        // Check if barcode contains only 8 to 14 digits
        const barcodePattern = /^\d{8,14}$/;

        if (!barcodePattern.test(cleanBarcode)) {
            throw new Error("Enter a valid barcode (8-14 digits)");
        }

        // Prepare the product URL
        const url = this.baseURL + "/api/v2/product/" + cleanBarcode + ".json";

        // Send the barcode request
        const response = await fetch(url);

        // Check if the request failed
        if (!response.ok) {
            throw new Error("Barcode lookup failed: " + response.status);
        }

        // Convert the response to JavaScript data
        const data = await response.json();

        // Return the product if it exists
        if (data.status === 1) {
            return data.product;
        }

        // Return null if the product was not found
        return null;
    }
}


// Create one object to use in other files
export const productsAPI = new ProductsAPI();



