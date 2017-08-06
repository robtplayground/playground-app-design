function formatState (option) {
  console.log('formatState', option);
  if (!option.id) { return option.text; }
  if(option.id === 'Cumulative'){
    var $option = $('<span><svg viewBox="0 0 300 300" preserveAspectRatio="xMinYMid meet"><use x="0" y="0" href="#comments-old" /></svg> ' + option.text + '</span>');
    return $option;
  }else{
    return $('<span>' + option.id + '</span>');
  }

};

$('select').select2({
  templateResult: formatState
});
