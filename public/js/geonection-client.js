var ws = new WebSocket('ws://localhost:8080');

var connections = [];

ws.onmessage = function(Event, flags) {
    console.debug( Event.data );
    //add connection data with a timestamp
};

var map = new Datamap({
    element: document.getElementById('container'),
    fills: {
        defaultFill: '#00215C'
    },
    geographyConfig: {
        highlightOnHover: true,
        popupOnHover: true
    }
});

setInterval(function () {
    //draw arcs with map.arc(connections); ?
    //remove stale connection data
}, 500);