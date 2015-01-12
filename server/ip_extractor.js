var path = require('path');

var serverInfo = require(path.join(__dirname, 'server_geo_info'));
var geodb = require(path.join(__dirname, 'geodb_reader'));

var classBRegex = new RegExp('(^172\\.1[6-9]\\.)|(^172\\.2[0-9]\\.)|(^172\\.3[0-1]\\.)', 'g');

var extractor = {};

extractor.callback = function(data){}

extractor.extract = function (data) {
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
        //First element will always be servers coords
        locations.push(serverInfo);
        //Get location from IP
        ips.forEach(function each(ip) {
            var connection = {};
            var geodata = geodb.getGeoDataSync(ip);

            if(geodata && geodata.location){
                connection.lat = geodata.location.latitude;
                connection.lon = geodata.location.longitude;
                connection.ip = ip;

                if(geodata.country && geodata.country.names){
                    connection.country = geodata.country.names.en;
                }else{
                    connection.country = "Unknown";
                }

                locations.push(connection);
            }
        });

        //Send array of locations
        extractor.callback(JSON.stringify(locations));
    }
};

module.exports = extractor;