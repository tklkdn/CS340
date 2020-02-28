const MOVIES_COL = ['Movie title', 'Release year', 'Runtime', 'IMDB rating', 'RT rating', 'Genre'];
const ACTORS_COL = ['Last name', 'First name'];
const AWARDS_COL = ['Year', 'Best Picture', 'Lead Actor', 'Lead Actress'];
const GENRES_COL = ['Genre'];
const MOVIES_ACTORS_COL = ['Movie title', 'Actor'];

// For use in dynamic input form
const MOVIES_INP = ['<input type="text" name="movie-title" id="" maxlength="255" required placeholder="Movie title">',
					'<input type="number" name="release-year" id="" required placeholder="Release year">',
					'<input type="number" name="runtime" id="" required placeholder="Runtime" min="0" step="1">',
					'<input type="number" name="imdb-rating" id="" placeholder="IMDB rating" min="0" max="10" step="0.1">',
					'<input type="number" name="rt-rating" id="" placeholder="RT rating" min="0" max="100" step="1">',
					'<select name="genre" id="" required><option disabled selected value>Select genre</option><option>action</option><option>comedy</option><option>drama</option></select>'
					];
					
const ACTORS_INP = ['<input type="text" name="last-name" id="" maxlength="255" required placeholder="Last name">',
					'<input type="text" name="first-name" id="" maxlength="255" required placeholder="First name">'
					];
const AWARDS_INP = ['<input type="number" name="year" id="" required placeholder="Year" min="0" step="1">',
					'<select name="best-picture" id="" required><option disabled selected value>Select best picture</option><option>val</option><option>val</option><option>val</option></select>',
					'<select name="lead-actor" id="" required><option disabled selected value>Select lead actor</option><option>val</option><option>val</option><option>val</option></select>',
					'<select name="lead-actress" id="" required><option disabled selected value>Select lead actress</option><option>val</option><option>val</option><option>val</option></select>'
					];
const GENRES_INP = ['<input type="text" name="genre" id="" maxlength="255" required placeholder="Genre">'
					];
const MOVIES_ACTORS_INP = ['<select name="movie" id="" required><option disabled selected value>Select movie</option><option>val</option><option>val</option><option>val</option></select>',
							'<select name="actor" id="" required><option disabled selected value>Select actor</option><option>val</option><option>val</option><option>val</option></select>'
							]

var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');

var app = express();

var handlebars = require('express-handlebars').create(
  {
    defaultLayout: 'main',
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
  
  // Filter function - filter by genre
  // Adds a WHERE clause to sql query
  var genre = req.query.genre;
  var filter;
  genre != undefined ? filter = 'WHERE m.genre = "' + genre + '"' : filter = '';
  
  // SQL query
  // Queries Top 50 movies in DB
  mysql.pool.query('SELECT movieTitle, releaseYear, m.genre, IF(bestPicture IS NOT NULL, "YES", "NO"), ((ratingIMDB * 10) + ratingRottenTomatoes)/2 AS score FROM Movies m INNER JOIN Genres g ON m.genre = g.genre LEFT JOIN OscarWinners o ON m.movieID = o.bestPicture ' + filter + 'ORDER BY score DESC LIMIT 50', function(err, rows, fields){
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
		  context.colList = MOVIES_COL; 
		  sqlQuery = 'SELECT movieTitle, releaseYear, runtime, ratingIMDB, ratingRottenTomatoes, genre FROM Movies ORDER BY movieTitle ASC';
		  break;
		  }
	  // Actors table
	  case "actors": {
		  context.colList = ACTORS_COL; 
		  sqlQuery = 'SELECT actorLastName, actorFirstName FROM Actors ORDER BY actorLastName ASC'; 
		  break;
		  }
	  // OscarWinners table
	  case "awards": {
		  context.colList = AWARDS_COL;
		  sqlQuery = 'SELECT o.year, (SELECT movieTitle FROM Movies INNER JOIN OscarWinners ON Movies.movieID = OscarWinners.bestPicture WHERE OscarWinners.year = o.year), (SELECT CONCAT(actorFirstName, " ", actorLastName) FROM Actors INNER JOIN OscarWinners ON Actors.actorID = OscarWinners.leadActor WHERE OscarWinners.year = o.year), (SELECT CONCAT(actorFirstName, " ", actorLastName) FROM Actors INNER JOIN OscarWinners ON Actors.actorID = OscarWinners.leadActress WHERE OscarWinners.year = o.year) FROM OscarWinners o ORDER BY year DESC';
		  break;
		  }
	  // Genres table
	  case "genres": {
		  context.colList = GENRES_COL;
		  sqlQuery = 'SELECT * FROM Genres ORDER BY genre ASC';
		  break;
		  }
	  // Movies_Actors table
	  case "movies-actors": {
		  context.colList = MOVIES_ACTORS_COL;
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

app.get('/add',function(req,res,next){
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
  
  res.render('add', context);
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
