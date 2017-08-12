var moment = require('moment');
var path = require('path');
var helpers = require( path.resolve( __dirname, "helpers.js" ) );


/***** CAMPAIGN  *****/

// graphing will happen from 27 June 2017

function generateCampaign(options) {
	var dateList = helpers.listDates(options.dates);
	var dur = helpers.duration(options.dates);
	return {
		name: helpers.breakText(options.name),
		brand: options.brand,
		objective: options.objective,
		vertical: options.vertical,
		dates: {
			start: options.dates.start,
			end: options.dates.end
		},
		dateList: dateList,
		duration: dur
	}
}

var campaign = generateCampaign({
	name:'Hero5 Mark II ',
	brand: "GoPro",
	vertical: "Technology",
	objective: "Awareness",
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	}
});

var currentDate = new Date(2017, 5, 28);


// BENCHMARKS

var iab = {
	benchmarks: {
		viewability: 28,
    er: 0.5,
    ativ: 3
	}
};

var superSkin = {
  benchmarks: {
    viewability: 63,
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
		values = helpers.setErrors(errors.reqImps.differences, values);
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

	// there are errors for this metric...

	if(errors.execImps){
		values = helpers.setErrors(errors.execImps.differences, values);
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

	// there are errors for this metric...

	if(errors.viewImps){
		values = helpers.setErrors(errors.viewImps.differences, values);
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

function ENGAGEMENTS(array, errors){
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

	// there are errors for this metric...

	if(errors.engagements){
		values = helpers.setErrors(errors.engagements.differences, values);
	}

  return values;
}

function PASSIVE_COMPLETIONS(array){
	var values = array.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var newValue = value/3;
	    values.splice(i, 1, newValue);
		}
  });
  return values;
}

function ENGAGED_COMPLETIONS(array){
	var values = array.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var newValue = value/5;
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
	var engagements = ENGAGEMENTS(viewableImps, options.errors);
	var passiveCompletions = PASSIVE_COMPLETIONS(engagements);
	var engagedCompletions = ENGAGED_COMPLETIONS(engagements);
	var clickEng = CLICKENG(clicks, engagements);
	var engagementRate = PERCENT(clickEng, executedImps);
	var passiveCompletionRate = PERCENT(passiveCompletions, executedImps);
	var engagedCompletionRate = PERCENT(engagedCompletions, executedImps);
	var ativ = ATIV(executedImps, superSkin.benchmarks.ativ);
	var videoViewableImps = VIDEO_VIEWABLE_IMPS(engagements);
	var video = VIDEO_METRICS(engagements);
	var name = helpers.breakText(options.name);

  return {
    name: name,
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
			passiveCompletions: passiveCompletions,
			engagedCompletions: engagedCompletions,
			passiveCompletionRate: passiveCompletionRate,
			engagedCompletionRate: engagedCompletionRate,
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

/***** ERRORS  *****/

var errorPath_execImps1_8Aug = [200, 200, 200, 200, 200, 200, 200, 200, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

var errorPath_viewb26_30July = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 139, 139, 143, 138, 137, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

var errorPath_reqImps1Jul_30Aug = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 49, 47, 35, 42, 44, 53, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 97, 92, 88, 84, 78, 64, 34, 34, 30, 30, 30, 29];

var errorPath_eng1Jul_30Aug = [133, 129, 127, 141, 125, 133, 143, 147, 130, 128, 123, 117, 123, 119, 118, 119, 119, 119, 119, 119, 119, 109, 109, 109, 109, 109, 109, 109, 109, 90, 90, 90, 90, 82, 82, 82, 82, 82, 82, 82, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60];


/***** GENERATE  *****/

// SUPER SKIN, male, pre-launch,

var SSM_same = createPlacement({
	name: '146560594_Airwave_GoPro_Target_MalesMetro18-44',
	bookedImps: 200000,
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
		},
		viewImps: {
			differences: errorPath_viewb26_30July
		},
		engagements: {
			differences: errorPath_eng1Jul_30Aug
		},
		execImps: {
			differences: errorPath_execImps1_8Aug
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
    locations: ['AU Metro']
  }
});

// SUPER SKIN, females, pre-launch

var SSM_opp = createPlacement({
	name: '146560595_Airwave_GoPro_Target_MalesMetro18-44',
	bookedImps: 50000,
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
		},
		viewImps: {
			differences: errorPath_viewb26_30July
		},
		engagements: {
			differences: errorPath_eng1Jul_30Aug
		},
		execImps: {
			differences: errorPath_execImps1_8Aug
		}
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
    locations: ['AU Metro']
  }
});

// SIDE-PUSH, males, pre-launch

var SSF_same = createPlacement({
	name: '146560596_Airwave_GoPro_Target_FemalesMetro18-44',
	bookedImps: 200000,
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
		},
		viewImps: {
			differences: errorPath_viewb26_30July
		},
		engagements: {
			differences: errorPath_eng1Jul_30Aug
		},
		execImps: {
			differences: errorPath_execImps1_8Aug
		}
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
    locations: ['AU Metro']
  }
});

var SSF_opp = createPlacement({
	name: '146560597_Airwave_GoPro_Target_FemalesMetro18-44',
	bookedImps: 50000,
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
		},
		viewImps: {
			differences: errorPath_viewb26_30July
		},
		engagements: {
			differences: errorPath_eng1Jul_30Aug
		},
		execImps: {
			differences: errorPath_execImps1_8Aug
		}
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
    locations: ['AU Metro']
  }
});

// SUPER SKIN, males, post-launch

var TTM_same = createPlacement({
	name: '146560598_Airwave_GoPro_Target_MalesMetro18-44',
	bookedImps: 200000,
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
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
    locations: ['AU Metro']
  }
});

// SUPER SKIN, females, post-launch

var TTM_opp = createPlacement({
	name: '146560599_Airwave_GoPro_Target_MalesMetro18-44',
	bookedImps: 50000,
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
		}
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
    locations: ['AU Metro']
  }
});

// SIDE-PUSH, males, pre-launch

var TTF_same = createPlacement({
	name: '146560600_Airwave_GoPro_Target_FemalesMetro18-44',
	bookedImps: 200000,
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
		}
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
    locations: ['AU Metro']
  }
});

var TTF_opp = createPlacement({
	name: '146560601_Airwave_GoPro_Target_FemalesMetro18-44',
	bookedImps: 50000,
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
		}
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
    locations: ['AU Metro']
  }
});

// console.log(SS1Pre);

module.exports = {
	chartData: {
		superSkin: superSkin,
		iab: iab,
		campaign: campaign,
	  SSM_same: SSM_same,
	  SSM_opp: SSM_opp,
	  SSF_same: SSF_same,
	  SSF_opp: SSF_opp,
	  TTM_same: TTM_same,
	  TTM_opp: TTM_opp,
	  TTF_same: TTF_same,
	  TTF_opp: TTF_opp
	}
};
