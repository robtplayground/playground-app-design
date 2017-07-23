Math.randMinMax = function(min, max, round) {
	var val = min + (Math.random() * (max - min));
	if( round ) val = Math.round( val );
	return val;
};

// var chartData = {};

// graphing will happen from 27 June 2017

var currentDate = new Date(2017, 5, 28);

// benchmarks

var superSkin = {
  benchmarks: {
    viewability: 91,
    er: 0.92,
    ativ: 9.2
  }
};

var campaign = {};
var today = new Date (2017,8,1)
// campaign starts 1 May, ends 31 July ??
campaign.dates = {start: new Date(2017, 4, 1), end: new Date(2017, 6, 32)};
campaign.progress = function(currentDate){
  // currentDate is a new javascript date eg ;
  if(!(currentDate instanceof Date)){
    console.log("Needs a javascript Date to get campaign.progress");
    return;
  }
  return Math.round((1*(campaign.currentDate - campaign.dates.start)) / (1*(campaign.dates.end - campaign.dates.start)) * 100)
};




var placement = {};
placement.name = '146560594_Airwave_GoPro_Target_MalesMetro18-44_PreLaunch';
// placement starts 1 May, ends 15 June
placement.dates = {start: new Date(2017, 4, 1), end: new Date(2017, 5, 16)};
placement.duration = function(){return moment(this.dates.end).diff(moment(this.dates.start), 'days')};
placement.booked = 500000;
// errors present for reqImps;
placement.reqImpsErrorDates = {start: new Date(2017,4,30), end:new Date(2017,5,5)};
placement.execImpsErrorDates = {start: new Date(2017,4,5), end:new Date(2017,4,15)};
placement.viewImpsErrorDates = {start: new Date(2017,4,5), end:new Date(2017,4,15)};
placement.positionErrors = function(errorDates){
  if(typeof errorDate != 'undefined' && !(errorDates.start instanceof Date)){
    console.log('start value must be a javascript Date');
    return;
  }
  if(typeof errorDate != 'undefined' && !(errorDates.end instanceof Date)){
    console.log('end value must be a javascript Date');
    return;
  }
  var startPos = moment(errorDates.start).diff(moment(this.dates.start), 'days');
  var endPos = moment(errorDates.end).diff(moment(this.dates.start), 'days');
  console.log(endPos, startPos);
  return {start: startPos, end: endPos};
};
placement.GEN_DATES = function(){
  // console.log(this.dates.start);
  var datesArray = [];
  for(var i=0; i < this.duration(); i++){
    var thisStart = this.dates.start;
    // console.log(thisStart);
    var value = moment(thisStart).add(i, 'days').format('D/M/Y');
    // console.log(value);
    datesArray.push(value);
  }
  return datesArray;
};
placement.GEN_REQUESTED_IMPS = function(){
  var reqImps = [];
  var impsPortion = Math.round(this.booked / this.duration());
  var errorDates = this.reqImpsErrorDates;
  for(var i = 0; i < this.duration(); i++){
    var impsThisDate = Math.randMinMax((impsPortion - 500), (impsPortion + 150), true);
    reqImps.push(impsThisDate);
  }
  // requestedImps error - delivery under half on errorDates - needs better traffiking / adserver tag problem
  if(typeof errorDates != "undefined"){
    var errorPos = this.positionErrors(errorDates);
    console.log('errorPos', errorPos);
    for(var i = errorPos.start; i < errorPos.end; i++){
      var newValue = Math.round(impsPortion / 2) - Math.randMinMax(500, 100, true);
      reqImps.splice(i, 1, newValue);
    }
  }
  return reqImps;
};
placement.GEN_EXECUTED_IMPS = function(){
  var reqImps = this.GEN_REQUESTED_IMPS();
  var execImps = [];
  var errorDates = this.execImpsErrorDates;
  reqImps.forEach(function(value){
    var difference = Math.randMinMax(100, 1000, true);
    execImps.push(value - difference);
  });
  // execImps error - ad only executing a third of the time - publisher onboarding issue
  if(typeof errorDates != "undefined"){
    var errorPos = this.positionErrors(errorDates);
    // console.log('errorPos', errorPos);
    for(var i = errorPos.start; i < errorPos.end; i++){
      var newValue = Math.round(execImps[i]/3);
      execImps.splice(i, 1, newValue);
    }
  }
  return execImps;
};
placement.GEN_VIEWABLE_IMPS = function(){
  var execImps = this.GEN_EXECUTED_IMPS();
  var viewImps = [];
  var errorDates = this.viewImpsErrorDates;
  execImps.forEach(function(value){
    var difference = Math.randMinMax(100, 1000, true);
    viewImps.push(value - difference);
  });
  // viewImps error - ad not becoming viewable - creative error?
  if(typeof errorDates != "undefined"){
    var errorPos = this.positionErrors(errorDates);
    // console.log('errorPos', errorPos);
    for(var i = errorPos.start; i < errorPos.end; i++){
      var newValue = Math.randMinMax(100, 60, true);
      execImps.splice(i, 1, newValue);
    }
  }
  return viewImps;
};
placement.GEN_VIEWABILITY = function(){
  var viewability = [];
  var viewImps = this.GEN_VIEWABLE_IMPS();
  var execImps = this.GEN_EXECUTED_IMPS();
  viewImps.forEach(function(value, index){
    var newValue = Number(((value / execImps[index]) * 100).toFixed(2));
    viewability.push(newValue);
  });
  return viewability;
};
placement.GEN_CLICKS = function(){
  var clicks = [];
  var viewImps = this.GEN_VIEWABLE_IMPS();
  viewImps.forEach(function(value, index){
    var difference = Math.randMinMax(36/10000, 24/10000, false);
    clicks.push(Math.round(value * difference));
  });
  return clicks;
};
placement.GEN_CTR = function(){
  var ctr = [];
  var clicks = this.GEN_CLICKS();
  var execImps = this.GEN_EXECUTED_IMPS();
  clicks.forEach(function(value, index){
    var newValue = Number(((value / execImps[index]) * 100).toFixed(2));
    ctr.push(newValue);
  });
  return ctr;
};
placement.GEN_ENGAGEMENTS = function(){
  var engagements = [];
  var viewImps = this.GEN_VIEWABLE_IMPS();
  var clicks = this.GEN_CLICKS();
  viewImps.forEach(function(value, index){
    var difference = Math.randMinMax(84/10000, 63/10000, false);
    engagements.push((Math.round(value * difference)));
  });
  return engagements;
};
placement.GEN_ENGAGEMENT_RATE = function(){
  var er = [];
  var clicks = this.GEN_CLICKS();
  var execImps = this.GEN_EXECUTED_IMPS();
  var engagements = this.GEN_ENGAGEMENTS();
  engagements.forEach(function(value, index){
    var newValue = Number((((value + clicks[index]) / execImps[index]) * 100).toFixed(2));
    er.push(newValue);
  });
  return er;
};
placement.GEN_ATIV = function(){
  var ativ = [];
  // var errorDates = this.ativErrorDates;
  for(var i = 0; i < this.duration(); i++){
    var newValue = Number((superSkin.benchmarks.ativ + Math.randMinMax(-1, 4)).toFixed(2));
  }
  return ativ;
};
placement.GEN_VIDEO_VIEWABLE_IMPS = function(){
  var vidViewables = [];
  var engagements = this.GEN_ENGAGEMENTS();
  // var errorDates = this.ativErrorDates;
  engagements.forEach(function(value, index){
    var newValue = value + Math.randMinMax(-1, -3, true);
    vidViewables.push(newValue);
  });
  return vidViewables;
};
placement.GEN_VIDEO_METRICS = function(){
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

  for(var i=0; i < this.duration(); i++){
    var values = splitPercent();
    video.vid0.push(values[0]);
    video.vid25.push(values[1]);
    video.vid50.push(values[2]);
    video.vid75.push(values[3]);
    video.vid100.push(values[4]);
  }

  // generate videoMetrics

  return video;
};
placement.data = function(){
  var data = {
    dates: this.GEN_DATES(),
    requestedImps: this.GEN_REQUESTED_IMPS(),
    executedImps: this.GEN_EXECUTED_IMPS(),
    viewableImps: this.GEN_VIEWABLE_IMPS(),
    viewability: this.GEN_VIEWABILITY(),
    clicks: this.GEN_CLICKS(),
    ctr: this.GEN_CTR(),
    engagements: this.GEN_ENGAGEMENTS(),
    engagementRate: this.GEN_ENGAGEMENT_RATE(),
    avgTIV: this.GEN_ATIV(),
    vidViewables: this.GEN_VIDEO_VIEWABLE_IMPS(),
    video: this.GEN_VIDEO_METRICS()
  };
  return data;
};

console.log(placement.data());
