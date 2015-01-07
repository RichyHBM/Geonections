//WebSocket server
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });

wss.broadcast = function(data){
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

//Netstat watcher
var spawn = require('child_process').spawn,
    netstat = spawn('watch', ['-d', '-n0', 'netstat -an']);

//Received new data from netstat
netstat.stdout.on('data', function (data) {
    //get list of IP's
    var ips = data.toString().match(/\d{1,3}(?:\.\d{1,3}){3}(?::\d{1,5})?/g);

    if(ips){
        //Remove invalid IP's
        ips = ips.filter( function( item ) {
            //Filter out loopback, private and invalid IP's
            return item.indexOf("0.0.0.0") != 0 && 
                   item.indexOf("127.0.0.1") != 0 &&
                   item.indexOf("10.") != 0 &&
                   item.indexOf("192.168.") != 0 &&
                   item.test(/(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)/g) == false;
        });
        //For now just send array of IP's
        wss.broadcast(ips.toString());
    }
});

netstat.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

//Express app
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendfile('./index.html');
});

app.listen(3000);