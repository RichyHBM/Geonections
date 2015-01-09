//WebSocket server
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });

wss.broadcast = function(data){
    wss.clients.forEach(function each(client) {
        try {
            client.send(data);
        } catch (e) { }
    });
};

//Read Geo-IP db
var mmdbreader = require('maxmind-db-reader');
var citiesDB = mmdbreader.openSync('./GeoLite2-City.mmdb');

//Netstat watcher
var spawn = require('child_process').spawn,
    netstat = spawn('watch', ['-d', '-n0', 'netstat -an']);

var classBRegex = new RegExp('(^172\\.1[6-9]\\.)|(^172\\.2[0-9]\\.)|(^172\\.3[0-1]\\.)', 'g');

//Received new data from netstat
netstat.stdout.on('data', function (data) {
    //get list of IP's
    var ips = data.toString().match(/\d{1,3}(?:\.\d{1,3}){3}(?::\d{1,5})?/g);

    if(ips){
        //Remove invalid IP's
        ips = ips.filter( function( item ) {
            //Filter out loopback, private and invalid IP's
            return item.indexOf("0.0.0.0") !== 0 &&
                   item.indexOf("127.0.0.1") !== 0 &&
                   item.indexOf("10.") !== 0 &&
                   item.indexOf("192.168.") !== 0 &&
                   classBRegex.test(item) === false;
        });

        var locations = [];

        //Get location from IP
        ips.forEach(function each(ip) {
            var city = {};

            var geodata = citiesDB.getGeoDataSync(ip);

            if(geodata && geodata.location){
                city.lon = geodata.location.latitude;
                city.lat = geodata.location.longitude;

                locations.push(city);
            }
        });
        
        if(locations.length > 0){
            //Send array of locations
            wss.broadcast(JSON.stringify(locations));
        }
    }
});

netstat.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

//Express app
var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000);
