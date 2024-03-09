const sqlite3 = require('sqlite3').verbose();

// Open a connection to the SQLite database file
const db = new sqlite3.Database('kendodatabase.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Example query: Select all users from the users table
    db.all('SELECT * FROM users', (err, rows) => {
      if (err) {
        console.error('Error executing query:', err.message);
        return;
      }
      // Output the results
      console.log('Users:');
      rows.forEach((row) => {
        console.log(row);
      });
    });

    db.all('SELECT * FROM posts', (err, rows) => {
      if (err) {
        console.error('Error executing query:', err.message);
        return;
      }
      // Output the results
      console.log('posts:');
      rows.forEach((row) => {
        console.log(row);
      });

      // Close the database connection when done
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Disconnected from the SQLite database.');
        }
      });
    });
  }
});
