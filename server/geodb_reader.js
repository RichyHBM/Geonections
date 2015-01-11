var path = require('path');

//Read Geo-IP db
var mmdbreader = require('maxmind-db-reader');
var citiesDB = mmdbreader.openSync(path.join(__dirname, '..', 'GeoLite2-City.mmdb'));

module.exports = citiesDB;