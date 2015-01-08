var ws = new WebSocket('ws://localhost:8080');

ws.onmessage = function(Event, flags) {
    console.debug( Event.data.split(",") );
};