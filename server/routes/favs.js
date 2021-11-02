const express = require('express');

const fileController = require('../controllers/fileController');

const router = express.Router();

// ADD STORE FAVORITE ROUTE HANDLER HERE
router.post('/:id', fileController.getFavs, fileController.addFav, (req, res) => {
  return res.status(200).json({favs: res.locals.favs});
});


// ADD REMOVE FAVORITE ROUTE HANDLER HERE
router.delete('/:id', fileController.getFavs, fileController.deleteFav, (req, res) => {
  return res.status(200).json({favs: res.locals.favs});
});

// EXPORT THE ROUTER
module.exports = router;