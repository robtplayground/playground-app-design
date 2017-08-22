function format (option) {
  if (!option.id) {
    return option.text;
  }
  if(option.id === 'Cumulative'){
    var $option = $('<span><svg viewBox="0 0 300 300" preserveAspectRatio="xMinYMid meet"><use x="0" y="0" href="#chart-area" /></svg> ' + option.text + '</span>');
    return $option;
  }
  if(option.id === 'Individual'){
    var $option = $('<span><svg viewBox="0 0 300 300" preserveAspectRatio="xMinYMid meet"><use x="0" y="0" href="#chart-bar" /></svg> ' + option.text + '</span>');
    return $option;
  }

};

$('.chart__select').select2({
  templateResult: format,
  templateSelection: format,
  minimumResultsForSearch: Infinity
});

$('.data-filter select').select2({
  minimumResultsForSearch: Infinity,
  width: 'resolve' 
});

// $('#slider').dateRangeSlider();
