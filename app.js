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
	  inc: function(val, options) {return parseInt(val) + 1;},
	  selected: function(val, options) {if (val == options && val != undefined) return "selected"; else return "";}
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

// Get all genres
function getGenres(res, mysql, context, complete) {
  mysql.pool.query('SELECT genre FROM Genres ORDER BY genre ASC', function(err, rows, fields){
	if(err){return err};
	context.genreList = rows;
	complete();
  });
}

// Get all movie titles
function getMovies(res, mysql, context, complete) {
  mysql.pool.query('SELECT movieID, movieTitle FROM Movies ORDER BY movieTitle ASC', function(err, rows, fields){
	if(err){return err};
	context.movieList = rows;
	complete();
  })
}

// Get all actor names
function getActors(res, mysql, context, complete) {
  mysql.pool.query('SELECT actorID, CONCAT(actorFirstName, " ", actorLastName) AS actor FROM Actors ORDER BY actorFirstName ASC', function(err, rows, fields){
	if(err){return err};
	context.actorList = rows;
	complete();
  })
}

// Check for duplicates when adding or updating an entry
function duplicate(res, mysql, context, req, complete) {
  var sqlQuery;
  var table = req.body.add == undefined ? req.query.table : req.body.add;
  
  switch(table) {
	case "actors":
		sqlQuery = "SELECT COUNT(actorID) AS count FROM Actors WHERE actorLastName = '" + req.body.lname + "' AND actorFirstName = '" + req.body.fname + "'";
		break;
	case "movies":
		sqlQuery = "SELECT COUNT(movieID) AS count FROM Movies WHERE movieTitle = '" + req.body.movie_title + "' AND releaseYear = " + req.body.release_year;
		break;
	case "genres":
		sqlQuery = "SELECT COUNT(genre) AS count FROM Genres WHERE genre = '" + req.body.genre + "'";
		break;
	case "awards":
		sqlQuery = "SELECT COUNT(year) AS count FROM OscarWinners WHERE year = " + req.body.year;
		break;
	case "movies-actors":
		sqlQuery = "SELECT COUNT(movieID) AS count FROM Movies_Actors WHERE movieID = " + req.body.movie + " AND actorID = " + req.body.actor;
		break;
	default: break;
  }
  
  mysql.pool.query(sqlQuery, function(err, rows, fields){
	if(err){return err};
	if (rows[0].count > 0) context.duplicate = true;
	else context.duplicate = false;
	complete();
  })
}

// Homepage
app.get('/',function(req,res,next){
  var context = {};
  var callbackCount = 0;
  
  function getTopMovies(res, mysql, context, complete) {
    // Filter function - filter by genre
    // Adds a WHERE clause to sql query
    var genre = req.query.genre;
    var filter;
	
	if (genre == undefined || genre == 'Select genre') {
	  filter = '';
	} else {
	  filter = 'WHERE m.genre = "' + genre + '"'
	}
    
	mysql.pool.query('SELECT movieTitle, releaseYear, m.genre, IF(bestPicture IS NOT NULL, "Yes", "No"), ((ratingIMDB * 10) + ratingRottenTomatoes)/2 AS score FROM Movies m INNER JOIN Genres g ON m.genre = g.genre LEFT JOIN OscarWinners o ON m.movieID = o.bestPicture ' + filter + ' ORDER BY score DESC LIMIT 50', function(err, rows, fields){
	  if(err){return next(err)};
	  context.movieList = rows;
	  complete();
	});
  }
  
  getGenres(res, mysql, context, complete);
  getTopMovies(res, mysql, context, complete);
  
  function complete(){
    callbackCount++;
    if(callbackCount >= 2){
      res.render('home', context);
    }
  }
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
	  context.colList = ['ID', 'ID2', 'Movie title', 'Actor'];
	  sqlQuery = 'SELECT m.movieID AS ID, a.actorID AS ID2, movieTitle, CONCAT(actorFirstName, " ", actorLastName) FROM Movies_Actors ma INNER JOIN Movies m ON ma.movieID = m.movieID INNER JOIN Actors a ON ma.actorID = a.actorID ORDER BY movieTitle ASC';
	  context.firstCol = "hide-first-col hide-second-col";
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

// Search
// Fields are dynamically generated through handlebar partials
app.post('/search', urlencodedParser, function(req,res,next) {
  var context = {};
  var callbackCount = 0;
  var option = req.body.searchoption;
  var phrase = req.body.search;
  var sql;
  
  function getTopMovies(res, mysql, context, complete) {
     
	switch (option) {
	  	case "title":
	  	var sql = "SELECT movieTitle, releaseYear, m.genre, IF(bestPicture IS NOT NULL, 'Yes', 'No'), (((ratingIMDB * 10) + ratingRottenTomatoes)/2) AS score FROM (Movies m INNER JOIN Genres g ON m.genre = g.genre LEFT JOIN OscarWinners o ON m.movieID = o.bestPicture) WHERE movieTitle LIKE '%" + phrase + "%'";
	  	break;

	  	case "genre":
	  	var sql = "SELECT movieTitle, releaseYear, m.genre, IF(bestPicture IS NOT NULL, 'Yes', 'No'), (((ratingIMDB * 10) + ratingRottenTomatoes)/2) AS score FROM (Movies m INNER JOIN Genres g ON m.genre = g.genre LEFT JOIN OscarWinners o ON m.movieID = o.bestPicture) WHERE m.genre LIKE '%" + phrase + "%'";
	  	break;

	  	case "year":
	  	var sql = "SELECT movieTitle, releaseYear, m.genre, IF(bestPicture IS NOT NULL, 'Yes', 'No'), (((ratingIMDB * 10) + ratingRottenTomatoes)/2) AS score FROM (Movies m INNER JOIN Genres g ON m.genre = g.genre LEFT JOIN OscarWinners o ON m.movieID = o.bestPicture) WHERE releaseYear LIKE '%" + phrase + "%'";
	  	break;

	  	default: break;
	  }

	mysql.pool.query(sql, function(err, rows, fields){
	  if(err){return next(err)};
	  context.movieList = rows;
	  complete();
	});
  }
  
  getTopMovies(res, mysql, context, complete);
  
  function complete(){
    callbackCount++;
    if(callbackCount >= 1){
      res.render('search', context);
    }
  }

});

// Add a row to a table
// Fields are dynamically generated through handlebar partials
app.get('/add',function(req,res,next){  
  var context = {};
  var table = req.query.table;
  context.tableTitle = table.charAt(0).toUpperCase() + table.slice(1);
  var callbackCount = 0;
  var error = req.query.error;
  if (error != undefined) context.error = "Error: Existing entry found. Please try again.";

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

// Update an existing row in a table
// Fields are dynamically generated through handlebar partials
app.get('/update',function(req,res,next){
  var context = {};
  var colList = [];
  var sqlQuery;
  var callbackCount = 0;
  var table = req.query.table;
  context.tableTitle = table.charAt(0).toUpperCase() + table.slice(1);
  var id = req.query.ID;
  var id2 = req.query.ID2;
  var error = req.query.error;
  if (error != undefined) context.error = "Error: Existing entry found. Please try again.";
  
  // Get all values of selected row
  function populateFields(res, mysql, context, sqlQuery, complete) {
	mysql.pool.query(sqlQuery, function(err, rows, fields) {
	  if(err){return next(err)};
	  context.rowData = rows[0];
	  context.movieID = rows[0].movieID;
	  context.genre = rows[0].genre;
	  context.actorID = rows[0].actorID;
	  context.leadActorID = rows[0].leadActorID;
	  context.leadActressID = rows[0].leadActressID;
	  complete();
	})
  }
  
  // Select which partial to use based on table
  // SQL query to use will differ by table
  switch (table) {
	case "movies": {
	  context.whichPartial = () => { return 'addMovie' };
	  sqlQuery = "SELECT * FROM Movies WHERE movieID=" + id;
	  break;
	  }
    case "actors": {
	  context.whichPartial = () => { return 'addActor' };
	  sqlQuery = "SELECT * FROM Actors WHERE actorID=" + id;
	  break;
	  }
    case "awards": {
	  context.whichPartial = () => { return 'addAward' };
	  sqlQuery = "SELECT year, m.movieID, (SELECT actorID FROM Actors INNER JOIN OscarWinners ON Actors.actorID = OscarWinners.leadActor WHERE OscarWinners.year = o.year) AS leadActorID, (SELECT actorID FROM Actors INNER JOIN OscarWinners ON Actors.actorID = OscarWinners.leadActress WHERE OscarWinners.year = o.year) AS leadActressID FROM OscarWinners o INNER JOIN Movies m ON o.bestPicture = m.movieID INNER JOIN Actors a ON o.leadActor WHERE year=" + id;
	  break;
	  }
	case "genres": {
	  context.whichPartial = () => { return 'addGenre' };
	  sqlQuery = "SELECT * FROM Genres WHERE genre='" + id + "'";
	  break;
	  }
	case "movies-actors": {
	  context.whichPartial = function() { return 'addMovieActor' };
	  sqlQuery = "SELECT ma.movieID, ma.actorID FROM Movies_Actors ma INNER JOIN Movies m ON ma.movieID = m.movieID INNER JOIN Actors a ON a.actorID = ma.actorID WHERE ma.movieID=" + id + " AND ma.actorID=" + id2;
	  break;
	  }
	default: break;
  }
  
  // Call all mysql queries used to populate dropdown fields
  getGenres(res, mysql, context, complete);
  getMovies(res, mysql, context, complete);
  getActors(res, mysql, context, complete);
  populateFields(res, mysql, context, sqlQuery, complete);
  
  function complete(){
    callbackCount++;
    if(callbackCount >= 4){
      res.render('update', context);
    }
  }
});

app.post('/add', urlencodedParser, function(req,res,next) {
  var context = {};
  var add = req.body.add;
  
  // Error handling - check for duplicates
  duplicate(res, mysql, context, req, complete);

  function complete() {
	if (context.duplicate) {
	  res.redirect('add?table=' + add + '&error=dup');
	  return;
	} else {
	  addRow();
	}
  }
  
  function addRow() {
	switch (add) {
		case "actors":
			var sql = `INSERT INTO Actors (actorLastName, actorFirstName) VALUES (?, ?)`;
			mysql.pool.query(sql, [req.body.lname , req.body.fname], function (err, data) {if (err) {} else {}});
		break;

		case "genres":
			var sql = `INSERT INTO Genres (genre) VALUES (?)`;
			mysql.pool.query(sql, [req.body.genre], function (err, data) {if (err) {} else {}});
		break;
		
		case "movies":
			var sql = `INSERT INTO Movies (movieTitle, releaseYear, runtime, ratingIMDB, ratingRottenTomatoes, genre) VALUES (?, ?, ?, ?, ?, ?)`;
			mysql.pool.query(sql, [req.body.movie_title, req.body.release_year, req.body.runtime, req.body.imdb_rating, req.body.rt_rating, req.body.genre], function (err, data) {if (err) {} else {}});
		break;
		
		case "awards":
			var sql = `INSERT INTO OscarWinners (year, bestPicture, leadActor, leadActress) VALUES (?, ?, ?, ?)`;
			mysql.pool.query(sql, [req.body.year, req.body.best_picture, req.body.lead_actor, req.body.lead_actress], function (err, data) {if (err) {} else {}});
		break;
		
		case "movies-actors":
			var sql = `INSERT INTO Movies_Actors (movieID, actorID) VALUES (?, ?)`;
			mysql.pool.query(sql, [req.body.movie, req.body.actor], function (err, data) {if (err) {} else {}});
		break;

		default: break;
	  }
	res.redirect('view?table=' + add);
  }
  
});

// POST request - update row in table
app.post('/update', urlencodedParser, function(req,res,next) {
  var context = {};
  var sqlQuery, values;
  var table = req.query.table;
  var id = req.query.ID;
  var id2 = req.query.ID2;
  
  // Error handling - check for duplicates
  duplicate(res, mysql, context, req, complete);
  
  function complete() {
	if (context.duplicate) {
	  res.redirect('update?table=' + table + '&ID=' + id + '&ID2' + id2 + '&error=dup');
	  return;
	} else {
	  updateRow();
	}
  }
  
  // Select query to execute based on table
  // Values to update should all be in req.body object
  function updateRow() {
	switch (table) {
	  case "movies": {
        sqlQuery = "UPDATE Movies SET movieTitle = ?, releaseYear = ?, runtime = ?, ratingIMDB = ?, ratingRottenTomatoes = ?, genre = ? WHERE movieID = " + id;
	    values = [req.body.movie_title, req.body.release_year, req.body.runtime, req.body.imdb_rating, req.body.rt_rating, req.body.genre];
	    break;
	  }
	  case "actors": {
	    sqlQuery = "UPDATE Actors SET actorLastName = ?, actorFirstName = ? WHERE actorID = " + id;
	    values = [req.body.lname , req.body.fname];
	    break;
	  }
	  case "genres": {
	    sqlQuery = "UPDATE Genres SET genre = ? WHERE genre = '" + id + "'";
	    values = [req.body.genre];
	    break;
	  }
	  case "awards": {
	    sqlQuery = "Update OscarWinners SET year = ?, bestPicture = ?, leadActor = ?, leadActress = ? WHERE year = " + id;
	    values = [req.body.year, req.body.best_picture, req.body.lead_actor, req.body.lead_actress];
	    break;
	  }
	  case "movies-actors": {
	    sqlQuery = "Update Movies_Actors SET movieID = ?, actorID = ? WHERE movieID = " + id + " AND actorID = " + id2;
	    values = [req.body.movie, req.body.actor];
	    break;
	  }
	  default: break;
    }
  
    // SQL query
    mysql.pool.query(sqlQuery, values, function(err, rows, fields){
      if(err){return next(err)};
	  res.redirect('view?table=' + table);
    });
  }
  
  
});

app.get('/delete',function(req,res,next){

var table = req.query.table;
var ID = req.query.ID;

  switch (req.query.table) {
	  case "movies": {
		  var sql = `DELETE FROM Movies WHERE movieID=?`;
		  mysql.pool.query(sql, [ID], function (err, data) {if (err) {} else {complete()}});
		  break;
		  }
	  case "actors": {
		  var sql = `DELETE FROM Actors WHERE actorID=?`;
		  mysql.pool.query(sql, [ID], function (err, data) {if (err) {} else {complete()}});
		  break;
		  }
	  case "awards": {
		  var sql = `DELETE FROM OscarWinners WHERE year=?`;
		  mysql.pool.query(sql, [ID], function (err, data) {if (err) {} else {complete()}});
		  break;
		  }
	  case "genres": {
		  var sql = `DELETE FROM Genres WHERE genre=?`;
		  mysql.pool.query(sql, [ID], function (err, data) {if (err) {} else {complete()}});
		  break;
		  }
	  case "movies-actors": {
		  var sql = `DELETE FROM Movies_Actors WHERE movieID=? AND actorID=?`;
		  mysql.pool.query(sql, [ID, req.query.ID2], function (err, data) {if (err) {} else {complete()}});
		  break;
		  }
	  default: break;
  }

  function complete() {
	res.redirect('view?table=' + table);
  }
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
