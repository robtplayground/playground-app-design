
function total(array, dates) {
  var rangeTotal = 0;
  var arrayR = arrayRange(dates, chartData.campaign);
  // only add totals of array within this Range
  for (var i = arrayR.startPos; i < arrayR.endPos; i++){
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
    layout: {}
  },
  viewability: {
    data: [],
    layout: {}
  }
};

console.log(chartData);

Object.keys(chartData).forEach(function(key, index){
  if(key === 'campaign'){
    return;
  }else{
    var placement = chartData[key];
    Chart.execImpsAgg.data[index - 1] = {
      name: placement.name,
      x: chartData.campaign.dateList,
      y: placement.data.execImpsAgg,
      type: 'scatter',
      fill: 'tozeroy'
    }
  }
});

Plotly.newPlot('imps-chart', Chart.execImpsAgg.data, Chart.execImpsAgg.layout, {displayModeBar: false});

var viewTarget = 'viewability-chart';

var ss2_viewb_Avg = average(chartData.SS2Pre.data.viewability, chartData.SS2Pre.dates);

var data = [{
  values: [ss2_viewb_Avg, 100 - ss2_viewb_Avg],
  labels: ['Viewability', 'remainder'],
  hoverinfo: 'label+percent+name',
  sort: false,
  hole: .8,
  type: 'pie'
}];

var viewLayout = {
  // title: 'Viewability: ' + SS2Pre.name,
  autosize: true,
  showlegend: false,
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
  margin:{
    l: 0,
    r:0,
    b:0,
    t:0,
    pad:200
  },
  paper_bgcolor: 'white',
  plot_bgcolor: 'grey'
};

console.log(viewLayout.width);

Plotly.newPlot(viewTarget, data, viewLayout, {displayModeBar: false});
$(window).on('resize', function(){
  viewLayout.width = $('#' + viewTarget).width();
  viewLayout.height = $('#' + viewTarget).height();
  console.log('viewLayout', viewLayout.width, viewLayout.height);
  Plotly.relayout(viewTarget, viewLayout);
});
// Plotly.newPlot('viewability-chart2', data, layout, {displayModeBar: false});
