var allClasses;
var titleText,
classNumber,
programCode,
searchField,
crn,
levelGrad,
levelUndergrad,
cc,
dataset,
table,
tr;

var seatsAvailable;

window.onload = function() {
d3.csv("class-merged.csv", function(error, classes) {

  allClasses = classes;
  cc = crossfilter(allClasses);
  titleOnly = cc.dimension(function(d) { return d.title_only; });
  classNumber = cc.dimension(function(d) { return d.class_number; });
  programCode = cc.dimension(function(d) { return d.program_code; });
  crn = cc.dimension(function(d) { return d.crn; });
  titleText = cc.dimension(function(d) { return d.title_text; });
  searchField = cc.dimension(function(d) { return d.search_field; });
  levelGrad = cc.dimension(function(d) { return d.level_grad; });
  levelUndergrad = cc.dimension(function(d) { return d.level_undergrad; });

  // table = d3.select('#main').append('table')
  table = d3.select('#main-table')
  .attr('class', 'table');


  dataset = programCode.filterAll().bottom(Infinity);

  drawTable(dataset);
  permalink();

});
}

function drawTable (data) {
  table.text("");
  // var rows = d3.selectAll('.rows');
  // rows.text("");

  tr = table.selectAll('tr')
  .data(data).enter()
  .append('tr')
  .attr('class', 'rows');

  tr.append('td')
  .attr('class', 'program_code')
  .html(function(m) { return m.program_code });

  tr.append('td')
  .attr('class', 'class_number')
  .html(function(m) { return m.class_number; });

  tr.append('td')
  .attr('class', 'title_only')
  .html(function(m) { return '<a class="crn_link" href="#' + m.crn + '">' + m.title_only + '</a'; });

  tr.append('td')
  .attr('class', 'days')
  .html(function(m) { return m.cs_days; });

  tr.append('td')
  .attr('class', 'time')
  .html(function(m) { return m.cs_time; });

  tr.append('td')
  .attr('class', 'sched_type')
  .html(function(m) { return m.cs_sched_type; });

  tr.append('td')
  .attr('class', 'instruct')
  .html(function(m) { return m.cs_instruct; });

  tr.append('td')
  .attr('class', 'level_grad')
  .html(function(m) { return m.level_grad; });

  tr.append('td')
  .attr('class', 'level_undergrad')
  .html(function(m) { return m.level_undergrad; });

  tr.append('td')
  .attr('class', 'credits')
  .html(function(m) { return m.credits; });
}

function filter(filterBy, query) {
  crn.filterAll();
  var dimension = window[filterBy];
  if(query === "ALL"){
    dataset = dimension.filterAll();
    dataset = programCode.bottom(Infinity);
  } else {
    dataset = dimension.filter(query).bottom(Infinity);
  }
  redrawTable(dataset);
}

function redrawTable(input) {
  drawTable(input);
}

function populateSidebar(selectedCrn) {
  crn.filter(selectedCrn.substring(1));
  var thisClass = crn.bottom(Infinity);
  // console.log(thisClass);
  var description = thisClass[0].description;
  $("#sb-program-code").text(thisClass[0].program_code);
  $("#sb-class-number").text(thisClass[0].class_number);
  $("#sb-title").text(thisClass[0].title_only);
  $("#sb-days").text(thisClass[0].cs_days);
  $("#sb-time").text(thisClass[0].cs_time);
  $("#sb-sched").text(thisClass[0].sched_type);
  $("#sb-instruct").text(thisClass[0].cs_instruct);
  $("#sb-location").text(thisClass[0].cs_where);
  $("#sb-descript").text(description);
  $("#sb-link").attr('href', 'https://alvin.newschool.edu/prbn/bwckschd.p_disp_detail_sched?term_in=201530&crn_in=' + thisClass[0].crn);
  $("#sb-link").attr('target', '_blank');
  $("#sbar-wrap").show();

  $("#sb-seats-total").text("");
  $("#sb-seats-taken").text("");
  $("#sb-seats-available").text("");
  requestSeats(thisClass[0].crn)

  reset(thisClass[0].crn, "https://betterclassfinder.herokuapp.com/#!" + thisClass[0].crn, thisClass[0].title_text);
}

$(window).on('hashchange', function() {
  var url = window.location.href;
  if(url.search("#!") > -1) {
    var selectedCrn = url.split("#!")[1];
    populateSidebar("#" + selectedCrn);
  } else if(url.search("#") > -1 && url.search("!") == -1) {
      var selectedCrn = url.split("#")[1];
      populateSidebar("#" + selectedCrn);
  }
});

//check if permalink
function permalink() {
  var url = window.location.href;
  if(url.search("#!") > -1) {
    var selectedCrn = url.split("#!")[1];
    populateSidebar("#" + selectedCrn);
  } else if(url.search("#") > -1 && url.search("!") == -1) {
      var selectedCrn = url.split("#")[1];
      populateSidebar("#" + selectedCrn);
  }
  $('#preloader').hide();
}

$(".crn_link").click(function(e) {
  e.preventDefault();
  var addressValue = $(this).attr("href");
  populateSidebar(addressValue);
});

function requestSeats(reqCrn) {
  var url = "https://seats-fetcher.herokuapp.com/request/" + reqCrn;
  $.getJSON( url, {})
  .done(function( data ) {
    seatsAvailable = data;
    $("#sb-seats-total").text(data[0]);
    $("#sb-seats-taken").text(data[1]);
    $("#sb-seats-available").text(data[2]);
  });
}
