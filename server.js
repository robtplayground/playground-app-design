var express = require('express');
var app = express();

// var data = require('./content/content.json');
var moment = require('moment');
const {
	setErrors,
	randMinMax,
	duration,
	arrayRange,
	average,
	total,
	makeZeros,
	listDates,
	breakText,
	extend,
	pickHex,
	hexToRgb
} = require( "./js/helpers.js" );

const {
  fm,
	campaigns,
	creatives,
	placements
} = require("./js/dataGenerator.js" );

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname));

// set the view engine to ejs
app.set('view engine', 'ejs');

// pages

var allData = {
	fm: fm,
	campaigns:campaigns,
	creatives:creatives,
	placements: placements,
  v_campaigns: JSON.stringify(campaigns),
  v_creatives: JSON.stringify(creatives),
  v_placements: JSON.stringify(placements),
  v_fm: JSON.stringify(fm),
  moment:moment,
  setErrors:setErrors,
	randMinMax:randMinMax,
	duration:duration,
	arrayRange:arrayRange,
	average:average,
	total:total,
	makeZeros:makeZeros,
	listDates:listDates,
	breakText:breakText,
	extend: extend,
	pickHex: pickHex,
	hexToRgb: hexToRgb
};

// console.log('HELPERS', dataGenerator.helpers);

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
