const goproDates = listDates(gopro.dates); // array of dates
// console.log('dates', goproDates);
const gopro_pments = placements.filter(pl => pl.campaign === 'cp_gopro');


var commentVals = [];
var comments = [];

// ** EXECUTED IMPS  ** //


var impsData = {
  current: 'init'
};
gopro_pments.forEach(function(pl) {
  // for every date
  var colorsE = [];
  var colorsV = [];
  while (colorsE.length < goproDates.length) {
    colorsE = colorsE.concat([getColor(pl)])
  };
  while (colorsV.length < goproDates.length) {
    colorsV = colorsV.concat(['grey'])
  };
  while (comments.length < goproDates.length) {
    comments = comments.concat([' '])
  };
  while (commentVals.length < goproDates.length) {
    commentVals = commentVals.concat([null])
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
      values: pl.data.viewImpsAgg
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
      name: 'commentVal',
      values: commentVals
    },
    {
      name: 'comment',
      values: comments
    }
  ]);
});

// console.log('IMPS DATA', impsData);

impsData.SSM_same[7].comment = '8 Aug: Corrected Publisher tag';
impsData.SSM_same[7].commentVal = 0;
impsData.SSM_same[27].comment = '28 Aug: Retarget audience';
impsData.SSM_same[27].commentVal = 0;
impsData.SSM_same[41].comment = '11 Sept: New supply Daily Mail';
impsData.SSM_same[41].commentVal = 0;

// console.log(impsData);

// get first object in impsData and convert to zeroed array.
var initData = impsData['SSM_same'];
impsData.init = $.extend(true, [], initData);
impsData.init.forEach(function(dateEntry) {
  dateEntry.execImpsAgg = 0;
  dateEntry.viewImpsAgg = 0;
});

// console.log('IMPSDATA', impsData);

// SERIAL CHART
var chart__ImpsTime = AmCharts.makeChart("chart--execImpsAgg", {
  dataObject: impsData,
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
    // title: "Impressions",
    minimum: 0,
    maximum: 300000
  }],
  graphs: [{
    type: "line", // try to change it to "column"
    title: "Exec Imps",
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
        return '<span class="offset offset2">EXECUTED: ' + graphItem.values.value + '</span>';
      }
    },{
    type: "line", // try to change it to "column"
    title: "Viewable Imps",
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
        return '<span class="offset">VIEWABLE: ' + graphItem.values.value + '</span>';
    }
  },{
    type: "line", // try to change it to "column"
    title: "comments",
    valueField: "commentVal",
    lineAlpha: 0,
    customBullet: "../images/pink-star.png",
    bulletColor: '#e91e63',
    bulletSize: 22,
    bulletOffset:14,
    bulletHitAreaSize: 30,
    balloon: {
      textAlign: "left",
      borderThickness: 0,
      // fillColor: impsData.SSM_same[0].colorE,
      fillColor: 'transparent',
      color: impsData.SSM_same[0].colorE,
      hideBalloonTime: 1000, // 1 second
      fixedPosition: true,
    },
    balloonFunction: function(graphItem, graph){
      if(graphItem.dataContext.comment !== ' '){
        // console.log(graphItem);
        return '<span class="chart__comment">' + graphItem.dataContext.comment + '</span>';
      }
    }
  }],
  chartCursor: {
    cursorPosition: "left",
    // categoryBalloonEnabled: false,
    // "balloonPointerOrientation": "vertical",
    categoryBalloonDateFormat: "DD MMMM",
    cursorColor: "#e91e63",
    cursorAlpha: 0.5,
    // bulletsEnabled:true
  },
  chartScrollbar:{},
  listeners: [{
    event: "clickGraphItem",
    method: function(e){
      $('.chart__error').toggleClass('visible');
    }
  }]
});

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
var vAvBenchLabels = {}

gopro_pments.forEach(function(pl) {
  var format = creatives.find(function(cr) {
    return cr.id === pl.creative
  }).format;

  var formatViewb = format.bm.viewability;
  var iabBench = fm.iab.bm.viewability;

  vAvBenchData[pl.id] = [{
    label: "space1",
    value: iabBench,
    color: "transparent"
  }, {
    label: "IAB",
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

  vAvBenchLabels[pl.id] = {
    formatViewb: formatViewb,
    iabBench: iabBench
  };

});

vAvBenchData.init = [{
    label: "space1",
    value: 0,
    color: "transparent"
  }, {
    label: "IAB",
    value: 0,
    color: "red"
  }, {
    label: "space2",
    value: 0,
    color: "transparent"
  }, {
    label: "format",
    format: "",
    value: 0,
    color: "#e91e63"
  }, {
    label: "space3",
    value: 100,
    color: "transparent"
}];

vAvBenchLabels.init = {
  formatViewb: 0,
  iabBench: 0
};

// console.log('vAvBenchData',vAvBenchData);

var chart__vAvBench = AmCharts.makeChart('chart--vAvBenchmarks', {
  dataObject: vAvBenchData,
  type: "pie",
  theme: "light",
  dataProvider: vAvBenchData.init,
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

  // fixed date for this one at 15/9/2017, but this would fuck up other comparisons... would need to address this if it ever goes to production

  var currentDur = moment(new Date(2017, 9-1, 15)).diff(moment(pl.dates.start), 'days');
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
  balloon:{
    enabled: false
  }
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
  // console.log(containerID);
  // countup(target, startVal, endVal, decimals, duration, {options})
  this.value = new CountUp(containerID + "_value", 0, initValue, 1, 1, {
    useEasing: false,
    useGrouping: true,
    separator: ',',
    decimal: '.'
  });
  this.pgBench = new CountUp(containerID + "_pgBench", 0, initPG, 1, 1, {
    useEasing: false,
    useGrouping: true,
    separator: ',',
    decimal: '.'
  });
  this.iabBench = new CountUp(containerID + "_iabBench", 0, initIAB, 1, 1, {
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
    $('#' + this.containerID + ' .chart__circle').css('background-color', data.color);
  };
  this.startCount = function() {
    // countUp method start()
    this.value.start(this.callback);
    this.pgBench.start(this.callback);
    this.iabBench.start(this.callback);
  };
  this.callback = function() {
    // console.log('add Plus or Minus signs + formatting?', this.value);
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
    color: plFormat.color,
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

// console.log('ativAvData', ativAvData);

var chart__ativAv = new totalsChart('chart--ativAv', ativAvData.init.value, ativAvData.init.pgBench, ativAvData.init.iabBench);



// ENGAGED COMPLETIONS
var engagedCData = {
  current: 'init'
};

gopro_pments.forEach(function(pl) {

  var plFormat = getFormat(pl);

  engagedCData[pl.id] = {
    value: average(pl.data.engagedCompletionRate, pl.dates, gopro).toFixed(1),
    color: plFormat.color,
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

// Passive COMPLETIONS

var passiveCData = {
  current: 'init'
};

gopro_pments.forEach(function(pl) {

  var plFormat = getFormat(pl);

  passiveCData[pl.id] = {
    value: average(pl.data.passiveCompletionRate, pl.dates, gopro).toFixed(1),
    color: plFormat.color,
    pgBench: plFormat.bm.passiveCompletionRate,
    iabBench: fm.iab.bm.passiveCompletionRate
  };

  // console.log('PASSIVE COMPLETIONS DATA', passiveCData);

});

passiveCData.init = {
  value: 0,
  color: '#000000',
  pgBench: 0,
  iabBench: 0
};

var chart__passiveC = new totalsChart('chart--passiveC', passiveCData.init.value, passiveCData.init.pgBench, passiveCData.init.iabBench);



// ENGAGEMENT RATE

var erAvData = {
  current: 'init'
};

gopro_pments.forEach(function(pl) {

  var plFormat = getFormat(pl);

  erAvData[pl.id] = {
    value: average(pl.data.engagementRate, pl.dates, gopro).toFixed(1),
    color: plFormat.color,
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
      values: pl.data.engagementRate
    }, {
      name: 'clickthroughRate',
      values: pl.data.clickRate
    }, {
      name: 'colorE',
      values: colorsE
    },
    {
      name: 'colorC',
      values: colorsC
    },
    {
      name: 'commentVal',
      values: commentVals
    },
    {
      name: 'comment',
      values: comments
    }
  ]);
});

// get first object in impsData and convert to zeroed array.
engData.init = engData['SSM_same'];
engData.init = $.extend(true, [], engData.init);
engData.init.forEach(function(dateEntry) {
  dateEntry.engagementRate = 0;
  dateEntry.clickthroughRate = 0;
  dateEntry.colorE = "transparent";
  dateEntry.colorC = "transparent";
});

engData.SSM_same[7].comment = '8 Aug: Corrected Publisher tag';
engData.SSM_same[7].commentVal = 0;
engData.SSM_same[27].comment = 'Retarget audience';
engData.SSM_same[27].commentVal = 0;
engData.SSM_same[41].comment = 'Reorganised supply';
engData.SSM_same[41].commentVal = 0;

// console.log('commentVals', commentVals);

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
  },
  // {
  //   type: "line", // try to change it to "column"
  //   title: "comments",
  //   valueField: "commentVal",
  //   lineColor: "#e91e63",
  //   lineAlpha: 0,
  //   customBullet: "../images/pink-star.png",
  //   bulletColor: '#e91e63',
  //   bulletSize: 30,
  //   bulletOffset:4,
  //   bulletHitAreaSize: 30,
  //   visibleInLegend: false,
  //   balloon: {
  //     textAlign: "left",
  //     borderThickness: 0,
  //     // fillColor: impsData.SSM_same[0].colorE,
  //     fillColor: 'transparent',
  //     color: "blue",
  //     hideBalloonTime: 1000, // 1 second
  //     // fixedPosition: true,
  //   },
  //   balloonFunction: function(graphItem, graph){
  //     if(graphItem.dataContext.comment !== ' '){
  //       // console.log(graphItem);
  //       return '<span class="chart__comment">' + graphItem.dataContext.comment + '</span>';
  //     }
  //   }
  // }
],
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

// console.log('ecHeatData', ecHeatData);

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

// console.log('pcHeatData', pcHeatData);

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

// var amCharts = [chart__impsDel, chart__impsDelBench, chart__ImpsTime, chart__vAv, chart__vAvBench, chart__erTime, chart__ecHeat, chart__pcHeat];
//
// var totalsCharts = [chart__erAv, chart__ativAv, chart__engagedC, chart__passiveC];

var allCharts = [chart__impsDel, chart__impsDelBench, chart__ImpsTime, chart__vAv, chart__vAvBench,  chart__ativAv, chart__passiveC, chart__erAv, chart__erTime, chart__engagedC, chart__pcHeat, chart__ecHeat];

$('.filter__placement-select label').click(function() {
  var plID = $(this).data('placement');
  $('p.group-value').text('146560600_Airwave_GoPro_Target_FemalesMetro18-44');
  if(plID !== 'SSM_same'){
    $('.chart__error-button').css('display', 'none');
  }else{
    $('.chart__error-button').css('display', 'block');
  }
  updateAllCharts(plID);
});

// $(window).on('load', function(){
//   setTimeout(function(){
//     updateAllCharts('SSM_same');
//   }, 1000);
//
// });

function updateAllCharts(pment_ID) {

  var pment = gopro_pments.find(pl => pl.id === pment_ID);
  var plFormat = getFormat(pment);
  var plColor = getColor(pment);

  let chartsRendered = 0;

  renderCharts();

  function renderCharts(){

    if(chartsRendered < allCharts.length){
      var chart = allCharts[chartsRendered];
      chartsRendered++;
      // console.log('CURRENT CHART: ', chart);
      if(chart.amString){ // its an amChart

        var data = chart.dataObject[pment_ID];
        var chartDiv = chart.containerDiv.offsetParent.id;
        console.log('amChart rendering', chartDiv);

        if(chartDiv === 'chart--impsDel'){
          // update labels on imspDel chart
          chart__impsDel.allLabels[0].text = Math.round(impsDelData[pment_ID][0].value);
          chart__impsDel.allLabels[2].text = Math.round(impsDelData[pment_ID][0].impsDel).toLocaleString();
          $('.chart--impsDel .chart__legend__left span').text(impsDelBenchData[pment_ID][1].label);
        }

        if(chartDiv === 'chart--vAv'){
          // upadte Viewability labels
          chart__vAv.allLabels[0].text = vAvData[pment_ID][0].value;
          $('#chart--vAv_pgBench .legend__label').text(plFormat.name);
          $('#chart--vAv_pgBench .legend__label .box').css('background', plColor);
          $('#chart--vAv_pgBench .legend__value').text(vAvBenchLabels[pment_ID].formatViewb + '%');
          $('#chart--vAv_iabBench .legend__value').text(vAvBenchLabels[pment_ID].iabBench + '%');
        }

        // console.log(chartDiv);
        // if( chartDiv === "chart--erTime"){
          // console.log('new Engagement data', data);
          // $('.chart--execImpsAgg').attr('class', 'chart chart--execImpsAgg ' + pment.id);
        // }

        chart.animateData(data, {
          duration: 300,
          complete: renderCharts
        });
      } else{
        console.log('countup chart', chart);
        if(chart.containerID === "chart--ativAv"){
          chart__ativAv.updateCount(ativAvData[pment_ID]);
          setTimeout(renderCharts, 1000);
        }

        if(chart.containerID === "chart--passiveC"){
          chart__passiveC.updateCount(passiveCData[pment_ID]);
          setTimeout(renderCharts, 1000);
        }

        if(chart.containerID === "chart--erAv"){
          chart__erAv.updateCount(erAvData[pment_ID]);
          setTimeout(renderCharts, 1000);
        }

        if(chart.containerID === "chart--engagedC"){
          chart__engagedC.updateCount(engagedCData[pment_ID]);
          setTimeout(renderCharts, 1000);
        }
      }
    }else{
      console.log('ALL CHARTS LOADED');
      // chart__ImpsTime.chartCursor.showCursorAt('2017-08-09');
    }
  }


}
