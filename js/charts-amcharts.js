const gopro = campaigns[0];
const goproDates = listDates(gopro.dates); // array of dates
const gopro_pments = placements.filter(pl => pl.campaign === 'cp_gopro');

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

// ** EXECUTED IMPS  ** //

var impsData = {};
gopro_pments.forEach(function(pl) {
  // for every date
  var colorsE = [];
  var colorsV = [];
  while (colorsE.length < goproDates.length) {colorsE = colorsE.concat([getColor(pl)])};
  while (colorsV.length < goproDates.length) {colorsV = colorsV.concat(['grey'])};

  impsData[pl.id] = prepData({
    name: 'date',
    values: goproDates
  }, [{
      name: 'execImpsAgg',
      values: pl.data.execImpsAgg
    },
    {
      name: 'viewImpsAgg',
      values: pl.data.viewImpsAgg,
      color: 'grey'
    },
    {
      name: 'colorE',
      values: colorsE
    },
    {
      name: 'colorV',
      values: colorsV
    }
  ]);
});

console.log('IMPS DATA', impsData);

// console.log(impsData);

// get first object in impsData and convert to zeroed array.
var initData = impsData[(Object.keys(impsData)[0])];
impsData.init = $.extend(true, [], initData);
impsData.init.forEach(function(dateEntry) {
  dateEntry.execImpsAgg = 0;
  dateEntry.viewImpsAgg = 0;
});

// SERIAL CHART
var chart__ImpsTime = AmCharts.makeChart("chart--execImpsAgg", {
  type: "serial",
  dataProvider: impsData.init, // start chart with zeroes
  categoryField: "date",
  startDuration: 0,
  addClassNames: true,
  marginRight: 40,
  categoryAxis: {
    parseDates: true, // in order char to understand dates, we should set parseDates to true
    gridAlpha: 0.07,
    axisColor: "#DADADA",
  },
  valueAxes: [{
    gridAlpha: 0.07,
    title: "Executed Impressions",
    minimum: 0,
    maximum: 300000
  }],
  graphs: [{
    type: "line", // try to change it to "column"
    title: "red line",
    valueField: "execImpsAgg",
    lineAlpha: 1,
    lineColorField: "colorE",
    fillColorsField: "colorE",
    fillAlphas: 0.3
  }, {
    type: "line", // try to change it to "column"
    title: "red line",
    valueField: "viewImpsAgg",
    lineAlpha: 1,
    lineColorField: "colorV",
    fillColorsField: "colorV",
    fillAlphas: 0.3
  }],
  chartCursor: {
    cursorPosition: "mouse",
    categoryBalloonDateFormat: "JJ:NN, DD MMMM"
  },
  chartScrollbar: {},
  listeners: [{
    event: "rendered",
    method: function(e){
      e.chart.animateData(impsData.SSM_same, {
        duration: 1000
      })
    }
  }]
});


$('.update-charts').click(function() {

});


// ** VIEWABILITY AVERAGE CHART

var vAvData = {};
gopro_pments.forEach(function(pl) {
  // console.log('placements', pl.dates);
  var viewb_Avg = Math.round(average(pl.data.viewability, pl.dates, gopro));

  // note: label is crucial for animation
  vAvData[pl.id] = [{
    label: 'viewability',
    value: viewb_Avg,
    color: getColor(pl)
  }, {
    label: 'remainder',
    value: 100 - viewb_Avg,
    color: "#dadada"
  }];
});

vAvData.init = [{
  label: 'viewability',
  value: 0,
  color: "#FFF"
}, {
  label: 'remainder',
  value: 100,
  color: "#dadada"
}];

// console.log('vAvData', JSON.stringify(vAvData));

var chart__vAv = AmCharts.makeChart('chart--vAv', {
  type: "pie",
  dataProvider: vAvData.init,
  valueField: "value",
  titleField: "label",
  colorField: "color",
  // labelFunction: labelFunction,
  labelsEnabled: false,
  // labelRadius: "-50%",
  innerRadius: "70%",
  allLabels: [{
    text: vAvData.init.value,
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
  balloonText: "",
  listeners: [{
    event: "rendered",
    method: function(e){
      e.chart.allLabels[0].text = vAvData.SSM_same[0].value;
      e.chart.animateData( vAvData.SSM_same,{
        duration: 3000
      });
    }
  }]
});

// VIEWABILITY BENCHMARKS OVERLAY

var vAvBench = {};

gopro_pments.forEach(function(pl) {
  var format = creatives.find(function(cr){return cr.id === pl.creative}).format;
  var formatViewb = format.bm.viewability;
  var iabBench = fm.iab.bm.viewability;
  vAvBench[pl.id] = {};
  vAvBench[pl.id].formatViewb = formatViewb;
  vAvBench[pl.id].iabBench = iabBench;
  vAvBench[pl.id].data = [{
    label: "space1",
    value: iabBench,
    color: "transparent"
  },{
    label: "IAB",
    // description: "IAB: " + iabBench + "%",
    value: 1,
    color: "red"
  },{
    label: "space2",
    value: formatViewb - iabBench - 1,
    color: "transparent"
  },{
    label: "format",
    value: 1,
    color: "#e91e63"
  },{
    label: "space3",
    value: 100 - 1 - formatViewb,
    color: "transparent"
  }];
});

vAvBench.init = {
  formatViewb: 0,
  iabBench: 0,
  data :[{
    label: "space1",
    value: 0,
    color: "transparent"
  },{
    label: "IAB",
    description: "IAB",
    value: 0,
    color: "red"
  },{
    label: "space2",
    value: 0,
    color: "transparent"
  },{
    label: "format",
    value: 0,
    color: "#e91e63"
  },{
    label: "space3",
    value: 100,
    color: "transparent"
  }]
};

// console.log('vAvBench',vAvBench);

var chart__vAvBenchmarks = AmCharts.makeChart('chart--vAvBenchmarks', {
  type: "pie",
  theme: "light",
  dataProvider: vAvBench.init.data,
  valueField: "value",
  titleField: "label",
  labelsEnabled: false,
  colorField: "color",
  alphaField: "alpha",
  innerRadius: "70%",
  startDuration: 0,
  addClassNames: true,
  balloonText: "",
  listeners: [{
    event: "rendered",
    method: function(e){
      $('#chart--vAv_pgBench').text(vAvBench.SSM_same.formatViewb + '%');
      $('#chart--vAv_iabBench').text(vAvBench.SSM_same.iabBench + '%');
      e.chart.animateData( vAvBench.SSM_same.data,{
        duration: 3000
      });
    }
  }]
});

// IMPS DELIVERED

var impsDelData = {};
var impsDelBenchData = {};
gopro_pments.forEach(function(pl) {
  var currentDur = moment(new Date()).diff(moment(pl.dates.start), 'days');
  var impsDel = pl.data.execImpsAgg[currentDur - 1];
  var impsBooked = pl.bookedImps;
  var impsBookedDaily = impsBooked / duration(pl.dates);
  var percentDel = impsDel / impsBooked * 100;
  // note: label is crucial for animation

  // MAIN ARC
  impsDelData[pl.id] = [{
    label: 'progress',
    value: percentDel,
    impsDel: impsDel,
    color: getColor(pl)
  }, {
    label: 'remainder',
    value: 100 - percentDel,
    color: "#dadada"
  }];
  // BENCHMARKS
  var impsDelBench = Math.round(((impsBookedDaily * 0.9 * currentDur) / impsBooked) * 100);
  // console.log(impsDelBench);

  impsDelBenchData[pl.id] = [{
      label: "1",
      value: impsDelBench,
      color: "transparent",
    },{
        label: "2",
      value: 1,
      label: "Expected: " + impsDelBench + "%",
      color: "red"
    },{
        label: "3",
      value: 100 - (impsDelBench + 1),
      color: "transparent"
    }];
});

// console.log('impsDelData', impsDelData);


// get first object in impsData and convert to zeroed array.
impsDelData.init = [{
  label: 'progress',
  value: 0,
  impsDel: 0,
  color: "#FFF"
}, {
  label: 'remainder',
  value: 100,
  color: "#dadada"
}];

impsDelBenchData.init = [{
    label: "1",
    value: 0,
    color: "transparent"
  },{
    label: "2",
    value: 0,
    color: "red"
  },{
      label: "3",
    value: 100,
    color: "transparent"
  }];


var chart__impsDel = AmCharts.makeChart('chart--impsDel', {
  type: "pie",
  theme: "light",
  dataProvider: impsDelData.init,
  valueField: "value",
  titleField: "label",
  colorField: "color",
  // labelFunction: labelFunction,
  labelsEnabled: false,
  // labelRadius: "-50%",
  alphaField: "alpha",
  innerRadius: "70%",
  startDuration: 0,
  allLabels: [{
    text: Math.round(impsDelBenchData.init[0].percentDel),
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
  }, {
    text: impsDelData.init[0].impsDel.toLocaleString(),
    align: "center",
    size: 12,
    bold: false,
    x: '0%',
    y: '55%'
  }],
  listeners: [{
    event: "rendered",
    method: function(e){
      e.chart.allLabels[0].text = Math.round(impsDelData.SSM_same[0].value);
      e.chart.allLabels[2].text = impsDelData.SSM_same[0].impsDel.toLocaleString();
      e.chart.animateData( impsDelData.SSM_same,{
        duration: 3000
      });
    }
  }]
});

$('.chart--impsDel .chart__legend__left span').text('Expected: 0%');

var chart__impsDelBench = AmCharts.makeChart('chart--impsDelBench', {
  type: "pie",
  theme: "light",
  dataProvider: impsDelBenchData.init,
  valueField: "value",
  titleField: "label",
  labelsEnabled: false,
  // labelFunction: labelFunction,
  // labelRadius: "-5%",
  colorField: "color",
  alphaField: "alpha",
  innerRadius: "70%",
  startDuration: 0,
  addClassNames: true,
  listeners: [{
    event: "rendered",
    method: function(e){
      $('.chart--impsDel .chart__legend__left span').text('Expected: ' + impsDelBenchData.SSM_same[0].value + '%');
      e.chart.animateData( impsDelBenchData.SSM_same,{
        duration: 3000
      });
    }
  }]
});


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
      "color": "red",
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

function totalsChart(containerID, initValue, initPG, initIAB) {
  this.containerID = containerID;
  // countup(target, startVal, endVal, decimals, duration, {options})
  this.value = new CountUp(containerID + "_value", 0, initValue, 1, 2, {
    useEasing: false,
    useGrouping: true,
    separator: ',',
    decimal: '.'
  });
  this.pgBench = new CountUp(containerID + "_pgBench", 0, initPG, 1, 2, {
    useEasing: false,
    useGrouping: true,
    separator: ',',
    decimal: '.'
  });
  this.iabBench = new CountUp(containerID + "_iabBench", 0, initIAB, 1, 2, {
    useEasing: false,
    useGrouping: true,
    separator: ',',
    decimal: '.'
  });
  this.updateCount = function(data) {
    // countUp methods update()
    this.value.update(data.value);
    this.pgBench.update(data.pgBench);
    this.iabBench.update(data.iabBench);
  };
  this.startCount = function() {
    // countUp method start()
    this.value.start(this.callback);
    this.pgBench.start(this.callback);
    this.iabBench.start(this.callback);
  };
  this.callback = function(){
    console.log('add Plus or Minus signs + formatting?', this.value);
  };
}


// ATIV

var ativAvData = {};

gopro_pments.forEach(function(pl) {

  var plFormat = getFormat(pl);

  ativAvData[pl.id] = {
    value: average(pl.data.ativ, pl.dates, gopro).toFixed(1),
    color: format.color,
    pgBench: plFormat.bm.ativ,
    iabBench: fm.iab.bm.ativ
  };

});

ativAvData.init = {
  value: 0,
  color: '#000000',
  pgBench: 0,
  iabBench: 0
};

console.log(ativAvData);

var chart__ativAv = new totalsChart('chart--ativAv', ativAvData.init.value, ativAvData.init.pgBench, ativAvData.init.iabBench);

chart__ativAv.updateCount(ativAvData.SSM_same);

// ENGAGED COMPLETIONS
var engagedCData = {};

gopro_pments.forEach(function(pl) {

  var plFormat = getFormat(pl);

  engagedCData[pl.id] = {
    value: average(pl.data.engagedCompletionRate, pl.dates, gopro).toFixed(1),
    color: format.color,
    pgBench: plFormat.bm.engagedCompletionRate,
    iabBench: fm.iab.bm.engagedCompletionRate
  };

});

engagedCData.init = {
  value: 0,
  color: '#000000',
  pgBench: 0,
  iabBench: 0
};

var chart__engagedC = new totalsChart('chart--engagedC', engagedCData.init.value, engagedCData.init.pgBench, engagedCData.init.iabBench);

chart__engagedC.updateCount(engagedCData.SSM_same);

// ENGAGEMENT RATE

var erAvData = {};

gopro_pments.forEach(function(pl) {

  var plFormat = getFormat(pl);

  erAvData[pl.id] = {
    value: average(pl.data.engagementRate, pl.dates, gopro).toFixed(1),
    color: format.color,
    pgBench: plFormat.bm.engagementRate,
    iabBench: fm.iab.bm.engagementRate
  };

});

erAvData.init = {
  value: 0,
  color: '#000000',
  pgBench: 0,
  iabBench: 0
};

var chart__erAv = new totalsChart('chart--erAv', erAvData.init.value, erAvData.init.pgBench, erAvData.init.iabBench);

chart__erAv.updateCount(erAvData.SSM_same);



// ** ENGAGEMENT RATE OVER TIME  ** //


// SERIAL CHART

var engData = {};
gopro_pments.forEach(function(pl) {
  var colorsE = [];
  var colorsC = [];
  while (colorsE.length < goproDates.length) {colorsE = colorsE.concat([getColor(pl)])};
  while (colorsC.length < goproDates.length) {colorsC = colorsC.concat(['red'])};

  engData[pl.id] = prepData(
    {
      name: 'date',
      values: listDates(gopro.dates)
    }, [{
      name: 'engagementRate',
      values: placements[0].data.engagementRate
    }, {
      name: 'clickthroughRate',
      values: placements[0].data.clickRate
    },{
      name: 'colorE',
      values: colorsE
    },
    {
      name: 'colorC',
      values: colorsC
    }
  ]);
});

// get first object in impsData and convert to zeroed array.
engData.init = engData[(Object.keys(engData)[0])];
engData.init = $.extend(true, [], engData.init);
engData.init.forEach(function(dateEntry) {
  dateEntry.engagementRate = 0;
  dateEntry.clickthroughRate = 0;
  dateEntry.colorE = "transparent";
  dateEntry.colorC = "transparent";
});



var chart__erTime = AmCharts.makeChart("chart--erTime", {
  type: 'serial',
  dataProvider: engData.init,
  categoryField: "date",
  startDuration: 0,
  addClassNames: true,
  marginRight: 40,
  categoryAxis: {
    parseDates: true, // in order char to understand dates, we should set parseDates to true
    gridAlpha: 0.07,
    axisColor: "#DADADA"
  },
  valueAxes: [{
    gridAlpha: 0.07,
    title: "Engagement",
    minimum: 0,
    maximum: 2
  }],
  graphs: [{
    type: "line", // try to change it to "column"
    title: "Engagement Rate",
    valueField: "engagementRate",
    lineAlpha: 1,
    // colorsField: "colorE",
    lineColorField: "colorE",
    fillColorsField: "colorE",
    fillAlphas: 0.3
  }, {
    type: "line", // try to change it to "column"
    title: "Clickthrough Rate",
    valueField: "clickthroughRate",
    lineAlpha: 1,
    // colorsField: "colorC",
    lineColorField: "colorC",
    fillColorsField: "colorC",
    fillAlphas: 0.3
  }],
  chartScrollbar: {},
  chartCursor: {
    cursorPosition: "mouse",
    categoryBalloonDateFormat: "JJ:NN, DD MMMM"
  },
  legend: {
    // "useGraphSettings": true,
    useMarkerColorForLabels: true
  },
  listeners: [{
    event: "rendered",
    method: function(e){
      e.chart.animateData(engData.SSM_same, {
        duration: 1000
      })
    }
  }]
});



// COMPLETION HEAT

var ecRatesData = {};
gopro_pments.forEach(function(pl) {

  var color1 = hexToRgb("#0078d8");
  var color2 = hexToRgb("#dadada");

  // get average for placement

  var avVid0 = average(pl.data.video.vid0, pl.dates, gopro);
  var avVid25 = average(pl.data.video.vid25, pl.dates, gopro);
  var avVid50 = average(pl.data.video.vid50, pl.dates, gopro);
  var avVid75 = average(pl.data.video.vid75, pl.dates, gopro);
  var avVid100 = average(pl.data.video.vid100, pl.dates, gopro);

  var allRates = [avVid0, avVid25, avVid50, avVid75, avVid100];

  // create array of colors

  ecRatesData[pl.id] = [
    {
      label: "25% completion",
      value: avVid25,
    },
    {
      label: "50% completion",
      value: avVid50
    },
    {
      label: "75% completion",
      value: avVid75
    },
    {
      label: "100% completion",
      value: avVid100
    },
  ];

  // calculate colors based on values

  var highest = Math.max.apply(null, allRates);
  var lowest = Math.min.apply(null, allRates);

  ecRatesData[pl.id].forEach(function(obj) {
    var colorPos = (obj.value - lowest) / (highest - lowest);
    obj.color = 'rgb(' + pickHex(color1, color2, colorPos) + ')';
    obj.stackHeight = 1;
  });

});

ecRatesData.init = [
  {
    label: "25% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
  {
    label: "50% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
  {
    label: "75% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
  {
    label: "100% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
];

console.log('ecRatesData', ecRatesData);

var chart9 = AmCharts.makeChart("chart--engagedCHeat", {
  type: 'serial',
  dataProvider: ecRatesData.init,
  categoryField: "label",
  startDuration: 0,
  addClassNames: true,
  categoryAxis: {
    gridAlpha: 0,
    axisAlpha: 0
  },
  valueAxes: [{
    stackType: "regular",
    title: " ",
    gridAlpha: 0,
    axisAlpha: 0,
    minimum: 0,
    maximum: 1,
    labelsEnabled: false
  }],
  graphs: [{
    columnWidth: 1,
    type: "column", // try to change it to "column"
    title: "Percent Completed",
    valueField: "stackHeight",
    colorField: "color",
    fillAlphas: 0.9,
    lineAlpha: 0,
    // "labelOffset": -40,
    "labelText": "Allo",
    "labelPosition": "middle",
    labelAnchor: "middle",
    "color": "#ffffff",
    labelFunction: function(item) {
      return Math.round(item.dataContext.value) + "%";
    },
    balloonText: ""
  }],
  listeners: [{
    event: "rendered",
    method: function(e){
      e.chart.animateData(ecRatesData.SSM_same, {
        duration: 1000
      })
    }
  }]
});

var ecRatesData = {};
gopro_pments.forEach(function(pl) {

  var color1 = hexToRgb(getColor(pl));
  var color2 = hexToRgb("#dadada");

  // get average for placement

  var avVid0 = average(pl.data.video.vid0, pl.dates, gopro);
  var avVid25 = average(pl.data.video.vid25, pl.dates, gopro);
  var avVid50 = average(pl.data.video.vid50, pl.dates, gopro);
  var avVid75 = average(pl.data.video.vid75, pl.dates, gopro);
  var avVid100 = average(pl.data.video.vid100, pl.dates, gopro);

  var allRates = [avVid0, avVid25, avVid50, avVid75, avVid100];

  // create array of colors

  ecRatesData[pl.id] = [
    {
      label: "25% completion",
      value: avVid25,
    },
    {
      label: "50% completion",
      value: avVid50
    },
    {
      label: "75% completion",
      value: avVid75
    },
    {
      label: "100% completion",
      value: avVid100
    },
  ];

  // calculate colors based on values

  var highest = Math.max.apply(null, allRates);
  var lowest = Math.min.apply(null, allRates);

  ecRatesData[pl.id].forEach(function(obj) {
    var colorPos = (obj.value - lowest) / (highest - lowest);
    obj.color = 'rgb(' + pickHex(color1, color2, colorPos) + ')';
    obj.stackHeight = 1;
  });

});

ecRatesData.init = [
  {
    label: "25% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
  {
    label: "50% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
  {
    label: "75% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
  {
    label: "100% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
];

console.log('ecRatesData', ecRatesData);

var chart9 = AmCharts.makeChart("chart--engagedCHeat", {
  type: 'serial',
  dataProvider: ecRatesData.init,
  categoryField: "label",
  startDuration: 0,
  addClassNames: true,
  categoryAxis: {
    gridAlpha: 0,
    axisAlpha: 0
  },
  valueAxes: [{
    stackType: "regular",
    title: " ",
    gridAlpha: 0,
    axisAlpha: 0,
    minimum: 0,
    maximum: 1,
    labelsEnabled: false
  }],
  graphs: [{
    columnWidth: 1,
    type: "column", // try to change it to "column"
    title: "Percent Completed",
    valueField: "stackHeight",
    colorField: "color",
    fillAlphas: 0.9,
    lineAlpha: 0,
    // "labelOffset": -40,
    "labelText": "Allo",
    "labelPosition": "middle",
    labelAnchor: "middle",
    "color": "#ffffff",
    labelFunction: function(item) {
      return Math.round(item.dataContext.value) + "%";
    },
    balloonText: ""
  }],
  listeners: [{
    event: "rendered",
    method: function(e){
      e.chart.animateData(ecRatesData.SSM_same, {
        duration: 1000
      })
    }
  }]
});


// ** PASSIVE COMPLETION RATE - basically a duplicate of Engaged, but I mess with the values to make it look different

var pcRatesData = {};
gopro_pments.forEach(function(pl) {

  var color1 = hexToRgb('#e91e63');
  var color2 = hexToRgb("#dadada");

  // data messed with below

  var avVid0 = average(pl.data.video.vid0, pl.dates, gopro) - 1;
  var avVid25 = average(pl.data.video.vid25, pl.dates, gopro) - 6;
  var avVid50 = average(pl.data.video.vid50, pl.dates, gopro) + 1;
  var avVid75 = average(pl.data.video.vid75, pl.dates, gopro) + 2;
  var avVid100 = average(pl.data.video.vid100, pl.dates, gopro) + 3;

  var allRates = [avVid0, avVid25, avVid50, avVid75, avVid100];

  // create array of colors

  pcRatesData[pl.id] = [
    {
      label: "25% completion",
      value: avVid25,
    },
    {
      label: "50% completion",
      value: avVid50
    },
    {
      label: "75% completion",
      value: avVid75
    },
    {
      label: "100% completion",
      value: avVid100
    },
  ];

  // calculate colors based on values

  var highest = Math.max.apply(null, allRates);
  var lowest = Math.min.apply(null, allRates);

  pcRatesData[pl.id].forEach(function(obj) {
    var colorPos = (obj.value - lowest) / (highest - lowest);
    obj.color = 'rgb(' + pickHex(color1, color2, colorPos) + ')';
    obj.stackHeight = 1;
  });

});

pcRatesData.init = [
  {
    label: "25% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
  {
    label: "50% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
  {
    label: "75% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
  {
    label: "100% completion",
    value: 0,
    color: '#ffffff',
    stackHeight: 1
  },
];

console.log('pcRatesData', pcRatesData);

var chart9 = AmCharts.makeChart("chart--passiveCHeat", {
  type: 'serial',
  dataProvider: pcRatesData.init,
  categoryField: "label",
  startDuration: 0,
  addClassNames: true,
  categoryAxis: {
    gridAlpha: 0,
    axisAlpha: 0
  },
  valueAxes: [{
    stackType: "regular",
    title: " ",
    gridAlpha: 0,
    axisAlpha: 0,
    minimum: 0,
    maximum: 1,
    labelsEnabled: false
  }],
  graphs: [{
    columnWidth: 1,
    type: "column", // try to change it to "column"
    title: "Percent Completed",
    valueField: "stackHeight",
    colorField: "color",
    fillAlphas: 0.9,
    lineAlpha: 0,
    // "labelOffset": -40,
    "labelText": "Allo",
    "labelPosition": "middle",
    labelAnchor: "middle",
    "color": "#ffffff",
    labelFunction: function(item) {
      return Math.round(item.dataContext.value) + "%";
    },
    balloonText: ""
  }],
  listeners: [{
    event: "rendered",
    method: function(e){
      e.chart.animateData(pcRatesData.SSM_same, {
        duration: 1000
      })
    }
  }]
});
