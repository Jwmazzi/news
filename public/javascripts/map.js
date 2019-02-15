function get_route_path(url, route) {

    var page = new URL(url);

    var type = page.search.split('=')[1];

    // Set Default on First Load
    if (!type) {
        var path = `${page.origin}/${route}?category=protest`;
    } else {
        var path = `${page.origin}/${route}?category=${type}`;
    }

    return path;

}

function fetch_events(e) {

    fetch(get_route_path(window.location.href, 'features')).then(response => {

        return response.json();

    }).then(data => {

        L.geoJSON(data, {

            onEachFeature: function(feat, layer) {

                layer.bindPopup(`
                    <strong>Event ID: ${feat.properties.globaleventid}</strong><br/>
                    <strong>Event Code: ${feat.properties.eventcode}</strong><br/>
                    <hr style="dotted 1px;" />

                    Actor 1: ${feat.properties.actor1name} <br/>
                    Actor 2: ${feat.properties.actor2name} <br/>
                    <hr style="dotted 1px;" />

                    Average Tone: ${feat.properties.avgtone} <br/>
                    Goldstein Scale: ${feat.properties.goldsteinscale} <br/>
                    <hr style="dotted 1px;" />

                    <a href="${feat.properties.sourceurl}" target="_blank">Go to the Article</a> <br/>
                `);
            }

        }).addTo(map);

    });

}

var grayscale = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	maxZoom: 19
});

var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var baseMaps = {
    "Grayscale": grayscale,
    "Imagery": imagery
};

var map = L.map('map', {layers: [grayscale]});

L.control.layers(baseMaps).addTo(map);

map.on('load', fetch_events);

map.setView([20, -20], 2);

// Build Map Interaction with Table
document.querySelectorAll('#top-ten-table a').forEach(e => e.addEventListener("mouseover", function() {

    map.eachLayer(function(layer) {

        if (layer.feature) {

            if (layer.feature.id == e.id) {

                console.log('Found. Update Symbology and Extent');

            } 

        }

    });

}));

// Build Search Functionality
function basic_search(e) {

    var input_targets = document.getElementsByClassName("form-control");
    var input_values = Array.prototype.slice.call(input_targets).map(input => input.value);

    console.log(input_values);

    fetch(get_route_path(window.location.href, 'news'));

}
