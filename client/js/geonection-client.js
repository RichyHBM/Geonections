var ws = new WebSocket('ws://localhost:8080');

var connections = [];

ws.onclose = function(event) {
    connections = [];
    alert("Lost connection to the server");
};

ws.onmessage = function(Event, flags) {

    var listOfCoords = JSON.parse(Event.data);

    //Start at 1 because element 0 is always the servers coords
    for(var i = 1; i < listOfCoords.length; i++)
    {
        var exists = false;

        connections.forEach(function (item) {
            if(item.ip === listOfCoords[i].ip)
            {
                item.expires = new Date().getTime() + 1000 * 4;
                exists = true;
            }
        });

        if(exists) continue;

        var geo = {};
        geo.destination = {};
        geo.destination.latitude = listOfCoords[0].lat;
        geo.destination.longitude = listOfCoords[0].lon;

        geo.origin = {};
        geo.origin.latitude = listOfCoords[i].lat;
        geo.origin.longitude = listOfCoords[i].lon;

        geo.latitude = listOfCoords[i].lat;
        geo.longitude = listOfCoords[i].lon;
        geo.radius = 4;

        geo.ip = listOfCoords[i].ip;

        //Display for 5 seconds
        geo.expires = new Date().getTime() + 1000 * 4;
        connections.push(geo);
    }
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
    //Draw arcs
    map.arc(connections, {
        strokeColor: '#DD1C77',
        strokeWidth: 1.5,
        arcSharpness: 0.5,
        animationSpeed: 800
    });

    map.bubbles(connections, {
        borderColor: '#0F0',
        popupTemplate: function(geo, data) { return '<div class="hoverinfo"><strong>' + data.ip + '</strong></div>'; }
    });

    //Keep arcs that expire in the future
    var now = new Date().getTime();
    connections = connections.filter( function( item ) {
        return item.expires > now;
    });
}, 500);

