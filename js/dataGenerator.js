Math.randMinMax = function(min, max, round) {
	var val = min + (Math.random() * (max - min));
	if( round ) val = Math.round( val );
	return val;
};

// var chartData = {};

var campaign = {};
var today = new Date (2017,8,1)

campaign.dates = {start: new Date(2017, 5, 1), end: new Date(2017, 7, 31)};
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
placement.dates = {start: new Date(2017, 5, 1), end: new Date(2017, 7, 15)};
placement.duration = function(){return moment(this.dates.end).diff(moment(this.dates.start), 'days')};
placement.booked = 500000;
// errors present for reqImps;
placement.reqImpsErrorDates = {start: new Date(2017,5,30), end:new Date(2017,6,30)};
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
  return {start: startPos, end: endPos};
};
placement.GEN_REQUESTED_IMPS = function(){
  var reqImps = [];
  var impsPortion = Math.round(this.booked / this.duration());
  var errorDates = this.reqImpsErrorDates;
  for(var i = 0; i < this.duration(); i++){
    var impsThisDate = Math.randMinMax((impsPortion - 500), (impsPortion + 150), true);
    reqImps.push(impsThisDate);
  }
  if(typeof errorDates != "undefined"){
    var errorPos = this.positionErrors(errorDates);
    for(var i = errorPos.start; i < errorPos.end; i++){
      var newValue = Math.round(impsPortion / 2) - Math.randMinMax(500, 100, true);
      reqImps[i] = newValue;
    }
  }
  return reqImps;
};
placement.GEN_EXECUTED_IMPS = function(){
  var reqImps = this.GEN_REQUESTED_IMPS();
  var execImps = [];
  reqImps.forEach(function(value){
    var difference = Math.randMinMax(100, 1000, true);
    execImps.push(value - difference);
  });
  return execImps;
};

console.log(placement.GEN_REQUESTED_IMPS());
