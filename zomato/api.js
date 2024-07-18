import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "projects",
    password: "chinmay@123",
    port: 5432,
});
db.connect();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//GET a specific restaurant by id
app.get('/restaurant/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await db.query('SELECT * FROM zomato WHERE "Restaurant ID" = $1', [id]);
        // console.log(result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//GET All restaurants with pagination
app.get('/allrestaurant', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const result = await db.query('SELECT * FROM zomato LIMIT $1 OFFSET $2', [limit, offset]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// GET restaurants by name search
app.get('/searchrestaurants', async (req, res) => {
    const { searchTerm, page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (pageNumber - 1) * itemsPerPage;

    try {
        let queryString = `
            SELECT * FROM zomato 
            WHERE LOWER("Restaurant Name") LIKE LOWER($1)
            LIMIT $2 OFFSET $3
        `;
        const queryParams = [`%${searchTerm}%`, itemsPerPage, offset];

        const result = await db.query(queryString, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//GET Filtered restaurants
app.get('/filteredrestaurants', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { country, minSpend, maxSpend, cuisines } = req.query;

    let queryString = 'SELECT * FROM zomato WHERE 1=1';
    const queryParams = [];
    let paramCount = 1;

    if (country) {
        queryString += ` AND "Country Code" = $${paramCount}`;
        queryParams.push(country);
        paramCount++;
    }

    if (minSpend) {
        queryString += ` AND "Average Cost for two" >= $${paramCount}`;
        queryParams.push(minSpend);
        paramCount++;
    }

    if (maxSpend) {
        queryString += ` AND "Average Cost for two" <= $${paramCount}`;
        queryParams.push(maxSpend);
        paramCount++;
    }

    if (cuisines) {
        queryString += ` AND "Cuisines" LIKE $${paramCount}`;
        queryParams.push(`%${cuisines}%`);
        paramCount++;
    }

    queryString += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    try {
        const result = await db.query(queryString, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//GET Unique values for filters
app.get('/filterOptions', async (req, res) => {
    try {
        const countryCodes = await db.query('SELECT DISTINCT "Country Code" FROM zomato');
        const cuisines = await db.query('SELECT DISTINCT "Cuisines" FROM zomato');
        const avgCosts = await db.query('SELECT MIN("Average Cost for two") as min, MAX("Average Cost for two") as max FROM zomato');
        // console.log(avgCosts.rows);
        res.json({
            countryCodes: countryCodes.rows.map(row => row['Country Code']),
            cuisines: cuisines.rows.map(row => row['Cuisines']),
            avgCostRange: {
                min: avgCosts.rows[0].min,
                max: avgCosts.rows[0].max
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});