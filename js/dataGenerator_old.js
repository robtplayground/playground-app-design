var moment = require('moment');
var path = require('path');
var helpers = require( path.resolve( __dirname, "helpers.js" ) );


/***** CAMPAIGN  *****/

function generateCampaign(options) {
	var dateList = helpers.listDates(options.dates);
	var dur = helpers.duration(options.dates);
	return {
		name: options.name,
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

cp_gopro = generateCampaign({
	name:'Hero5 Mark II ',
	brand: "GoPro",
	vertical: "Technology",
	objective: "Awareness",
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	}
});

cp_mcdonalds = generateCampaign({
	name:'Chicken Tenders',
	brand: "McDonalds",
	vertical: "Food and Beverage",
	objective: "Direct Response",
	dates: {
		start: new Date(2017, 9, 1),
		end: new Date(2017, 10, 31)
	}
});

cp_woolworths = generateCampaign({
	name:'Spring Specials',
	brand: "Woolworths",
	vertical: "FMCG",
	objective: "Awareness",
	dates: {
		start: new Date(2017, 10, 1),
		end: new Date(2017, 11, 31)
	}
});

campaigns = [cp_gopro, cp_mcdonalds, cp_woolworths];

// BENCHMARKS

iab = {
	name: 'iab',
	bm: {
		viewability: 28,
    engagementRate: 0.5,
    ativ: 3,
		engagedCompletionRate: 4.1
	}
};

superSkin = {
	name: 'super-skin',
	color: "#0078d8",
  bm: {
    viewability: 63,
    engagementRate: 0.92,
    ativ: 9.2,
		engagedCompletionRate: 15.1
  }
};

topTail = {
	name: 'top-and-tail',
	color: "#5d3289",
  bm: {
    viewability: 82,
    engagementRate: 0.55,
    ativ: 14,
		engagedCompletionRate: 14.1
  }
};

hangTime = {
	name: 'hang-time',
	color: "#fd7732",
  bm: {
    viewability: 61,
    engagementRate: 3,
    ativ: 3.65,
		engagedCompletionRate: 14.1
  }
};

sidePush= {
	name: 'side-push',
	color: "#005558",
  bm: {
    viewability: 87,
    engagementRate: 0.9,
    ativ: 7,
		engagedCompletionRate: 14.1
  }
};

subWay = {
	name: 'subway',
	color: "#ffc200",
  bm: {
    viewability: 90,
    engagementRate: 1,
    ativ: 20,
		engagedCompletionRate: 14.1
  }
};

/***** METRICS  *****/

function REQUESTED_IMPS(placementDates, errors, expectedImps, campaign){
	// create zeros
  var values = helpers.makeZeros(campaign.duration);
	// work out where placement data sits in campaign metrics
	var pDuration = helpers.duration(placementDates);
	var pRange = helpers.arrayRange(placementDates, campaign);

	function setMetric(){
		// create random reqImps value
		var min = expectedImps * 0.90;
		var max = expectedImps * 1.5;
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

function EXECUTED_IMPS(reqImpsArray, errors, expectedImps){
	// create zeros
  var values = reqImpsArray.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var difference = helpers.randMinMax(expectedImps*0.1, expectedImps*0.3, true);
	    values.splice(i, 1, value - difference);
		}
  });

	// there are errors for this metric...

	if(errors.execImps){
		values = helpers.setErrors(errors.execImps.differences, values);
	}
  return values;
}

function VIEWABLE_IMPS(execImpsArray, errors, expectedImps){
	// create zeros
  var values = execImpsArray.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var difference = helpers.randMinMax(expectedImps*0.1, expectedImps*0.2, true);
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
			var newValue = value/2;
	    values.splice(i, 1, newValue);
		}
  });
  return values;
}

function ENGAGED_COMPLETIONS(array){
	var values = array.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var newValue = value/3;
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
	var duration = helpers.duration(options.dates);
	var expectedImps = options.bookedImps / duration;
	var requestedImps = REQUESTED_IMPS(options.dates, options.errors, expectedImps, options.campaign);
	var reqImpsAgg = AGGREGATE(requestedImps);
	var executedImps = EXECUTED_IMPS(requestedImps, options.errors, expectedImps);
	var execImpsAgg = AGGREGATE(executedImps);
	var viewableImps = VIEWABLE_IMPS(executedImps, options.errors, expectedImps);
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
	var ativ = ATIV(executedImps, options.creative.format.bm.ativ);
	var videoViewableImps = VIDEO_VIEWABLE_IMPS(engagements);
	var video = VIDEO_METRICS(engagements);
	var name = options.name;

  return {
    name: name,
    dates: options.dates,
		bookedImps: options.bookedImps,
		color: options.color,
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
	  audience: options.audience,
		campaign: options.campaign
	}
}

/***** ERRORS  *****/

var errorPath_execImps1_8Aug = [200, 200, 200, 200, 200, 200, 200, 200, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

var errorPath_viewb26_30July = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 139, 139, 143, 138, 137, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

var errorPath_reqImps1Jul_30Aug = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 49, 47, 35, 42, 44, 53, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 97, 92, 88, 84, 78, 64, 34, 34, 30, 30, 30, 29];

var errorPath_eng1Jul_30Aug = [133, 129, 127, 141, 125, 133, 143, 147, 130, 128, 123, 117, 123, 119, 118, 119, 119, 119, 119, 119, 119, 109, 109, 109, 109, 109, 109, 109, 109, 90, 90, 90, 90, 82, 82, 82, 82, 82, 82, 82, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60];


/***** GENERATE  *****/

// SUPER SKIN, male, pre-launch,

SSM_same = createPlacement({
	name: '146560594_Airwave_GoPro_Target_MalesMetro18-44',
	bookedImps: 200000,
	color: "#0078d8",
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
	campaign: cp_gopro,
	creative: {
		thumb: 'thumb-gopro-males.png',
		author: 'Steve Nash',
		status: 'locked',
		modified: new Date(2017, 7, 1),
		format: superSkin,
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Males Festival',
    name: 'GoPro Hero5 Males Festival SS'
  },
  audience: {
		shortName: 'Male AU Metro Tech',
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

SSM_opp = createPlacement({
	name: '146560595_Airwave_GoPro_Target_MalesMetro18-44',
	bookedImps: 50000,
	color: "#0078d8",
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
	campaign: cp_gopro,
	creative: {
		thumb: 'thumb-gopro-males.png',
		author: 'Steve Nash',
		status: 'locked',
		modified: new Date(2017, 7, 1),
		format: superSkin,
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Females Travel',
    name: 'GoPro Hero5 Males Festival SS'
  },
  audience: {
		shortName: 'Female AU Metro Lifestyle',
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

SSF_same = createPlacement({
	name: '146560596_Airwave_GoPro_Target_FemalesMetro18-44',
	bookedImps: 200000,
	color: "#0078d8",
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
	campaign: cp_gopro,
	creative: {
		thumb: 'thumb-gopro-females.png',
		author: 'Vinko Kraljevic',
		status: 'locked',
		modified: new Date(2017, 7, 7),
		format: superSkin,
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Females Travel',
    name: 'GoPro Hero5 Females Travel SS'
  },
  audience: {
		shortName: 'Male AU Metro Tech',
    gender: 'male',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro']
  }
});

SSF_opp = createPlacement({
	name: '146560597_Airwave_GoPro_Target_FemalesMetro18-44',
	bookedImps: 50000,
	color: "#0078d8",
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
	campaign: cp_gopro,
	creative: {
		thumb: 'thumb-gopro-females.png',
		author: 'Vinko Kraljevic',
		status: 'locked',
		modified: new Date(2017, 7, 8),
		format: superSkin,
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Females Travel',
    name: 'GoPro Hero5 Females Travel SS'
  },
  audience: {
		shortName: 'Female AU Metro Travel',
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

TTM_same = createPlacement({
	name: '146560598_Airwave_GoPro_Target_MalesMetro18-44',
	bookedImps: 200000,
	color: "#5d3289",
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
		}
	},
	campaign: cp_gopro,
	creative: {
		thumb: 'thumb-gopro-males.png',
		author: 'Rob Thwaites',
		status: 'locked',
		modified: new Date(2017, 7, 10),
		format: topTail,
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Males Festival',
    name: 'GoPro Hero5 Males Festival TT'
  },
  audience: {
		shortName: 'Male AU Metro Tech',
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

TTM_opp = createPlacement({
	name: '146560599_Airwave_GoPro_Target_MalesMetro18-44',
	bookedImps: 50000,
	color: "#5d3289",
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
		}
	},
	campaign: cp_gopro,
	creative: {
		thumb: 'thumb-gopro-males.png',
		author: 'Rob Thwaites',
		status: 'locked',
		modified: new Date(2017, 7, 10),
		format: topTail,
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Females Travel',
    name: 'GoPro Hero5 Males Festival TT'
  },
  audience: {
		shortName: 'Female AU Metro Travel',
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

TTF_same = createPlacement({
	name: '146560600_Airwave_GoPro_Target_FemalesMetro18-44',
	bookedImps: 200000,
	color: "#5d3289",
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
		}
	},
	campaign: cp_gopro,
	creative: {
		thumb: 'thumb-gopro-females.png',
		author: 'Rob Thwaites',
		status: 'locked',
		modified: new Date(2017, 7, 10),
		format: topTail,
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Males Festival',
    name: 'GoPro Hero5 Females Travel'
  },
  audience: {
		shortName: 'Male AU Metro Tech',
    gender: 'male',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro']
  }
});

TTF_opp = createPlacement({
	name: '146560601_Airwave_GoPro_Target_FemalesMetro18-44',
	bookedImps: 50000,
	color: "#5d3289",
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
	errors: {
		reqImps: {
			differences: errorPath_reqImps1Jul_30Aug
		}
	},
	campaign: cp_gopro,
	creative: {
		thumb: 'thumb-gopro-females.png',
		author: 'Rob Thwaites',
		status: 'locked',
		modified: new Date(2017, 7, 10),
		format: topTail,
    features: ['expand-frame', 'video'],
    content: 'GoPro Hero5 Females Travel',
    name: 'GoPro Hero5 Females Travel'
  },
  audience: {
		shortName: 'Female AU Metro Lifestyle',
    gender: 'female',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Tech', 'Lifestyle', 'News' ],
    locations: ['AU Metro']
  }
});

HT_mac_1 = createPlacement({
	name: '5124365_McD_Tenders_Nov',
	bookedImps: 50000,
	color: "#fd7732",
	dates: {
		start: new Date(2017, 9, 1),
		end: new Date(2017, 10, 31)
	},
	errors: {},
	campaign: cp_mcdonalds,
	creative: {
		thumb: 'thumb-maccers.png',
		author: 'Steve Nash',
		status: 'pending',
		modified: new Date(2017, 7, 1),
		format: hangTime,
    features: [],
    content: 'HT Chicken Tenders Anim',
    name: 'HT Chicken Tenders Anim HT'
  },
  audience: {
		shortName: 'Young Families',
    gender: 'both',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Food', 'Lifestyle', 'News' ],
    locations: ['AU Metro']
  }
});

SP_woolworths_1 = createPlacement({
	name: '654871_Woolies_Spring_Catalogue',
	bookedImps: 50000,
	color: "#fd7732",
	dates: {
		start: new Date(2017, 9, 1),
		end: new Date(2017, 10, 31)
	},
	errors: {},
	campaign: cp_woolworths,
	creative: {
		thumb: 'thumb-woolies.png',
		author: 'Steve Nash',
		status: 'pending',
		modified: new Date(2017, 7, 1),
		format: sidePush,
    features: ['expand-frame', 'image'],
    content: 'Woolies Snackfood Combos',
    name: 'Woolies Snackfood Combos SP'
  },
  audience: {
		shortName: 'Entertainers Fem 25-39',
    gender: 'both',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Food', 'Lifestyle', 'News' ],
    locations: ['AU Metro']
  }
});

SP_woolworths_2 = createPlacement({
	name: '654872_Woolies_Spring_Catalogue',
	bookedImps: 50000,
	color: "#005558",
	dates: {
		start: new Date(2017, 10, 1),
		end: new Date(2017, 11, 31)
	},
	errors: {},
	campaign: cp_woolworths,
	creative: {
		thumb: 'thumb-woolies.png',
		author: 'Vinko Kraljevic',
		status: 'edit',
		modified: new Date(2017, 7, 1),
		format: sidePush,
    features: ['expand-frame', 'image'],
    content: 'Woolies Leg Lamb Special',
    name: 'Woolies Leg Lamb Special SP'
  },
  audience: {
		shortName: 'Entertainers Fem 25-39',
    gender: 'both',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Food', 'Lifestyle', 'News' ],
    locations: ['AU Metro']
  }
});

SW_woolworths_1 = createPlacement({
	name: '654872_Woolies_Spring_Catalogue',
	bookedImps: 50000,
	color: "#ffc200",
	dates: {
		start: new Date(2017, 10, 1),
		end: new Date(2017, 11, 31)
	},
	errors: {},
	campaign: cp_woolworths,
	creative: {
		thumb: 'thumb-woolies.png',
		author: 'Vinko Kraljevic',
		status: 'edit',
		modified: new Date(2017, 7, 1),
		format: subWay,
    features: ['expand-frame', 'image'],
    content: 'Woolies Leg Lamb Special',
    name: 'Woolies Leg Lamb Special SW'
  },
  audience: {
		shortName: 'Entertainers Fem 25-39',
    gender: 'both',
    age: {
      from: 18,
      to: 44
    },
    interests: ['Entertainment', 'Food', 'Lifestyle', 'News' ],
    locations: ['AU Metro']
  }
});

allPl = [
	SSM_same,
	SSM_opp,
	SSF_same,
	SSF_opp,
	TTM_same,
	TTM_opp,
	TTF_same,
	TTF_opp,
	HT_mac_1,
	SP_woolworths_1,
	SP_woolworths_2,
	SW_woolworths_1
];

function prepCampaigns(placements){
	var cpNames = [];
	var cps = [];
	placements.forEach(function(pl) {
    if (!cpNames.includes(pl.campaign.name)) {
      cpNames.push(pl.campaign.name);
    }
  });
	cpNames.forEach(function(thisName) {
    var obj = {};
    obj.name = thisName;
    // clones placements before filtering
    obj.placements = placements.slice();
    obj.placements = obj.placements.filter(function(pl) {
      // console.log(pl);
      return pl.campaign.name === thisName;
    }); // returns an array of objects
		obj.brand = obj.placements[0].campaign.brand;
		obj.vertical = obj.placements[0].campaign.vertical;
		obj.objective = obj.placements[0].campaign.objective;
		obj.dates = obj.placements[0].campaign.dates
    obj.placements.forEach(function(pl) {
      delete campaign;
    });
    cps.push(obj);
  });
  return cps;
}

allCp = prepCampaigns(allPl);

console.log(allCp[0].placements[0].creative);

function prepCreatives(campaign) {
  var cName= [];
  var crs = [];
	// console.log(campaigns.placement[0]);
  campaign.placements.forEach(function(pl) {
    if (!cName.includes(pl.creative.name)) {
      cName.push(pl.creative.name);
    }
  });
	// console.log('C CONTENT', cName);
  cName.forEach(function(thisName) {
    var obj = {};
    obj.name = thisName;
    // clones placements before filtering
    obj.placements = campaign.placements.slice();
    obj.placements = obj.placements.filter(function(pl) {
      // console.log(pl);
      return pl.creative.name === thisName;
    }); // returns an array of objects
		// console.log('PLACEMENTS BY CAMPAIGN', obj.placements);
    obj.thumb = obj.placements[0].creative.thumb;
    obj.author = obj.placements[0].creative.author;
    obj.status = obj.placements[0].creative.status;
    obj.modified = obj.placements[0].creative.modified;
    obj.format = obj.placements[0].creative.format;
		obj.content = obj.placements[0].creative.content;
    obj.features = obj.placements[0].creative.features;
    // obj.id = obj.placements[0].creative.id;
    obj.placements.forEach(function(pl) {
      delete creative;
    });
    crs.push(obj);
		// console.log('CREATIVES', crs);
  });
	delete campaign.placements;
  campaign.creatives = crs;
}

allCp.forEach(function(campaign){
	prepCreatives(campaign);
});

// console.log('ALL CP', allCp[0].creatives);


// console.log(SS1Pre);

module.exports = {
	fm: {
		superSkin: superSkin,
		topTail: topTail,
		hangTime: hangTime,
		sidePush: sidePush,
		subWay: subWay,
		iab: iab
	},
	cp: cp_gopro,
	allCp: allCp,
	pl:{
	  SSM_same: SSM_same,
	  SSM_opp: SSM_opp,
	  SSF_same: SSF_same,
	  SSF_opp: SSF_opp,
	  TTM_same: TTM_same,
	  TTM_opp: TTM_opp,
	  TTF_same: TTF_same,
	  TTF_opp: TTF_opp
	},
	allPl:{
	  SSM_same: SSM_same,
	  SSM_opp: SSM_opp,
	  SSF_same: SSF_same,
	  SSF_opp: SSF_opp,
	  TTM_same: TTM_same,
	  TTM_opp: TTM_opp,
	  TTF_same: TTF_same,
	  TTF_opp: TTF_opp,
		HT_mac_1: HT_mac_1,
		SP_woolworths_1: SP_woolworths_1,
		SP_woolworths_2: SP_woolworths_2,
		SW_woolworths_1: SW_woolworths_1
	},
	helpers: helpers
};
