const goproDates = listDates(gopro.dates); // array of dates
console.log('dates', goproDates);
const gopro_pments = placements.filter(pl => pl.campaign === 'cp_gopro');



// ** EXECUTED IMPS  ** //

var impsData = {
  current: 'init'
};
gopro_pments.forEach(function(pl) {
  // for every date
  var colorsE = [];
  var colorsV = [];
  var comments = [];
  while (colorsE.length < goproDates.length) {
    colorsE = colorsE.concat([getColor(pl)])
  };
  while (colorsV.length < goproDates.length) {
    colorsV = colorsV.concat(['grey'])
  };
  while (comments.length < goproDates.length) {
    comments = comments.concat([' '])
  };

  impsData[pl.id] = prepData({
    name: 'date',
    values: goproDates
  }, [{
      name: 'execImpsAgg',
      values: pl.data.execImpsAgg,
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
    },
    {
      name: 'comment',
      values: comments
    }
  ]);
});

console.log('IMPS DATA', impsData);

impsData.SSM_same[8].comment = 'Scot Liddell corrected tag to stop 100% fallback';

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
  dataObject: impsData,
  type: "serial",
  dataProvider: impsData[impsData.current], // start chart with zeroes
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
    // title: "Impressions",
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
    fillAlphas: 0.3,
    balloon: {
      textAlign: "left",
      borderThickness: 0,
      // fillColor: impsData.SSM_same[0].colorE,
      fillColor: 'transparent',
      color: impsData.SSM_same[0].colorE,
    },
    balloonFunction: function(graphItem, graph){
      if(graphItem.dataContext.comment !== ' '){
        console.log(graphItem);
        return '<span>EXECUTED: ' + graphItem.values.value + '</span> <div class="chart__comment">' + graphItem.dataContext.comment + '</div>';
      }else{
        return '<span>EXECUTED: ' + graphItem.values.value + '</span>';
      }
    }
  }, {
    type: "line", // try to change it to "column"
    title: "red line",
    valueField: "viewImpsAgg",
    lineAlpha: 1,
    lineColorField: "colorV",
    fillColorsField: "colorV",
    fillAlphas: 0.3,
    balloon: {
      textAlign: "left",
      borderThickness: 0,
      fillColor: 'transparent',
      color: impsData.SSM_same[0].color,
    },
    balloonFunction: function(graphItem, graph){
        return '<span>VIEWABLE: ' + graphItem.values.value + '</span>';
    }
  }],
  chartCursor: {
    cursorPosition: "middle",
    // categoryBalloonEnabled: false,
    categoryBalloonDateFormat: "DD MMMM",
    cursorColor: "#e91e63",
    cursorAlpha: 0.5,
    // bulletsEnabled:true
  },
  chartScrollbar:{}
  // listeners: [{
  //   event: "rendered",
  //   method: function(e){
  //     e.chart.animateData(impsData.SSM_same, {
  //       duration: 1000
  //     })
  //   }
  // }]
});

setTimeout(function(){
  chart__ImpsTime.chartCursor.showCursorAt('2017-08-09');
}, 3000);

//
// chart__ImpsTime.chartCursor.showCursorAt('Aug 15');


// ** VIEWABILITY AVERAGE CHART

var vAvData = {
  current: 'init'
};
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
  dataObject: vAvData,
  type: "pie",
  dataProvider: vAvData[vAvData.current],
  startDuration: 0,
  valueField: "value",
  titleField: "label",
  colorField: "color",
  // labelFunction: labelFunction,
  labelsEnabled: false,
  // labelRadius: "-50%",
  innerRadius: "70%",
  allLabels: [{
    text: vAvData[vAvData.current][0].value,
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
  // listeners: [{
  //   event: "rendered",
  //   method: function(e){
  //     e.chart.allLabels[0].text = vAvData.SSM_same[0].value;
  //     e.chart.animateData( vAvData.SSM_same,{
  //       duration: 3000
  //     });
  //   }
  // }]
});

// VIEWABILITY BENCHMARKS OVERLAY

var vAvBenchData = {};

gopro_pments.forEach(function(pl) {
  var format = creatives.find(function(cr) {
    return cr.id === pl.creative
  }).format;
  var formatViewb = format.bm.viewability;
  var iabBench = fm.iab.bm.viewability;
  vAvBenchData[pl.id] = {};
  vAvBenchData[pl.id].formatViewb = formatViewb;
  vAvBenchData[pl.id].iabBench = iabBench;
  vAvBenchData[pl.id].data = [{
    label: "space1",
    value: iabBench,
    color: "transparent"
  }, {
    label: "IAB",
    // description: "IAB: " + iabBench + "%",
    value: 1,
    color: "red"
  }, {
    label: "space2",
    value: formatViewb - iabBench - 1,
    color: "transparent"
  }, {
    label: "format",
    format: format,
    value: 1,
    color: "#e91e63"
  }, {
    label: "space3",
    value: 100 - 1 - formatViewb,
    color: "transparent"
  }];
});

vAvBenchData.init = {
  formatViewb: 0,
  iabBench: 0,
  data: [{
    label: "space1",
    value: 0,
    color: "transparent"
  }, {
    label: "IAB",
    // description: "IAB",
    value: 0,
    color: "red"
  }, {
    label: "space2",
    value: 0,
    color: "transparent"
  }, {
    label: "format",
    value: 0,
    color: "#e91e63"
  }, {
    label: "space3",
    value: 100,
    color: "transparent"
  }]
};

// console.log('vAvBenchData',vAvBenchData);

var chart__vAvBench = AmCharts.makeChart('chart--vAvBenchmarks', {
  dataObject: vAvBenchData,
  type: "pie",
  theme: "light",
  dataProvider: vAvBenchData.init.data,
  startDuration: 0,
  valueField: "value",
  titleField: "label",
  labelsEnabled: false,
  colorField: "color",
  alphaField: "alpha",
  innerRadius: "70%",
  startDuration: 0,
  addClassNames: true,
  balloonText: ""
  // listeners: [{
  //   event: "rendered",
  //   method: function(e){
  //     $('#chart--vAv_pgBench').text(vAvBenchData.SSM_same.formatViewb + '%');
  //     $('#chart--vAv_iabBench').text(vAvBenchData.SSM_same.iabBench + '%');
  //     e.chart.animateData( vAvBenchData.SSM_same.data,{
  //       duration: 3000
  //     });
  //   }
  // }]
});

// IMPS DELIVERED

var impsDelData = {
  current: 'init'
};
var impsDelBenchData = {
  current: 'init'
};
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
  }, {
    label: "2",
    value: 1,
    label: "Expected: " + impsDelBench + "%",
    color: "red"
  }, {
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
}, {
  label: "2",
  value: 0,
  color: "red"
}, {
  label: "3",
  value: 100,
  color: "transparent"
}];


var chart__impsDel = AmCharts.makeChart('chart--impsDel', {
  dataObject: impsDelData,
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
    text: Math.round(impsDelData.init[0].value),
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
  // listeners: [{
  //   event: "rendered",
  //   method: function(e){
  //     e.chart.allLabels[0].text = Math.round(impsDelData.SSM_same[0].value);
  //     e.chart.allLabels[2].text = impsDelData.SSM_same[0].impsDel.toLocaleString();
  //     e.chart.animateData( impsDelData.SSM_same,{
  //       duration: 3000
  //     });
  //   }
  // }]
});

$('.chart--impsDel .chart__legend__left span').text('Expected: 0%');

var chart__impsDelBench = AmCharts.makeChart('chart--impsDelBench', {
  dataObject: impsDelBenchData,
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
  balloonText: ""
  // listeners: [{
  //   event: "rendered",
  //   method: function(e){
  //     $('.chart--impsDel .chart__legend__left span').text('Expected: ' + impsDelBenchData.SSM_same[0].value + '%');
  //     e.chart.animateData( impsDelBenchData.SSM_same,{
  //       duration: 3000
  //     });
  //   }
  // }]
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
  this.callback = function() {
    console.log('add Plus or Minus signs + formatting?', this.value);
  };
}


// ATIV

var ativAvData = {
  current: 'init'
};

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



// ENGAGED COMPLETIONS
var engagedCData = {
  current: 'init'
};

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



// ENGAGEMENT RATE

var erAvData = {
  current: 'init'
};

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





// ** ENGAGEMENT RATE OVER TIME  ** //


// SERIAL CHART

var engData = {
  current: 'init'
};
gopro_pments.forEach(function(pl) {
  var colorsE = [];
  var colorsC = [];
  while (colorsE.length < goproDates.length) {
    colorsE = colorsE.concat([getColor(pl)])
  };
  while (colorsC.length < goproDates.length) {
    colorsC = colorsC.concat(['red'])
  };

  engData[pl.id] = prepData({
    name: 'date',
    values: listDates(gopro.dates)
  }, [{
      name: 'engagementRate',
      values: placements[0].data.engagementRate
    }, {
      name: 'clickthroughRate',
      values: placements[0].data.clickRate
    }, {
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
  dataObject: engData,
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
    categoryBalloonDateFormat: "DD MMMM",
    cursorColor: "#e91e63",
    cursorAlpha: 0.5
  },
  legend: {
    // "useGraphSettings": true,
    useMarkerColorForLabels: true
  },
  // listeners: [{
  //   event: "rendered",
  //   method: function(e){
  //     e.chart.animateData(engData.SSM_same, {
  //       duration: 1000
  //     })
  //   }
  // }]
});



// COMPLETION HEAT


var ecHeatData = {
  current: 'init'
};
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

  ecHeatData[pl.id] = [{
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

  ecHeatData[pl.id].forEach(function(obj) {
    var colorPos = (obj.value - lowest) / (highest - lowest);
    obj.color = 'rgb(' + pickHex(color1, color2, colorPos) + ')';
    obj.stackHeight = 1;
  });

});

ecHeatData.init = [{
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

console.log('ecHeatData', ecHeatData);

var chart__ecHeat = AmCharts.makeChart("chart--engagedCHeat", {
  dataObject: ecHeatData,
  type: 'serial',
  dataProvider: ecHeatData.init,
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
  // listeners: [{
  //   event: "rendered",
  //   method: function(e){
  //     e.chart.animateData(ecHeatData.SSM_same, {
  //       duration: 1000
  //     })
  //   }
  // }]
});


// ** PASSIVE COMPLETION RATE - basically a duplicate of Engaged, but I mess with the values to make it look different

var pcHeatData = {
  current: 'init'
};
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

  pcHeatData[pl.id] = [{
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

  pcHeatData[pl.id].forEach(function(obj) {
    var colorPos = (obj.value - lowest) / (highest - lowest);
    obj.color = 'rgb(' + pickHex(color1, color2, colorPos) + ')';
    obj.stackHeight = 1;
  });

});

pcHeatData.init = [{
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

console.log('pcHeatData', pcHeatData);

var chart__pcHeat = AmCharts.makeChart("chart--passiveCHeat", {
  dataObject: pcHeatData,
  type: 'serial',
  dataProvider: pcHeatData.init,
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
  // listeners: [{
  //   event: "rendered",
  //   method: function(e){
  //     e.chart.animateData(pcHeatData.SSM_same, {
  //       duration: 1000
  //     })
  //   }
  // }]
});


// push data to all charts on click

var amCharts = [chart__ImpsTime, chart__vAv, chart__vAvBench, chart__impsDel, chart__impsDelBench, chart__erTime, chart__ecHeat, chart__pcHeat];

var totalsCharts = [chart__ativAv, chart__engagedC, chart__erAv];

$('.filter__placement-select label').click(function() {
  var plID = $(this).data('placement');
  updateAllCharts(plID);
});

$(window).on('load', function(){
  setTimeout(function(){
    updateAllCharts('SSM_same');
  }, 1000);

});

function updateAllCharts(pment_ID) {

  var pment = gopro_pments.find(pl => pl.id === pment_ID);
  console.log(pment);
  var plFormat = getFormat(pment);
  var plColor = getColor(pment);

  amCharts.forEach(chart => {


    var data = chart.dataObject[pment_ID];
    chart.animateData(data, {
      duration: 1000
    });
  });

  chart__vAvBench.animateData(chart__vAvBench.dataObject[pment_ID].data, {
    duration: 1000
  });

  chart__vAv.allLabels[0].text = vAvData[pment_ID][0].value;
  chart__impsDel.allLabels[0].text = Math.round(impsDelData[pment_ID][0].value);
  chart__impsDel.allLabels[2].text = Math.round(impsDelData[pment_ID][0].impsDel).toLocaleString();
  $('.chart--impsDel .chart__legend__left span').text(impsDelBenchData[pment_ID][1].label);

  $('#chart--vAv_pgBench .legend__label').text(plFormat.name);
  $('#chart--vAv_pgBench .legend__label .box').css('background', plColor);
  $('#chart--vAv_pgBench .legend__value').text(vAvBenchData[pment_ID].formatViewb + '%');
  $('#chart--vAv_iabBench .legend__value').text(vAvBenchData[pment_ID].iabBench + '%');


  chart__ativAv.updateCount(ativAvData[pment_ID]);
  chart__engagedC.updateCount(engagedCData[pment_ID]);
  chart__erAv.updateCount(erAvData[pment_ID]);
}
