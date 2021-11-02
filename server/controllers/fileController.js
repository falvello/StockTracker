const fs = require('fs');
const path = require('path');

const fileController = {};

fileController.getCharacters = (req, res, next) => {
  const { results } = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/characters.json'), 'UTF-8'));
  if (!results) {
    return next({
      log: 'fileController.getCharacters: ERROR: Error getting characters data from characters.json file',
      message: { err: 'Error occurred in fileController.getCharacters. Check server logs for more details.' },
    });
  }
  res.locals.characters = results;
  next();
};

// ADD MIDDLEWARE TO GET FAVORITE CHARACTERS HERE
fileController.getFavs = (req, res, next) => {
  const results  = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/favs.json'), 'UTF-8'));
  //console.log('results ' , results)
  if (!results) {
    return next({
      log: 'fileController.getFavs: ERROR: Error getting favs data from favs.json file',
      message: { err: 'Error occurred in fileController.getFavs. Check server logs for more details.' },
    });
  }
  res.locals.favs = results; // empty {}
  next();
};

// ADD MIDDLEWARE TO ADD A FAVORITE CHARACTER HERE
fileController.addFav = (req, res, next) => {

  if (!res.locals.favs) {
    return next({
      log: 'fileController.addFavs: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals.favs to be an object.',
      message: { err: 'fileController.addFavs: ERROR: Check server logs for details' },
    });
  }

  const newFavID = req.params.id;
  if (res.locals.favs[newFavID]) next();
  else {
    res.locals.favs[newFavID] = true; //{1: true, 2: true }          favs: {'1' : true, '2' : false}
    const data = JSON.stringify(res.locals.favs);
    fs.writeFileSync(path.resolve(__dirname, '../data/favs.json'), data, 'UTF-8', next());
    
  }
};


// ADD MIDDLEWARE TO REMOVE A CHARACTER FROM FAVORITES HERE
fileController.deleteFav = (req, res, next) => {

  if (!res.locals.favs) {
    return next({
      log: 'fileController.removeFav: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals.favs to be an object.',
      message: { err: 'fileController.removeFav: ERROR: Check server logs for details' },
    });
  }


  const newFavID = req.params.id;
  if (res.locals.favs[newFavID]){
    delete res.locals.favs[newFavID];
    const data = JSON.stringify(res.locals.favs);
    fs.writeFileSync(path.resolve(__dirname, '../data/favs.json'), data, 'UTF-8', next());
  }
  else next();
};

// Extention 1: ADD MIDDLEWARE TO GET CHARACTER NICKNAMES HERE


// Extention 1: ADD MIDDLEWARE TO SET A CHARACTER'S NICKNAME HERE


// Extention 1: ADD MIDDLEWARE TO REMOVE A CHARACTER'S NICKNAME HERE


// EXPORT THE CONTROLLER HERE
module.exports = fileController;