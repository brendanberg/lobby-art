var map = L.map('map');

$.ajax({
	url: 'https://github.com/brendanberg/lobby-art/blob/master/data/art.geojson',
	dataType: 'json',
	type: 'GET'
}).then(
	function(geoData, status, jqXHR) {
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

