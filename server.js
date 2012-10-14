var AsteriskAmi = require('asterisk-ami');

var ami = new AsteriskAmi( { host: '172.16.172.130', username: 'astricon', password: 'secret' } );

ami.on('ami_data', function(data){
  console.log('AMI DATA', data);
});

ami.connect(function(response){
  ami.send({action: 'Ping'});//run a callback event when we have connected to the socket
});

process.on('SIGINT', function () {
  ami.disconnect();
});