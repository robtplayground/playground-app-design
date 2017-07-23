var csvData;
var labels;

// create namespace

var chartData = {};


$(document).ready(function() {

  // fileList defined in template

  fileList.forEach(function(fileName){
    dataToArray(fileName);
  });



  function dataToArray(csvFileName){

    $.ajax({
        type: "GET",
        url: "/data/" + csvFileName,
        dataType: "text",
        success: function(data) {
          // convert CSV to arrays
          csvData = $.csv.toArrays(data);
          // remove column headers
          var labels = csvData.shift();
          csvData.forEach(function(row){

            // create data Objects

            var placementObjName = csvFileName.replace(/\s+/g, '').replace('.csv', '');
            // console.log('placementObjName', placementObjName);
            // console.log(placementObjName);

            if(!chartData[placementObjName]){
              chartData[placementObjName] = {
                name: "",
                data: {
                  dates: [],
                  requestedImps: [],
                  executedImps: [],
                  viewableImps: [],
                  viewability: [],
                  clicks: [],
                  ctr: [],
                  engagements: [],
                  engagementRate: [],
                  avgTIV: [],
                  videoCompletionRate: []
                }
              };
              // console.log(window[placementObjName]);
            }

            chartData[placementObjName].name = placementObjName;
            console.log('placementName', chartData[placementObjName].name);
            var date = row[0];
            // date = moment.unix(date).format("DD-MM");
            console.log('date', date);
            // do this on chart render instead
            // var lastIndex = date.lastIndexOf("-");
            // date = date.substring(0, lastIndex);
            // date = date.replace('-', ' ');
            chartData[placementObjName].data.dates.push(date);
            chartData[placementObjName].data.requestedImps.push(parseInt(row[2]));
            chartData[placementObjName].data.executedImps.push(parseInt(row[3]));
            chartData[placementObjName].data.viewableImps.push(parseInt(row[4]));
            chartData[placementObjName].data.viewability.push(parseInt(row[5])/100);
            chartData[placementObjName].data.clicks.push(parseInt(row[6]));
            chartData[placementObjName].data.ctr.push(parseInt(row[7]) / 100);
            chartData[placementObjName].data.engagements.push(parseInt(row[8]));
            chartData[placementObjName].data.engagementRate.push(parseInt(row[9]) / 100);
            chartData[placementObjName].data.avgTIV.push(parseInt(row[10]));
            chartData[placementObjName].data.videoCompletionRate.push(parseInt(row[11])/100);

          });

          // console.log(chartData);



          // progress bar




          // end progress bar

          // cumulative Imps

          for (var placement in chartData) {
            // console.log('PLACEMENT',placement);
            if(placement.indexOf('Airwave') > 0){
              var lastAmount = 0;
              var thisPlacement = chartData[placement];
              thisPlacement.data.execImpsCumulative = [];
              thisPlacement.data.executedImps.forEach(function(amount){
                lastAmount += amount;
                // console.log(placement, lastAmount);
                thisPlacement.data.execImpsCumulative.push(lastAmount);
              });
            }
          }

          console.log("chartData.length", Object.keys(chartData).length);

          // callback, essentially

          if(Object.keys(chartData).length === fileList.length){
              buildImpsChart();
          }

        }
     });

   } // end dataToArray

   function buildImpsChart(){

     console.log('chartData', chartData);

     // create campaign Object
     var campaign = chartData[campaign] = {};

     campaign.dates = {start: new Date(2017, 2, 8), end: new Date(2017, 3, 20)};
     campaign.current = new Date (2017,3,11);
     campaign.progress = function(){
       return Math.round((1*(campaign.current - campaign.dates.start)) / (1*(campaign.dates.end - campaign.dates.start)) * 100)
     };
     campaign.benchmarks = {};
     campaign.benchmarks.impressions = 13000;

     var campaignDaysDuration = moment(campaign.dates.end).diff(moment(campaign.dates.start), 'days');

     var campaignDaysCount = moment(campaign.dates.end).diff(moment(campaign.current), 'days');

     var impsChartData = {
       labels: chartData["146560594_Airwave_GoPro_Target_MalesMetro18-44_PreLaunch"].data.dates,
       series: [
         chartData["146560605_Airwave_GoPro_Target_FemalesMetro18-44_Post"].data.executedImps,
        //  chartData["146560595_Airwave_GoPro_Target_FemalesMetro18-44_PreLaunch"].data.execImpsCumulative,
        //  chartData["146560596_Airwave_GoPro_Target_MalesMetro18-44_Post"].data.execImpsCumulative,
        //  chartData["146560597_Airwave_GoPro_Target_FemalesMetro18-44_Post"].data.execImpsCumulative,
        //  chartData["146560598_Airwave_GoPro_Target_MalesMetro18-44_PreLaunch"].data.execImpsCumulative,
        //  chartData["146560599_Airwave_GoPro_Target_FemalesMetro18-44_PreLaunch"].data.execImpsCumulative
       ]
     };

     var options = {
       low:0,
       high: campaign.benchmarks.impressions,
       showArea: true,
       lineSmooth: false,
       showPoint: false,
       showLine:false,
       fullWidth: true,
       width: '100vw',
       height: '40vw',
       chartPadding: {
         left: 40
       },
       axisX: {
         // show only every third label OR last label
         labelInterpolationFnc: function(value, index) {
           return index % 3 === 0 || index === impsChart.data.labels.length - 1  ? value : null;
         }
       }
     };

     var impsChart = new Chartist.Line('.imps-chart', impsChartData, options).on('created', function(data){
       // console.log('imps-chart', impsChart);
       var horizGrids = impsChart.container.querySelectorAll('line.ct-grid.ct-horizontal');
       var firstLine = horizGrids[0];
       var lastLine = horizGrids[horizGrids.length - 1];
       var startPoint = [firstLine.getAttribute('x2'), firstLine.getAttribute('y2')];
       var endPoint = [lastLine.getAttribute('x1'), lastLine.getAttribute('y1')];

       var impsExpected = new Chartist.Svg('line', {x1: startPoint[0], y1: startPoint[1], x2: endPoint[0], y2: endPoint[1], stroke: "#000", strokeWidth: "1"}, 'imps-expected', data.svg, false);

       var impsExpected = new Chartist.Svg('line', {x1: startPoint[0], y1: startPoint[1], x2: endPoint[0], y2: endPoint[1], stroke: "#000"}, 'imps-expected', data.svg, false);

     });

   }



});

// $('.module--impressions .module__benchmark').html(campaign.benchmarks.impressions + ' booked');



var chart = new Chartist.Pie('.ct-square', {
  series: [10, 20, 50, 20, 5, 50, 15],
  labels: [1, 2, 3, 4, 5, 6, 7]
}, {
  donut: true,
  donutWidth:1,
  showLabel: false
});

// How do I get the width of the circle graph - that is the problem...
// I need to do the reverse equation for plotting the point to get the donut center

function createRadial(data, angle) {

    var endAngleDeg = angle - 90;  // 30
    var endAngleRadians = (endAngleDeg * Math.PI) / 180;
    // var largeArcFlag = (angle < 180 ? '0' : '1');

    var radiusLength = data.chartRect.width();

    var endX = Math.cos(endAngleRadians) * radiusLength / 2;
    var endY = data.chartRect.height() + (Math.sin(endAngleRadians) * radiusLength / 2);

    var startX = (data.chartRect.y1 - data.chartRect.y2)/2 + data.chartRect.y2;
    var startY = (data.chartRect.x2 - data.chartRect.x1)/2 + data.chartRect.x1;

    return {x1: startX, y1: startY, x2: endX, y2: endY, stroke:'#ff9900', strokeWidth: '5px'};

}

chart.on('created', function(data){

  // console.log('donut', data);

  var shape = new Chartist.Svg('circle', {cx:((data.chartRect.x2 - data.chartRect.x1)/2 + data.chartRect.x1), cy:((data.chartRect.y1 - data.chartRect.y2)/2 + data.chartRect.y2), r: (data.chartRect.width() * 0.1), fill: '#000'}, 'dude', data.svg, true);

  var radialLine = new Chartist.Svg('line', createRadial(data, 280), 'thingy', data.svg, false);

});
