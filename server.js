// TODO: create a basic server with express
// that will send back the index.html file on a GET request to '/'
// it should then send back jsonData on a GET to /data

/* DATA */

var lions = [];
var id = 0;
//var jsonData = {count: 12, message: 'hey'};

/* SERVER */

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var _ = require('lodash');

var app = express();

/* MIDDLEWARE */

/*
app.use is a way to register middleware to use on the server
the middleware is run in order of registration (the order they appear on the page) for every request that comes in
*/

app.use('morgan', function(err, req, res, next) {
  if (err) {
    console.log(err);
  } else {
    next();
  }
});

/*
body parser makes it possible to post JSON to the server
we can access data we post as req.body
*/
app.use('bodyParser', function(err, req, res, next) {
  if (err) {
    console.log(err);
  } else {
    next();
  }
});
/*
express.static will serve everything within the designated directory as a static resource
also, it will serve the index.html on the root of that directory on a GET to '/'
  IF you use express.static you NEED a folder to reference... it can't be set to a directory/endpoint '/'
*/
app.use(express.static('client'));
/*
IF you need to dynamically reference a directory path '__dirname' is a built-in variable that you can use to reference the current project direcctory where node is initialized
*/
//app.use('/static', express.static(path.join(__dirname, 'public')))


/* ROUTES */

// EXAMPLE OF BASIC ROUTE
// app.get('/', function(req, res) {
//   res.send('GET request to the homepage');
// });

app.get('/lions', function(req, res, next) {
  //respond with data for all lions, currently an array set above
  res.json(lions);
});

app.get('/lions/:id', function(req, res, next) {
  //find lion with id = id param passed
  // // lions[req.params['id']];
  //respond with just that lion object

  // Below is teacher's code...
  var lion = _.find(lions, {id: req.params.id});
  res.json(lion || null);
});

app.post('/lions', function(req, res, next) {
  // Below is Teacher's code
  var lion = req.body;
  id++; //increase to get a new id #
  lion.id = id + ''; //coerce id to be a string for storage
  lions.push(lion);
  res.json(lion);
});

app.put('/lions/:id', function(req, res, next) {
  // Below is Teacher's code
  //expect object to come from client with an id to find & update
  var update = req.body; //should be the full obj you want to update
  //if update.id exists in the database then update the object
  if (update.id) {
    delete update.id;  //prevents accidentally updating the id of the obj
  }
  var lion = _.findIndex(ions, {id: req.params.id});
  if (!lions[lion]) {
    res.send();
  } else {
    var updatedLion = _.assign(lions[lion], update);
    res.json(updatedLion);
  }
});

app.delete('/lions/:id', function(req, res) {
  var lion = _.findIndex(lions, {id: req.params.id});
  if (!lions[lion]) {
    res.send();
  } else {
    var deletedLion = lions[lion];  //save deleted lion to send back at the end
    lions.splice(lion, 1); //modify the array to remove the lion
    res.json(deletedLion);
  }
});


/*  IF you don't use express.static... then you'll need to create a root route

// app.get('/', function(req, res) {
//   console.log('/ hit, index.html sent', __dirname);
//   /* __dirname is one of the global variables available for Node and it refers to the current directory where the file you're working on is saved
//   /


//   res.sendFile(__dirname + '/index.html', function(err) {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });

//   /*  IF 'fs' module is required then you could also do...
//       .... with a Node-style callback & stringify-ing...

//     fs.readFile('index.html', function(err, buffer) {
//       var html = buffer.toString();
//       res.setheader('Content-Type', 'text/html');
//       res.send(html);
//     })
//   /
// });

*/

// app.get('/data', function(req, res) {
//   console.log('/data hit, jsonData sent');
//   res.json(jsonData);
// });


/* ERROR HANDLING */



/* START SERVER LISTENING */
var port = 3000;
app.listen(port, function () {
  console.log('Listening on http://localhost:', port);
});