const express = require('express');
const app = express();
const path = require('path');

const db = require((path.join(__dirname, '../model/userFunctions')))
const users = require((path.join(__dirname, '../model/userDatabase')))


app.get('/verify', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  // With Object Reference
  // if (users[username].password == password) {
  //   const userSessionData = users[username].data;
  //   res.header("Access-Control-Allow-Origin", "*");
  //   return res.status(200).json(userSessionData);
  //   }
  
  // With JSON file database
  const userData = db.findUser(username, password);
  if (userData) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).json(userData);
  }

  else {
    // TODO: Base option: immediate sign up if user doesnt exist.
    const userData = db.addUser(username, password)
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).json(userData);

    // TODO: Improved option to return error once proper sign up has been set up
    // res.header("Access-Control-Allow-Origin", "*")
    // return res.status(404).send('Username or Password Incorrect');
  }
});

app.get('/addstock', (req, res) => {
  const stock = req.query.stock;
  const username = req.query.username;
  // With JSON file database
  const userData = db.addStockAndReturn(username, stock);
  if (userData) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).json(userData);
  }
  else {
    const userData = db.addUser(username, password)
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).json(userData);
  }
  

})

app.post('/deletestock', (req, res) => {
  const symbol = req.query.symbol;
  const username = req.query.username;
  // With JSON file database
  const userData = db.deleteStockAndReturn(username, symbol);
  if (userData) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).json(userData);
  }
  else {
    return res.status(404).send("Stock symbol not found");
  }
})


if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/build', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });
}


app.listen(3000); //listens on port 3000 -> http://localhost:3000/

