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

$('select').select2({
  templateResult: format,
  templateSelection: format
});
