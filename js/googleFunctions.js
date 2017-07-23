
/// randMinMax function

Math.randMinMax = function(min, max, round) {
	var val = min + (Math.random() * (max - min));
	if( round ) val = Math.round( val );
	return val;
};

// get Active Spreadsheet

var SS = SpreadsheetApp.getActiveSpreadsheet();
var currentData = function(){
  SS.getDataRange().getValues();
};

// Query Column Names instead of numbers

function getByName(colName, row) {
  var data = SS.getDataRange().getValues();
  var col = data[0].indexOf(colName);
  if (col != -1) {
    return data[row-1][col];
  }
}

function col(colName){
  var data = SS.getDataRange().getValues();
  return data[0].indexOf(colName);
}

// and we're off...

var bookedImps = 500000; // for this placement
var numRows = (SS.getLastRow() - 1) // less the header row;

function GEN_REQUESTED_IMPS() {
  for (var i = 2; i <= (numRows-1); i++) {
    var impsColumn = col('Requested Impressions');
    SS.getActiveCell().setValue(impsColumn);
    //var currentCell = SS.getRange('' + impsColumn + i);
    //console.log(currentCell);
    //currentCell.setValue(Math.randMinMax(((bookedImps / numRows) - 500), ((bookedImps / numRows) + 150), true));
  }
  //callback
  //GEN_EXECUTED_IMPS();
}

function GEN_EXECUTED_IMPS() {
  var cellRow = SS.getActiveCell().getRow();
  var reqImps = getByName('Requested Impressions', cellRow);
  var difference = Math.randMinMax(100, 1000, true);
  return reqImps - difference;
}

function GEN_VIEWABLE_IMPS() {
  var cellRow = SS.getActiveCell().getRow();
  var execImps = getByName('Executed Impressions', cellRow);
  var difference = Math.randMinMax(500, 1500, true);
  return execImps - difference;
}

function GEN_VIEWABILITY() {
  var cellRow = SS.getActiveCell().getRow();
  var execImps = getByName('Executed Impressions', cellRow);
  var viewImps = getByName('Viewable Impressions', cellRow);
  return Number(((viewImps / execImps) * 100).toFixed(2));
}

function GEN_CLICKS() {
  var cellRow = SS.getActiveCell().getRow();
  var viewImps = getByName('Viewable Impressions', cellRow);
  var difference = Math.randMinMax(36/10000, 24/10000, false);
  return Math.round(viewImps * difference);
}

function GEN_CTR() {
  var cellRow = SS.getActiveCell().getRow();
  var clicks = getByName('Clicks', cellRow);
  var reqImps = getByName('Requested Impressions', cellRow);
  return Number(((clicks / reqImps) * 100).toFixed(2));
}

function GEN_ENGAGEMENTS() {
  var cellRow = SS.getActiveCell().getRow();
  var clicks = getByName('Clicks', cellRow);
  var execImps = getByName('Executed Impressions', cellRow);
  var difference = Math.randMinMax(28/10000, 44/10000, false);
  return ((execImps * difference) + clicks);
}

function resetSheet(){
  GEN_REQUESTED_IMPS();
}

function onOpen() {
  var menuItems = [
    {name: 'Reset Spreadsheet Data', functionName: 'resetSheet'}
  ];
  SS.addMenu('Metrics Data', menuItems);
}
