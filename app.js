// var express = require('express');
// var app = express();
var fs = require("fs");
// var cheerio = require('cheerio');
var request = require('request');

var static = require('node-static');
var file = new static.Server();

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
//
// var server = app.listen(3000, function () {
//   var host = server.address().address;
//   var port = server.address().port;
//
//   console.log('Example app listening at http://%s:%s', host, port);
// });
//

// //
// // var express = require('express');
// // var app = express();
//
// // var pg = require('pg');
// //
// // app.get('/db', function (request, response) {
// //   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
// //     client.query('SELECT * FROM test_table', function(err, result) {
// //       done();
// //       if (err)
// //        { console.error(err); response.send("Error " + err); }
// //       else
// //        { response.render('pages/db', {results: result.rows} ); }
// //     });
// //   });
// // })
//
// if (process.env.REDISTOGO_URL) {
//   var rtg   = require("url").parse(process.env.REDISTOGO_URL);
//   var client = require("redis").createClient(rtg.port, rtg.hostname);
//
//   redis.auth(rtg.auth.split(":")[1]);
// } else {
//   var client = require("redis").createClient();
// }
//
// function scapePage(html) {
//
// }
//
// app.get('/request/all', function (req, res) {
//   console.log("welcome to requests/all");
//   var date = new Date().getTime();
//   console.log(date);
//
//   // var listUrl = JSON.parse(fs.readFileSync("listUrlFile.json", "utf8")); // loading JSON list from file
//   var counter = 0;
//   var counterIndex;
//   var intervalSeconds;
//   var listStart = 0; // USER DEFINED: index to start requesting
//   var listEnd = 0; // USER DEFINED: index to end requesting
//   var intervalSeconds = 0.16; // USER DEFINED: seconds between requests
//   var interval = intervalSeconds * 1000;
//
//   var listUrl;
//
//   fs.readFile("listUrlFile.json", "utf8", function (err, data) {
//     if (err) throw err;
//     listUrl = JSON.parse(data);
//     console.log("There are " + listUrl.length + " URLs in this list.");
//     listEnd = listUrl.length - 1;
//     console.time();
//     makeRequest(listUrl[listStart]); // triggers first request
//     console.log("Starting to request ------->")
//   });
//
//   function makeRequest(reqCrn) {
//     var completeUrl = "https://alvin.newschool.edu/prbn/bwckschd.p_disp_detail_sched?term_in=201530&crn_in=" + reqCrn;
//     console.log("CRN: " + reqCrn);
//     request({
//       uri: completeUrl,
//     }, function(error, response, html) {
//       if(counterIndex != undefined) {
//         console.log("Request #" + counterIndex + " done.");
//       }
//       counterIndex = counter + 1;
//
//       // scrape page
//       var $ = cheerio.load(html);
//       var data = [];
//       //https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping
//       $('.dddefault td').each(function(i, element) {
//         if(i > 0) {
//           var a = $(this);
//           data.push(a.text());
//         }
//       });
//
//       // save results to redis
//       client.hmset(reqCrn, [
//         's_cap', data[0],
//         's_act', data[1],
//         's_rem', data[2],
//         'w_cap', data[3],
//         'w_act', data[4],
//         'w_rem', data[5]
//       ], function (err, value) {
//         // res.send(value);
//         console.log("just set CRN: " + reqCrn);
//       });
//
//       counter++;
//       listStart++;
//       if(listStart <= listEnd) { // if there are still elements in the list to request
//         var randomInterval = (intervalSeconds + Math.random() / 12 ) * 1000;
//         setTimeout(function() {
//           makeRequest(listUrl[listStart]); // triggers the next request, after interval
//         }, randomInterval);
//       } else { // if the list is done
//         console.log("-------> All requests done. Total time:");
//         console.timeEnd();
//         // save results to redis
//         client.hmset('reqlast', [
//           'crn', 'all',
//           'date', date
//         ], function (err, value) {
//           // console.log("Request log created.");
//           // client.hgetall('reqlast', function(err, value) {
//           //   client.lpush('reqlog', JSON.stringify(value), function (err, value) {
//           //     console.log("Request log stored.");
//           //   });
//           // });
//         });
//         client.hmset(date, [
//           'crn', 'all'
//         ], function (err, value) {
//           console.log("Request log stored.");
//         });
//         res.send("-------> All requests done.");
//       }
//     });
//   }
// });
//
// app.get('/request/:crn', function (req, res) {
//   console.log("welcome to requests/crn");
//   var date = new Date().getTime();
//   console.log(date);
//
//   function makeRequest(reqCrn) {
//     var completeUrl = "https://alvin.newschool.edu/prbn/bwckschd.p_disp_detail_sched?term_in=201530&crn_in=" + reqCrn;
//     console.log("CRN: " + reqCrn);
//     request({
//       uri: completeUrl,
//     }, function(error, response, html) {
//       // scrape page
//       var $ = cheerio.load(html);
//       var data = [];
//       //https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping
//       $('.dddefault td').each(function(i, element) {
//         if(i > 0) {
//           var a = $(this);
//           data.push(a.text());
//         }
//       });
//
//       // save results to redis
//       client.hmset(reqCrn, [
//         's_cap', data[0],
//         's_act', data[1],
//         's_rem', data[2],
//         'w_cap', data[3],
//         'w_act', data[4],
//         'w_rem', data[5]
//       ], function (err, value) {
//         console.log("just set CRN: " + reqCrn);
//       });
//       // save results to redis
//       client.hmset('reqlast', [
//         'crn', reqCrn,
//         'date', date
//       ], function (err, value) {
//         // console.log("Request log created.");
//         // client.hgetall('reqlast', function(err, value) {
//         //   client.lpush('reqlog', JSON.stringify(value), function (err, value) {
//         //     console.log("Request log stored.");
//         //   });
//         // });
//       });
//       client.hmset(date, [
//         'crn', reqCrn
//       ], function (err, value) {
//         console.log("Request log stored.");
//       });
//
//       res.send(data);
//     });
//   }
//
//   makeRequest(req.params.crn); // triggers the request with crn in url
// });

require('http').createServer(function(request, response) {
  request.addListener('end', function() {
    file.serve(request, response);
  }).resume();
}).listen(process.env.PORT || 3000);


// this could be a wiki-like website!
