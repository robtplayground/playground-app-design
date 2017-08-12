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

// ** EXECUTED IMPS  ** //

var chart1;

AmCharts.ready(function() {

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

    console.log('data', chart1.dataProvider);

    // data updated event will be fired when chart is first displayed,
    // also when data will be updated. We'll use it to set some
    // initial zoom
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
    graph1.type = "column"; // try to change it to "column"
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

    function animChart(){
      setTimeout(function(){
        $("#chart--execImpsAgg").addClass('animateChart');
      }, 500);
    }

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
    align: "right",
    size: 45,
    // bold: true,
    x: '55%',
    y: '42%'
  }, {
    text: "%",
    align: "left",
    size: 15,
    bold: false,
    x: '55%',
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



}); // end AmCharts.ready

// IMPS DELIVERED

Chart.impsDel = {};

var thisPCurDur = moment(new Date()).diff(moment(chartData.TTM_same.dates.start), 'days');
console.log(chartData.TTM_same.dates.start, 'campapign', chartData.campaign.dates.start);
var thisImpsDel = chartData.TTM_same.data.execImpsAgg[thisPCurDur - 1];
console.log('thisImpsDel', thisImpsDel);
var thisImpsBooked = chartData.TTM_same.bookedImps;
var thisImpsBookedDaily = thisImpsBooked / duration(chartData.TTM_same.dates);
var thisImpsPercDel = thisImpsDel / thisImpsBooked * 100;
// console.log('thisImpsPercDel',thisImpsPercDel);
console.log('pCurDur', thisPCurDur);
console.log('bookedImpsDaily', thisImpsBookedDaily * thisPCurDur);
// execImps bench is 10% below reqImps bench
var thisImpsBench = Math.round(((thisImpsBookedDaily * 0.9 * thisPCurDur) / thisImpsBooked) * 100);


Chart.impsDel.target = 'chart--impsDelivered';
Chart.impsDel.data = [{
    values: [thisImpsPercDel, 100 - thisImpsPercDel],
    labels: ['Amount Delivered', 'remainder'],
    hoverinfo: 'label+percent+name',
    sort: false,
    showlegend: false,
    direction: 'clockwise',
    hole: .8,
    type: 'pie',
  },
  {
    values: [thisImpsBench, 1, 100 - (thisImpsBench + 1)],
    labels: ['', 'Expected', ''],
    showlegend: false,
    text: ['', (thisImpsBench + '%'), ''],
    hoverinfo: 'none',
    textinfo: 'label+text',
    textposition: ['none', 'outside', 'none'],
    marker: {
      colors: ['rgba(255,0,0,0)', 'rgba(255,255,255, 0.5)', 'rgba(0,255,0,0)']
    },
    sort: false,
    direction: 'clockwise',
    hole: .2,
    pull: .5,
    type: 'pie'
  },
];

Chart.impsDel.layout = {
  title: 'Impressions Delivered (Executed)',
  autosize: true,
  annotations: [{
      font: {
        size: 40
      },
      showarrow: false,
      text: Math.round(thisImpsPercDel),
      x: 0.5,
      y: 0.5
    },
    {
      font: {
        size: 15
      },
      showarrow: false,
      text: '%',
      x: 0.58,
      y: 0.53
    }
  ],
  margin: {
    l: 30,
    r: 30,
    b: 30,
    t: 30,
    pad: 0
  },
  paper_bgcolor: 'white',
  plot_bgcolor: 'grey'
};



// ** CAMPAIGN PROGRESS

Chart.cProg = {};

var currentDur = moment(new Date()).diff(moment(chartData.campaign.dates.start), 'days');
var campDur = chartData.campaign.duration;
var cProgPercent = currentDur / campDur;

Chart.cProg.target = 'chart--cProg';
Chart.cProg.data = [{
    values: [90, 270],
    showlegend: false,
    hoverinfo: 'none',
    marker: {
      colors: ['rgba(255,0,0,0)', '#ababab']
    },
    sort: true,
    rotation: 225,
    hole: .9,
    type: 'pie'
  },
  {
    values: [90, (270 * cProgPercent), (270 - (270 * cProgPercent))],
    showlegend: false,
    hoverinfo: 'none',
    marker: {
      colors: ['rgba(255,0,0,0)', 'rgb(0,255, 1)', 'rgba(255,0,0,0)']
    },
    sort: false,
    direction: 'clockwise',
    rotation: 135,
    hole: .9,
    type: 'pie'
  },
];

Chart.cProg.layout = {
  autosize: false,
  annotations: [{
      font: {
        color: 'white',
        size: 0.9 * rem,
        weight: 700
      },
      // xref: 'paper',
      // yref: 'paper',
      x: 0.45,
      xanchor: 'right',
      y: -0.05,
      yanchor: 'bottom',
      text: moment(chartData.campaign.dates.start).format('ddd D MMMM'),
      showarrow: false
    }, {
      font: {
        color: 'white',
        size: 0.9 * rem,
        weight: 700
      },
      // xref: 'paper',
      // yref: 'paper',
      x: 0.55,
      xanchor: 'left',
      y: -0.05,
      yanchor: 'bottom',
      text: moment(chartData.campaign.dates.end).format('ddd D MMMM'),
      showarrow: false
    },
    {
      font: {
        size: 13,
        color: 'white'
      },
      showarrow: false,
      text: 'DAYS LEFT',
      x: .5,
      y: .42,
      yanchor: 'top'
    },
    {
      font: {
        size: 36,
        color: 'white'
      },
      showarrow: false,
      text: (campDur - currentDur),
      x: .5,
      y: .35,
      yanchor: 'bottom'
    }
  ],
  margin: {
    l: 0,
    r: 0,
    b: 20,
    t: 10,
    pad: 200
  },
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent'
};




// ATIV

var ativAv = average(chartData.TTM_same.data.ativ, chartData.TTM_same.dates).toFixed(1);

$('#chart--ativAv .chart-single__value').text(ativAv);

// PASSIVE COMPLETION RATE

var thisPassiveC = (average(chartData.TTM_same.data.passiveCompletionRate, chartData.TTM_same.dates) * 100).toFixed(2);
$('#chart--passiveC .chart-single__value').text(thisPassiveC);

// ENGAGED COMPLETION RATE

var thisEngagedC = (average(chartData.TTM_same.data.engagedCompletionRate, chartData.TTM_same.dates) * 100).toFixed(2);
$('#chart--engagedC .chart-single__value').text(thisEngagedC);

// ENGAGEMENT RATE

var thisErAv = (average(chartData.TTM_same.data.engagementRate, chartData.TTM_same.dates)).toFixed(2);
$('#chart--erAv .chart-single__value').text(thisErAv);



// ** ENGAGEMENT RATE OVER TIME  ** //

Chart.er = {};
Chart.er.target = "chart--erTime";
Chart.er.data = [];

Chart.er.data[0] = {
  name: chartData.TTM_same.name.trunc(10),
  x: chartData.campaign.dateList,
  y: chartData.TTM_same.data.engagementRate,
  type: 'scatter',
  fill: 'tozeroy',
  mode: 'line',
  line: {
    color: 'rgb(255, 0, 0, 0.5)',
    width: 0
  }
};

Chart.er.layout = {
  showlegend: true,
  xaxis: {
    type: 'date',
    title: 'Date'
  },
  yaxis: {
    range: [0, 2],
    title: 'Engagement Rate (%)'
  },
  // title: 'Engagement Rate'
};



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




// resize charts

Object.keys(Chart).forEach(function(chart, index) {
  if (typeof Chart[chart].target != 'undefined') {
    console.log(chart, Chart[chart]);
    sizeChart(Chart[chart]);
  }
});


$(window).on('resize', function() {
  Object.keys(Chart).forEach(function(chart, index) {
    if (typeof Chart[chart].target != 'undefined') {
      sizeChart(Chart[chart]);
    }
  });
});
