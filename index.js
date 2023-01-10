"use strict";

var express = require('express')
  , rp= require('request-promise');

var app = express();

console.log(__dirname);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/index.html", function (err) {
    if (err) {
      console.error(err);
      res.status(404).end();
    }
    else {
      console.log('/');
    }
  });
});

app.get(/.+/, function (req, res) {
  //console.log(req);
  res.sendFile(__dirname + "/public/app.html", function (err) {
    if (err) {
      console.error('fejl: ' + err);
    }
    else {
      console.log('app.html');
    }
  });
}); 

var port= process.argv[2];

if (!port) port= 3000;
  console.log('port:%s', port);

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('URL http://%s:%s', host, port);
});
