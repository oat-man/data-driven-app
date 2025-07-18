
require('dotenv').config();
const express = require('express');
const sql = require('mssql');
// const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
app.use(express.json());

// Use environment variables instead of hardcoding credentials
const dbConfig = {
    server: process.env.DB_SERVER || 'my-sqldb.database.windows.net',
    database: process.env.DB_NAME || 'MyAppDatabase',
    user: process.env.DB_USER || 'seksit',
    password: process.env.DB_PASSWORD || 'CrZzid4743$',
    options: {
        encrypt: true
    }
};

// Create a connection pool to reuse across requests
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed: ', err.message);
        process.exit(1);
    });

// GET /api/products endpoint
app.get('/api/products', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Products');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(`Database error: ${err.message}`);
    }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

