function b64_to_utf8(str) {
    return decodeURIComponent(window.atob(str));
}

var map = L.mapbox.map('map', 'brendanberg.map-3c5zsf9m').setView([40.738, -73.989], 13);
map.legendControl.addLegend(document.getElementById('legend-content').innerHTML);

var markerColors = {
	'private-lobby': '#c0392b',
	'private-outdoor': '#e67e22',
	'public-lobby': '#2980b9',
	'public-outdoor': '#16a085'
};

var markerStyle = {
	'marker-size': 'small',
	'marker-color': '#438fd3',
	'marker-symbol': null
};

var template = {"type":"Template","expressionList":[{"type":"Literal","string":"<p>"},{"type":"Block","name":{"type":"Name","name":"if"},"expression":{"type":"Expression","searchPath":[{"type":"Name","name":"Location"}]},"consequent":{"type":"Template","expressionList":[{"type":"Literal","string":"<span class=\"title\">"},{"type":"Expression","searchPath":[{"type":"Name","name":"Location"}]},{"type":"Literal","string":"</span>"},{"type":"Block","name":{"type":"Name","name":"if"},"expression":{"type":"Expression","searchPath":[{"type":"Name","name":"Address"}]},"consequent":{"type":"Template","expressionList":[{"type":"Literal","string":"<br>"},{"type":"Expression","searchPath":[{"type":"Name","name":"Address"}]}]}}]},"alternative":{"type":"Template","expressionList":[{"type":"Literal","string":""},{"type":"Block","name":{"type":"Name","name":"if"},"expression":{"type":"Expression","searchPath":[{"type":"Name","name":"Address"}]},"consequent":{"type":"Template","expressionList":[{"type":"Literal","string":"<span class=\"title\">"},{"type":"Expression","searchPath":[{"type":"Name","name":"Address"}]},{"type":"Literal","string":"</span>"}]}}]}},{"type":"Literal","string":"</p>"},{"type":"Block","name":{"type":"Name","name":"if"},"expression":{"type":"Expression","searchPath":[{"type":"Name","name":"Image"}]},"consequent":{"type":"Template","expressionList":[{"type":"Literal","string":"<img src=\""},{"type":"Expression","searchPath":[{"type":"Name","name":"Image"}]},{"type":"Literal","string":"\" width=\"100%\">"}]}},{"type":"Literal","string":"<p><strong>"},{"type":"Expression","searchPath":[{"type":"Name","name":"Artist"}]},{"type":"Literal","string":"</strong><br><em>"},{"type":"Expression","searchPath":[{"type":"Name","name":"Title"}]},{"type":"Literal","string":"</em></p>"}]};

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
				var properties = feature.properties, popupTemplate, style, styleProps = {};

				if (layer instanceof L.Marker) {
					for (style in markerStyle) {
						if (style in properties) {
							styleProps[style] = properties[style];
						} else {
							styleProps[style] = markerStyle[style];
						}
					}
					if ('feature-type' in properties) {
						styleProps['marker-color'] = markerColors[properties['feature-type']];
					}
					layer.setIcon(L.mapbox.marker.icon(styleProps));
				}

				popupTemplate = Strudel.load(template);
				layer.bindPopup(popupTemplate(properties), {minWidth: 400});
			}
		}).addTo(map);

	}
);

