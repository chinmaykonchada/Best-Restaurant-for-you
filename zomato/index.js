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
    const response = await axios.get(`${API_URL}/allrestaurant`, {
      params: { page, limit }
    });
    res.render("index.ejs", { 
      restaurants: response.data,
      page: page,
      limit: limit
    });
  } catch (error) {
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