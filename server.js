var AsteriskAmi = require('asterisk-ami');
var nowjs = require("now");
var fs = require('fs');
var express = require('express');
var http = require('http');


var ami = new AsteriskAmi( { host: '172.16.172.130', username: 'astricon', password: 'secret'} );
var app = express();
var server = http.createServer(app).listen(8080, function(){
  console.log('listening on http://localhost:8080');
});

app.configure(function(){
  app.use("/assets", express.static(__dirname + '/assets'));
});

app.use(express.errorHandler());
app.get('/', function(req, res) {
  var stream = fs.createReadStream(__dirname + '/webpage.html');
  stream.on('error', function (err) {
      res.statusCode = 500;
      res.end(String(err));
  });
  stream.pipe(res);
})

var everyone = nowjs.initialize(server);

ami.on('ami_data', function(data){
  if(everyone.now.echoAsteriskData instanceof Function){
    everyone.now.echoAsteriskData(data);
  }
});

ami.connect(function(response){
  console.log('connected to the AMI');
  setInterval(function(){
    ami.send({action: 'Ping'});//run a callback event when we have connected to the socket
  }, 2000);
});

process.on('SIGINT', function () {
  ami.disconnect();
  process.exit(0);
});