function b64_to_utf8( str ) {
    return decodeURIComponent(window.atob( str ));
}

var map = L.map('map');

$.ajax({
	url: 'https://api.github.com/repos/brendanberg/lobby-art/contents/data/art.geojson?ref=master',
	dataType: 'json',
	type: 'GET'
}).then(
	function(response, status, jqXHR) {
		var decoded = b64_to_utf8(response.content.replace(/\n/g, '')),
			geoData = JSON.parse(decoded);
		console.log(geoData);

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

