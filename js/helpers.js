
if(typeof require != "undefined"){
	var moment = require('moment');
}


function setErrors(pathArray, targetArray){
	// console.log('pathArray', pathArray, 'targetArray', targetArray);
	var values = targetArray.slice();
	// console.log(targetArray)
	var path = pathArray.slice();
	for(i = 0; i < path.length; i++){
		// make path value into percentage value
		var originalValue = values[i];
		var percent = (path[i] - 100)/100 * -1;
		var difference = values[i] * percent;
		var result = Math.round(values[i] + difference);
		if(result > 0){
			values[i] = result;
		}else{
			values[i] = 0;
		}
	}

	return values;
}

// not sure how to get this dynamically for JS

var rem = 16;

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
		// var value = moment(thisStart).add(i, 'days').format('YYYY-MM-DD');
		var value = moment(thisStart).add(i, 'days');
		// console.log(value);
		datesArray.push(value);
	}
	return datesArray;
}

function breakText(string){
	if(string.indexOf('_') > 0){
		return string.replace(/_/g, '<wbr>_');
	}else{
		return string;
	}
}



if(typeof module != 'undefined'){
	module.exports = {
		setErrors: setErrors,
		randMinMax: randMinMax,
		duration: duration,
		arrayRange: arrayRange,
		makeZeros: makeZeros,
		listDates: listDates,
		breakText: breakText,

	};
}

// add string truncator to String prototype. Note - not exported for use in backend, didn't figure that out

String.prototype.trunc = String.prototype.trunc || function(n){
    return (this.length > n) ? this.substr(0, n-1) + '…' : this;
};
