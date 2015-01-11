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

module.exports = wss;