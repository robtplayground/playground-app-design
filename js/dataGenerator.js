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
  if(!(errorDates.start instanceof Date)){
    console.log('startDate must be a javascript Date');
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
  if(errorDates != "undefined"){
    console.log('doin the error');
    var errorPos = this.positionErrors(errorDates);
    console.log(errorPos);
    for(var i = errorPos.start; i < errorPos.end; i++){
      var newValue = Math.round(impsPortion / 2) - Math.randMinMax(500, 100, true);
      console.log(newValue);
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
placement.GEN_REQ_IMPS_ERROR = function(){
  var errorDates = REQ_IMPS_ERROR_DATES;
  var impsPortion = this.booked / this.duration();
  if(!(errorDates.start instanceof Date)){
    console.log('startDate must be a javascript Date');
    return;
  }
  var errorStart = moment(errorDates.start).diff(moment(this.dates.start), 'days');
  var errorEnd = moment(errorDates.end).diff(moment(this.dates.start), 'days');


};

console.log(placement.GEN_REQUESTED_IMPS());


function GEN_DATES(dateCount){

}


function GEN_REQUESTED_IMPS(){

}
