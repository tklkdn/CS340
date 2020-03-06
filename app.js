var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');
var app = express();
var bodyParser = require('body-parser')

var handlebars = require('express-handlebars').create(
  {
    defaultLayout: 'main',
	partialsDir: path.join(__dirname, '/views/partials'),
    helpers: {
	  inc: function(val, options) {return parseInt(val) + 1;}
	}
  }
);

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3141);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function(){
  console.log('Handlebars/Node started on http://flipX.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});

// Homepage
app.get('/',function(req,res,next){
  var context = {};
  
  // Get values for filter dropdown from Genres table
  mysql.pool.query('SELECT genre FROM Genres ORDER BY genre ASC', function(err, rows, fields) {
    if (err){return next(err)};
	
	var allGenres = [];
	for (let p in rows) {
	  allGenres.push(rows[p].genre);
	}
	
	context.genreList = allGenres;
  });
  
  // Filter function - filter by genre
  // Adds a WHERE clause to sql query
  var genre = req.query.genre;
  var filter;
  genre != undefined ? filter = 'WHERE m.genre = "' + genre + '"' : filter = '';
  
  // SQL query
  // Queries Top 50 movies in DB
  mysql.pool.query('SELECT movieTitle, releaseYear, m.genre, IF(bestPicture IS NOT NULL, "YES", "NO"), ((ratingIMDB * 10) + ratingRottenTomatoes)/2 AS score FROM Movies m INNER JOIN Genres g ON m.genre = g.genre LEFT JOIN OscarWinners o ON m.movieID = o.bestPicture ' + filter + ' ORDER BY score DESC LIMIT 50', function(err, rows, fields){
    if(err){return next(err)};
	
	var data = [];
	for (let p in rows) {
	  data.push(rows[p]);
	}
	
	context.dataList = data;
	res.render('home', context);
  });
});

// View each individual table
// Data is dynamically populated depending on which link is selected
// The 'view' page shares the same template
app.get('/view',function(req,res,next){
  var context = {};
  var colList = [];
  var sqlQuery;
  context.firstCol = "";
  var table = req.query.table;
  context.table = table;
  context.tableTitle = table.charAt(0).toUpperCase() + table.slice(1);		// Page title
  
  // Columns and SQL query are selected depending on value of "table" variable
  switch (table) {
	  // Movies table
	  case "movies": {
		  context.colList = ['ID', 'Movie title', 'Release year', 'Runtime', 'IMDB rating', 'RT rating', 'Genre']; 
		  sqlQuery = 'SELECT movieID AS ID, movieTitle, releaseYear, runtime, ratingIMDB, ratingRottenTomatoes, genre FROM Movies ORDER BY movieTitle ASC';
		  context.firstCol = "hide-first-col";
		  break;
		  }
	  // Actors table
	  case "actors": {
		  context.colList = ['ID', 'Last name', 'First name'];
		  sqlQuery = 'SELECT actorID AS ID, actorLastName, actorFirstName FROM Actors ORDER BY actorLastName ASC'; 
		  context.firstCol = "hide-first-col";
		  break;
		  }
	  // OscarWinners table
	  case "awards": {
		  context.colList = ['Year', 'Best Picture', 'Lead Actor', 'Lead Actress'];
		  sqlQuery = 'SELECT o.year AS ID, (SELECT movieTitle FROM Movies INNER JOIN OscarWinners ON Movies.movieID = OscarWinners.bestPicture WHERE OscarWinners.year = o.year), (SELECT CONCAT(actorFirstName, " ", actorLastName) FROM Actors INNER JOIN OscarWinners ON Actors.actorID = OscarWinners.leadActor WHERE OscarWinners.year = o.year), (SELECT CONCAT(actorFirstName, " ", actorLastName) FROM Actors INNER JOIN OscarWinners ON Actors.actorID = OscarWinners.leadActress WHERE OscarWinners.year = o.year) FROM OscarWinners o ORDER BY year DESC';
		  break;
		  }
	  // Genres table
	  case "genres": {
		  context.colList = ['Genre'];
		  sqlQuery = 'SELECT genre AS ID FROM Genres ORDER BY genre ASC';
		  break;
		  }
	  // Movies_Actors table
	  case "movies-actors": {
		  context.colList = ['ID', 'Movie title', 'Actor'];
		  sqlQuery = 'SELECT m.movieID AS ID, movieTitle, CONCAT(actorFirstName, " ", actorLastName) FROM Movies_Actors ma INNER JOIN Movies m ON ma.movieID = m.movieID INNER JOIN Actors a ON ma.actorID = a.actorID ORDER BY movieTitle ASC';
		  context.firstCol = "hide-first-col";
		  break;
		  }
	  default: break;
  }

  // SQL query
  mysql.pool.query(sqlQuery, function(err, rows, fields){
    if(err){return next(err)};
	
	var data = [];
	for (let p in rows) {
	  data.push(rows[p]);
	}
	
	context.dataList = data;
	res.render('view', context);
  });
});

// Add a row to a table
// Fields are dynamically generated through handlebar partials
app.get('/add',function(req,res,next){  
  var context = {};
  var table = req.query.table;
  var callbackCount = 0;

  // Get all genres
  function getGenres(res, mysql, context, complete) {
	mysql.pool.query('SELECT genre FROM Genres ORDER BY genre ASC', function(err, rows, fields){
	  if(err){return next(err)};
	  context.genreList = rows;
	  complete();
	})
  }

  // Get all movie titles
  function getMovies(res, mysql, context, complete) {
	mysql.pool.query('SELECT movieTitle FROM Movies ORDER BY movieTitle ASC', function(err, rows, fields){
	  if(err){return next(err)};
	  context.movieList = rows;
	  complete();
	})
  }
  
  // Get all actor names
  function getActors(res, mysql, context, complete) {
	mysql.pool.query('SELECT CONCAT(actorFirstName, " ", actorLastName) AS actor FROM Actors ORDER BY actorFirstName ASC', function(err, rows, fields){
	  if(err){return next(err)};
	  context.actorList = rows;
	  complete();
	})
  }

  // Form fields are different depending on which table is selected for adding new row
  // The partial to resolve is calculated here
  switch (table) {
	  case "movies": context.whichPartial = () => { return 'addMovie' }; break;
	  case "actors": context.whichPartial = () => { return 'addActor' }; break;
	  case "awards": context.whichPartial = () => { return 'addAward' }; break;
	  case "genres": context.whichPartial = () => { return 'addGenre' }; break;
	  case "movies-actors": context.whichPartial = function() { return 'addMovieActor' }; break;
	  default: break;
  }
  
  // Call all mysql queries used to populate dropdown fields
  getGenres(res, mysql, context, complete);
  getMovies(res, mysql, context, complete);
  getActors(res, mysql, context, complete);
  
  function complete(){
    callbackCount++;
    if(callbackCount >= 3){
      res.render('add', context);
    }
  }
});

app.get('/update',function(req,res,next){
  var context = {};
  var colList = [];
  var sqlQuery;
  var table = req.query.table;
  var ID = req.query.ID;

  // Need to make sure ID is not empty
  
  switch (table) {
	  case "movies": {
		  context.whichPartial = () => { return 'addMovie' };
		  sqlQuery = "SELECT * FROM Movies WHERE movieID=" + ID;
		  break;
		  }
	  case "actors": {
		  context.whichPartial = () => { return 'addActor' };
		  sqlQuery = "SELECT * FROM Actors WHERE actorID=" + ID;
		  break;
		  }
	  case "awards": {
		  context.whichPartial = () => { return 'addAward' };
		  sqlQuery = "SELECT * FROM OscarWinners WHERE year=" + ID;
		  break;
		  }
	  case "genres": {
		  context.whichPartial = () => { return 'addGenre' };
		  sqlQuery = "SELECT * FROM Genres WHERE genre='" + ID + "'";
		  break;
		  }
	  case "movies-actors": {
		  context.whichPartial = function() { return 'addMovieActor' };
		  sqlQuery = "SELECT * FROM Movies_Actors WHERE movieID=" + ID;
		  break;
		  }
	  default: break;
  }
  
  mysql.pool.query(sqlQuery, function(err, rows, fields){
    if(err){return next(err)};
	context.rowData = rows[0];
	res.render('update', context);
  });
});

app.post('/add', urlencodedParser, function(req,res,next) {
  var context = {};
  console.log(req);
  var add = req.body.add;
  
  switch (add) {
  	case "actor":
  		var sql = `INSERT INTO Actors (actorLastName, actorFirstName) VALUES (?, ?)`;
  		mysql.pool.query(sql, [req.body.lname , req.body.fname], function (err, data) {if (err) {} else {}});
  	break;

  	case "genre":
  		var sql = `INSERT INTO Genres (genre) VALUES (?)`;
		mysql.pool.query(sql, [req.body.genre], function (err, data) {if (err) {} else {}});
  	break;
  	
  	case "movie":
  		console.log(req.body);
  		var sql = `INSERT INTO Movies (movieTitle, releaseYear, runtime, ratingIMDB, ratingRottenTomatoes, genre) VALUES (?, ?, ?, ?, ?, ?)`;
  		mysql.pool.query(sql, [req.body.movie_title, req.body.release_year, req.body.runtime, req.body.imdb_rating, req.body.rt_rating, req.body.genre], function (err, data) {if (err) {} else {}});
  	break;
  	
  	case "award":
  		var firstNameActor = req.body.lead_actor.split(' ').slice(0, -1).join(' ');
		var lastNameActor = req.body.lead_actor.split(' ').slice(-1).join(' ');
		var firstNameActress = req.body.lead_actress.split(' ').slice(0, -1).join(' ');
		var lastNameActress = req.body.lead_actress.split(' ').slice(-1).join(' ');
  		var sql = `INSERT INTO OscarWinners (year, bestPicture, leadActor, leadActress) VALUES (?, (SELECT movieID FROM Movies WHERE movieTitle=?), (SELECT actorID FROM Actors WHERE actorLastName=? AND actorFirstName=?), (SELECT actorID FROM Actors WHERE actorLastName=? AND actorFirstName=?))`;
  		mysql.pool.query(sql, [req.body.year, req.body.best_picture, lastNameActor,firstNameActor, lastNameActress, firstNameActress], function (err, data) {if (err) {} else {}});
  	break;
  	
  	case "movieactor":
  		var firstName = req.body.actor.split(' ').slice(0, -1).join(' ');
		var lastName = req.body.actor.split(' ').slice(-1).join(' ');
  		var sql = `INSERT INTO Movies_Actors (movieID, actorID) VALUES ((SELECT movieID FROM Movies WHERE movieTitle=?), (SELECT actorID FROM Actors WHERE actorLastName=? AND actorFirstName=?))`;
		mysql.pool.query(sql, [req.body.movie, lastName, firstName], function (err, data) {if (err) {} else {}});
  	break;

  	default: break;
  }

  res.render('confirm', context);
});

app.post('/update',function(req,res,next) {
  var context = {};
  res.render('confirm', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});
