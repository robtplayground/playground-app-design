var moment = require('moment');
var path = require('path');
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
	extend
} = require( "./helpers.js" );

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
  var values = makeZeros(campaign.duration);
	// work out where placement data sits in campaign metrics
	var pDuration = duration(placementDates);
	var pRange = arrayRange(placementDates, campaign);

	function setMetric(){
		// create random reqImps value
		var min = expectedImps * 0.90;
		var max = expectedImps * 1.5;
		return randMinMax(min, max, true);
	}

	// overwrite zeroes with impressions
  for(var i = pRange.startPos; i < pRange.endPos; i++){
		values.splice(i, 1, setMetric());
  }

	// there are errors for this metric...

	if(errors.reqImps){
		values = setErrors(errors.reqImps.differences, values);
	}
  return values;
}

function EXECUTED_IMPS(reqImpsArray, errors, expectedImps){
	// create zeros
  var values = reqImpsArray.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var difference = randMinMax(expectedImps*0.1, expectedImps*0.3, true);
	    values.splice(i, 1, value - difference);
		}
  });

	// there are errors for this metric...

	if(errors.execImps){
		values = setErrors(errors.execImps.differences, values);
	}
  return values;
}

function VIEWABLE_IMPS(execImpsArray, errors, expectedImps){
	// create zeros
  var values = execImpsArray.slice();
	values.forEach(function(value, i){
		if(value != 0){
			var difference = randMinMax(expectedImps*0.1, expectedImps*0.2, true);
	    values.splice(i, 1, value - difference);
		}
  });

	// there are errors for this metric...

	if(errors.viewImps){
		values = setErrors(errors.viewImps.differences, values);
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
			var newValue = Math.round(value * randMinMax(min, max));
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
			var newValue = Math.round(value * randMinMax(min, max));
	    values.splice(i, 1, newValue);
		}
  });

	// there are errors for this metric...

	if(errors.engagements){
		values = setErrors(errors.engagements.differences, values);
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
			var newValue = Number((ativBenchmark + randMinMax(-1, 4)).toFixed(2));
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
			var newValue = value + randMinMax(-1, -3, true);
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
      var value = randMinMax(1, 10);
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

/***** CAMPAIGN  *****/

function makeCampaign(options) {
	var dateList = listDates(options.dates);
	var dur = duration(options.dates);
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
		duration: dur,
		creatives: []
	}
}

cp_gopro = makeCampaign({
	name:'Hero5 Mark II ',
	brand: "GoPro",
	vertical: "Technology",
	objective: "Awareness",
	dates: {
		start: new Date(2017, 6, 1),
		end: new Date(2017, 7, 31)
	},
});

cp_mcdonalds = makeCampaign({
	name:'Chicken Tenders',
	brand: "McDonalds",
	vertical: "Food and Beverage",
	objective: "Direct Response",
	dates: {
		start: new Date(2017, 9, 1),
		end: new Date(2017, 10, 31)
	},
});

cp_woolworths = makeCampaign({
	name:'Spring Specials',
	brand: "Woolworths",
	vertical: "FMCG",
	objective: "Awareness",
	dates: {
		start: new Date(2017, 10, 1),
		end: new Date(2017, 11, 31)
	},
});



function makeCreative(campaign, options){
	campaign.creatives[options.id] = {
		name: options.desc,
		content: options.content,
		thumb: options.thumb,
		author: options.author,
		status: options.status,
		modified: options.modified,
		format: options.format,
		features: options.features,
		placements: {}
	};
}


const makePlacement = function(campaign, creative, options){
	// name is string, dates = dates object, errors = errorsObject{}
	var dur = duration(options.dates);
	var expectedImps = options.bookedImps / dur;
	var requestedImps = REQUESTED_IMPS(options.dates, options.errors, expectedImps, campaign);
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
	var ativ = ATIV(executedImps, campaign.creatives[creative].format.bm.ativ);
	var videoViewableImps = VIDEO_VIEWABLE_IMPS(engagements);
	var video = VIDEO_METRICS(engagements);
	var name = options.name;

  campaign.creatives[creative].placements[options.id] = {
    name: name,
    dates: options.dates,
		bookedImps: options.bookedImps,
		audience: options.audience,
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
  	}
	};
}



/***** ERRORS  *****/

var errorPath_execImps1_8Aug = [200, 200, 200, 200, 200, 200, 200, 200, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

var errorPath_viewb26_30July = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 139, 139, 143, 138, 137, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

var errorPath_reqImps1Jul_30Aug = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 49, 47, 35, 42, 44, 53, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 97, 92, 88, 84, 78, 64, 34, 34, 30, 30, 30, 29];

var errorPath_eng1Jul_30Aug = [133, 129, 127, 141, 125, 133, 143, 147, 130, 128, 123, 117, 123, 119, 118, 119, 119, 119, 119, 119, 119, 109, 109, 109, 109, 109, 109, 109, 109, 90, 90, 90, 90, 82, 82, 82, 82, 82, 82, 82, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60];


makeCreative(cp_gopro, {
		id: 'SS_Males',
		name: 'GoPro Hero5 Males Festival SS',
		content: 'GoPro Hero5 Males Festival',
		thumb: 'thumb-gopro-males.png',
		author: 'Steve Nash',
		status: 'locked',
		modified: new Date(2017, 7, 1),
		format: superSkin,
    features: ['expand-frame', 'video'],
});

makePlacement(cp_gopro, 'SS_Males', {
	id: 'SSM_same',
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

makePlacement(cp_gopro, 'SS_Males', {
	id: 'SSM_opp',
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

makeCreative(cp_gopro, {
		id: 'SS_Females',
		name: 'GoPro Hero5 Females Travel SS',
		content: 'GoPro Hero5 Females Travel',
		thumb: 'thumb-gopro-females.png',
		author: 'Vinko Kraljevic',
		status: 'locked',
		modified: new Date(2017, 7, 8),
		format: superSkin,
    features: ['expand-frame', 'video'],
});

makePlacement(cp_gopro, 'SS_Females',{
	id: 'SSF_same',
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

makePlacement(cp_gopro, 'SS_Females',{
	id: 'SSF_opp',
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

makeCreative(cp_gopro, {
		id: 'TT_Males',
		name: 'GoPro Hero5 Males Festival TT',
		content: 'GoPro Hero5 Males Festival',
		thumb: 'thumb-gopro-males.png',
		author: 'Rob Thwaites',
		status: 'locked',
		modified: new Date(2017, 7, 10),
		format: topTail,
    features: ['expand-frame', 'video']
});

makePlacement(cp_gopro, 'TT_Males',{
	 id: 'TTM_same',
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

makePlacement(cp_gopro, 'TT_Males', {
	 id: 'TTM_opp',
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

makeCreative(cp_gopro, {
		id: 'TT_Females',
		name: 'GoPro Hero5 Females Travel TT',
		content: 'GoPro Hero5 Females Travel',
		thumb: 'thumb-gopro-females.png',
		author: 'Rob Thwaites',
		status: 'locked',
		modified: new Date(2017, 7, 9),
		format: topTail,
    features: ['expand-frame', 'video']
});

makePlacement(cp_gopro, 'TT_Females',{
	 id: 'TTF_same',
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

makePlacement(cp_gopro, 'TT_Females', {
	id: 'TTF_opp',
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

makeCreative(cp_mcdonalds, {
		id: 'HT_Tenders',
		name: 'HT Chicken Tenders Anim HT',
		content: 'HT Chicken Tenders Anim',
		thumb: 'thumb-maccers.png',
		author: 'Steve Nash',
		status: 'pending',
		modified: new Date(2017, 7, 1),
		format: hangTime,
    features: ['video'],
});


makePlacement(cp_mcdonalds, 'HT_Tenders', {
	id: 'HT_mac_1',
	name: '5124365_McD_Tenders_Nov',
	bookedImps: 50000,
	dates: {
		start: new Date(2017, 9, 1),
		end: new Date(2017, 10, 31)
	},
	errors: {},
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

makeCreative(cp_woolworths, {
		id: 'SP_Snacks',
		name: 'Woolies Snackfood Combos SP',
		thumb: 'thumb-woolies.png',
		author: 'Steve Nash',
		status: 'pending',
		modified: new Date(2017, 7, 1),
		format: sidePush,
    features: ['expand-frame', 'image'],
    content: 'Woolies Snackfood Combos'
});

makePlacement(cp_woolworths, 'SP_Snacks', {
	id: 'SP_Snacks1',
	name: '654871_Woolies_Spring_Catalogue',
	bookedImps: 50000,
	dates: {
		start: new Date(2017, 9, 1),
		end: new Date(2017, 10, 31)
	},
	errors: {},
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

makePlacement(cp_woolworths, 'SP_Snacks', {
	id: 'SP_Snacks2',
	name: '654872_Woolies_Spring_Catalogue',
	bookedImps: 50000,
	dates: {
		start: new Date(2017, 10, 1),
		end: new Date(2017, 11, 31)
	},
	errors: {},
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

makeCreative(cp_woolworths, {
		id: 'SW_Lamb_1',
		name: 'Woolies Leg Lamb Special SP',
		thumb: 'thumb-woolies.png',
		author: 'Vinko Kraljevic',
		status: 'edit',
		modified: new Date(2017, 7, 1),
		format: sidePush,
    features: ['expand-frame', 'image'],
    content: 'Woolies Leg Lamb Special'
});


makePlacement(cp_woolworths, 'SW_Lamb_1', {
	id: 'Lamb1',
	name: '654873_Woolies_Spring_Catalogue',
	bookedImps: 50000,
	color: "#ffc200",
	dates: {
		start: new Date(2017, 10, 1),
		end: new Date(2017, 11, 31)
	},
	errors: {},
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

let allCp = {
	cp_gopro,
	cp_mcdonalds,
	cp_woolworths
};

console.log(allCp.cp_gopro.creatives.SS_Males.placements);

// let goProPl = {};
//
// Object.keys(allCp.cp_gopro.creatives).forEach(function(cr){
// 	goProPl = extend(goProPl, allCp.cp_gopro.creatives[cr]);
// });
//
// console.log('GO PRO PLACEMENTS', goProPl);

module.exports = {
	fm: {
		superSkin: superSkin,
		topTail: topTail,
		hangTime: hangTime,
		sidePush: sidePush,
		subWay: subWay,
		iab: iab
	},
	allCp: allCp
};
