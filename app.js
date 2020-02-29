var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');
var app = express();

var handlebars = require('express-handlebars').create(
  {
    defaultLayout: 'main',
	partialsDir: path.join(__dirname, '/views/partials'),
    helpers: {
	  inc: function(val, options) {return parseInt(val) + 1;}
	}
  }
);

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.listen(3141);

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
  var table = req.query.table;
  context.table = table;
  context.tableTitle = table.charAt(0).toUpperCase() + table.slice(1);		// Page title
  
  // Columns and SQL query are selected depending on value of "table" variable
  switch (table) {
	  // Movies table
	  case "movies": {
		  context.colList = ['Movie title', 'Release year', 'Runtime', 'IMDB rating', 'RT rating', 'Genre']; 
		  sqlQuery = 'SELECT movieTitle, releaseYear, runtime, ratingIMDB, ratingRottenTomatoes, genre FROM Movies ORDER BY movieTitle ASC';
		  break;
		  }
	  // Actors table
	  case "actors": {
		  context.colList = ['Last name', 'First name'];
		  sqlQuery = 'SELECT actorLastName, actorFirstName FROM Actors ORDER BY actorLastName ASC'; 
		  break;
		  }
	  // OscarWinners table
	  case "awards": {
		  context.colList = ['Year', 'Best Picture', 'Lead Actor', 'Lead Actress'];
		  sqlQuery = 'SELECT o.year, (SELECT movieTitle FROM Movies INNER JOIN OscarWinners ON Movies.movieID = OscarWinners.bestPicture WHERE OscarWinners.year = o.year), (SELECT CONCAT(actorFirstName, " ", actorLastName) FROM Actors INNER JOIN OscarWinners ON Actors.actorID = OscarWinners.leadActor WHERE OscarWinners.year = o.year), (SELECT CONCAT(actorFirstName, " ", actorLastName) FROM Actors INNER JOIN OscarWinners ON Actors.actorID = OscarWinners.leadActress WHERE OscarWinners.year = o.year) FROM OscarWinners o ORDER BY year DESC';
		  break;
		  }
	  // Genres table
	  case "genres": {
		  context.colList = ['Genre'];
		  sqlQuery = 'SELECT * FROM Genres ORDER BY genre ASC';
		  break;
		  }
	  // Movies_Actors table
	  case "movies-actors": {
		  context.colList = ['Movie title', 'Actor'];
		  sqlQuery = 'SELECT movieTitle, CONCAT(actorFirstName, " ", actorLastName) FROM Movies_Actors ma INNER JOIN Movies m ON ma.movieID = m.movieID INNER JOIN Actors a ON ma.actorID = a.actorID ORDER BY movieTitle ASC';
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
  var table = req.query.table;
  
  switch (table) {
	  case "movies": context.colList = MOVIES_INP; break;
	  case "actors": context.colList = ACTORS_INP; break;
	  case "awards": context.colList = AWARDS_INP; break;
	  case "genres": context.colList = GENRES_INP; break;
	  case "movies-actors": context.colList = MOVIES_ACTORS_INP; break;
	  default: break;
  }
  
  res.render('update', context);
});

app.post('/add',function(req,res,next) {
  var context = {};
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
