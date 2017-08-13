function total(array, dates) {
  var rangeTotal = 0;
  var arrayR = arrayRange(dates, chartData.campaign);
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

function sizeChart(chart) {
  console.log(chart.target);
  var parentWidth = $('#' + chart.target).width();
  var parentHeight = $('#' + chart.target).height();
  chart.layout.width = parentWidth;
  chart.layout.height = parentHeight;
  // Plotly.relayout(chart.target, chart.layout);
}

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

var chart1;

    // SERIAL CHART
    var chart1 = Chart.execImpsAgg = new AmCharts.AmSerialChart();
    chart1.dataProvider = prepData({
      name: 'date',
      values: chartData.campaign.dateList
    },[
      {name: 'execImps',values: chartData.SSM_same.data.execImpsAgg},
      {name: 'viewImps',values: chartData.SSM_same.data.viewImpsAgg}
    ]);
    chart1.categoryField = "date";
    chart1.startDuration = 0;
    chart1.addClassNames = true;

    // chart1.addListener("dataUpdated", zoomChart);
    chart1.addListener("rendered", animChart);

    // AXES
    // Category
    var categoryAxis = chart1.categoryAxis;
    categoryAxis.parseDates = true; // in order char to understand dates, we should set parseDates to true
    categoryAxis.gridAlpha = 0.07;
    categoryAxis.axisColor = "#DADADA";

    // Value
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.gridAlpha = 0.07;
    valueAxis.title = "Executed Impressions";
    chart1.addValueAxis(valueAxis);

    // GRAPH 1
    var graph1 = new AmCharts.AmGraph();
    graph1.type = "line"; // try to change it to "column"
    graph1.title = "red line";
    graph1.valueField = "execImps";
    graph1.lineAlpha = 1;
    graph1.lineColor = "#d1cf2a";
    graph1.fillAlphas = 0.3; // setting fillAlphas to > 0 value makes it area graph1
    chart1.addGraph(graph1);

    var graph2 = new AmCharts.AmGraph();
    graph2.type = "line"; // try to change it to "column"
    graph2.title = "red line";
    graph2.valueField = "viewImps";
    graph2.lineAlpha = 1;
    graph2.lineColor = "#e91e63";
    graph2.fillAlphas = 0.3; // setting fillAlphas to > 0 value makes it area graph2
    chart1.addGraph(graph2);

    // CURSOR
    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorPosition = "mouse";
    chartCursor.categoryBalloonDateFormat = "JJ:NN, DD MMMM";
    chart1.addChartCursor(chartCursor);

    // SCROLLBAR
    var chartScrollbar = new AmCharts.ChartScrollbar();

    chart1.addChartScrollbar(chartScrollbar);

    // WRITE
    chart1.write("chart--execImpsAgg");



  // this method is called when chart is first inited as we listen for "dataUpdated" event
  function zoomChart() {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    chart1.zoomToIndexes(chart1.dataProvider.length - 40, chart1.dataProvider.length - 1);
  }

  // WRITE
  chart1.write("chart--execImpsAgg");


// ** VIEWABILITY AVERAGE CHART
var viewb_Avg = Math.round(average(chartData.TTM_same.data.viewability, chartData.TTM_same.dates));

console.log(viewb_Avg);

var vAvData = [{viewability: viewb_Avg, label: "TT Viewability", color:"#5d3289"}, {viewability: 100 - viewb_Avg, label: "", color: "lightgrey"}];

var vAvBenchData = [
  {segment: chartData.iab.benchmarks.viewability, color: "transparent"},
  {segment: 1, label: "IAB: " + chartData.iab.benchmarks.viewability + "%", color: "red"},
  {segment: chartData.topAndTail.benchmarks.viewability - chartData.iab.benchmarks.viewability - 1, color: "transparent"},
  {segment: 1, label: "TT: " + chartData.topAndTail.benchmarks.viewability + '%', color: "#e91e63"},
  {segment: 100 - 1 - chartData.topAndTail.benchmarks.viewability, color: "transparent"}
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

var thisPCurDur = moment(new Date()).diff(moment(chartData.TTM_same.dates.start), 'days');

var thisImpsDel = chartData.TTM_same.data.execImpsAgg[thisPCurDur - 1];

var thisImpsBooked = chartData.TTM_same.bookedImps;
var thisImpsBookedDaily = thisImpsBooked / duration(chartData.TTM_same.dates);
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

var currentDur = moment(new Date()).diff(moment(chartData.campaign.dates.start), 'days');
var campDur = chartData.campaign.duration;
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
    "text": moment(chartData.campaign.dates.start).format('ddd D MMMM'),
    "x": "40%",
    "y": "80%",
    "size": 10,
    "bold": true,
    "color": "#fff",
    "align": "right"
  }, {
    "text": moment(chartData.campaign.dates.end).format('ddd D MMMM'),
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

var ativAv = average(chartData.TTM_same.data.ativ, chartData.TTM_same.dates).toFixed(1);

$('#chart--ativAv .chart__circle__value').text(ativAv);

// PASSIVE COMPLETION RATE

var thisPassiveC = (average(chartData.TTM_same.data.passiveCompletionRate, chartData.TTM_same.dates) * 100).toFixed(2);
$('#chart--passiveC .chart__circle__value').text(thisPassiveC);

// ENGAGED COMPLETION RATE

var thisEngagedC = (average(chartData.TTM_same.data.engagedCompletionRate, chartData.TTM_same.dates) * 100).toFixed(2);
$('#chart--engagedC .chart__circle__value').text(thisEngagedC);

// ENGAGEMENT RATE

var thisErAv = (average(chartData.TTM_same.data.engagementRate, chartData.TTM_same.dates)).toFixed(2);
$('#chart--erAv .chart__circle__value').text(thisErAv);



// ** ENGAGEMENT RATE OVER TIME  ** //

Chart.er = {};
Chart.er.target = "chart--erTime";
Chart.er.data = [];

// SERIAL CHART
var chart8 = Chart.execImpsAgg = AmCharts.makeChart("chart--erTime",{
  type: 'serial',
  dataProvider: prepData({
    name: 'date',
    values: chartData.campaign.dateList
  },[
    {name: 'engagementRate',values: chartData.TTM_same.data.engagementRate}
  ]),
  categoryField: "date",
  startDuration: 0,
  addClassNames: true,
  categoryAxis: {
    parseDates: true, // in order char to understand dates, we should set parseDates to true
    gridAlpha: 0.07,
    axisColor: "#DADADA"
  },
  valueAxis: {
    gridAlpha:0.07,
    title:"Engagement Rate"
  },
  graphs: [{
    type: "line", // try to change it to "column"
    title: "red line",
    valueField: "engagementRate",
    lineAlpha: 1,
    lineColor: "#d1cf2a",
    fillAlphas: 0.3
  }],
  chartScrollbar: {},
  chartCursor: {
    cursorPosition: "mouse",
    categoryBalloonDateFormat: "JJ:NN, DD MMMM"
  },
  listeners: [{
    event: "rendered",
    method: animChart
  }]
});


// ** CTR OVER TIME ** //

Chart.ctrTime = {};
Chart.ctrTime.target = "chart--ctrTime";
Chart.ctrTime.data = [];

Chart.ctrTime.data[0] = {
  name: chartData.TTM_same.name.trunc(10),
  x: chartData.campaign.dateList,
  y: chartData.TTM_same.data.clickRate,
  type: 'scatter',
  fill: 'tozeroy',
  mode: 'line',
  line: {
    color: 'rgb(255, 0, 0, 0.5)',
    width: 0
  }
};

Chart.ctrTime.layout = {
  showlegend: false,
  xaxis: {
    type: 'date',
    title: 'Date'
  },
  yaxis: {
    range: [0, 1],
    title: 'Clickthrough Rate (%)'
  },
  // title: 'CTR'
};



// ** COMPLETIONS OVER TIME  ** //

Chart.completionsTime = {};
Chart.completionsTime.target = "chart--completionsTime";
Chart.completionsTime.data = [];

Chart.completionsTime.data[0] = {
  name: 'Completion Rate (Engaged)',
  x: chartData.campaign.dateList,
  y: chartData.TTM_same.data.engagedCompletionRate,
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
  x: chartData.campaign.dateList,
  y: chartData.TTM_same.data.passiveCompletionRate,
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

Chart.ecHeat = {};
Chart.ecHeat.target = "chart--ecHeat";
Chart.ecHeat.data = [];

var avVid0 = average(chartData.TTM_same.data.video.vid0, chartData.TTM_same.dates);
var avVid25 = average(chartData.TTM_same.data.video.vid25, chartData.TTM_same.dates);
var avVid50 = average(chartData.TTM_same.data.video.vid50, chartData.TTM_same.dates);
var avVid75 = average(chartData.TTM_same.data.video.vid75, chartData.TTM_same.dates);
var avVid100 = average(chartData.TTM_same.data.video.vid100, chartData.TTM_same.dates);

console.log(avVid0, avVid25, avVid50, avVid75, avVid100);

var colorscaleValue = [
  [0, 'grey'],
  [1, 'red']
];

Chart.ecHeat.data = [{
  z: [
    [avVid0, avVid25, avVid50, avVid75, avVid100]
  ],
  x: ['0%', '25%', '50%', '75%', '100%'],
  y: ['Video Completions'],
  type: 'heatmap',
  colorscale: colorscaleValue
}];

Chart.ecHeat.layout = {};
