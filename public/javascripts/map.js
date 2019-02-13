var map = L.map('map');

function fetch_events(e) {

    var page = new URL(window.location.href);

    var type = page.search.split('=')[1];

    var path = `${page.origin}/features?category=${type}`;

    fetch(path).then(response => {

        return response.json();

    }).then(data => {

        // TODO - Inject Properties into Marker Pop Up
        var features = data.map(feature => JSON.parse(feature.geo));

        L.geoJSON(features).addTo(map);

    });

}

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	maxZoom: 19
}).addTo(map);

map.on('load', fetch_events);

map.setView([20, -20], 2);