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

// Stand-ins for dummy data
const MOVIES_DUMP = [['Plan 9 from Outer Space', 1959, 80, 4, 67, 'Fantasy'],
					['Mac and Me', 1988, 99, 3.3, 0, 'Fantasy'],
					['The Wicker Man', 2006, 102, 3.7, 15, 'Thriller']];
const ACTORS_DUMP = [['Bogart', 'Humphrey'],
					['Aniston', 'Jennifer'],
					['Cage', 'Nicholas']];
const AWARDS_DUMP = [[2018, 'Green Book', 'Rami Malek', 'Olivia Colman'],
					[2017, 'The Shape of Water', 'Gary Oldman', 'Frances McDormand'],
					[2016, 'Moonlight', 'Casey Affleck', 'Emma Stone']];
const GENRES_DUMP = [['action'], ['comedy'], ['drama'], ['horror'], ['sci-fi'], ['thriller']];
const MOVIES_ACTORS_DUMP = [['Mac and Me', 'Jennifer Aniston'],
						['The Wicker Man', 'Nicholas Cage']]

var express = require('express');
// var mysql = require('./dbcon.js');
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

app.get('/',function(req,res,next){
  var context = {};
  var outer = [];
  var genre = req.query.genre;
  var rows;
  genre != undefined ? rows = 15 : rows = 50
  
  for (var i = 0; i < rows; i++) {
	var inner = [];
	for (var j = 0; j < 4; j++) {
	  if (genre == undefined) inner.push("val");  
	  else {
	    if (j == 2) inner.push(genre);
		else inner.push("val");
	  }
	}
	outer.push(inner);
  }
  
  context.outer = outer;
  res.render('home', context);
});

app.get('/view',function(req,res,next){
  var context = {};
  var colList = [];
  var table = req.query.table;
  context.table = table;
  context.tableTitle = table.charAt(0).toUpperCase() + table.slice(1);
  
  switch (table) {
	  case "movies": context.colList = MOVIES_COL; context.dataList = MOVIES_DUMP; break;
	  case "actors": context.colList = ACTORS_COL; context.dataList = ACTORS_DUMP; break;
	  case "awards": context.colList = AWARDS_COL; context.dataList = AWARDS_DUMP; break;
	  case "genres": context.colList = GENRES_COL; context.dataList = GENRES_DUMP; break;
	  case "movies-actors": context.colList = MOVIES_ACTORS_COL; context.dataList = MOVIES_ACTORS_DUMP; break;
	  default: break;
  }

  res.render('view', context);
});

app.get('/add',function(req,res,next){
  var context = {};
  var colList = [];
  var table = req.query.table;
  
  switch (table) {
	  case "movies": context.colList = MOVIES_INP; context.dataList = MOVIES_DUMP; break;
	  case "actors": context.colList = ACTORS_INP; context.dataList = ACTORS_DUMP; break;
	  case "awards": context.colList = AWARDS_INP; context.dataList = AWARDS_DUMP; break;
	  case "genres": context.colList = GENRES_INP; context.dataList = GENRES_DUMP; break;
	  case "movies-actors": context.colList = MOVIES_ACTORS_INP; context.dataList = MOVIES_ACTORS_DUMP; break;
	  default: break;
  }
  
  res.render('add', context);
});

app.get('/update',function(req,res,next){
  var context = {};
  var colList = [];
  var table = req.query.table;
  
  switch (table) {
	  case "movies": context.colList = MOVIES_INP; context.dataList = MOVIES_DUMP; break;
	  case "actors": context.colList = ACTORS_INP; context.dataList = ACTORS_DUMP; break;
	  case "awards": context.colList = AWARDS_INP; context.dataList = AWARDS_DUMP; break;
	  case "genres": context.colList = GENRES_INP; context.dataList = GENRES_DUMP; break;
	  case "movies-actors": context.colList = MOVIES_ACTORS_INP; context.dataList = MOVIES_ACTORS_DUMP; break;
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
