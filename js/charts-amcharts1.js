const gopro = campaigns[0];

function prepData(categoryObj, valuesArray) {
  var data = [];
  for (i = 0; i < categoryObj.values.length; i++) {
    var dataGroup = {};
    dataGroup[categoryObj.name] = categoryObj.values[i];
    valuesArray.forEach(function(metric) {
      dataGroup[metric.name] = metric.values[i];
    });
    data.push(dataGroup);
  }
  return data;
}

function getColor(placement){
  var crtv = creatives.find(cr => cr.id === placement.creative);
  return crtv.format.color;
}

function getFormat(placement){
  var crtv = creatives.find(cr => cr.id === placement.creative);
  return crtv.format;
}

var dataIndex = 0;

// ** CAMPAIGN PROGRESS

var currentDur = moment(new Date()).diff(moment(gopro.dates.start), 'days');
var campDur = duration(gopro.dates);
var cProgPercent = currentDur / campDur;

var chart__cProg = AmCharts.makeChart('chart--cProg', {
  "type": "gauge",
  "axes": [{
    backgroundColor: "#000",
    labelsEnabled: false,
    "axisThickness": 0,
    "axisAlpha": 0,
    "tickAlpha": 0,
    "startValue": 0,
    "endValue": 100,
    "bands": [{
      "color": "#e91e63",
      "startValue": 0,
      "endValue": cProgPercent * 100,
      "radius": "100%",
      "innerRadius": "85%"
    }, {
      "color": "#dadada",
      "startValue": cProgPercent * 100,
      "endValue": 100,
      "radius": "100%",
      "innerRadius": "85%",
      "balloonText": "90%"
    }],
  }],
  "allLabels": [{
    "text": moment(gopro.dates.start).format('ddd D MMMM'),
    "x": "40%",
    "y": "80%",
    "size": 10,
    "bold": true,
    "color": "#fff",
    "align": "right"
  }, {
    "text": moment(gopro.dates.end).format('ddd D MMMM'),
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
});
