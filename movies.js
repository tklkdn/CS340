var express = require('express');
//var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res,next){
  var context = {};
  res.render('home', context);
});

app.get('/table',function(req,res,next){
  var context = {};
  res.render('table', context);
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