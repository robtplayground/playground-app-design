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
  execImpsAgg: {
    data: [],
    layout: {
      xaxis: {
        type: 'date',
        title: 'Date'
      },
      yaxis: {
        title: 'Impressions'
      },
      title: 'Campaign Imps'
    }
  },
  viewability: {
    data: [],
    layout: {}
  }
};


Object.keys(chartData).forEach(function(key, index) {
  if (key === 'campaign' | key === 'iab' | key === 'superSkin') {
    return;
  } else {
    var placement = chartData[key];
    // -3 so as not to put in the 3 useless indexes
    Chart.execImpsAgg.data[index - 3] = {
      name: placement.name,
      x: chartData.campaign.dateList,
      y: placement.data.execImpsAgg,
      type: 'scatter',
      fill: 'tozeroy'
    }
  }
});

// console.log(Chart.execImpsAgg.data[1].x);

Plotly.newPlot('imps-chart', Chart.execImpsAgg.data, Chart.execImpsAgg.layout, {
  displayModeBar: false
});

// relayout to only show 1 July - 4 July

Plotly.relayout('imps-chart', 'xaxis.range', [new Date(2017, 6, 1).getTime(), new Date(2017, 6, 4).getTime()]);

// relayout to only show from start of campaign to today!

Plotly.relayout('imps-chart', 'xaxis.range', [new Date(2017, 6, 1).getTime(), new Date().getTime()]);

var viewTarget = 'viewability-chart';

var ss2_viewb_Avg = average(chartData.SS2Pre.data.viewability, chartData.SS2Pre.dates);

var data = [{
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

var viewLayout = {
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
  width: $('#' + viewTarget).width(),
  height: $('#' + viewTarget).height(),
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

console.log(viewLayout.width);

Plotly.newPlot(viewTarget, data, viewLayout, {
  displayModeBar: false
});
$(window).on('resize', function() {
  viewLayout.width = $('#' + viewTarget).width();
  viewLayout.height = $('#' + viewTarget).height();
  console.log('viewLayout', viewLayout.width, viewLayout.height);
  Plotly.relayout(viewTarget, viewLayout);
});
