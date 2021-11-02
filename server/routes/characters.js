const express = require('express');

const starWarsController = require('../controllers/starWarsController');

const router = express.Router();

// ADD GET MORE CHARACTERS ROUTE HANDLER HERE
router.get('/', starWarsController.getMoreCharacters, starWarsController.populateCharacterPhotos, (req, res) => {
  return res.status(200).json({newCharacters: res.locals.newCharacters});
});

// ADD GET CHARACTER DETAILS ROUTE HANDLER HERE

// EXPORT THE ROUTER
module.exports = router;