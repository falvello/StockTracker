# Unit 9 Express - Star Wars API Challenge

## Summary

In this unit you will create a backend (server) to interact with a pre-built frontend (react application).

## Learning goals

* Learn what a server is, how it works, and what it does
* Understand client-server from the server perspective: how a server interprets the http request and develops a response
* Implement the Express framework on top of Node.js: define middleware and configure Express Router
* Handle different types of requests from clients
* Interact with a third-party API (Star Wars API) by having your server act as a client: send requests from your server to the Star Wars API to retrieve data for your frontend.

## What is Express?
Express is a framework for Node.js based on the Middleware Design Pattern.  Express wraps the vanilla Node.js `request` and `response` objects and provides helpful abstractions to the Node.js workflow.  For example, the Express-powered response object includes a helpful method called `sendFile` which abstracts the process of retrieving a file from the file system and then sending that file as a response to the request.  There are many other abstractions Express provides, and their [documentation](https://expressjs.com/en/) is amazing.

<div id="apis"></div>

## What is an API? / Intro to the Star Wars API (SWAPI)
An Application Programming Interface or, API, is the code providing the structure for applications to connect with and access a server and / or database.  In short, APIs enable applications to communicate with one another.  Colloquially, APIs are thought of as web based APIs that return data in response to a request made by a client. This is the type of API you will be working with throughout this unit.  You can read more generally about APIs [here](https://medium.com/@perrysetgo/what-exactly-is-an-api-69f36968a41f).

The API you will be working with for this challenge is the [Star Wars API (SWAPI)](https://swapi.dev/documentation). It is a REST-based API which provides tons of data on different Star Wars characters, films, planets, etc.  There is a wealth of data to be fetched an manipulated, and we're only going to begin to scratch the surface of it!  Before you get started with the challenges below, take a look at the [docs](https://swapi.dev/documentation).  You can even use their [sandbox](https://swapi.dev/) to test out some requests before diving into the unit to get some practice and familiarity with the data you will be working with.

## What is our server going to do?
There are a few goals we will be working towards when creating our server:

* Get comfortable handling different request methods from a client
* Practice writing Express middleware
* Modularize our routes with Express Router
* Abstract incoming streaming request data using global Express middleware
* Gain familiarity with web APIs by connecting our server with the Star Wars API

<hr />

## Challenges

### Setup / Installation

#### Install dependencies
1. [  ] Install your npm dependencies: run `npm install` in your terminal

#### Start application (see note below)
1. [  ] To start your node server and compile the boilerplate React application, run the following: `npm run dev`
    
    - `npm run dev` is actually an npm script - to see what it really runs, you can look in the `scripts` object inside package.json

1. [  ] To 'access' your React application in the browser, visit: `http://localhost:8080/`
  
    - **Note:** the React application won't actually load until we've configured our server, so for now, it's just going to say, "Loading data, please wait..."

    - **Note:** while the React app runs on `http://localhost:8080`, our _server_ is going to be running on `http://localhost:3000` so if you are planning to test with Postman instead of (or in addition to) using the React app, send your Postman requests to `http://localhost:3000`.

#### Start / Download Postman
Postman enables you to test your backend code without a build-out frontend browser application.  It is a powerful tool for backend developers because it allows for a separation of concerns - you can build and test your backend without worrying about whether there is a bug in your backend code or your frontend code!

1. [  ] If you haven't already, download and setup [Postman](https://getpostman.com)

### Serving static files
Express provides a handy piece of middleware which can be configured to easily serve static files.  No more wasting time configuring route handlers for every .css file you write!  See more details on how to configure this [here](https://expressjs.com/en/starter/static-files.html)

1. [  ] In `server/server.js`, _use_ express.static to serve all static files from the `/client/assets` directory when requests are made to `/assets`.

We won't be needing this just yet, but if you want to test to see if it works, open up Postman and send a `GET` request to `http://localhost:3000/assets/images/ackbar.jpg`. You should get a jpg file back in response.

### Creating basic routes

#### Serving main React app
1. [  ] Add a route handler that looks for a `GET` request to `/`
1. [  ] When a `GET` to `/` is received, respond with the `index.html` file inside the `/client` directory
1. [  ] Test your route by going to `http://localhost:8080/` or sending a `GET` request to `http://localhost:3000/` (using Postman or some equivalent).  You should be served the basic React application! **Note:** Due to using webpack-dev-server (which you'll learn more about in a later unit), this may seem like an unnecessary step since you can already see your React app on `http://localhost:8080`. This is an important step though in any project you will eventually have a production environment for since you won't be using webpack-dev-server in production!

#### Handle unknown routes
Since we **always** want to respond to a request, even if we aren't going to _process_ it, Express gives us a handy way to 'catch' any unknown requests and respond in a generic way. Read through the express docs on how to setup a catch-all route for unhandled endpoint requests.  **Hint:** This route handler must be the **last** route handler you configure, otherwise it will 'catch' routes you mean to handle.
1. [  ] After your last configured route handler, add another route handler.  This route handler should run regardless of request method, and should have only one anonymous middleware function.
1. [  ] The anonymous middleware function for this route handler should simply send back a status code of 404, no other data necessary. **Hint:** check the express docs for a handy method you can use to send back just a status code.
1. [  ] Test your new route.  Try sending a `GET` request on Postman to `http://localhost:3000/nothandlingthis`.  You should get back a simple 404 status code.  Alternatively, you can check the Network tab in Chrome dev tools to see the 404 status code coming back for our request to `/api/characters` since we are not yet handling this route on our server!

**A quick note on Chrome Dev Tools - Network Tab**
The Network tab of the Chrome Dev Tools is a great place to get acquainted with outgoing requests and incoming responses.  You can see all of your browser's outgoing requests and if you click on a particular request you can see a lot of information such as:

* the full request (headers, body, and other metadata)
* the full response (headers, data, status code, etc)

The network tab is a great place to look when troubleshooting requests and responses because you can see the exact format of your request body data and the exact format of the response from the server.

### Configure global error handler
The golden rule of middleware is **never close out a request in a reusable middleware function**.  Express enables us to write a global error handler which we can invoke within middleware by passing an error object as an argument to the `next` function. See more details [here](https://expressjs.com/en/guide/error-handling.html#writing-error-handlers).  Let's configure this global error now while we're still working in our `server.js` file.
1. [  ] In `server/server.js`, add an express global middleware error handler
1. [  ] This function should first define a `defaultErr`.  This object will store defaults for data we will use in this error handler.  This gives us the flexibility to customize what details we provide in our actual middleware. The `defaultErr` object should contain the following key/value pairs:
    ```js
    // defaultErr object
    {
      log: 'Express error handler caught unknown middleware error',
      status: 400,
      message: { err: 'An error occurred' }, 
    }
    ```
1. [  ] Next, create a variable, `errorObj` and use the `Object.assign` method to create an error object using the `defaultErr` as a base and overwriting with the `err` param object.
1. [  ] Add a `console.log` and log the `errorObj.log` property. This log property should contain any error information that we want to log, but that may be too sensitive to pass back to the client (i.e. detailed database errors)
1. [  ] Finally, respond to the request using the `errorObj.status` property as the status code and the `errorObj.message` as the response data.  Pass this data back as json.

### Starter data route
We're already serving our React application, but it's looking pretty bare at the moment.  If we check the console we can see that we are sending a `GET` request to `/api` which we can assume is trying to fetch some starter data. Let's configure our backend to handle this request and serve up some data for us to work with!

#### Configure api router and serve starter data
Express enables us to modularize our routes so that when we have a lot of routes we can easily and thoughtfully organize them. You have been given a starting router file in `/server/routes/api.js`.  Let's setup this file so that we can serve our base data needed by our application.
1. [  ] Look over the boilerplate code in `/server/routes/api.js`.  You should understand the following about this file:
    1. [  ] What is `router` doing?
    1. [  ] What is `fileController`? Feel free to open up the file being referenced and take a look around!
1. [  ] In the `/server/routes/api.js` file, add a new route handler for `GET` to `/`.
1. [  ] This route handler should start by invoking the `fileController.getCharacters` middleware function.  Take a look at the `server/controllers/fileController.js` and get an understanding for what the `getCharacters` method is doing.
1. [  ] The middleware function in the previous step should have added data to the `res.locals` object.  Now, as a final step in this route handler, add an anonymous function to respond to the request.  The response should include a status code of `200` as well as a json object with a key of `characters` and the value will be the data stored in `res.locals` by the `fileController.getCharacters` middleware function.  Hint: see [docs](http://expressjs.com/en/api.html#res.json) for details on sending a json response.
1. [  ] Now that your router is ready, let's add it to the `/server/server.js` file so that our server knows when to use it!
    1. [  ] In the `require routers` section at the top of the file, declare a constant to store the required api router we just updated (`/server/routes/api.js`).
    1. [  ] In the `define route handlers` section, configure your server to _use_ the api router you required in the previous step when any request method is received and the request url starts with `/api`.
1. [  ] Test your new route handler by going to `localhost:8080/`. When the react app loads you should now see a lot more data displayed. Alternatively, you can send a `GET` request to `http://localhost:3000/api` and you should get back a JSON object with a `characters` property defined.

### Save favorite characters
You may notice that each character card in the React app has a star outline icon in the top right corner.  This icon denotes whether or not the user has selected the character as one of their favorites.  A star outline notes that this character is _not_ a favorite and a filled star notes that this character _is_ a favorite.  Try clicking on a star outline for any character.  What happens? 🤔 Nothing! Because our server is not setup to handle adding / updating favorites.  We will now add this functionality so that our users can save their favs.

#### Configure express.json() global middleware
Now, our clients will be sending some data with their requests to our API via the request body.  You'll remember from vanilla node that the request body data is transmitted as a stream.  Luckily though, Express has a handy piece of middleware which provides an abstraction for the process of concatenating the streaming body data.  Take a look at the [express.json()](https://expressjs.com/en/api.html#express.json) middleware docs.  This is what we will configure globally so that this process runs on _all_ incoming requests to our server. 
1. [  ] In the same file, under the `// configure request body parser` section, setup a global middleware call to parse the request body as `json`.  **Hint:** see the Express docs on configuring global middleware.  **Hint 2:** see the Express docs for specific configurations on json.

#### Create fileController.getFavs
First, we'll want to _get_ any current favorite selections so that we can add to them instead of overwriting them.

1. [  ] In the `server/controllers/fileController.js` add a new method called `getFavs`.
1. [  ] Use the built-in Node.js `fs` module to read all the data in the `favs.json` file. **Hint:** you will need to add an additional step to _parse_ the results of reading the file into JSON.
1. [  ] Store all of the favorites on `res.locals.favs`.
1. [  ] Move on to the next middleware function.
1. [  ] If an error occurs, invoke the express global error handler with the following data:
    ```
    {
      log: `fileController.getFavs: ERROR: /* the error from the file system */`,
      message: { err: 'fileController.getFavs: ERROR: Check server logs for details' },
    }
    ```

#### Create fileController.addFav
Now that we have any existing favs, let's add a new one.

1. [  ] In the `server/controllers/fileController.js` add a new method called `addFav`.
1. [  ] We expect that this piece of middleware will run after some other middleware which will get all our existing favorites data.  Let's be sure we have this data that we'll need to actually complete this function.  Verify that we have a property on the `res.locals` object called `favs` and that the value of this property is an object.
    1. [  ] If either of those checks are invalid, invoke the global Express error handler with the following error object:
    ```
    {
      log: 'fileController.addFavs: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals.favs to be an object.',
      message: { err: 'fileController.addFavs: ERROR: Check server logs for details' },
    }
    ```
1. [  ] Once the required data is validated, you will need to get the id of the character we want to add as a favorite. The route params used for the request must include a param known as `:id` (see [express routing parameters](https://expressjs.com/en/guide/routing.html#route-parameters) for how to access this data).  The value for this property is the character id we want to add.  Store this id in a variable.
1. [  ] Check to see if there is already a property on the `res.locals.favs` object for the character id (no need to resave this character if it is already a favorite!)
    1. [  ] If the character id does already exist, just move to the _next_ piece of middleware.
1. [  ] If the character id does not already exist on the object, add a new key/value pair to the favorites object where the key is the new favorited character id and the value is `true`.
1. [  ] Use the Node.js built-in `fs` module to save the new favorites data stored in `res.locals.favs` back into the `server/data/favs.json` file.
1. [  ] If an error occurs at any point after the validation check, invoke the express global error handler with the following data:
    ```
    {
      log: `fileController.addFav: ERROR: /* the error from the file system / other calls */`,
      message: { err: 'fileController.addFav: ERROR: Check server logs for details' },
    }
    ```

#### Add route handler for requests to save favorite character
1. [  ] In the `/server/routes/favs.js` file, add a new route handler for `POST` to `/:id`.
1. [  ] This route handler should invoke the following middleware functions:
    1. [  ] fileController.getFavs
    1. [  ] fileController.addFav
1. [  ] Add an anonymous function to respond to the request.  The response should include a status code of `200` as well as a json object with a `favs` key where the value is the data stored on the `res.locals` object.

#### Add favs router to main server file.
Now that your router is ready, let's add it to the `/server/server.js` file so that our server knows when to use it!
1. [  ] In the `require routers` section at the top of the file, declare a constant to store the required api router we just updated (`/server/routes/favs.js`).
1. [  ] In the `define route handlers` section, configure your server to _use_ the api router you required in the previous step when any request method is received and the request url starts with `/api/favs`. **Hint:** Think about what order this router middleware should be. Why?

#### Test your new route
1. [  ] Test your new route handler by going to `localhost:8080/`. When the react app loads, click the star outline icon on any character where the star is an outline and not filled.  This should update the star to filled and the `server/data/favs.json` file should now have new key / value pair where the key is the `charId` for the favorited character and the value is `true`. Alternatively, you can send a `POST` request to `http://localhost:3000/api/favs/{insert-specific-character-id-here}` and you should get back a JSON object with a `favs` object property defined with the character you submitted as one of the key/value pairs.

### Populate existing favorite characters data on load
We are now saving our favorite characters in a data file! This is great, but try refreshing your application... uh oh, the favorites aren't being populated when the browser refreshes 😕.  Let's fix this by adding another route to enable getting our favorites.

#### Add middleware to initial api call route handler
1. [  ] In the `/server/routes/api.js` file, add the new `fileController.getFavs` middleware in the `GET` to `/` route handler.
1. [  ] In the anonymous response middleware, add the favorites data stored in the `res.locals` to the response object as `favs`.

#### Test your new middleware
1. 1. [  ] Test your new middleware function by going to `localhost:8080/`. When the react app loads you should now see your saved favorite characters load with their fav star filled in. Alternatively, you can send a `GET` request to `http://localhost:3000/api` and you should get back a JSON object with  `characters`, and `favs` properties defined. `favs` should be populated with any existing favorite character ids.

### Remove a favorite character
Our application can successfully add a new favorite and loads all our existing favorites when the app loads.  That's great! However, what happens if one of our favs has now gone to the dark side and we no longer want them as one of our favs? Try clicking the filled star icon in your React app. Nothing happens again! Let's configure our server to also handle _removing_ a favorite from the list.

#### Create fileController.removeFav
Now that we have any existing favs, let's add a new one.

1. [  ] In the `server/controllers/fileController.js` add a new method called `removeFav`.
1. [  ] We expect that this piece of middleware will run after some other middleware which will get all our existing favorites data.  Let's be sure we have this data that we'll need to actually complete this function.  Verify that we have a property on the `res.locals` object called `favs` and that the value of this property is an object.
    1. [  ] If either of those checks are invalid, invoke the global Express error handler with the following error object:
    ```
    {
      log: 'fileController.removeFav: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals.favs to be an object.',
      message: { err: 'fileController.removeFav: ERROR: Check server logs for details' },
    }
    ```
1. [  ] Once the required data is validated, you will need to get the id of the character we want to remove from our favorites. The route params used for the request must include a param known as `:id` (see [express routing parameters](https://expressjs.com/en/guide/routing.html#route-parameters) for how to access this data).  The value for this property is the character id we want to remove.  Store this id in a variable.
1. [  ] Check to see if there is already a property on the `res.locals.favs` object for the character id (no need to remove this character if they aren't currently a favorite!)
    1. [  ] If the character id does not exist, just move to the _next_ piece of middleware.
1. [  ] If the character id does exist on the object, `delete` the property from the favorites object where the key is the character id from the request params.
1. [  ] Use the Node.js built-in `fs` module to save the updated favorites data stored in `res.locals.favs` back into the `server/data/favs.json` file.
1. [  ] If an error occurs at any point after the validation check, invoke the express global error handler with the following data:
    ```
    {
      log: `fileController.removeFav: ERROR: /* the error from the file system / other calls */`,
      message: { err: 'fileController.removeFav: ERROR: Check server logs for details' },
    }
    ```

#### Add route handler for requests to remove a favorite character
1. [  ] In the `/server/routes/favs.js` file, add a new route handler for `DELETE` to `/:id`.
1. [  ] This route handler should invoke the following middleware functions:
    1. [  ] fileController.getFavs
    1. [  ] fileController.removeFav
1. [  ] Add an anonymous function to respond to the request.  The response should include a status code of `200` as well as a json object with a `favs` key where the value is the data stored on the `res.locals` object.

#### Test your new route
1. [  ] Test your new route handler by going to `localhost:8080/`. When the react app loads, click a _filled_ star icon on a current favorite character.  This should update the star to an outline and the `server/data/favs.json` file should no longer have the unfavorited character's id. Alternatively, you can send a `DELETE` request to `http://localhost:3000/api/favs/{insert-specific-character-id-here}` and you should get back a JSON object with a `favs` object property defined _without_ the character you submitted as one of the key/value pairs.

### Get more characters
Now that we have some of our basic functionality set up, we can see that there are a few more options in our React app that we're going to need to handle.  One of these options is to `Get More Characters`.  We will now set up our backend to handle fetching 10 more characters from the Star Wars API. If you skipped over the [What is an API?](#apis) section in the beginning of this README, I suggest you head back up there and take a look.  All the information about how to interact with this API can be found there.

#### Create starWarsController.getMoreCharacters
We'll start by adding logic to the `starWarsController.getMoreCharacters` middleware function in the `server/controllers/starWarsController.js` file.
1. [  ] Use the [node-fetch]() library to send a `GET` request to `https://swapi.dev/api/people/?page=3`.  This url is a specific route on the [Star Wars API](#apis) which will request the next 10 characters from their API.
1. [  ] Once we have the new characters, parse the response and store _only the new character data_ in `res.locals.newCharacters`. **Hint:** take a look at the results before deciding what to store in `res.locals`. **Hint 2:** make sure to move on to the _next_ piece of middleware.
1. [  ] Add an error handler to invoke the global express error handler if something goes wrong.  The global error handler should be passed the following properties in an object:
    1. [  ] `log`: should include the middleware function name where the error occurred as well as any error data returned from the Star Wars API.
    1. [  ] `message`: should be an object with an `err` that will be sent back to the client:
    ```
    { err: 'starWarsController.getMoreCharacters: ERROR: Check server logs for details' }
    ```

#### Add route handler to our characters router for requests to get more characters
1. [  ] In the `/server/routes/characters.js` file, add a new route handler for `GET` to `/`.
1. [  ] This route handler should invoke the starWarsController.getMoreCharacters middleware function.
1. [  ] Add an anonymous function to respond to the request.  The response should include a status code of `200` as well as the following data as `newCharacters` inside a json object.

#### Add characters router to main server file.
Now that your router is ready, let's add it to the `/server/server.js` file so that our server knows when to use it!
1. [  ] In the `require routers` section at the top of the file, declare a constant to store the required api router we just updated (`/server/routes/characters.js`).
1. [  ] In the `define route handlers` section, configure your server to _use_ the api router you required in the previous step when any request method is received and the request url starts with `/api/characters`. **Hint:** Think about what order this router middleware should be. Why?

#### Test your new route
1. [  ] Test your new route handler by going to `localhost:8080/`. When the react app loads, click the button that says `Get More Characters`.  This should load an additional 10 characters. Alternatively, you can send a `GET` request to `http://localhost:3000/api/characters` and you should get back a JSON object with a `newCharacters` property defined.

#### Add middleware to populate character photos
You'll notice that your new characters do not have photos.  In order for character photos to display, the character objects need to have a `photo` property. Let's add this to each new character by creating a new middleware function in the `server/controllers/starWarsController.js` file.
1. [  ] We'll use a helper function along with the name of each character in order to set the `photo` property.  To do this, let's first require in the `convertToPhotoUrl` from the `server/utils/helpers.js` file.
1. [  ] Create a new express middleware function in `starWarsController` called `populateCharacterPhotos`.
We will expect that this piece of middleware will be called _after_ we have gotten new characters. So we will use the `res.locals.newCharacters` data to create photo urls for each new character.  
1. [  ] Let's make sure to check if we have this required `res.locals.newCharacters` data and if not, invoke the next error handler to break out of the middleware chain and return an error. The error handler should be passed the following properties in an object:
    1. [  ] `log`: should include the middleware function name where the error occurred as well as a message noting that the required data was not provided.
    1. [  ] `message`: should be an object with an `err` that will be sent back to the client:
    ```
    { err: 'starWarsController.starWarsController: ERROR: Check server logs for details' }
    ```
As long as we have the required `newCharacters` data we can now add the `photo` property to each new character
1. [  ] update `res.locals.newCharacters` by iterating over each new character object and adding a new `photo` property.  The key should be `photo` and the value will be the output of invoking the `convertToPhotoUrl` function with the character `name` as the argument.
1. [  ] Again, make sure to invoke the _next_ middleware when you're done.
1. [  ] Finally, we need to add our new middleware function to our route handler.  In the `server/routes/characters.js`, add the new `starWarsController.populateCharacterPhotos` as middleware to the route handler for `GET` to `/`.  **Hint:** Think about the _order_ in which this middleware should be called.

#### Test your route again
1. [  ] Test your route handler again by going to `localhost:8080/`. When the react app loads, click the button that says `Get More Characters`.  This should load an additional 10 characters, and this time they should each have a photo! Alternatively, you can send a `GET` request to `http://localhost:3000/api/characters` and you should get back a JSON object with a `newCharacters` property defined and each character object should have a `photo` property defined.

### Get more details about a specific character
Another option in our React app is to `Get More Info` for each character.  The goal of this button is to load some additional details about a particular character. You're going to need to navigate the [Star Wars API docs](#apis) in order to complete this part of the challenge.
The specific additional character details we are going to care about are:
* The character's homeworld
* The film(s) the character was featured in

#### Create starWarsController.validateRequestCharacter
Before we start making requests to the SWAPI, we'll want to validate our incoming requests to make sure we have the correct data required to process the request.  In order to get additional information about a character, we'll need the character information to be passed to us in the request body. Since we already have express.json() configured to parse the request body, now all we need to do is setup some custom middleware to _validate_ that request body.
1. [  ] In the `server/controllers/starWarsController.js` file, add a new method called `validateRequestCharacter`.
1. [  ] This new function should check the following:
    1. [  ] Verify there is a property called `character` on the request body.
    1. [  ] Verify that there is a property called `homeworld` on the `character`.
    1. [  ] Verify that there is a property called `films` on the `character`.
1. [  ] If all of the properties are there, move on to the next piece of middleware.
1. [  ] If _any_ of these properties are missing, invoke the global error handler with the following data:
    ```
    {
      log: 'starWarsController.validateRequestCharacter: ERROR: expected /* insert missing property here */ to exist',
      message: { err: 'server POST /details: ERROR: Invalid request body' },
    }
    ```

#### Create starWarsController.getHomeworld
Now we're ready to get our first piece of additional data: the character's homeworld.
1. [  ] In the `server/controllers/starWarsController.js` add a new method called `getHomeworld`.
1. [  ] The character data submitted with the request includes a property called `homeworld`.  The value for this property is a url which can be used to request more data about that particular planet.  Send a `GET` request to the `homeworld` url value and store the result in `res.locals.homeworld`.
1. [  ] If an error occurs, invoke the express global error handler with the following data:
    ```
    {
      log: `starWarsController.getHomeworld: ERROR: /* the error from the star wars api */`,
      message: { err: 'starWarsController.getHomeworld: ERROR: Check server logs for details' },
    }
    ```

#### Create starWarsController.getFilms
Now we're ready to get our first piece of additional data: the character's homeworld.
1. [  ] In the `server/controllers/starWarsController.js` add a new method called `getFilms`.
1. [  ] The character data submitted with the request includes a property called `films`.  The value for this property is an array of urls which can be used to request more data about each film.  Send a `GET` request for each url in the `films` array and store the results in `res.locals.films`.  **Hint:** You'll need to wait for _all_ requests to resolve before moving on to the next piece of middleware.
1. [  ] If an error occurs in _any_ of the requests, invoke the express global error handler with the following data:
    ```
    {
      log: `starWarsController.getFilms: ERROR: /* the error from the star wars api */`,
      message: { err: 'starWarsController.getFilms: ERROR: Check server logs for details' },
    }
    ```

#### Add route handler for requests to get more details about a character
It's time to create a route handler for this new functionality.
1. [  ] In the `/server/routes/characters.js` file, add a new route handler for `POST` to `/details`.
1. [  ] This route handler should invoke the following middleware functions:
    1. [  ] starWarsController.validateRequestCharacter
    1. [  ] starWarsController.getHomeworld
    1. [  ] starWarsController.getFilms
1. [  ] Add an anonymous function to respond to the request.  The response should include a status code of `200` as well as the following data as a json object with the following key/value pairs:
    1. [  ] `homeworld`: the data stored in the response object from invoking the starWarsController.getHomeworld middleware.
    1. [  ] `films`: the data stored in the response object from invoking the starWarsController.getFilms middleware.

#### Test your new route
1. [  ] Test your new route handler by going to `localhost:8080/`. When the react app loads, click the button that says `Get More Info`.  This should load the Homeworld and Films data. Alternatively, you can send a `POST` request to `http://localhost:3000/api/characters/details`.  In the body of the request you should pass in any of the character details found in `server/data/characters.json`. You should get back a JSON object with `homeworld` and `films` properties defined.

## Extensions

### Extension 1: Add character nicknames functionality
You may have noticed that there is another button on the character card, `Customize Character` which takes you to a form where you can give the character a nickname.  It works, but unfortunately our nicknames aren't saved across browser refreshes 🙁.  Now that you have practice with adding routes and creating middleware, try adding functionality to store nicknames in the `server/data/nicknames.json` file.

#### Before you start!
You will need to update some frontend code to be able to test this in the React application. Alternatively, you can simply test your new changes using Postman if you don't want to mess around with the frontend. Follow the instructions below if you do want to use the React app to test your application.

1. [  ] Follow the comments in the `client/components/CustomCharacter.jsx` file => `saveNickname` method to have the frontend trigger requests to your server when a nickname is saved. **Hint:** use the information in the frontend fetch request as a guide for how to construct your routes!

### Extension 2: Refactor getMoreCharacters to get the next page of characters on each new request
Currently your middleware for getMoreCharacters is hard-coded to _only_ get the 3rd page of characters from the SWAPI.  Refactor this getMoreCharacters middleware so that it keeps track of the last page of characters requested and subsequent invocations request the _next_ page of characters until there are none left.  **Hint:** How can your function _remember_ what it did the last time it was invoked? 🤔

#### Before you start!
You will need to update some frontend code to be able to test this in the React application. Alternatively, you can simply test your new changes using Postman if you don't want to mess around with the frontend. Follow the instructions below if you do want to use the React app to test your application.

1. [  ] Follow the comments in the `client/components/Characters.jsx` => the `return` section of the `render` method so that the `Get More Characters` button continues to display even if there are 10 or more characters already displayed.

### Extension 2b: getMoreCharacters refactor part 2: photos!
You may notice that characters fetched after the third page will not have photos. This is because in the boilerplate we had pre-loaded photos for all 10 characters from the main challenge. All we had to do in our server was use the `convertToPhotoUrl` helper function on our new characters.  This won't work for any characters after the that though.  You _could_ go out and manually download more character photos into this repo if you wanted to take the easy way out.  Alternatively, and more fun, you could incorporate a new API for searching photos using the name of the character.  Some options to check out are:
* Google Search API
* Unsplash Image API

### Extension 3: Implement caching so you don't have to keep requesting the same data from the SWAPI
Some challenges that may arise when working with outside APIs in your applications is API rate limiting.  Rate limiting helps applications deter excessive requests to their API which could overload their servers.  Many APIs have some limit that they enforce on requests, typically on requests from the same IP address.  One way to avoid getting rate limited (and also speed up your server's response time!) is to `cache` API response data so that subsequent requests to your server for that same data do not trigger another API request, but instead the results are returned directly from the cache.  **Note:** try creating your own caching strategy first, but you can also lookup some common Node / Express caching libraries.

**Hint:** check out [this](https://medium.com/the-node-js-collection/simple-server-side-cache-for-express-js-with-node-js-45ff296ca0f0) medium article on simple caching with Node / Express.