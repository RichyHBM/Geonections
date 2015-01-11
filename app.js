var path = require('path');

var webSocketServer = require(path.join(__dirname, 'server', 'websocket_server'));

//Netstat watcher
var spawn = require('child_process').spawn,
    netstat = spawn('node', [ path.join('server', 'ip_printer.js')]);

var extractor = require(path.join(__dirname, 'server', 'ip_extractor'));
extractor.callback = webSocketServer.broadcast;

//Received new data from netstat
netstat.stdout.on('data', extractor.extract);

netstat.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
    process.exit(1);
});

var express_app = require(path.join(__dirname, 'server', 'html_server'));
express_app.listen(3000);