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

function initControls(){

  $('.campaign__expand').click(function(){
    var target = $(this).data('cp');
    $('.' + target).toggleClass('collapse');
  });

  $('.campaign__table.cp_gopro').click(function(){
    var header = $(this).clone();

    var rem = parseInt($('html').css('font-size').replace('px', ''));
    var offset = $(this).offset().top - 4.5*rem;
    $('.campaign-details').css('transform', 'translateY(' + offset + 'px)');

    header.find('.creative-row').remove();
    header.appendTo('.campaign-details');
    var rh = $('.app__body .campaigns').height();

    $('.app__body .campaigns').fadeOut(500, function(){
      $('.app__body .report').css('min-height', rh + 'px');
      $('.campaign-details').css({
        transition: 'transform 0.5s ease-out',
        transform: 'translateY(0)'
      });

      // window.history.pushState("", "", '/report');
      $('.menu__report').addClass('current').siblings().removeClass('current');

      $.ajax({
          type:'GET',
          url: '/report',
          dataType: 'html',
          success: function (data) {

        var thisData = $(data).filter('.main');
        $('.report').html(thisData);
        $('body').addClass('report');
        setTimeout(function(){
          updateAllCharts('SSM_same');
        }, 1000);
        // window.history.pushState("", "", '/report');
        // $('.menu__report').addClass('current').siblings().removeClass('current');
        // initControls();
      }

    });
  });

});

$('.filter__group-select').on('change', function(e){
  var val = $(this).val();
  $('.group-by').attr('class', 'filter group-by ' + val);
});

$('.filter__split-select').on('change', function(e){
  var val = $(this).val();
  $('.filter.split-by').attr('class', 'filter split-by ' + val);
});

}

initControls();



// $('#slider').dateRangeSlider();
//
$('.login__box .button').click(function(e){
  // e.preventDefault();
  // alert('clicked');

  // $.get('/campaigns', function(data) {
  //   var campaigns = $(data).filter('.app__body').contents();
  //   $('.app__body').html(campaigns);
  //   window.history.pushState("", "", '/campaigns');
  //   $('.menu__campaigns').addClass('current').siblings().removeClass('current');
  //   initControls();
  // });

  $('body').addClass('loading');

  setTimeout(function(){
      document.location.href = '/campaigns';
  }, 1000);

});

$(document).ready(function(){
  var page = document.location.href.split('/')[3];
  $('body').addClass(page);
  $('menu__' + page).addClass('current').siblings().removeClass('current');

  // $('#radio1').attr('selected');

});

$('.show-filter').click(function(){
  $('body').addClass('side');
})

$('.close-filter').click(function(){
  $('body').removeClass('side');
})
