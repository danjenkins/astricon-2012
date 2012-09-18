var AsteriskAmi = require('asterisk-ami');
var nowjs = require("now");
var fs = require('fs');

var ami = new AsteriskAmi( { host: '172.16.172.131', username: 'astricon', password: 'secret' } );

var httpServer = require('http').createServer(function(req, res){ 
  var stream = fs.createReadStream(__dirname + '/webpage.html');
  stream.on('error', function (err) {
      res.statusCode = 500;
      res.end(String(err));
  });
  stream.pipe(res);
});

httpServer.listen(8080);

var everyone = nowjs.initialize(httpServer);

ami.on('ami_data', function(data){
  if(everyone.now.echoAsteriskData instanceof Function){
    everyone.now.echoAsteriskData(data);
  }
});

ami.connect(function(response){
  setInterval(function(){
    ami.send({action: 'Ping'});//run a callback event when we have connected to the socket
  }, 1000);
});

process.on('SIGINT', function () {
  ami.disconnect();
  process.exit(0);
});