import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//GET all restaurants
app.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { country, cuisines, minSpend, maxSpend, searchTerm } = req.query;

    // Fetch filter options
    const filterOptionsResponse = await axios.get(`${API_URL}/filterOptions`);
    const filterOptions = filterOptionsResponse.data;

    let response;
    if (searchTerm) {
      // If there's a search term, use the new search endpoint
      response = await axios.get(`${API_URL}/searchrestaurants`, {
        params: { searchTerm, page, limit }
      });
    } else {
      // Otherwise, use the existing filtered restaurants endpoint
      response = await axios.get(`${API_URL}/filteredrestaurants`, {
        params: { page, limit, country, cuisines, minSpend, maxSpend }
      });
    }

    const currentFilters = {
      country: country || '',
      cuisines: cuisines || '',
      minSpend: minSpend || '',
      maxSpend: maxSpend || '',
      searchTerm: searchTerm || ''
    };

    res.render("index.ejs", { 
      restaurants: response.data,
      page: page,
      limit: limit,
      filterOptions: filterOptions,
      currentFilters: currentFilters
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});

//GET a specific restaurant by id
app.get("/restaurant/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant/${req.params.id}`);
    res.render("restaurant.ejs", { restaurant: response.data[0] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant details" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});