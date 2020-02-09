const MOVIES_COL = ['Movie title', 'Release year', 'Runtime', 'IMDB rating', 'RT rating'];
const ACTORS_COL = ['Last name', 'First name'];
const AWARDS_COL = ['Year', 'Best Picture', 'Lead Actor', 'Lead Actress'];
const GENRES_COL = ['Genre'];
const MOVIES_ACTORS_COL = ['Movie title', 'Actor'];

const MOVIES_DUMP = [['Plan 9 from Outer Space', 1959, 80, 4, 67],
					['Mac and Me', 1988, 99, 3.3, 0],
					['The Wicker Man', 2006, 102, 3.7, 15]];
const ACTORS_DUMP = [['Bogart', 'Humphrey'],
					['Aniston', 'Jennifer'],
					['Cage', 'Nicholas']];
const AWARDS_DUMP = [[2018, 'Green Book', 'Rami Malek', 'Olivia Colman'],
					[2017, 'The Shape of Water', 'Gary Oldman', 'Frances McDormand'],
					[2016, 'Moonlight', 'Casey Affleck', 'Emma Stone']];
const GENRES_DUMP = [['action'], ['comedy'], ['drama'], ['horror'], ['sci-fi']];
const MOVIES_ACTORS_DUMP = [['Mac and Me', 'Jennifer Aniston'],
						['The Wicker Man', 'Nicholas Cage']]


var express = require('express');
//var mysql = require('./dbcon.js');
var path = require('path');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.listen(3000);

app.get('/',function(req,res,next){
  var context = {};
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

app.get('/admin',function(req,res,next){
  var context = {};
  var colList = [];
  var table = req.query.table;
  
  switch (table) {
	  case "movies": context.colList = MOVIES_COL; context.dataList = MOVIES_DUMP; break;
	  case "actors": context.colList = ACTORS_COL; context.dataList = ACTORS_DUMP; break;
	  case "awards": context.colList = AWARDS_COL; context.dataList = AWARDS_DUMP; break;
	  case "genres": context.colList = GENRES_COL; context.dataList = GENRES_DUMP; break;
	  case "movies-actors": context.colList = MOVIES_ACTORS_COL; context.dataList = MOVIES_ACTORS_DUMP; break;
	  default: break;
  }
  
  res.render('admin', context);
});

app.get('/query',function(req,res,next){
  var context = {};
  
  res.render('query', context);
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