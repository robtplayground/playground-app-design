{
  event: "dataUpdated",
  method: function(e){
    e.chart.animateData( e.chart.dataProvider, {
      duration: 1000
    })
  }
}
