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

app.get('/', function(request, response) {
  response.render('../views/index.html.ejs');
});

app.get('/login', function(request, response) {
  response.render('../views/login.html.ejs');
});

app.get('/graphs', function(request, response) {
  response.render('../views/graphs.html.ejs', {
    chartData: dataGenerator.chartData,
    v_chartData: JSON.stringify(dataGenerator.chartData)
  });
});

app.get('/ui', function(request, response) {
  response.render('../views/ui.html.ejs');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
