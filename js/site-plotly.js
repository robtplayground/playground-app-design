function total(array, dates) {
  var rangeTotal = 0;
  var arrayR = arrayRange(dates);
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


var ss1Imps = {
  x: campaign.dateList(),
  y: SS1.data.execImpsAgg(),
  type: 'scatter',
  fill: 'tozeroy'
};

var ss2Imps = {
  x: campaign.dateList(),
  y: SS2.data.execImpsAgg(),
  type: 'scatter',
  fill: 'tozeroy'
};

var impsData = [ss1Imps, ss2Imps];

Plotly.newPlot('imps-chart', impsData, {}, {displayModeBar: false});

var ss2_viewb_Avg = average(SS2.data.viewability(), SS2.dates);

var data = [{
  values: [ss2_viewb_Avg, 100 - ss2_viewb_Avg],
  labels: ['Viewability', 'remainder'],
  // domain: {
  //   x: [0, .8]
  // },
  hoverinfo: 'label+percent+name',
  sort: false,
  hole: .8,
  type: 'pie'
}];

var layout = {
  title: 'Viewability: ' + SS2.name,
  annotations: [{
    font: {
      size: 20
    },
    showarrow: false,
    text: 'GHG',
    x: 0.17,
    y: 0.5
  }],
  height: 600,
  width: 600
};

Plotly.newPlot('viewability-chart', data, layout, {displayModeBar: false});
