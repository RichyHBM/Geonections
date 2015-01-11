Geonections
===========

A lightweight node.js service for visualising network connections made to a computer

By default uses 'netstat' to retreive IP addresses of network connections, but this can be changed in the [server/ip_printer.js script](server/ip_printer.js) to monitor for IP addresses from logs or any other source

Change the location of the websocket server in [client/js/geonection-client.js](client/js/geonection-client.js), currently it will just attempt to connect to localhost

On a system that includes wget and gunzip, just npm install and npm start

If you dont have wget or gunzip, download and unzip the MaxMind GeoLite2-City database and place in the root directory.