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
const pg = require('pg')

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  schema: ["cookalicious"],
  database: "postgres",
  password: "postgres",
  port: 5432
})
db.connect();

/*
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
*/



app.set('view engine', 'ejs');

const upload = multer({ dest: './public/data/uploads/' })

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


/*

app.post('/submit', async (req, res) => {
  // Assuming some condition here
  if (req.body["username"] == "dergeheimeuser") {
      try {          
          res.sendFile(path.join(__dirname, '../public', 'secret.html'));
      } catch (error) {
          console.error(error);
          res.status(500).send('Beep Beep Beep Error Beep Beep.');
      }
  } 
  
  else {
      //res.send('Condition not met. Try harder to get my secret');
      res.render(path.join(__dirname, '../views', 'login.ejs'));
  }
});

*/

app.post('/login', async (req, res) => {
  const username = req.body.username
  console.log(username)
  const password = req.body.password
  console.log(password)
  const email = req.body.email
  
    try {
      const result = await db.query("SELECT * FROM cookalicious.users WHERE username = $1", [username]);
  
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log(user);
        console.log(result.rows);
        const storedPassword = user.password;
  
        if (password === storedPassword) {
          return res.render(path.join(__dirname, '../views', 'loggedin.ejs'), { data: { username, password }});

        } else {
          return res.send("Incorrect Password");
        }
      } else {
        return res.send("User not found");
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }
  });
  



app.post('/upload', upload.single('uploaded_file'), function (req, res) {
  console.log(req.file, req.body)
});

app.post('/myrecipes', upload.single('uploaded_file'), function (req, res) {

  console.log(req.file, req.body)
});



app.post('/recipes', async (req, res) => {
  try {
    //console.log(req.body)
    //console.log("asdf")
    const recipeSelection = req.body.recipeSelection
    //console.log(recipeSelection)
    //console.log("awfeef")
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeSelection}`
    );
    const result = response.data;
    // console.log(result)
    res.render(path.join(__dirname, '../views', 'recipes.ejs'), {
        data: result
    });
  } catch (error) {
    console.error("Failed to make request halihalo", error.message);
    res.render(path.join(__dirname, '../views', 'recipes.ejs'), {
      error: "No Meal was found"
    });
  }
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any 
  console.log(req.file, req.body)
});


/*app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully: ' + req.file.filename);
});
*/

/*

const db = new sqlite3.Database('kendodatabase.db', (err) => {
  if (err) {
      console.error('Error opening database:', err.message);
  } else {
      console.log('Connected to the SQLite database.');
  }
});

*/

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'client' folder
//app.use(express.static(path.resolve(__dirname, "..", 'public')));
//app.use(express.static(staticFilesPath));
// Routes



app.get('/', (req, res) => {
  
  today = new Date();
  day = today.getDate();
  hour = today.getHours();
  minutes = today.getMinutes();
  seconds = today.getSeconds();

  res.render(path.join(__dirname, '../views', 'index.ejs'),
   {
    day: day,
    hour: hour,
    minutes: minutes,
    seconds: seconds,
    dayType: "a weekday",
    advice: "it´s time to work hard"})
});

app.get('/weather', (req, res) => {
  res.render(path.join(__dirname, '../views', 'weather.ejs'));
});

app.get('/qrcode', (req, res) => {
  res.render(path.join(__dirname, '../views', 'qrcodegensite.ejs'));
});

/*
app.get('/', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
*/
app.get('/posts', (req, res) => {
  console.log("hai")
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public', 'posts.html'));
});



app.get('/register', async (req, res) => {
  
  res.render(path.join(__dirname, '../views', 'register.ejs'));

});
  console.log("hai")
  console.log(__dirname)
  

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  function isPasswordSecure(password) {
    return passwordRegex.test(password);
  }

  const emailregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  function isemailvalid(email) {
    return emailregex.test(email);
  }

  
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/

app.post('/registerattempt', async (req, res) => {
  
    
  
  const {username, password, email, firstname, lastname, telephonenumber} = req.body
  console.log(req.body)

  if (!isPasswordSecure(password)) {
    return res.render(path.join(__dirname, '../views', 'register.ejs'), {
      errorMessage: `Password is not secure enough.
      The password can consist of letters (both lowercase and uppercase), digits, and the special characters @$!%*?&.
      Minimum length = 8`
    });
  }

  if (!isemailvalid(password)) {
    return res.render(path.join(__dirname, '../views', 'register.ejs'), {
      errorMessageEmail: `Email is not a valid email address`
    });
  }



  const checkResult = await db.query("select user, email from cookalicious.users where username = $1 and email = $2" , [
    username, email
  ]);

  if (checkResult.rows.length > 0) {
    return res.render(path.join(__dirname, '../views', 'register.ejs'), {
      errorMessage: "User already exists"
    });
  } else
  try {
    
    const result = await db.query(
      "INSERT INTO cookalicious.users (username, email, password, firstname, lastname, telephonenumber) VALUES ($1, $2, $3, $4, $5, $6)",
      [username, email, password, firstname, lastname, telephonenumber]
    );
    res.render(path.join(__dirname, '../views', 'loggedin.ejs'), {
      data: { username, password }
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Error occurred during registration.');
  }




});




   
/*
  const email = req.body.email;
 
  try {
  const checkResult = await db.query("Select * from users where email = $1", [
    email,
    
  ]); } catch (error) {
    console.log("asdfewfwfewfewf")
  }

  if (checkResult.rows.length > 0) {
    res.send("Email Exists. Login pls")
    console.log("hasidfhapfoie")
  } else 

  try {
    const result = await db.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
      [username, password, email]
    );
    console.log("User registered successfully");
    res.render(path.join(__dirname, '../views', 'accountcreated.ejs'));
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});

*/

/*
  console.log(username)
  console.log(password)
  console.log("hai")
  console.log(__dirname)
  if (!/^.*(?=.{8,})(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]).*$/.test(req.body["password"])) {
    res.render(path.join(__dirname, '../views', 'invalidregistration.ejs'));
    alert("Bitte Sonderzeichen eingeben und eine Zahl")
  } else {
  res.render(path.join(__dirname, '../views', 'accountcreated.ejs'));}
});

/*
*/
app.get('/secret', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  
  res.sendFile(path.join(__dirname, '../../public', 'secret.html'));
});




app.get('/index', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  today = new Date();
  day = today.getDate();
  hour = today.getHours();
  minutes = today.getMinutes();
  seconds = today.getSeconds();
  console.log("hai")
  console.log(__dirname)
  //res.sendFile(path.join(__dirname, '../public', 'index.html'));
  res.render(path.join(__dirname, '../views', 'index.ejs'));
});

app.get('/login', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  const email = req.body.username
  const password = req.body.password
  console.log("hai")
  console.log(__dirname)
  res.render(path.join(__dirname, '../views', 'login.ejs'));
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
  console.log(__dirname)
  res.render(path.join(__dirname, '../views', 'contact.ejs'));
});

app.get('/myrecipes', (req, res) => {
  console.log(__dirname)
  res.render(path.join(__dirname, '../views', 'myrecipes.ejs'));
});





app.get('/recipes', (req, res) => {

  console.log("hai")
  console.log(__dirname)
  res.render(path.join(__dirname, '../views', 'recipes.ejs'));
});

app.get('/about', (req, res) => {
  // Instead of sending "Hello World!", send the index.html file
  console.log("hai")
  console.log(__dirname)
  res.render(path.join(__dirname, '../views', 'about.ejs'));
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

app.use(express.static(path.resolve(__dirname, "..", 'public')));


// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

