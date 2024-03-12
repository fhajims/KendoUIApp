const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module
console.log("hallo");
const sqlite3 = require('sqlite3').verbose();
const morgan = require("morgan");
const axios = require("axios");
const qr= require("qr-image");
const fs= require("fs")
console.log("hallo");
const app = express();
const port = 3000;
const multer  = require('multer')
//const upload = multer({ dest: './public/data/uploads/' })

/*function LoginName(req, res, next) {
  console.log(req.body);
  loginName = req.body
}*/

/* function logger(req, res, next) {
  console.log("Request Method: ", req.method)
  console.log("Request URL: ", req.url)
  next()
} */

//app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({extended: true}));

function LoginNameGenerator (req, res, next) {
  console.log(req.body);
  loginName = req.body["username"] + req.body["password"]
  console.log("hello")
  next()
}

app.use(LoginNameGenerator);

//app.use(logger)


app.post('/submit', async (req, res) => {
  // Assuming some condition here
  if (req.body["username"] == "dergeheimeuser") {
      try {          
          res.sendFile(path.join(__dirname, '../public', 'secret.html'));
      } catch (error) {
          console.error(error);
          res.status(500).send('Beep Beep Beep Error Beep Beep.');
      }
  } else {
      //res.send('Condition not met. Try harder to get my secret');
      res.sendFile(path.join(__dirname, '../public', 'login.html'));
  }
});


/*app.post('/upload', upload.single('uploaded_file'), function (req, res) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any 
  console.log(req.file, req.body)
});*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully: ' + req.file.filename);
});

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
app.use(express.static(path.resolve(__dirname, "..", 'public')));
//app.use(express.static(staticFilesPath));
// Routes



app.get('/', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/posts', (req, res) => {
  console.log("hai")
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public', 'posts.html'));
});

app.get('/secret', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  
  res.sendFile(path.join(__dirname, '../../public', 'secret.html'));
});

app.get('/index', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  console.log("hai")
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/login', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  console.log("hai")
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
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

app.get('/contact', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  console.log("hai")
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public', 'contact.html'));
});

app.get('/about', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  console.log("hai")
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public', 'about.html'));
});


/*app.get('/posts', (req, res) => {
  db.all('SELECT * FROM posts', (err, rows) => {
      if (err) {
          console.error('Error retrieving data from database:', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.sendFile(path.join(__dirname, '../client', 'posts.html'));
         // res.json(rows);
      }
      console.log("Postsretrieved")
      //res.sendFile(path.join(__dirname, '../client', 'posts.html'));
  });
});*/


app.post('/api/data', (req, res) => {
  const { data } = req.body;
  // Do something with the data
  console.log('Received data:', data);
  res.json({ success: true, message: 'Data received successfully' });
});

app.post('/qrcode', (req, res) => {
  var qrcodetext = req.body["qrcode"];
  var qr_svg = qr.image(qrcodetext);
  qr_svg.pipe(fs.createWriteStream('qr_img.png'));
  //res.send(`Your qrcode for ${qrcodetext}`);
  const imagePath = 'C:\\Users\\FH_J\\Documents\\Kendo_UI\\server\\qr_img.png'
  res.sendFile(imagePath);
  fs.writeFile('qrcode.txt', qrcodetext, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  }); 
 
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

