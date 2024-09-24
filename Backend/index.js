const express = require('express');
const cors = require('cors'); // Import CORS
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

// Enable CORS
app.use(cors());  // Allow cross-origin requests from the frontend

// Body parser middleware
app.use(bodyParser.json());  // Parse incoming JSON data

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'server_database',
  password: 'Keerthanag@2003',
  database: 'user_details'
});

// Connect to MySQL
db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Endpoint to register user and address
app.post('/register', (req, res) => {
  const { name, address } = req.body;

  console.log('Received data:', name, address);  // Debug logging

  // Insert user into User table
  const userQuery = 'INSERT INTO User (name) VALUES (?)';
  db.query(userQuery, [name], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json(err);
    }

    const userId = result.insertId;

    // Insert address into Address table with user_id
    const addressQuery = 'INSERT INTO Address (user_id, address) VALUES (?, ?)';
    db.query(addressQuery, [userId, address], (err, result) => {
      if (err) {
        console.error('Error inserting address:', err);
        return res.status(500).json(err);
      }

      res.json({ message: 'User and address saved successfully' });
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
