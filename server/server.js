const express = require('express');
const app = express();
const path = require('path');
const { default: DataBox } = require('../client/components/DataBox');
//const db = require('../model/userFunctions')

// If "fake" database
const users = require((path.join(__dirname, '../model/userDatabase')))


app.get('/verify', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  // // Fake Database
  if (users[username].password == password) {
    const userSessionData = users[username].data;
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(200).json(userSessionData);
  }
  else {
    res.header('Access-Control-Allow-Origin', '*')
    return res.status(404).send('Username or Password Incorrect');
  }

  // JSON Database
  // const currentUser = db.find(username)
  // if (currentUser.password == password) {
  //   const userSessionData = currentUser.data;
  //   res.header('Access-Control-Allow-Origin', '*');
  //   return res.status(200).json(userSessionData);
  // }
  // else {
  //   res.header('Access-Control-Allow-Origin', '*')
  //   return res.status(404).send('Username or Password Incorrect');
  // }
});

if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/build', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });
}


app.listen(3000); //listens on port 3000 -> http://localhost:3000/

