var ws = new WebSocket('ws://localhost:8080');

var connections = [];
var serverinfo = null;

ws.onclose = function(event) {
    connections = [];
    alert("Lost connection to the server");
};

ws.onmessage = function(Event, flags) {

    var listOfCoords = JSON.parse(Event.data);

    if(!serverinfo)
    {
        serverinfo = {};
        serverinfo.latitude = listOfCoords[0].lat;
        serverinfo.longitude = listOfCoords[0].lon;
        serverinfo.radius = 2;
        serverinfo.country = listOfCoords[0].country;

        serverinfo.ip = listOfCoords[0].ip;
    }

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
        geo.country = listOfCoords[i].country;

        pushToTable(geo);
        //Display for 5 seconds
        geo.expires = new Date().getTime() + 1000 * 4;
        connections.push(geo);
    }
};

var tableContents = [];
var pushToTable = function (info)
{
    $('#table-info').empty();
    //Maintain at most 8 entries
    tableContents.push(info);
    if(tableContents.length > 8)
        tableContents.shift();
    for(var i = 0; i < tableContents.length; i++){
        $('#table-info').append('<tr><td>'+ tableContents[i].ip +'</td><td>'+ tableContents[i].country +'</td></tr>');
    }
}

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

    map.bubbles(connections.concat(serverinfo), {
        borderColor: '#0F0',
        popupTemplate: function(geo, data) { return '<div class="hoverinfo"><strong>' + data.ip + '<br />' + data.country + '</strong></div>'; }
    });

    //Keep arcs that expire in the future
    var now = new Date().getTime();
    connections = connections.filter( function( item ) {
        return item.expires > now;
    });
}, 500);

