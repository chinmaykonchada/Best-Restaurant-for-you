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
        const result = await db.query('SELECT * FROM zomato WHERE "Restaurant ID" = $1', [id]);// SQL query to use double quotes for the column name since it's case-sensitive.
        console.log(result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//GET All restaurants
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

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
