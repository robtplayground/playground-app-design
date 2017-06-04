var csvData;
var labels;

// create namespace

var chartData = {};

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/js/csv/Adidas-All.csv",
        dataType: "text",
        success: function(data) {
          // convert CSV to arrays
          csvData = $.csv.toArrays(data);
          // remove column headers
          var labels = csvData.shift();
          csvData.forEach(function(row){

            // create data Objects

            var placementObjName = row[1].replace(/\s+/g, '');
            // console.log(placementObjName);

            if(!chartData[placementObjName]){
              chartData[placementObjName] = {
                name: "",
                data: {
                  dates: [],
                  requestedImps: [],
                  executedImps: [],
                  clicks: [],
                  ctr: [],
                  viewability: [],
                  bannerRenders: [],
                  bannerViewability: [],
                  heroRenders: [],
                  heroViewability: [],
                  videoPlayRate: [],
                  video25: [],
                  video50: [],
                  video75: [],
                  videoCompletionRate: []
                }
              };
              // console.log(window[placementObjName]);
            }

            chartData[placementObjName].name = row[1];
            var date = row[0];
            // do this on chart render instead
            // var lastIndex = date.lastIndexOf("-");
            // date = date.substring(0, lastIndex);
            // date = date.replace('-', ' ');
            chartData[placementObjName].data.dates.push(date);
            chartData[placementObjName].data.requestedImps.push(parseInt(row[1]));
            chartData[placementObjName].data.executedImps.push(parseInt(row[2]));
            chartData[placementObjName].data.clicks.push(parseInt(row[5]));
            chartData[placementObjName].data.ctr.push(parseInt(row[4]) / 100);
            chartData[placementObjName].data.viewability.push(parseInt(row[6])/100);
            chartData[placementObjName].data.bannerRenders.push(parseInt(row[7]));
            chartData[placementObjName].data.bannerViewability.push(parseInt(row[8])/100);
            chartData[placementObjName].data.heroRenders.push(parseInt(row[9]));
            chartData[placementObjName].data.heroViewability.push(parseInt(row[10])/100);
            chartData[placementObjName].data.videoPlayRate.push(parseInt(row[11])/100);
            chartData[placementObjName].data.video25.push(parseInt(row[12]));
            chartData[placementObjName].data.video50.push(parseInt(row[13]));
            chartData[placementObjName].data.video75.push(parseInt(row[14]));
            chartData[placementObjName].data.videoCompletionRate.push(parseInt(row[15])/100);

          });

          console.log(chartData);


          // progress bar

          var campaign = chartData[campaign] = {};

          campaign.dates = {start: new Date(2017, 2, 8), end: new Date(2017, 3, 20)};
          campaign.current = new Date (2017,3,11);
          campaign.progress = function(){
            return Math.round((1*(campaign.current - campaign.dates.start)) / (1*(campaign.dates.end - campaign.dates.start)) * 100)
          };
          campaign.benchmarks = {};
          campaign.benchmarks.impressions = 450000;

          var campaignDaysDuration = moment(campaign.dates.end).diff(moment(campaign.dates.start), 'days');

          var campaignDaysCount = moment(campaign.dates.end).diff(moment(campaign.current), 'days');

          $('.progress__days').html('day ' + campaignDaysCount + ' of ' + campaignDaysDuration);
          // console.log(progressSeries);

          $('.progress__dates__start').html(moment(campaign.dates.start).format("dddd, D MMMM YYYY"));

          $('.progress__dates__end').html(moment(campaign.dates.end).format("dddd, D MMMM YYYY"));

          $('.progress__bar__indicator').css('width', campaign.progress() + '%');
          $('.progress__bar__integer').html(campaign.progress() + '%');

          // cumulative Imps

          for (var placement in chartData) {
            if(placement.indexOf('Adidas') > 0){
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

          $('.module--impressions .module__benchmark').html(campaign.benchmarks.impressions + ' booked');



          // console.log(chartData);

          // create area line chartist

          // var impsChartData = {
          //   labels: dates,
          //   series: [impsAccumulated]
          // };
          //
          // var options = {
          //   low:0,
          //   showArea: true,
          //   lineSmooth: false,
          //   showPoint: false,
          //   showLine:false,
          //   chartPadding: {
          //     left: 40
          //   }
          // };
          //
          // var impsChart = new Chartist.Line('.imps-chart', impsChartData, options);


          // Woohoo! Chartist API...


        }
     });
});

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

function circlePoint(data, angle) {

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

  // console.log(data);

  var shape = new Chartist.Svg('circle', {cx:((data.chartRect.x2 - data.chartRect.x1)/2 + data.chartRect.x1), cy:((data.chartRect.y1 - data.chartRect.y2)/2 + data.chartRect.y2), r: (data.chartRect.width() * 0.1), fill: '#000'}, 'dude', data.svg, true);

  var radialLine = new Chartist.Svg('line', circlePoint(data, 280), 'thingy', data.svg, false);

});
