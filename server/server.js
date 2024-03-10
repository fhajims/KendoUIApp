const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module

console.log("hallo");
const sqlite3 = require('sqlite3').verbose();

console.log("hallo");
const app = express();
const port = 3000;


const db = new sqlite3.Database('kendodatabase.db', (err) => {
  if (err) {
      console.error('Error opening database:', err.message);
  } else {
      console.log('Connected to the SQLite database.');
  }
});

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'client' folder
app.use(express.static(path.resolve(__dirname, "..", 'client')));

// Routes
app.get('/', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error('Error retrieving data from database:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
});


app.post('/api/data', (req, res) => {
  const { data } = req.body;
  // Do something with the data
  console.log('Received data:', data);
  res.json({ success: true, message: 'Data received successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

