var path = require('path');
var geodb = require(path.join(__dirname, 'geodb_reader'));

//Get my IP and my coordinates
var http = require("http");
var server = {};

http.get("http://curlmyip.com", function(res) {
    var body = '';

    res.on('data', function(d) {
        body += d;
        body = body.trim();
    });

    res.on('end', function() {
        var geodata = geodb.getGeoDataSync(body);

        server.ip = body;
        server.lat = geodata.location.latitude;
        server.lon = geodata.location.longitude;
    });
});

module.exports = server;