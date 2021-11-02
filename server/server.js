const path = require('path');
const express = require('express');

const app = express();
const PORT = 3000;

/**
 * require routers
 */

const routerAPI = require('./routes/api');
const routerCharacters = require('./routes/characters');
const routerFavs = require('./routes/favs');
const routerNickNames = require('./routes/nicknames');

/**
 * handle parsing request body
 * 
 * app.use('*', express.json(), (req, res) => {
 * res.sendStatus(404);
*  });
 * 
 */

app.use(express.json());
//app.use(express.urlencoded({ extended : true }));

/**
 * handle requests for static files
 * 
 */
app.use('/assets', express.static(path.join(__dirname, '../client/assets')));

/**
 * define route handlers
 */

app.use('/api', routerAPI);
app.use('/api/favs', routerFavs);
app.use('/api/characters', routerCharacters);

// route handler to respond with main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// catch-all route handler for any requests to an unknown route



app.use('*', (req, res) => {
  res.sendStatus(404);
});


/**
 * configire express global error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */
app.use((err, req, res, next) => {

  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' }, 
  };

  const errorObj = Object.assign(defaultErr);
  errorObj.message.err = err.message.err;

  return res.status(errorObj.status).json(errorObj.message);

});



/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
