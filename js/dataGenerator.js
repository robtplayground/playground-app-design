var moment = require('moment');
var path = require('path');
var helpers = require( path.resolve( __dirname, "helpers.js" ) );

/***** CAMPAIGN  *****/

// graphing will happen from 27 June 2017

function generateCampaign(name, dates) {
	var dateList = helpers.listDates(dates);
	var dur = helpers.duration(dates);
	return {
		name: name,
		dates: {
			start: dates.start,
			end: dates.end
		},
		dateList: dateList,
		duration: dur
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
  var values = helpers.makeZeros(campaign.duration);
	// work out where placement data sits in campaign metrics
	var pDuration = helpers.duration(placementDates);
	var pRange = helpers.arrayRange(placementDates, campaign);

	function setMetric(){
		// create random reqImps value
		var min = (bookedImps / pDuration) - 500;
		var max = (bookedImps / pDuration) + 150;
		return helpers.randMinMax(min, max, true);
	}

	function setError(){
		// create random reqImps error value - delivery under half on errorDates
		var min = Math.round((bookedImps / pDuration) / 2) - 500;
		var max = Math.round((bookedImps / pDuration) / 2) - 100;
		return helpers.randMinMax(min, max, true);
	}
	// overwrite zeroes with impressions
  for(var i = pRange.startPos; i < pRange.endPos; i++){
		values.splice(i, 1, setMetric());
  }

	// there are errors for this metric...
	if(errors.reqImps){
		var eRange = helpers.arrayRange(errors.reqImps, campaign);
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
			var difference = helpers.randMinMax(100, 1000, true);
	    values.splice(i, 1, value - difference);
		}
  });

	function setError(value){
		// only 1/4 imps are executing
		return Math.round(value / 4);
	}

	// there are errors for this metric...
	if(errors.execImps){
		var eRange = helpers.arrayRange(errors.execImps, campaign);
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
			var difference = helpers.randMinMax(100, 1000, true);
	    values.splice(i, 1, value - difference);
		}
  });

	function setError(){
		// ad not viewable - not rendering - creative error?
		return helpers.randMinMax(100, 60, true);
	}

	// there are errors for this metric...
	if(errors.viewImps){

		var eRange = helpers.arrayRange(errors.viewImps, campaign);
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
			var newValue = Math.round(value * helpers.randMinMax(min, max));
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
			var newValue = Math.round(value * helpers.randMinMax(min, max));
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
			var newValue = Number((ativBenchmark + helpers.randMinMax(-1, 4)).toFixed(2));
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
			var newValue = value + helpers.randMinMax(-1, -3, true);
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
      var value = helpers.randMinMax(1, 10);
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
	var reqImpsAgg = AGGREGATE(requestedImps);
	var executedImps = EXECUTED_IMPS(requestedImps, options.errors);
	var execImpsAgg = AGGREGATE(executedImps);
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
  	},
		creative: options.creative,
	  audience: options.audience
	}
}


/***** GENERATE  *****/

// SUPER SKIN, male, pre-launch,

var SS1Pre = createPlacement({
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
	},
	creative: {
    format: 'super-skin',
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Males Festival'
  },
  audience: {
    gender: 'male',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro', 'AU Regional']
  }
});

// SUPER SKIN, females, pre-launch

var SS2Pre = createPlacement({
	name: '146560595_Airwave_GoPro_Target_FemalesMetro18-44_PreLaunch',
	bookedImps: 500000,
	dates: {
		start: new Date(2017, 4, 1),
		end: new Date(2017, 5, 16)
	},
	errors: {
		// execImps:{
		// 	start: new Date(2017, 4, 10),
		// 	end: new Date(2017, 4, 30)
		// }
	},
	creative: {
    format: 'super-skin',
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Females Travel'
  },
  audience: {
    gender: 'female',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro', 'AU Regional']
  }
});

// SIDE-PUSH, males, pre-launch

var SP1Pre = createPlacement({
	name: '146560596_Airwave_GoPro_Target_MalesMetro18-44_Pre',
	bookedImps: 500000,
	dates: {
		start: new Date(2017, 4, 1),
		end: new Date(2017, 5, 16)
	},
	errors: {
		// viewImps:{
		// 	start: new Date(2017, 4, 3),
		// 	end: new Date(2017, 4, 16)
		// }
	},
	creative: {
    format: 'side-push',
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Males Festival'
  },
  audience: {
    gender: 'male',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro', 'AU Regional']
  }
});

var SP2Pre = createPlacement({
	name: '146560597_Airwave_GoPro_Target_FemalesMetro18-44_Pre',
	bookedImps: 500000,
	dates: {
		start: new Date(2017, 4, 1),
		end: new Date(2017, 5, 16)
	},
	errors: {
		// viewImps:{
		// 	start: new Date(2017, 4, 3),
		// 	end: new Date(2017, 4, 16)
		// }
	},
	creative: {
    format: 'side-push',
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Females Travel'
  },
  audience: {
    gender: 'female',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro', 'AU Regional']
  }
});

// SUPER SKIN, males, post-launch

var SS1Post = createPlacement({
	name: '146560598_Airwave_GoPro_Target_MalesMetro18-44_PreLaunch',
	bookedImps: 500000,
	dates: {
		start: new Date(2017, 5, 17),
		end: new Date(2017, 6, 32)
	},
	errors: {
		// reqImps:{
		// 	start: new Date(2017, 4, 30),
		// 	end: new Date(2017, 5, 5)
		// }
	},
	creative: {
    format: 'super-skin',
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Males Festival'
  },
  audience: {
    gender: 'male',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro', 'AU Regional']
  }
});

// SUPER SKIN, females, post-launch

var SS2Post = createPlacement({
	name: '146560599_Airwave_GoPro_Target_FemalesMetro18-44_PreLaunch',
	bookedImps: 500000,
	dates: {
		start: new Date(2017, 5, 17),
		end: new Date(2017, 6, 32)
	},
	errors: {
		// execImps:{
		// 	start: new Date(2017, 4, 10),
		// 	end: new Date(2017, 4, 30)
		// }
	},
	creative: {
    format: 'super-skin',
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Females Travel'
  },
  audience: {
    gender: 'female',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro', 'AU Regional']
  }
});

// SIDE-PUSH, males, pre-launch

var SP1Post = createPlacement({
	name: '146560600_Airwave_GoPro_Target_MalesMetro18-44_Pre',
	bookedImps: 500000,
	dates: {
		start: new Date(2017, 5, 17),
		end: new Date(2017, 6, 32)
	},
	errors: {
		// viewImps:{
		// 	start: new Date(2017, 4, 3),
		// 	end: new Date(2017, 4, 16)
		// }
	},
	creative: {
    format: 'side-push',
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Males Festival'
  },
  audience: {
    gender: 'male',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro', 'AU Regional']
  }
});

var SP2Post = createPlacement({
	name: '146560601_Airwave_GoPro_Target_FemalesMetro18-44_Pre',
	bookedImps: 500000,
	dates: {
		start: new Date(2017, 5, 17),
		end: new Date(2017, 6, 32)
	},
	errors: {
		// viewImps:{
		// 	start: new Date(2017, 4, 3),
		// 	end: new Date(2017, 4, 16)
		// }
	},
	creative: {
    format: 'side-push',
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Females Travel'
  },
  audience: {
    gender: 'female',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro', 'AU Regional']
  }
});

// console.log(SS1Pre);

module.exports = {
	chartData: {
		campaign: campaign,
	  SS1Pre: SS1Pre,
	  SS2Pre: SS2Pre,
	  SP1Pre: SP1Pre,
	  SP2Pre: SP2Pre,
	  SS1Post: SS1Post,
	  SS2Post: SS2Post,
	  SP1Post: SP1Post,
	  SP2Post: SP2Post
	}
};
