function format(option) {
  if (!option.id) {
    return option.text;
  }
  if (option.id === 'Cumulative') {
    var $option = $('<span><svg viewBox="0 0 300 300" preserveAspectRatio="xMinYMid meet"><use x="0" y="0" href="#chart-area" /></svg> ' + option.text + '</span>');
    return $option;
  }
  if (option.id === 'Individual') {
    var $option = $('<span><svg viewBox="0 0 300 300" preserveAspectRatio="xMinYMid meet"><use x="0" y="0" href="#chart-bar" /></svg> ' + option.text + '</span>');
    return $option;
  }

};

$('.chart__select').select2({
  templateResult: format,
  templateSelection: format,
  minimumResultsForSearch: Infinity
});

$('.filter__group-select').select2({
  minimumResultsForSearch: Infinity,
  width: 'resolve'
});
$('.filter__split-select').select2({
  minimumResultsForSearch: Infinity,
  width: 'resolve'
});

$('.campaigns__filter select').select2({
  minimumResultsForSearch: Infinity,
  width: 'resolve'
});


$('.campaign__expand').click(function() {
  var target = $(this).data('cp');
  $('.' + target).toggleClass('collapse');
});

$('.table__actions__menu').click(function() {

  $('body').addClass('loading');

  setTimeout(function() {
    document.location.href = '/report';
  }, 1000);

});

$('.filter__group-select').on('change', function(e) {
  var val = $(this).val();
  $('.group-by').attr('class', 'filter group-by ' + val);
});

$('.filter__split-select').on('change', function(e) {
  var val = $(this).val();
  $('.filter.split-by').attr('class', 'filter split-by ' + val);
});

// $('#slider').dateRangeSlider();
//
$('.login__box .button').click(function(e) {

  $('body').addClass('loading');

  setTimeout(function() {
    document.location.href = '/campaigns';
  }, 1000);

});

$(document).ready(function() {
  var page = document.location.href.split('/')[3];
  $('body').addClass(page);
  $('.menu__' + page).addClass('current').siblings().removeClass('current');

  // $('#radio1').attr('selected');

});

$('.show-filter').click(function() {
  $('body').addClass('side');
  $('#radio0').prop('checked', 'checked');
})

$('.close-filter').click(function() {
  $('body').removeClass('side');
})
