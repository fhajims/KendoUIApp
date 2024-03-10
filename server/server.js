const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'client' folder
app.use(express.static(path.resolve(__dirname, "..", 'client')));

// Routes
app.get('/', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
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

