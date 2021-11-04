const fs = require('fs');

const writeLocation = `${__dirname}/users.json`
let usersObject = JSON.parse(fs.readFileSync(writeLocation))
let userList = {}
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
  userList = JSON.parse(fs.readFileSync(writeLocation))
  const selectedUser = userList[username];
  if (selectedUser && selectedUser.password === password) {
    return selectedUser.data;
  }
  else return undefined;
}

// Add user to the database given a username and password. Return user's data
db.addUser = (username, password) => {
  userList = JSON.parse(fs.readFileSync(writeLocation))

  // If username already registered, return undefined
  if (userList[username]) return undefined;

  else {
    // Create username key and assign it to object with password
    userList[username] = {
      "password" : password,
      "data" : {
        "id" : "1",
        "stocks" : {}
      }
    }
    fs.writeFileSync(writeLocation, JSON.stringify(userList, null, 2));
    return userList[username].data;
  }
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
