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

function prepData(xName, xArray, yName, yArray) {
  var data = [];
  for (i = 0; i < xArray.length; i++) {
    var obj = {};
    obj[xName] = xArray[i];
    obj[yName] = yArray[i];
    data.push(obj);
  }
  return data;
}

// ** EXECUTED IMPS  ** //



AmCharts.ready(function() {

  var c1 = Chart.execImpsAgg = new AmCharts.AmSerialChart();
  // c1.dataProvider = generateChartData();
  c1.dataProvider = prepData('date', chartData.campaign.dateList, 'imps', chartData.TTM_same.data.execImpsAgg);
  console.log(c1.dataProvider);
  c1.addListener("dataUpdated", zoomChart());

  // this method is called when chart is first inited as we listen for "dataUpdated" event


  function zoomChart() {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    c1.zoomToIndexes(c1.dataProvider.length - 40, c1.dataProvider.length - 1);
  }

  var categoryAxis = c1.categoryAxis;
  categoryAxis.parseDates = true; // in order char to understand dates, we should set parseDates to true
  // categoryAxis.minPeriod = "dd";
  categoryAxis.axisColor = "#DADADA";

  // Value
  var valueAxis = new AmCharts.ValueAxis();
  valueAxis.gridAlpha = 0.07;
  valueAxis.title = "Executed Impressions";
  c1.addValueAxis(valueAxis);

  // GRAPH
  var graph = new AmCharts.AmGraph();
  graph.type = "line"; // try to change it to "column"
  graph.title = "red line";
  graph.valueField = "imps";
  graph.lineAlpha = 1;
  graph.lineColor = "#d1cf2a";
  graph.fillAlphas = 0.3; // setting fillAlphas to > 0 value makes it area graph
  c1.addGraph(graph);

  // CURSOR
  // var chartCursor = new AmCharts.ChartCursor();
  // chartCursor.cursorPosition = "mouse";
  // chartCursor.categoryBalloonDateFormat = "JJ:NN, DD MMMM";
  // c1.addChartCursor(chartCursor);

  // SCROLLBAR
  var chartScrollbar = new AmCharts.ChartScrollbar();

  c1.addChartScrollbar(chartScrollbar);

  console.log('c1', c1.dataProvider);

  // WRITE
  c1.write("chart--execImpsAgg");

  // function generateChartData() {
  //
  //   var chartData = [];
  //   // current date
  //   var firstDate = new Date();
  //   // now set 1000 minutes back
  //   firstDate.setMinutes(firstDate.getDate() - 1000);
  //
  //   // and generate 1000 data items
  //   for (var i = 0; i < 1000; i++) {
  //     var newDate = new Date(firstDate);
  //     // each time we add one minute
  //     newDate.setMinutes(newDate.getMinutes() + i);
  //     // some random number
  //     var visits = Math.round(Math.random() * 40) + 10;
  //     // add data item to the array
  //     chartData.push({
  //       date: newDate,
  //       visits: visits
  //     });
  //   }
  //   return chartData;
  // }


  // ** VIEWABILITY AVERAGE CHART

  Chart.vAv = {};

  var ss2_viewb_Avg = average(chartData.TTM_same.data.viewability, chartData.TTM_same.dates);

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
    annotations: [{
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


}); // end AmCharts.ready

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
