function formatSelects(option) {
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
  templateResult: formatSelects,
  templateSelection: formatSelects,
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
  $('p.group-value').attr('data-label', val);
});

$('.filter__split-select').on('change', function(e) {
  var val = $(this).val();
  $('.filter.split-by').attr('class', 'filter split-by ' + val);
  $('p.split-value').attr('data-label', val);
});

// $('#slider').dateRangeSlider();
//
$('.login__box .button').click(function(e) {

  $('body').addClass('loading');

  setTimeout(function() {
    document.location.href = '/campaigns';
  }, 1000);

});

// var timeline = new TimelineMax({paused:true});
//
// timeline
// .set('.campaign-details', {
//   y: '160px'
// })
// .set('.campaign-details .background', {
//   scaleX: 0.8,
//   scaleY: 0.84
// })
// .set('.filter-actions', {
//   opacity:0,
//   y:'-100%'
// })
// .set('.chart', {
//   opacity:0,
//   scale: 0.8
// })
// .to('.campaign-details .background', 0.5, {
//   scaleX: 1,
//   ease: Power4.easeIn
// })
// .to('.campaign-details .background', 0.2, {
//   scaleY: 1,
//   ease: Power4.easeIn
// },)
// .to('.campaign-details', 0.5, {
//   y: 0,
//   ease: Power4.easeIn
// }, 'move')
// .to('.campaign__table', 0.5, {
//   y: '20px',
//   ease: Power4.easeIn
// }, 'move')
// .to('.campaign__table', 0.5, {
//   y: '0px',
//   ease: Back.easeOut.config(3)
// }, 'filter-in')
// .set('.filter-actions', {
//   opacity: 1
// }, 'filter-in')
// .to('.filter-actions', 0.4, {
//   y: '0%'
// }, 'filter-in+=0.1')
// .staggerTo('.chart', 0.2, {
//   scale:1,
//   opacity:1
// }, 0.1)
// .call(updateAllCharts, ['SSM_same'])
// ;

$(document).ready(function() {
  var page = document.location.href.split('/')[3];
  $('body').addClass(page);


  // if(page === 'campaigns'){
  //   var header = $('.campaign__table.cp_gopro').clone();
  //   header.find('.creative-row').remove();
  //   header.appendTo('.campaign-details');
  // }

  if(page === 'report'){
    // $('.campaign-details').css('display', 'flex');
    // timeline.play();
    setTimeout(function(){
      updateAllCharts('SSM_same');
    }, 500);

  }

  // $('.menu__' + page).addClass('current').siblings().removeClass('current');

  // $('#radio1').attr('selected');

});

$('.show-filter').click(function() {
  $('body').toggleClass('side');
  $('#radio0').prop('checked', 'checked');
});

$('.close-filter').click(function() {
  $('body').removeClass('side');
});

$('.chart__error, .notes-button').click(function(){
  $('.chart__error').toggleClass('visible');
  $('.chart__comment').parent().css({
    'overflow': 'visible'
  });
  // chart__ImpsTime.chartCursor.showCursorAt('2017-08-08');
});

// fix filters at header

$(window).scroll(function(){
  var filter = $('.data-filter'),
      scroll = $(window).scrollTop();

  if (scroll >= 165 && $('body').hasClass('side')) filter.addClass('fixed');
  else filter.removeClass('fixed');
});

$('.filter__treemap .dm').click(function(){
  $(this).addClass('active');
  updateAllCharts('SSM_same_DM');
  $('p.split-value').text('Technology');
});

$('.download-file').click(function(){
  $('.spinner').css('display', 'flex');
});


$('.accordion-header').click(function(){
  $(this).toggleClass('hide');
  $(this).next('.accordion-content').toggleClass('hidden');
});
