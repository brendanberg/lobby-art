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
				var properties = feature.properties, popupContent;

				if ('Location' in properties && 'Address' in properties) {
					popupContent = '<p><span class="title">' + properties['Location'] + '</span><br>' + properties['Address'] + '</p>';
				} else if ('Location' in properties) {
					popupContent = '<p><span class="title">' + properties['Location'] + '</span></p>';
				} else if ('Address' in properties) {
					popupContent = '<p><span class="title">' + properties['Address'] + '</span></p>';
				}

				if ('Image' in properties) {
					popupContent += '<img src="' + properties['Image'] + '" width="100%">';
				}

				popupContent += '<p><strong>' + properties['Artist'] + '</strong><br>' +
					'<em>' + properties['Title'] + '</em></p>';

				layer.bindPopup(popupContent, {minWidth: 350});
			}
		}).addTo(map);

	}
);

