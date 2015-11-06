var allClasses;
var titleText,
classNumber,
programCode,
searchField,
crn,
cc,
dataset,
table,
tr;

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

  // tr.append('td')
  // .attr('class', 'where')
  // .html(function(m) { return m.cs_where; });

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

  // tr.append('td')
  // .attr('class', 'type_href')
  // .html(function(m) { return '<a href="https://alvin.newschool.edu/prbn/bwckschd.p_disp_detail_sched?term_in=201530&crn_in=' + m.class_number + '">Link</a>';});


}

function filter(filterBy, query) {
  // console.log(filterBy + "," + query);
  crn.filterAll();
  var dimension = window[filterBy];
  if(query === "ALL"){
    dataset = dimension.filterAll();
    dataset = programCode.bottom(Infinity);
  } else {
    dataset = dimension.filter(query).bottom(Infinity);
    // dataset = programCode.filterAll().bottom(Infinity);
    // dataset = titleOnly.filterAll().bottom(Infinity);
  }
  redrawTable(dataset);
}

// function filterByProgram() {
//   checkCheckboxes();
//   dataset = programCode.filterFunction(function(d) {
//     return "PSAM" == d || "PGUD" == d;
//   }).bottom(Infinity);
//   redrawTable(dataset);
// }

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
  $("#sb-link").attr('href', 'https://alvin.newschool.edu/prbn/bwckschd.p_disp_detail_sched?term_in=201530&crn_in=' + thisClass[0].crn)
  // $(document).prop('title', 'b-c-f-' + thisClass[0].title_text);
  $("#sbar-wrap").show();

  reset(thisClass[0].crn, "https://better-class-finder.herokuapp.com/#!" + thisClass[0].crn, thisClass[0].title_text);
}

$(window).on('hashchange', function() {
  var url = window.location.href;
  // if(url.search("#") > -1) {
  //   var selectedCrn = url.split("#")[1];
  //   populateSidebar("#" + selectedCrn);
  // }
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
  console.log("callback")
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
