var express = require('express');
var app = express();

var data = require('./content/content.json');
// var moment = require('moment');
var dataGenerator = require('./js/dataGenerator.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname));

// set the view engine to ejs
app.set('view engine', 'ejs');

// pages

var allData = {
  cp: dataGenerator.cp,
  fm: dataGenerator.fm,
  pl: dataGenerator.pl,
  v_cp: JSON.stringify(dataGenerator.cp),
  v_fm: JSON.stringify(dataGenerator.fm),
  v_pl: JSON.stringify(dataGenerator.pl)
};

app.get('/', function(request, response) {
  response.render('../views/index.html.ejs', allData);
});

app.get('/login', function(request, response) {
  response.render('../views/login.html.ejs', allData);
});

app.get('/charts', function(request, response) {
  response.render('../views/charts.html.ejs', allData);
});

app.get('/campaigns', function(request, response) {
  response.render('../views/campaigns.html.ejs', allData);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
