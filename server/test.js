const fs = require("fs");


fs.writeFile('message.txt', "hihihihihi", (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  }); 

fs.readFile('message.txt', encoding = 'UTF-8', (err, data) => {
    if (err) throw err;
    console.log(data);
  }); 
