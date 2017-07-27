
if(typeof require != "undefined"){
	var moment = require('moment');
}

var randMinMax = Math.randMinMax = function(min, max, round) {
	var val = min + (Math.random() * (max - min));
	if( round ) val = Math.round( val );
	return val;
};

function duration(dates){
	// eg dates: {start: new Date(2017, 4, 1), end: new Date(2017, 6, 32)}
	return moment(dates.end).diff(moment(dates.start), 'days')
}

function arrayRange(segmentDates, campaign){
	return {
  	startPos: moment(segmentDates.start).diff(moment(campaign.dates.start), 'days'),
  	endPos: moment(segmentDates.end).diff(moment(campaign.dates.start), 'days')
	}
}

function makeZeros(duration){
	var array = [];
	for(var i = 0; i < duration; i++){
		array.push(0);
	}
	return array;
}

function listDates(dates){
	// eg dates: {start: new Date(2017, 4, 1), end: new Date(2017, 6, 32)}
	var datesArray = [];
	for(var i=0; i < duration(dates); i++){
		var thisStart = dates.start;
		// console.log(thisStart);
		var value = moment(thisStart).add(i, 'days').format('D/M/Y');
		// console.log(value);
		datesArray.push(value);
	}
	return datesArray;
}

if(typeof module != 'undefined'){
	module.exports = {
		randMinMax: randMinMax,
		duration: duration,
		arrayRange: arrayRange,
		makeZeros: makeZeros,
		listDates: listDates

	};
}
