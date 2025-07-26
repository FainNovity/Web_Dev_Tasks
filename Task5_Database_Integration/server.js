
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// MS SQL Server connection configuration
const config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, 
        trustServerCertificate: true // For local run.
    }
};

let pool;

// --- CRUD Operations ---

// CREATE a new user
app.post('/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('age', sql.Int, age)
            .query("INSERT INTO users (name, email, age) OUTPUT INSERTED.* VALUES (@name, @email, @age)");

        res.status(201).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// READ all users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.request().query("SELECT * FROM users ORDER BY id ASC");
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// READ a single user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM users WHERE id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age } = req.body;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('age', sql.Int, age)
            .query("UPDATE users SET name = @name, email = @email, age = @age OUTPUT INSERTED.* WHERE id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM users OUTPUT DELETED.* WHERE id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send(); // Successfully deleted
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// Function to ensure the 'users' table exists
const ensureTableExists = async () => {
    try {
        const tableCheckRequest = pool.request();
        const tableExistsResult = await tableCheckRequest.query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
            CREATE TABLE users (
                id INT PRIMARY KEY IDENTITY(1,1),
                name NVARCHAR(100) NOT NULL,
                email NVARCHAR(100) UNIQUE NOT NULL,
                age INT
            );
        `);
        console.log("✅ 'users' table checked/created successfully.");
    } catch (err) {
        console.error("❌ Error creating table: ", err.message);
        throw err; 
    }
};


// Start the server
const startServer = async () => {
    try {
        console.log("Connecting to database... ⏳");
        pool = await sql.connect(config);
        console.log("✅ Database connection successful!");

        await ensureTableExists();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("❌ Failed to connect to the database. Server is not running.", err.message);
        process.exit(1); 
    }
};

startServer();