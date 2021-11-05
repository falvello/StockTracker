const fs = require('fs');

const writeLocation = `${__dirname}/users.json`
let usersObject = JSON.parse(fs.readFileSync(writeLocation))

/*Example content os users.json
{
  jemmy : {
    password: 'go',
    data: {
      id : '1',
      stocks: ['AAPL', 'MSFT']
    }
  }
 }*/

const db = {};

// Find user based on username and password. If matches, return user's data
db.findUser = (username, password) => {
  userList = JSON.parse(fs.readFileSync(writeLocation));
  const selectedUser = userList[username];
  if (selectedUser && selectedUser.password === password) {
    return selectedUser.data;
  }
  else return undefined;
}

// Add user to the database given a username and password. Return user's data
db.addUser = (username, password) => {
  userList = JSON.parse(fs.readFileSync(writeLocation));

  // If username already registered, return undefined
  if (userList[username] || password === '') return undefined;

  else {
    // Create username key and assign it to object with password
    userList[username] = {
      "password" : password,
      "data" : {
        "id" : "1",
        "stocks" : []
      }
    }
    fs.writeFileSync(writeLocation, JSON.stringify(userList, null, 2));
    return userList[username].data;
  }
}

/**
 * #addStockAndReturn - Adds a stock for a given username and returns updated user data
 */

db.addStockAndReturn = (username, stock) => {
  userList = JSON.parse(fs.readFileSync(writeLocation));
  if (stock === '') return userList[username].data;
  else if (userList[username].data.stocks.length === 0) userList[username].data.stocks.push(stock); 
  else userList[username].data.stocks.unshift(stock);
  fs.writeFileSync(writeLocation, JSON.stringify(userList, null, 2))
  return userList[username].data;
}

/**
 * #deleteStockAndReturn - Deletes a stock for a given username and returns updated user data
 */

 db.deleteStockAndReturn = (username, symbol) => {
  userList = JSON.parse(fs.readFileSync(writeLocation));
  userList[username].data.stocks = userList[username].data.stocks.filter((x) => (x != symbol));
  fs.writeFileSync(writeLocation, JSON.stringify(userList, null, 2))
  return userList[username].data;
}

/**
 * #drop - Deletes everything from the appropriate users.json file and
 * writes an empty array in its place.
 */

db.drop = () => {
  userList = {};
  fs.writeFileSync(writeLocation, JSON.stringify(userList, null, 2));
};


module.exports = db;
