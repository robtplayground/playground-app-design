function total(array, dates) {
  var rangeTotal = 0;
  var arrayR = arrayRange(dates, cp);
  // only add totals of array within this Range
  for (var i = arrayR.startPos; i < arrayR.endPos; i++) {
    rangeTotal += array[i];
  }
  return rangeTotal;
}

function average(array, dates) {
  // only add totals of array within this Range
  var rangeTotal = total(array, dates);
  return rangeTotal / duration(dates);
}

var Chart = {};

function prepData(categoryObj, valuesArray) {
  var data = [];
  for (i = 0; i < categoryObj.values.length; i++) {
    var dataGroup = {};
    dataGroup[categoryObj.name] = categoryObj.values[i];
    valuesArray.forEach(function(metric){
      dataGroup[metric.name] = metric.values[i];
    });
    data.push(dataGroup);
  }
  return data;
}

function animChart(event){
  setTimeout(function(){
    $(event.chart.div).addClass('animateChart');
  }, 500);
}

// ** EXECUTED IMPS  ** //

var execImpsData = {};
Object.keys(pl).forEach(function(p){
  execImpsData[p] = prepData({
    name: 'date',
    values: cp.dateList
  },[
    {name: 'execImps',values: pl[p].data.execImpsAgg},
    {name: 'viewImps',values: pl[p].data.viewImpsAgg}
  ]);
});
console.log(execImpsData);


// SERIAL CHART
var chart1 = Chart.execImpsAgg = AmCharts.makeChart("chart--execImpsAgg", {
  type: "serial",
  dataProvider: prepData({
    name: 'date',
    values: cp.dateList
  },[
    {name: 'execImps',values: pl.SSM_same.data.execImpsAgg},
    {name: 'viewImps',values: pl.SSM_same.data.viewImpsAgg}
  ]),
  categoryField: "date",
  startDuration: 0,
  addClassNames: true,
  marginRight: 40,
  categoryAxis:{
    parseDates: true, // in order char to understand dates, we should set parseDates to true
    gridAlpha: 0.07,
    axisColor: "#DADADA",
  },
  valueAxes:[{
    gridAlpha: 0.07,
    title: "Executed Impressions",
  }],
  graphs: [{
    type: "line", // try to change it to "column"
    title: "red line",
    valueField: "execImps",
    lineAlpha: 1,
    lineColor: "#d1cf2a",
    fillAlphas: 0.3
  },{
    type: "line", // try to change it to "column"
    title: "red line",
    valueField: "viewImps",
    lineAlpha: 1,
    lineColor: "#e91e63",
    fillAlphas: 0.3
  }],
  chartCursor: {
    cursorPosition: "mouse",
    categoryBalloonDateFormat: "JJ:NN, DD MMMM"
  },
  chartScrollbar: {},
  listeners:[{
    event: "rendered",
    method: animChart
  }]
});

// ** VIEWABILITY AVERAGE CHART

var viewb_Avg = Math.round(average(pl.TTM_same.data.viewability, pl.TTM_same.dates));

console.log(viewb_Avg);

var vAvData = [{viewability: viewb_Avg, label: "TT Viewability", color:"#5d3289"}, {viewability: 100 - viewb_Avg, label: "", color: "lightgrey"}];

var vAvBenchData = [
  {segment: fm.iab.benchmarks.viewability, color: "transparent"},
  {segment: 1, label: "IAB: " + fm.iab.benchmarks.viewability + "%", color: "red"},
  {segment: fm.topAndTail.benchmarks.viewability - fm.iab.benchmarks.viewability - 1, color: "transparent"},
  {segment: 1, label: "TT: " + fm.topAndTail.benchmarks.viewability + '%', color: "#e91e63"},
  {segment: 100 - 1 - fm.topAndTail.benchmarks.viewability, color: "transparent"}
];

var chart2 = Chart.vAvData = AmCharts.makeChart('chart--vAvData', {
  type: "pie",
  theme: "light",
  dataProvider: vAvData,
  valueField: "viewability",
  titleField: "label",
  colorField: "color",
  // labelFunction: labelFunction,
  labelsEnabled: false,
  // labelRadius: "-50%",
  alphaField: "alpha",
  innerRadius: "70%",
  startDuration: 0,
  allLabels: [{
    text: viewb_Avg,
    align: "center",
    size: 35,
    // bold: true,
    x: 3,
    y: '43%'
  }, {
    text: "%",
    align: "center",
    size: 15,
    bold: false,
    x: -28,
    y: '45%'
  }],
});

var chart3 = Chart.vAvBenchmarks = AmCharts.makeChart('chart--vAvBenchmarks', {
  type: "pie",
  theme: "light",
  dataProvider: vAvBenchData,
  valueField: "segment",
  titleField: "label",
  labelsEnabled: false,
  // labelFunction: labelFunction,
  // labelRadius: "-5%",
  colorField: "color",
  alphaField: "alpha",
  innerRadius: "70%",
  startDuration: 0,
  addClassNames: true
});

function labelFunction(info) {
  var data = info.dataContext;
  if (info.index != null && data.label) {
    return data.label;
  } else {
    return "";
  }
}

// IMPS DELIVERED

var thisPCurDur = moment(new Date()).diff(moment(pl.TTM_same.dates.start), 'days');

var thisImpsDel = pl.TTM_same.data.execImpsAgg[thisPCurDur - 1];

var thisImpsBooked = pl.TTM_same.bookedImps;
var thisImpsBookedDaily = thisImpsBooked / duration(pl.TTM_same.dates);
var thisImpsPercDel = thisImpsDel / thisImpsBooked * 100;

// execImps bench is 10% below reqImps bench
var thisImpsBench = Math.round(((thisImpsBookedDaily * 0.9 * thisPCurDur) / thisImpsBooked)  * 100);


var impsDelData = [{progress: thisImpsPercDel, label: "Executed Impressions", color:"#5d3289"}, {progress: 100 - thisImpsPercDel, label: "", color: "lightgrey"}];

var impsDelBench = [
  {segment: thisImpsBench, color: "transparent"},
  {segment: 1, label: "Expected: " + thisImpsBench + "%", color: "red"},
  {segment: 100 - (thisImpsBench + 1), color: "transparent"}
];

var chart4 = Chart.impsDelData = AmCharts.makeChart('chart--impsDelData', {
  type: "pie",
  theme: "light",
  dataProvider: impsDelData,
  valueField: "progress",
  titleField: "label",
  colorField: "color",
  // labelFunction: labelFunction,
  labelsEnabled: false,
  // labelRadius: "-50%",
  alphaField: "alpha",
  innerRadius: "70%",
  startDuration: 0,
  allLabels: [{
    text: Math.round(thisImpsPercDel),
    align: "center",
    size: 35,
    // bold: true,
    x: 1,
    y: '41%'
  }, {
    text: "%",
    align: "center",
    size: 15,
    bold: false,
    x: -28,
    y: '42%'
  },{
    text: thisImpsDel.toLocaleString(),
    align: "center",
    size: 12,
    bold: false,
    x: '0%',
    y: '55%'
  }],
});

var chart5 = Chart.impsDelBenchmarks = AmCharts.makeChart('chart--impsDelBench', {
  type: "pie",
  theme: "light",
  dataProvider: impsDelBench,
  valueField: "segment",
  titleField: "label",
  labelsEnabled: false,
  // labelFunction: labelFunction,
  // labelRadius: "-5%",
  colorField: "color",
  alphaField: "alpha",
  innerRadius: "70%",
  startDuration: 0,
  addClassNames: true
});

$('.chart--impsDel .chart__legend__left span').text('Expected: ' + thisImpsBench + '%');






// ** CAMPAIGN PROGRESS

var currentDur = moment(new Date()).diff(moment(cp.dates.start), 'days');
var campDur = cp.duration;
var cProgPercent = currentDur / campDur;

var chart6 = Chart.cProg = AmCharts.makeChart('chart--cProg', {
  "type": "gauge",
  "axes": [ {
    backgroundColor: "#000",
    labelsEnabled: false,
    "axisThickness": 0,
    "axisAlpha": 0,
    "tickAlpha": 0,
    "startValue": 0,
    "endValue": 100,
    "bands": [{
      "color": "red",
      "startValue": 0,
      "endValue": cProgPercent * 100,
      "radius": "100%",
      "innerRadius": "85%"
    }, {
      "color": "lightgrey",
      "startValue": cProgPercent * 100,
      "endValue": 100,
      "radius": "100%",
      "innerRadius": "85%",
      "balloonText": "90%"
    }],
  } ],
  "allLabels": [{
    "text": moment(cp.dates.start).format('ddd D MMMM'),
    "x": "40%",
    "y": "80%",
    "size": 10,
    "bold": true,
    "color": "#fff",
    "align": "right"
  }, {
    "text": moment(cp.dates.end).format('ddd D MMMM'),
    "x": "60%",
    "y": "80%",
    "size": 10,
    "bold": true,
    "color": "#fff",
    "align": "left"
  }, {
    "text": campDur - currentDur,
    "x": 4,
    "y": "35%",
    "size": 25,
    "bold": false,
    "color": "#fff",
    "align": "center"
  }, {
    "text": "DAYS LEFT",
    "x": 0,
    "y": "60%",
    "size": 9,
    "bold": false,
    "color": "#fff",
    "align": "center"
  }],
  "export": {
    "enabled": true
  }
} );



// ATIV

var ativAv = average(pl.TTM_same.data.ativ, pl.TTM_same.dates).toFixed(1);

$('#chart--ativAv .chart__circle__value').text(ativAv);

// PASSIVE COMPLETION RATE

var thisPassiveC = (average(pl.TTM_same.data.passiveCompletionRate, pl.TTM_same.dates) * 100).toFixed(2);
$('#chart--passiveC .chart__circle__value').text(thisPassiveC);

// ENGAGED COMPLETION RATE

var thisEngagedC = (average(pl.TTM_same.data.engagedCompletionRate, pl.TTM_same.dates) * 100).toFixed(2);
$('#chart--engagedC .chart__circle__value').text(thisEngagedC);

// ENGAGEMENT RATE

var thisErAv = (average(pl.TTM_same.data.engagementRate, pl.TTM_same.dates)).toFixed(2);
$('#chart--erAv .chart__circle__value').text(thisErAv);



// ** ENGAGEMENT RATE OVER TIME  ** //


// SERIAL CHART
var chart8 = Chart.erTime = AmCharts.makeChart("chart--erTime",{
  type: 'serial',
  dataProvider: prepData({
    name: 'date',
    values: cp.dateList
  },[{
    name: 'engagementRate', values: pl.TTM_same.data.engagementRate
  },{
    name: 'clickthroughRate', values: pl.TTM_same.data.clickRate
  }]),
  categoryField: "date",
  startDuration: 0,
  addClassNames: true,
  marginRight: 40,
  categoryAxis: {
    parseDates: true, // in order char to understand dates, we should set parseDates to true
    gridAlpha: 0.07,
    axisColor: "#DADADA"
  },
  valueAxes: [{
    gridAlpha:0.07,
    title:"Engagement",
    minimum: 0,
    maximum: 2
  }],
  graphs: [{
    type: "line", // try to change it to "column"
    title: "Engagement Rate",
    valueField: "engagementRate",
    lineAlpha: 1,
    lineColor: "#d1cf2a",
    fillAlphas: 0.3
  },{
    type: "line", // try to change it to "column"
    title: "Clickthrough Rate",
    valueField: "clickthroughRate",
    lineAlpha: 1,
    lineColor: "#e91e63",
    fillAlphas: 0.3
  }],
  chartScrollbar: {},
  chartCursor: {
    cursorPosition: "mouse",
    categoryBalloonDateFormat: "JJ:NN, DD MMMM"
  },
  legend: {},
  listeners: [{
    event: "rendered",
    method: animChart
  }]
});


// ** COMPLETIONS OVER TIME  ** //

Chart.completionsTime = {};
Chart.completionsTime.target = "chart--completionsTime";
Chart.completionsTime.data = [];

Chart.completionsTime.data[0] = {
  name: 'Completion Rate (Engaged)',
  x: cp.dateList,
  y: pl.TTM_same.data.engagedCompletionRate,
  type: 'scatter',
  fill: 'tozeroy',
  mode: 'line',
  line: {
    color: 'rgb(255, 0, 0, 0.5)',
    width: 0
  }
};

Chart.completionsTime.data[1] = {
  name: 'Completion Rate (Passive)',
  x: cp.dateList,
  y: pl.TTM_same.data.passiveCompletionRate,
  type: 'scatter',
  fill: 'tozeroy',
  mode: 'line',
  line: {
    // color: 'rgb(255, 0, 0, 0.5)',
    width: 0
  }
};

Chart.completionsTime.layout = {
  showlegend: true,
  xaxis: {
    type: 'date',
    title: 'Date'
  },
  yaxis: {
    title: 'Completion Rate (%)'
  },
  // title: 'CTR'
};



// COMPLETION HEAT

var ec_color1 = hexToRgb("#e91e63");
var ec_color2 = hexToRgb("#666666");

var pc_color1 = hexToRgb("#0078d8");
var pc_color2 = hexToRgb("#666666");


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var values = [];
    if(result){
      values.push(parseInt(result[1], 16));
      values.push(parseInt(result[2], 16));
      values.push(parseInt(result[3], 16));
      return values;
    }else{
      return null;
    }
}

function pickHex(color1, color2, weight) {
    var p = weight;
    var w = p * 2 - 1;
    var w1 = (w/1+1) / 2;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
}

var avVid0 = average(pl.TTM_same.data.video.vid0, pl.TTM_same.dates);
var avVid25 = average(pl.TTM_same.data.video.vid25, pl.TTM_same.dates);
var avVid50 = average(pl.TTM_same.data.video.vid50, pl.TTM_same.dates);
var avVid75 = average(pl.TTM_same.data.video.vid75, pl.TTM_same.dates);
var avVid100 = average(pl.TTM_same.data.video.vid100, pl.TTM_same.dates);

var ecRates = [{value: avVid25, label: "25% complete"}, {value: avVid50, label: "50% complete"}, {value: avVid75, label: "75% complete"}, {value: avVid100, label: "100% complete"}];

var pcRates = [{value: avVid25 - 6, label: "25% complete"}, {value: avVid50 + 1, label: "50% complete"}, {value: avVid75 + 2, label: "75% complete"}, {value: avVid100 + 3, label: "100% complete"}];


var ecHighVal = 0;
var ecLowVal = 100;
ecRates.forEach(function(obj){
  if(obj.value > ecHighVal){
    ecHighVal = obj.value;
  }
  if(obj.value < ecLowVal){
    ecLowVal = obj.value;
  }
});
ecRates.forEach(function(obj){
  obj.color = [];
  var colorPos = (obj.value - ecLowVal) / (ecHighVal - ecLowVal);
  obj.color = 'rgb(' + pickHex(ec_color1, ec_color2, colorPos) + ')';
  obj.stackHeight = 1;
});

var pcHighVal = 0;
var pcLowVal = 100;
pcRates.forEach(function(obj){
  if(obj.value > pcHighVal){
    pcHighVal = obj.value;
  }
  if(obj.value < pcLowVal){
    pcLowVal = obj.value;
  }
});
pcRates.forEach(function(obj){
  obj.color = [];
  var colorPos = (obj.value - pcLowVal) / (pcHighVal - pcLowVal);
  obj.color = 'rgb(' + pickHex(pc_color1, pc_color2, colorPos) + ')';
  obj.stackHeight = 1;
});

var chart9 = Chart.ecHeat = AmCharts.makeChart("chart--engagedCHeat",{
  type: 'serial',
  dataProvider: ecRates,
  categoryField: "label",
  startDuration: 0,
  addClassNames: true,
  categoryAxis: {
    gridAlpha: 0,
    axisAlpha: 0
  },
  valueAxes: [{
    stackType: "regular",
    title:" ",
    gridAlpha:0,
    axisAlpha:0,
    minimum: 0,
    maximum: 1,
    labelsEnabled: false
  }],
  graphs: [{
    columnWidth: 1,
    type: "column", // try to change it to "column"
    title: "Percent Completed",
    valueField: "stackHeight",
    colorField: "color",
    fillAlphas: 0.9,
    lineAlpha: 0,
    // "labelOffset": -40,
    "labelText": "Allo",
    "labelPosition": "middle",
    labelAnchor: "middle",
    "color": "#fff",
    labelFunction: function(item){
      return Math.round(item.dataContext.value) + "%";
    },
    balloonText: ""
  }]
  // listeners: [{
  //   event: "rendered",
  //   method: animChart
  // }]
});

var chart10 = Chart.pcHeat = AmCharts.makeChart("chart--passiveCHeat",{
  type: 'serial',
  dataProvider: pcRates,
  categoryField: "label",
  startDuration: 0,
  addClassNames: true,
  categoryAxis: {
    gridAlpha: 0,
    axisAlpha: 0
  },
  valueAxes: [{
    stackType: "regular",
    title:" ",
    gridAlpha:0,
    axisAlpha:0,
    minimum: 0,
    maximum: 1,
    labelsEnabled: false
  }],
  graphs: [{
    columnWidth: 1,
    type: "column", // try to change it to "column"
    title: "Percent Completed",
    valueField: "stackHeight",
    colorField: "color",
    fillAlphas: 0.9,
    lineAlpha: 0,
    // "labelOffset": -40,
    "labelText": "Allo",
    "labelPosition": "middle",
    labelAnchor: "middle",
    "color": "#fff",
    labelFunction: function(item){
      return Math.round(item.dataContext.value) + "%";
    },
    balloonText: ""
  }]
  // listeners: [{
  //   event: "rendered",
  //   method: animChart
  // }]
});
