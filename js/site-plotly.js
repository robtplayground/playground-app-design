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
  console.log(rangeTotal);
  return rangeTotal / duration(dates);
}

var Chart = {
  execImpsAgg:{},
  vAv: {},
  ativ:{},
  impsPercent:{},
  er: {},
  erAv: {},
  passiveC: {},
  engagedC: {},
  ctr: {},
  ctd: {},
  passiveHeat: {},
  engagedHeat: {}
};

function sizeChart(chart){
  var parentWidth = $('#' + chart.target).width();
  var parentHeight = $('#' + chart.target).height();

  console.log(chart.target, parentWidth, parentHeight);

  chart.layout.width = parentWidth;
  chart.layout.height = parentHeight;

  Plotly.relayout(chart.target, chart.layout);
}

// ** EXECUTED IMPS  ** //

Chart.execImpsAgg.target = "chart--execImpsAgg";
Chart.execImpsAgg.data = [];

Object.keys(chartData).forEach(function(key, index) {
  if (key === 'campaign' | key === 'iab' | key === 'superSkin') {
    return;
  } else {
    var placement = chartData[key];
    // -3 so as not to put in the 3 useless indexes
    Chart.execImpsAgg.data[index - 3] = {
      name: placement.name.trunc(10),
      x: chartData.campaign.dateList,
      y: placement.data.execImpsAgg,
      type: 'scatter',
      fill: 'tozeroy'
    }
  }
});

Chart.execImpsAgg.layout = {
  xaxis: {
    type: 'date',
    title: 'Date'
  },
  yaxis: {
    title: 'Impressions'
  },
  title: 'Campaign Imps'
};

Plotly.newPlot(Chart.execImpsAgg.target, Chart.execImpsAgg.data, Chart.execImpsAgg.layout, {
  displayModeBar: false
});

// relayout to only show 1 July - 4 July

Plotly.relayout(Chart.execImpsAgg.target, 'xaxis.range', [new Date(2017, 6, 1).getTime(), new Date(2017, 6, 4).getTime()]);

// relayout to only show from start of campaign to today!

Plotly.relayout(Chart.execImpsAgg.target, 'xaxis.range', [new Date(2017, 6, 1).getTime(), new Date().getTime()]);

// ** VIEWABILITY AVERAGE CHART

var ss2_viewb_Avg = average(chartData.SS2Pre.data.viewability, chartData.SS2Pre.dates);

Chart.vAv.target = 'chart--vAv';
Chart.vAv.data = [{
    values: [ss2_viewb_Avg, 100 - ss2_viewb_Avg],
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
    labels: ['', 'IAB Benchmark', ''],
    showlegend: false,
    text: ['', (chartData.iab.benchmarks.viewability + '%'), ''],
    hoverinfo: 'none',
    textinfo: 'label+text',
    textposition: ['none', 'outside', 'none'],
    marker: {
      colors: ['rgba(255,0,0,0)', 'rgb(0,0, 255, 1)', 'rgba(0,255,0,0)']
    },
    sort: false,
    direction: 'clockwise',
    hole: .2,
    pull: .1,
    type: 'pie'
  },
];

Chart.vAv.layout = {
  // title: 'Viewability: ' + SS2Pre.name,
  autosize: true,
  annotations: [{
    font: {
      size: 20
    },
    showarrow: false,
    text: 'GHG',
    x: .8,
    y: .8
  }],
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0,
    pad: 200
  },
  paper_bgcolor: 'white',
  plot_bgcolor: 'grey'
};

Plotly.newPlot(Chart.vAv.target, Chart.vAv.data, Chart.vAv.layout, {
  displayModeBar: false
});

// Set size for charts
sizeChart(Chart.execImpsAgg);
sizeChart(Chart.vAv);


$(window).on('resize', function() {
  sizeChart(Chart.execImpsAgg);
  sizeChart(Chart.vAv);
});
