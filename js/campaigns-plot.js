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
  SS1Prog: {}
};

function sizeChart(chart){
  var parentWidth = $('#' + chart.target).width();
  var parentHeight = $('#' + chart.target).height();

  console.log(chart.target, parentWidth, parentHeight);

  chart.layout.width = parentWidth;
  chart.layout.height = parentHeight;

  Plotly.relayout(chart.target, chart.layout);
}

// ** CAMPAIGN PROGRESS

var currentDur = moment(new Date()).diff(moment(chartData.campaign.dates.start), 'days');
var campDur = chartData.campaign.duration;
var SS1ProgPercent = currentDur / campDur;

console.log('SS1ProgPercent', SS1ProgPercent);

Chart.SS1Prog.target = 'chart--SS1Prog';
Chart.SS1Prog.data = [
  {
    values: [90, 270],
    showlegend: false,
    hoverinfo: 'none',
    textpostion: ['none', 'none'],
    marker: {
      colors: ['rgba(255,0,0,0)', '#dadada']
    },
    sort: true,
    rotation: 225,
    hole: .8,
    type: 'pie'
  },
  {
    values: [90, (270 * SS1ProgPercent)],
    showlegend: false,
    hoverinfo: 'none',
    textposition: ['none', 'none'],
    marker: {
      colors: ['rgba(255,0,0,0)', '#0078d8']
    },
    sort: true,
    rotation: 225,
    hole: .83,
    type: 'pie'
  },
];

// console.log('chart date', moment(chartData.campaign.dates.start).format('ddd D MMM'));

// console.log(rem);

Chart.SS1Prog.layout = {
  autosize: false,
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0,
    pad: 10
  },
  annotations: [{
    font: {
      size: 12,
      color: 'grey'
    },
    showarrow: false,
      text: '%',
    x: .64,
    y: .6,
    yanchor: 'left'
  },
  {
    font: {
      size: 18,
      color: 'grey'
    },
    showarrow: false,
    text: Math.round(SS1ProgPercent * 100),
    x: .62,
    xanchor: 'right',
    y: .52,
    yanchor: 'center'
  }],
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent'
};

Plotly.newPlot(Chart.SS1Prog.target, Chart.SS1Prog.data, Chart.SS1Prog.layout, {
  displayModeBar: false
});


sizeChart(Chart.SS1Prog);


$(window).on('resize', function() {
  sizeChart(Chart.SS1Prog);
});
