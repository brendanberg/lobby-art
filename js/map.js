function b64_to_utf8(str) {
    return decodeURIComponent(window.atob(str));
}

var map = L.mapbox.map('map', 'brendanberg.map-3c5zsf9m').setView([40.738, -73.989], 13);

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
				return {color: feature.properties['marker-color']};
			},
			onEachFeature: function (feature, layer) {
				var properties = feature.properties;
				var popupContent = '<h2>' + properties['Location'] + '</h2>';

				if ('Address' in properties) {
					popupContent += '<p>' + properties['Address'] + '</p>';
				}

				if ('Image' in properties) {
					popupContent += '<img src="' + properties['Image'] + '">';
				}

				popupContent += '<p><strong>' + properties['Artist'] + '</strong><br>' +
					'<em>' + properties['Title'] + '</em></p>';

				layer.bindPopup(popupContent, {minWidth: 350});
			}
		}).addTo(map);

	}
);

