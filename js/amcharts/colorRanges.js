/**
 * AmCharts plugin: Auto-calculate color based on value
 * The plugin relies on custom chart propety: `colorRanges`
 */
AmCharts.addInitHandler(function(chart) {

  var dataProvider = chart.dataProvider;
  var colorRanges = chart.colorRanges;

  // Based on https://www.sitepoint.com/javascript-generate-lighter-darker-color/
  function ColorLuminance(hex, lum) {

    console.log('calculating luminance');

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#",
      c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }
    console.log('rgb', rgb);
    return rgb;
  }

  if (colorRanges) {

    var item;
    var range;
    var valueProperty;
    var value;
    var average;
    var variation;
    for (var i = 0, iLen = dataProvider.length; i < iLen; i++) {

      item = dataProvider[i];

      for (var x = 0, xLen = colorRanges.length; x < xLen; x++) {

        range = colorRanges[x];
        valueProperty = range.valueProperty;
        value = item[valueProperty];

        if (value >= range.start && value <= range.end) {
          average = (range.start - range.end) / 2;

          if (value <= average)
            variation = (range.variation * -1) / value * average;
          else if (value > average)
            variation = range.variation / value * average;

          item[range.colorProperty] = ColorLuminance(range.color, variation.toFixed(2));
        }
      }
    }
  }

}, ["serial"]);
