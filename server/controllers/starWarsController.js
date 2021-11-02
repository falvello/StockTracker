const fetch = require('node-fetch');

const { convertToPhotoUrl } = require('../utils/helpers');

const starWarsController = {};

// ADD MIDDLEWARE TO GET MORE CHARACTERS HERE
starWarsController.getMoreCharacters = (req, res, next) => {
  try {
    // let method = 'GET';
    fetch('https://swapi.dev/api/people/?page=3')
      .then(response => response.json())
      .then(response => {
        res.locals.newCharacters = response.results;
        return next();
      });
  }
  catch (err) {
    return next({
      log: 'fileController.getCharacters: ERROR: Error getting characters data from characters.json file',
      message: { err: 'starWarsController.getMoreCharacters: ERROR: Check server logs for details' }
    });
  }
};


// ADD MIDDLEWARE TO ADD CHARACTER PHOTOS HERE
starWarsController.populateCharacterPhotos = (req, res, next) => {
  try {
    for (const char of res.locals.newCharacters){
      char.photo = convertToPhotoUrl(char.name);
    }
    return next();
  }
  catch (err) {
    return next({
      log: 'fileController.populateCharacterPhotos: ERROR: Error getting characters data from characters.json file',
      message: { err: 'starWarsController.populateCharacterPhotos: ERROR: Check server logs for details' }
    });
  }
};


// ADD REQUEST CHARACTER VALIDATION MIDDLEWARE HERE


// ADD GET HOMEWORLD MIDDLEWARE HERE


// ADD GET FILMS MIDDLEWARE HERE


// EXPORT THE CONTROLLER HERE
module.exports = starWarsController;