var csvData;
var impsData = [];
var impsAccumulated = [];
// var labelsData;
var dates = [];

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/js/csv/ID.csv",
        dataType: "text",
        success: function(data) {
          // convert CSV to arrays
          csvData = $.csv.toArrays(data);
          // remove column headers
          csvData.shift();
          // remove totals
          csvData.pop();
          // get dates and impressions values
          var lastImp = 0;
          csvData.forEach(function(row){
            // dates without years
            var date = row[0];
            var lastIndex = date.lastIndexOf(" ");
            date = date.substring(0, lastIndex);
            dates.push(date);

            // impressions
            var impAmount = parseInt(row[1]);
            // console.log('impAmount',impAmount);
            // impsData.push(impAmount);
            lastImp += impAmount;
            impsAccumulated.push(lastImp);
          });

          // console.log(impsAccumulated);

          // create bar chartist

          var chartData = {
            labels: dates,
            series: [impsAccumulated]
          };

          var options = {
            low:0,
            showArea: true,
            lineSmooth: false,
            showPoint: false,
            showLine:false,
            chartPadding: {
              left: 40
            }
          };

          var impsChart = new Chartist.Line('.imps-chart', chartData, options);


          // Woohoo! Chartist API...

          impsChart.on('created', function(data){

            var shape = new Chartist.Svg('circle', {cx:((data.chartRect.x2 - data.chartRect.x1)/2 + data.chartRect.x1), cy:((data.chartRect.y1 - data.chartRect.y2)/2 + data.chartRect.y2), r: 2, fill: '#000'}, 'dude', data.svg, true);

          });

        }
     });
});

var $svg;

// add centred circle to donut chart

function svgEl(tagName) {
    return document.createElementNS("http://www.w3.org/2000/svg", tagName);
}

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

    var lineWidth = Math.max(data.chartRect.width(), data.chartRect.height());
    // console.log('lineWidth',lineWidth);

    var endX = Math.cos(endAngleRadians) * lineWidth / 2;
    var endY = 100 + (Math.sin(endAngleRadians) * lineWidth / 2);

    var startX = (data.chartRect.y1 - data.chartRect.y2)/2 + data.chartRect.y2;
    var startY = (data.chartRect.x2 - data.chartRect.x1)/2 + data.chartRect.x1;

    return {x1: startX, y1: startY, x2: endX, y2: endY, stroke:'#ff9900', strokeWidth: '5px'};

    // $(target, docs.fixedFrame).attr('d', data);
}

chart.on('created', function(data){

  circlePoint(data, 280);

  // console.log(data);

  var shape = new Chartist.Svg('circle', {cx:((data.chartRect.x2 - data.chartRect.x1)/2 + data.chartRect.x1), cy:((data.chartRect.y1 - data.chartRect.y2)/2 + data.chartRect.y2), r: (data.chartRect.width() * 0.1), fill: '#000'}, 'dude', data.svg, true);

  var radialLine = new Chartist.Svg('line', circlePoint(data, 280), 'thingy', data.svg, false);

});


$(window).on('resize', function(){
  console.log(($('.ct-chart-donut').width()) / ($('.ct-chart-donut path:nth-of-type(1)').width()));
});


function SVG(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}
