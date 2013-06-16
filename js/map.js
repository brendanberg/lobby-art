function b64_to_utf8( str ) {
    return decodeURIComponent(window.atob( str ));
}

var map = L.map('map');

L.tileLayer('http://{s}.tiles.mapbox.com/v3/brendanberg.map-3c5zsf9m/{z}/{x}/{y}.png', {
	maxZoom: 18,
	minZoom: 10
}).addTo(map);

$.ajax({
	url: 'https://api.github.com/repos/brendanberg/lobby-art/contents/data/art.geojson?ref=master',
	dataType: 'json',
	type: 'GET'
}).then(
	function(response, status, jqXHR) {
		var decoded = b64_to_utf8(response.content.replace(/\n/g, '')),
			geoData = JSON.parse(decoded);

		L.geoJson(geoData, {
			style: function (feature) {
				return {color: feature.properties.color};
			},
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.description);
			}
		}).addTo(map);

	}
);

