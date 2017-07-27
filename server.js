var express = require('express');
var app = express();

var data = require('./content/content.json');
// var moment = require('moment');
var dataGenerator = require('./js/dataGenerator.js');

console.log(dataGenerator.campaign);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname));

// set the view engine to ejs
app.set('view engine', 'ejs');

// pages

app.get('/', function(request, response) {
  response.render('../views/index.html.ejs');
});

app.get('/graphs', function(request, response) {
  response.render('../views/graphs.html.ejs', {
    t_campaign: dataGenerator.campaign,
    SS1Pre: dataGenerator.SS1Pre,
    SS2Pre: dataGenerator.SS2Pre,
    SP1Pre: dataGenerator.SP1Pre,
    SP2Pre: dataGenerator.SP2Pre,
    SS1Post: dataGenerator.SS1Post,
    SS2Post: dataGenerator.SS2Post,
    SP1Post: dataGenerator.SP1Post,
    SP2Post: dataGenerator.SP2Post,
    v_campaign: JSON.stringify(dataGenerator.campaign),
    v_SS1Pre: JSON.stringify(dataGenerator.SS1Pre),
    v_SS2Pre: JSON.stringify(dataGenerator.SS2Pre),
    v_SP1Pre: JSON.stringify(dataGenerator.SP1Pre),
    v_SP2Pre: JSON.stringify(dataGenerator.SP2Pre),
    v_SS1Post: JSON.stringify(dataGenerator.SS1Post),
    v_SS2Post: JSON.stringify(dataGenerator.SS2Post),
    v_SP1Post: JSON.stringify(dataGenerator.SP1Post),
    v_SP2Post: JSON.stringify(dataGenerator.SP2Post)
  });
});

app.get('/ui', function(request, response) {
  response.render('../views/ui.html.ejs');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
