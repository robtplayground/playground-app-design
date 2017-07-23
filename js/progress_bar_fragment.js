$('.progress__days').html('day ' + campaignDaysCount + ' of ' + campaignDaysDuration);
// console.log(progressSeries);

$('.progress__dates__start').html(moment(campaign.dates.start).format("dddd, D MMMM YYYY"));

$('.progress__dates__end').html(moment(campaign.dates.end).format("dddd, D MMMM YYYY"));

$('.progress__bar__indicator').css('width', campaign.progress() + '%');
$('.progress__bar__integer').html(campaign.progress() + '%');
