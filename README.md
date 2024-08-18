# Zomato Restaurant Explorer

## Description
This project is a web application that allows users to explore and search for restaurants using data from Zomato. It features a paginated list of restaurants with filtering options by country, cuisine, and price range, as well as a search functionality by restaurant name.

## Features
- Search restaurants by name
- View detailed information about a specific restaurant
- Responsive design for various screen sizes
- View a paginated list of restaurants
- Filter restaurants by:
  - Country
  - Cuisine
  - Price range (average cost for two)

## Tech Stack
- Frontend: HTML, CSS, JavaScript, EJS
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Additional libraries: Axios for HTTP requests, Bootstrap for styling

## Setup and Installation

1. Clone the repository:
2. Install dependencies:
npm install
Copy
3. Set up the PostgreSQL database:
- Create a database named 'projects'
- Import the Zomato dataset into a table named 'zomato'
- Create a 'countries' table with columns 'Country Code' and 'Country Name'

4. Update database connection details in `api.js`:
```javascript
const db = new pg.Client({
    user: "your_username",
    host: "localhost",
    database: "projects",
    password: "your_password",
    port: 5432,
});
```
## Start the API server:
Copynode api.js

## Start the main application server:
Copynode index.js

## Access the application at http://localhost:3000

API Endpoints
- GET /restaurant/:id: Get details of a specific restaurant
- GET /allrestaurant: Get all restaurants (paginated)
- GET /filteredrestaurants: Get filtered restaurants
- GET /filterOptions: Get options for filters (countries, cuisines, price range)
- GET /searchrestaurants: Search restaurants by name

File Structure:
```
  api.js: API server handling database operations
  index.js: Main application server
  views/index.ejs: Main page template
  views/restaurant.ejs: Individual restaurant page template
  public/: Static files (CSS, images)
```