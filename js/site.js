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
            // console.log(window[placementName]);





            // dates.push(date);

            // impressions
            // var impAmount = parseInt(row[1]);
            // console.log('impAmount',impAmount);
            // impsData.push(impAmount);
            // lastImp += impAmount;
            // impsAccumulated.push(lastImp);
          });


          // progress bar

          var campaign = chartData[campaign] = {};

          campaign.dates = {start: new Date(2017, 2, 8), end: new Date(2017, 3, 20)};
          campaign.current = new Date (2017,3,11);
          campaign.progress = function(){
            return Math.round((1*(campaign.current - campaign.dates.start)) / (1*(campaign.dates.end - campaign.dates.start)) * 100)
          };

          var progressSeries = [[campaign.progress()], [(100 - campaign.progress())]];

          // console.log(progressSeries);

          var progressChart = new Chartist.Bar('.progress-bar', {
            series: progressSeries
          }, {
            stackBars: true,
            horizontalBars: true,
            chartPadding: 0,
            axisX:{
              offset:0,
              showGrid: false
            },
            axisY:{
              offset:0,
              showGrid: false
            }
          }).on('draw', function(data) {
            console.log(data);
            if(data.type === 'bar') {
              data.element.attr({
                style: 'stroke-width: 30px'
              });
          }
        }).on('created', function(data){
          console.log(data);
          if(data.type === 'bar') {

            // add value
            var barHorizontalCenter, barVerticalCenter, label, value;
            barHorizontalCenter = data.x2 + (data.element.height());
            barVerticalCenter = data.y2 + (data.element.width()/2);
            value = data.element.attr('ct:value');
            if (value !== '0') {
              label = new Chartist.Svg('text');
              label.text('75');
              label.addClass("ct-barlabel");
              label.attr({
                x: barHorizontalCenter,
                y: barVerticalCenter,
                'text-anchor': 'right'
              });
              return data.group.append(label);
          }
        }
          // data.svg._node.attr('preserveAspectRatio', 'none');
        });

          $('.progress-bar-labels .start-date').html(moment(campaign.dates.start).format("dddd, D MMMM YYYY"));

          $('.progress-bar-labels .end-date').html(moment(campaign.dates.end).format("dddd, D MMMM YYYY"));



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
