
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const path = require("path");

dotenv.config({
  path: path.join(__dirname, ".env")
});

const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json());

app.post("/api/nutrition", async (req, res) => {
  try {
    const apiKey = process.env.USDA_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: { message: "USDA API key is missing" },
      });
    }

    const { recipeName, ingredients } = req.body;

    if (
      !recipeName ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: { message: "Invalid recipe data" },
      });
    }

    const response = await fetch(
      "https://nutriplan-api.vercel.app/api/nutrition/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ recipeName, ingredients }),
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Nutrition server error:", error);

    res.status(500).json({
      success: false,
      error: { message: "Nutrition request failed" },
    });
  }
});



app.get("/api/products/search", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query || query.length > 100) {
      return res.status(400).json({
        error: "Enter a valid product name",
      });
    }

    const url = new URL(
      "https://search.openfoodfacts.org/search"
    );

    url.searchParams.set("q", query);
    url.searchParams.set("page_size", "24");

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Open Food Facts: ${response.status}`);
    }

    const data = await response.json();

    res.json({
      products: data.hits ?? [],
    });

  } catch (error) {
    console.error("Product search error:", error.message);

    res.status(502).json({
      error: "Could not search products",
    });
  }
});





app.listen(PORT, () => {
  console.log(`Nutrition server running at http://localhost:${PORT}`);
});
