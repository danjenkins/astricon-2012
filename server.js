var AsteriskAmi = require('asterisk-ami');
var nowjs = require("now");
var fs = require('fs');
var express = require('express');
var http = require('http');


var ami = new AsteriskAmi( { host: '172.16.172.135', username: 'astricon', password: 'secret'} );
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

everyone.now.send_data_to_asterisk = function(data){
  console.log('got data from browser', data);
  ami.send(data);
}

ami.on('ami_data', function(data){
  if(everyone.now.echoAsteriskData instanceof Function){
    everyone.now.echoAsteriskData(data);//calls a function on the browser
  }
});

ami.connect(function(response){
  console.log('connected to the AMI');
});

process.on('SIGINT', function () {
  ami.disconnect();
  process.exit(0);
});