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

function sizeChart(chart){
  var parentWidth = $('#' + chart.target).width();
  var parentHeight = $('#' + chart.target).height();
  chart.layout.width = parentWidth;
  chart.layout.height = parentHeight;
  Plotly.relayout(chart.target, chart.layout);
}

// ** EXECUTED IMPS  ** //

Chart.execImpsAgg = {};

Chart.execImpsAgg.target = "chart--execImpsAgg";
Chart.execImpsAgg.data = [];

// all placements

// Object.keys(chartData).forEach(function(key, index) {
//   if (key === 'campaign' | key === 'iab' | key === 'superSkin') {
//     return;
//   } else {
//     var placement = chartData[key];
//     // -3 so as not to put in the 3 useless indexes
//     Chart.execImpsAgg.data[index - 3] = {
//       name: placement.name.trunc(10),
//       x: chartData.campaign.dateList,
//       y: placement.data.execImpsAgg,
//       type: 'scatter',
//       fill: 'tozeroy'
//     }
//   }
// });

Chart.execImpsAgg.data[0] = {
  name: chartData.SSM_same.name.trunc(10),
  x: chartData.campaign.dateList,
  y: chartData.SSM_same.data.execImpsAgg,
  type: 'scatter',
  fill: 'tozeroy',
  mode: 'line',
  line: {
    color: 'rgb(255)',
    width: 0
  }
};

Chart.execImpsAgg.data[1] = {
  name: chartData.SSM_same.name.trunc(10),
  x: chartData.campaign.dateList,
  y: chartData.SSM_same.data.execImpsAgg,
  type: 'scatter',
  fill: 'tozeroy',
  mode: 'line',
  line: {
    color: 'rgb(255, 0, 191)',
    width: 0
  }
};

Chart.execImpsAgg.layout = {
  showlegend: false,
  xaxis: {
    type: 'date',
    title: 'Date'
  },
  yaxis: {
    title: 'Impressions'
  },
  // title: 'Campaign Imps'
};

Plotly.newPlot(Chart.execImpsAgg.target, Chart.execImpsAgg.data, Chart.execImpsAgg.layout, {
  displayModeBar: false
});

// relayout to only show 1 July - 4 July

// Plotly.relayout(Chart.execImpsAgg.target, 'xaxis.range', [new Date(2017, 6, 1).getTime(), new Date(2017, 6, 4).getTime()]);

// relayout to only show from start of campaign to today!

// Plotly.relayout(Chart.execImpsAgg.target, 'xaxis.range', [new Date(2017, 6, 1).getTime(), new Date().getTime()]);

// ** VIEWABILITY AVERAGE CHART

Chart.vAv = {};

var ss2_viewb_Avg = average(chartData.SSM_same.data.viewability, chartData.SSM_same.dates);

Chart.vAv.target = 'chart--vAv';
Chart.vAv.data = [{
    values: [ss2_viewb_Avg, 100 - ss2_viewb_Avg],
    // domain: {
    //   x: [0, 1],
    //   y: [0, 0.8]
    // },
    labels: ['Viewability', 'remainder'],
    hoverinfo: 'label+percent+name',
    sort: false,
    showlegend: false,
    direction: 'clockwise',
    hole: .8,
    type: 'pie',
  },
  {
    values: [chartData.iab.benchmarks.viewability, 1, 100 - (chartData.iab.benchmarks.viewability + 1)],
    // domain: {
    //   x: [0, 1],
    //   y: [0, 0.8]
    // },
    labels: ['', 'IAB', ''],
    showlegend: false,
    text: ['', (chartData.iab.benchmarks.viewability + '%'), ''],
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
  {
    values: [chartData.superSkin.benchmarks.viewability, 1, 100 - (chartData.superSkin.benchmarks.viewability + 1)],
    // domain: {
    //   x: [0, 1],
    //   y: [0, 0.8]
    // },
    labels: ['', 'Super Skin', ''],
    showlegend: false,
    text: ['', (chartData.superSkin.benchmarks.viewability + '%'), ''],
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

Chart.vAv.layout = {
  title: 'Viewability',
  autosize: true,
  annotations: [
    {
      font: {
        size: 40
      },
      showarrow: false,
      text: Math.round(ss2_viewb_Avg),
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

Plotly.newPlot(Chart.vAv.target, Chart.vAv.data, Chart.vAv.layout, {
  displayModeBar: false
});

// IMPS DELIVERED

Chart.impsDel = {};

var thisPCurDur = moment(new Date()).diff(moment(chartData.SSM_same.dates.start), 'days');
console.log(chartData.SSM_same.dates.start, 'campapign', chartData.campaign.dates.start);
var thisImpsDel = chartData.SSM_same.data.execImpsAgg[thisPCurDur - 1];
console.log('thisImpsDel', thisImpsDel);
var thisImpsBooked = chartData.SSM_same.bookedImps;
var thisImpsBookedDaily = thisImpsBooked / duration(chartData.SSM_same.dates);
var thisImpsPercDel = thisImpsDel / thisImpsBooked * 100;
// console.log('thisImpsPercDel',thisImpsPercDel);
console.log('pCurDur', thisPCurDur);
var thisImpsBench = Math.round(((thisImpsBookedDaily * thisPCurDur) / thisImpsBooked) * 100);


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
  annotations: [
    {
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

Plotly.newPlot(Chart.impsDel.target, Chart.impsDel.data, Chart.impsDel.layout, {
  displayModeBar: false
});


// ** CAMPAIGN PROGRESS

Chart.cProg = {};

var currentDur = moment(new Date()).diff(moment(chartData.campaign.dates.start), 'days');
var campDur = chartData.campaign.duration;
var cProgPercent = currentDur / campDur;

Chart.cProg.target = 'chart--cProg';
Chart.cProg.data = [
  {
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
    font:{
      color: 'white',
      size: 0.9*rem,
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
    font:{
      color: 'white',
      size: 0.9*rem,
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
  }],
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

Plotly.newPlot(Chart.cProg.target, Chart.cProg.data, Chart.cProg.layout, {
  displayModeBar: false
});


// ATIV

var ativAv = average(chartData.SSM_same.data.ativ, chartData.SSM_same.dates).toFixed(1);

$('#chart--ativAv .chart-single__value').text(ativAv);

// PASSIVE COMPLETION RATE

var thisPassiveC = (average(chartData.SSM_same.data.passiveCompletionRate, chartData.SSM_same.dates) * 100).toFixed(2) ;
$('#chart--passiveC .chart-single__value').text(thisPassiveC);

// ENGAGED COMPLETION RATE

var thisEngagedC = (average(chartData.SSM_same.data.engagedCompletionRate, chartData.SSM_same.dates) * 100).toFixed(2) ;
$('#chart--engagedC .chart-single__value').text(thisEngagedC);

// ENGAGEMENT RATE

var thisErAv = (average(chartData.SSM_same.data.engagementRate, chartData.SSM_same.dates) * 100).toFixed(2) ;
$('#chart--erAv .chart-single__value').text(thisErAv);



// ** ENGAGEMENT RATE OVER TIME  ** //

Chart.er = {};
Chart.er.target = "chart--erTime";
Chart.er.data = [];

Chart.er.data[0] = {
  name: chartData.SSM_same.name.trunc(10),
  x: chartData.campaign.dateList,
  y: chartData.SSM_same.data.engagementRate,
  type: 'scatter',
  fill: 'tozeroy',
  mode: 'line',
  line: {
    color: 'rgb(255, 0, 0, 0.5)',
    width: 0
  }
};

Chart.er.layout = {
  showlegend: false,
  xaxis: {
    type: 'date',
    title: 'Date'
  },
  yaxis: {
    title: 'Engagement Rate'
  },
  // title: 'Engagement Rate'
};

Plotly.newPlot(Chart.er.target, Chart.er.data, Chart.er.layout, {
  displayModeBar: false
});

// ** CTR OVER TIME ** //

Chart.ctrTime = {};
Chart.ctrTime.target = "chart--ctrTime";
Chart.ctrTime.data = [];

Chart.ctrTime.data[0] = {
  name: chartData.SSM_same.name.trunc(10),
  x: chartData.campaign.dateList,
  y: chartData.SSM_same.data.clickRate,
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
    title: 'Clickthrough Rate'
  },
  // title: 'CTR'
};

Plotly.newPlot(Chart.ctrTime.target, Chart.ctrTime.data, Chart.ctrTime.layout, {
  displayModeBar: false
});

// ** COMPLETIONS OVER TIME  ** //

Chart.completionsTime = {};
Chart.completionsTime.target = "chart--completionsTime";
Chart.completionsTime.data = [];

Chart.completionsTime.data[0] = {
  name: chartData.SSM_same.name.trunc(10),
  x: chartData.campaign.dateList,
  y: chartData.SSM_same.data.engagedCompletionRate,
  type: 'scatter',
  fill: 'tozeroy',
  mode: 'line',
  line: {
    color: 'rgb(255, 0, 0, 0.5)',
    width: 0
  }
};

Chart.completionsTime.data[1] = {
  name: chartData.SSM_same.name.trunc(10),
  x: chartData.campaign.dateList,
  y: chartData.SSM_same.data.passiveCompletionRate,
  type: 'scatter',
  fill: 'tozeroy',
  mode: 'line',
  line: {
    // color: 'rgb(255, 0, 0, 0.5)',
    width: 0
  }
};

Chart.completionsTime.layout = {
  showlegend: false,
  xaxis: {
    type: 'date',
    title: 'Date'
  },
  yaxis: {
    title: 'Clickthrough Rate'
  },
  // title: 'CTR'
};

Plotly.newPlot(Chart.completionsTime.target, Chart.completionsTime.data, Chart.completionsTime.layout, {
  displayModeBar: false
});


// COMPLETION HEAT

Chart.ecHeat = {};
Chart.ecHeat.target = "chart--ecHeat";
Chart.ecHeat.data = [];



var avVid0 = average(chartData.SSM_same.data.video.vid0, chartData.SSM_same.dates);
var avVid25 = average(chartData.SSM_same.data.video.vid25, chartData.SSM_same.dates);
var avVid50 = average(chartData.SSM_same.data.video.vid50, chartData.SSM_same.dates);
var avVid75 = average(chartData.SSM_same.data.video.vid75, chartData.SSM_same.dates);
var avVid100 = average(chartData.SSM_same.data.video.vid100, chartData.SSM_same.dates);

console.log(avVid0, avVid25, avVid50, avVid75, avVid100);

var colorscaleValue = [
  [0, 'grey'],
  [1, 'red']
];

Chart.ecHeat.data = [
  {
    z: [[avVid0, avVid25, avVid50, avVid75, avVid100]],
    x: ['0%', '25%', '50%', '75%', '100%'],
    y: ['Video Completions'],
    type: 'heatmap',
    colorscale: colorscaleValue
  }
];

Plotly.newPlot(Chart.ecHeat.target, Chart.ecHeat.data);

// resize charts

Object.keys(Chart).forEach(function(chart, index) {
  if(typeof Chart[chart].target != 'undefined'){
    sizeChart(Chart[chart]);
  }
});


$(window).on('resize', function() {
  Object.keys(Chart).forEach(function(chart, index) {
    if(typeof Chart[chart].target != 'undefined'){
      sizeChart(Chart[chart]);
    }
  });
});
