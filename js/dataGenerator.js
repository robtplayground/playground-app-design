Math.randMinMax = function(min, max, round) {
	var val = min + (Math.random() * (max - min));
	if( round ) val = Math.round( val );
	return val;
};

/***** HELPERS  *****/

function duration(dates){
	// eg dates: {start: new Date(2017, 4, 1), end: new Date(2017, 6, 32)}
	return moment(dates.end).diff(moment(dates.start), 'days')
}

function arrayRange(segmentDates){
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

/***** CAMPAIGN  *****/

// graphing will happen from 27 June 2017

function generateCampaign(name, dates) {
	return {
		name: name,
		dates: {
			start: dates.start,
			end: dates.end
		},
		dateList: function(){
			return listDates(this.dates);
		},
		duration: duration(dates)
	}
}

var campaign = generateCampaign('campaign', {
	start: new Date(2017, 4, 1),
	end: new Date(2017, 6, 32)
});

var currentDate = new Date(2017, 5, 28);


// BENCHMARKS

var superSkin = {
  benchmarks: {
    viewability: 91,
    er: 0.92,
    ativ: 9.2
  }
};

/***** METRICS  *****/

function REQUESTED_IMPS(bookedImps, placementDates, errors){
	// create zeros
  var values = makeZeros(campaign.duration);
	// work out where placement data sits in campaign metrics
	var pDuration = duration(placementDates);
	var pRange = arrayRange(placementDates);

	function setMetric(){
		// create random reqImps value
		var min = (bookedImps / pDuration) - 500;
		var max = (bookedImps / pDuration) + 150;
		return Math.randMinMax(min, max, true);
	}

	function setError(){
		// create random reqImps error value - delivery under half on errorDates
		var min = Math.round((bookedImps / pDuration) / 2) - 500;
		var max = Math.round((bookedImps / pDuration) / 2) - 100;
		return Math.randMinMax(min, max, true);
	}
	// overwrite zeroes with impressions
  for(var i = pRange.startPos; i < pRange.endPos; i++){
		values.splice(i, 1, setMetric());
  }

	// there are errors for this metric...
	if(errors.reqImps){
		var eRange = arrayRange(errors.reqImps);
		// overwrite impressions with errors
		for(var i = eRange.startPos; i < eRange.endPos; i++){
			values.splice(i, 1, setError());
	  }
	}
  return values;
}

function EXECUTED_IMPS(reqImpsArray, errors){
	// create zeros
  var values = reqImpsArray.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var difference = Math.randMinMax(100, 1000, true);
	    values.splice(i, 1, value - difference);
		}
  });

	function setError(value){
		// only 1/4 imps are executing
		return Math.round(value / 4);
	}

	// there are errors for this metric...
	if(errors.execImps){
		var eRange = arrayRange(errors.execImps);
		// overwrite impressions with errors
		for(var i = eRange.startPos; i < eRange.endPos; i++){
			values.splice(i, 1, setError(values[i]));
	  }
	}

  return values;
}

function VIEWABLE_IMPS(execImpsArray, errors){
	// create zeros
  var values = execImpsArray.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var difference = Math.randMinMax(100, 1000, true);
	    values.splice(i, 1, value - difference);
		}
  });

	function setError(){
		// ad not viewable - not rendering - creative error?
		return Math.randMinMax(100, 60, true);
	}

	// there are errors for this metric...
	if(errors.viewImps){

		var eRange = arrayRange(errors.viewImps);
		// overwrite impressions with errors
		for(var i = eRange.startPos; i < eRange.endPos; i++){
			values.splice(i, 1, setError());
	  }
	}

  return values;
}

function PERCENT(array1, array2){
	// create zeros
	var values = array1.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var newValue = Number(((value / array2[i]) * 100).toFixed(2));
	    values.splice(i, 1, newValue);
		}
  });
	// console.log(values);
  return values;
}

function CLICKS(array){
	// create zeros
	var values = array.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var min = 24/10000;
			var max = 36/10000;
			var newValue = Math.round(value * Math.randMinMax(min, max));
	    values.splice(i, 1, newValue);
		}
  });
  return values;
}

function ENGAGEMENTS(array){
	// create zeros
	var values = array.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var min = 63/10000;
			var max = 84/10000;
			var newValue = Math.round(value * Math.randMinMax(min, max));
	    values.splice(i, 1, newValue);
		}
  });
  return values;
}

function CLICKENG(clicksArray, engagementsArray){
	// create zeros
	var values = clicksArray.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var newValue = value + engagementsArray[i];
	    values.splice(i, 1, newValue);
		}
  });
  return values;
}

function ATIV(executedImpsArray, ativBenchmark){
	// create zeros
	var values = executedImpsArray.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var newValue = Number((ativBenchmark + Math.randMinMax(-1, 4)).toFixed(2));
	    values.splice(i, 1, newValue);
		}
  });
  return values;
}

function VIDEO_VIEWABLE_IMPS(engagementsArray){
	// create zeros
	var values = engagementsArray.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var newValue = value + Math.randMinMax(-1, -3, true);
	    values.splice(i, 1, newValue);
		}
  });
  return values;
}

function AGGREGATE(array){
	// create zeros
	var values = array.slice();
	var aggValue = 0;
	values.forEach(function(value, i){
		aggValue = aggValue + value;
    values.splice(i, 1, aggValue);
  });
  return values;
}

function VIDEO_METRICS(executedImpsArray){
	var values = executedImpsArray.slice();
  var video = {
    vid0: [],
    vid25: [],
    vid50: [],
    vid75: [],
    vid100: []
  };
  function splitPercent(){
    var randoms = [];
    var sum = 0;
    var percents = [];
    // generate 5 random numbers
    for(var i = 0; i < 5; i++){
      var value = Math.randMinMax(1, 10);
      randoms.push(value);
    }
    // sum randoms
    randoms.forEach(function(value){
      sum = sum + value;
    });
    // create percentages
    randoms.forEach(function(value){
      var percentage = Number(((value / sum) * 100).toFixed(2));
      percents.push(percentage);
    });
    return percents;
  }

	values.forEach(function(value, i){
		if(value === 0){
			video.vid0.push(0);
	    video.vid25.push(0);
	    video.vid50.push(0);
	    video.vid75.push(0);
	    video.vid100.push(0);
		}else{
			var percents = splitPercent();
	    video.vid0.push(percents[0]);
	    video.vid25.push(percents[1]);
	    video.vid50.push(percents[2]);
	    video.vid75.push(percents[3]);
	    video.vid100.push(percents[4]);
		}
  });

  // generate videoMetrics

  return video;
}

function createPlacement(options){
	// name is string, dates = dates object, errors = errorsObject{}
	var requestedImps = REQUESTED_IMPS(options.bookedImps, options.dates, options.errors);
	console.log(requestedImps);
	var reqImpsAgg = AGGREGATE(requestedImps);
	console.log('reqImps', requestedImps, reqImpsAgg);
	var executedImps = EXECUTED_IMPS(requestedImps, options.errors);
	console.log('reqImps', requestedImps, executedImps);
	var execImpsAgg = AGGREGATE(executedImps);
	console.log('execImps', executedImps, execImpsAgg);
	var viewableImps = VIEWABLE_IMPS(executedImps, options.errors);
	var viewImpsAgg = AGGREGATE(viewableImps);
	var viewability = PERCENT(viewableImps, executedImps);
	// console.log(requestedImps);
	var clicks = CLICKS(viewableImps);
	var clickRate = PERCENT(clicks, executedImps);
	var engagements = ENGAGEMENTS(viewableImps);
	var clickEng = CLICKENG(clicks, engagements);
	var engagementRate = PERCENT(clickEng, executedImps);
	var ativ = ATIV(executedImps, superSkin.benchmarks.ativ);
	var videoViewableImps = VIDEO_VIEWABLE_IMPS(engagements);
	var video = VIDEO_METRICS(engagements);

  return {
    name: options.name,
    dates: options.dates,
		bookedImps: options.bookedImps,
    data: {
			// dates are always the campaign dates
			requestedImps: requestedImps,
			reqImpsAgg: reqImpsAgg,
			executedImps: executedImps,
			execImpsAgg: execImpsAgg,
			viewableImps: viewableImps,
			viewImpsAgg: viewImpsAgg,
			viewability: viewability,
			clicks: clicks,
			clickRate: clickRate,
			engagements: engagements,
			clickEng: clickEng,
			engagementRate: engagementRate,
			ativ: ativ,
			videoViewableImps: videoViewableImps,
			video: video
  	}
	}
}


/***** GENERATE  *****/


var SS1 = createPlacement({
	name: '146560594_Airwave_GoPro_Target_MalesMetro18-44_PreLaunch',
	bookedImps: 500000,
	dates: {
		start: new Date(2017, 4, 1),
		end: new Date(2017, 5, 16)
	},
	errors: {
		reqImps:{
			start: new Date(2017, 4, 30),
			end: new Date(2017, 5, 5)
		}
	}
});

var SS2 = createPlacement({
	name: '146560595_Airwave_GoPro_Target_FemalesMetro18-44_PreLaunch',
	bookedImps: 500000,
	dates: {
		start: new Date(2017, 4, 1),
		end: new Date(2017, 5, 16)
	},
	errors: {
		execImps:{
			start: new Date(2017, 4, 10),
			end: new Date(2017, 4, 30)
		}
	}
});

var SS3 = createPlacement({
	name: '146560596_Airwave_GoPro_Target_MalesMetro18-44_Post',
	bookedImps: 500000,
	dates: {
		start: new Date(2017, 5, 11),
		end: new Date(2017, 6, 32)
	},
	errors: {
		viewImps:{
			start: new Date(2017, 5, 11),
			end: new Date(2017, 5, 16)
		}
	}
});

// console.log(SS1.data.executedImps);
