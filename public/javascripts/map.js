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

                    Keywords: ${feat.properties.keywords} <br/>
                    <hr style="dotted 1px;" />

                    ${feat.properties.summary} <br/>
                    <br/><a href="${feat.properties.sourceurl}" target="_blank">Go to the Article</a> <br/>
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

L.control.navbar().addTo(map);

// Table Mouseover
document.querySelectorAll('#top-ten-table a').forEach(e => e.addEventListener("mouseover", function() {

    map.eachLayer(function(layer) {

        if (layer.feature) {

            if (layer.feature.id == e.dataset.globalid) {

                map.setView(
                    [layer.feature.geometry.coordinates[1], layer.feature.geometry.coordinates[0]],
                    6
                );

                layer.openPopup();

            }

        }

    });

}));

// Build Search Functionality
function basic_search(e) {

    var input_targets = document.getElementsByClassName("form-control");
    var country_value = Array.prototype.slice.call(input_targets).map(input => input.value);

    var news_url = new URL(get_route_path(window.location.href, 'news'));

    var params = new URLSearchParams(news_url.search);
    params.append('country', country_value);

    news_url.search = params;

    window.open(news_url.href, "_self");

}

function export_shapefile() {

    var id_array = Array.prototype.slice.call(document.querySelectorAll('#globaleventid')).map(el => el.dataset.globalid);
    var the_date = Array.prototype.slice.call(document.querySelectorAll('.navbar-brand')).map(tr => tr.dataset.date)[0];
    var the_page = new URL(window.location.href).origin;

    fetch(`${the_page}/export`, {
        
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ids: id_array, table: the_date})
        
    }).then(response => {

        return response.json();


    }).then(data => {

        window.open(`${the_page}/${data.zip_path}`);

    });

}
