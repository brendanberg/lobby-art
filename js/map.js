
mapboxgl.accessToken =
	'pk.eyJ1IjoiYnJlbmRhbmJlcmciLCJhIjoiWXVvZHV6VSJ9.6wcfcCqUfRnFd2EUT_9QGw';
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/brendanberg/cikk9vbhw003hsykput8wm6ry',
	center: [-73.989, 40.738],
	zoom: 13,
});

const nav = new mapboxgl.NavigationControl({
	showCompass: false,
	showZoom: true,
});

map.addControl(nav, 'top-left');

/*
map.legendControl.addLegend(
	document.getElementById('legend-content').innerHTML
);*/

const markerColors = {
	'private-lobby': '#c0392b',
	'private-outdoor': '#e67e22',
	'public-lobby': '#2980b9',
	'public-outdoor': '#16a085',
};

const template = {
	type: 'Template',
	expressionList: [
		{type: 'Literal', string: '<p>'},
		{
			type: 'Block',
			name: {type: 'Name', name: 'if'},
			expression: {
				type: 'Expression',
				searchPath: [{type: 'Name', name: 'Location'}],
			},
			consequent: {
				type: 'Template',
				expressionList: [
					{type: 'Literal', string: '<span class="title">'},
					{
						type: 'Expression',
						searchPath: [{type: 'Name', name: 'Location'}],
					},
					{type: 'Literal', string: '</span>'},
					{
						type: 'Block',
						name: {type: 'Name', name: 'if'},
						expression: {
							type: 'Expression',
							searchPath: [{type: 'Name', name: 'Address'}],
						},
						consequent: {
							type: 'Template',
							expressionList: [
								{type: 'Literal', string: '<br>'},
								{
									type: 'Expression',
									searchPath: [
										{type: 'Name', name: 'Address'},
									],
								},
							],
						},
					},
				],
			},
			alternative: {
				type: 'Template',
				expressionList: [
					{type: 'Literal', string: '<span class="title">'},
					{
						type: 'Expression',
						searchPath: [{type: 'Name', name: 'Address'}],
					},
					{type: 'Literal', string: '</span>'},
				],
			},
		},
		{type: 'Literal', string: '</p>'},
		{
			type: 'Block',
			name: {type: 'Name', name: 'if'},
			expression: {
				type: 'Expression',
				searchPath: [{type: 'Name', name: 'Image'}],
			},
			consequent: {
				type: 'Template',
				expressionList: [
					{
						type: 'Literal',
						string:
							'<div class="image" style="background-image: url(\'',
					},
					{
						type: 'Expression',
						searchPath: [{type: 'Name', name: 'Image'}],
					},
					{type: 'Literal', string: '\')"></div>'},
				],
			},
		},
		{type: 'Literal', string: '<p><strong>'},
		{type: 'Expression', searchPath: [{type: 'Name', name: 'Artist'}]},
		{type: 'Literal', string: '</strong><br><em>'},
		{type: 'Expression', searchPath: [{type: 'Name', name: 'Title'}]},
		{type: 'Literal', string: '</em></p>'},
	],
};

map.on('load', () => {
	map.addSource('works', {
		type: 'geojson',
		data:
			'https://raw.githubusercontent.com/brendanberg/lobby-art/master/data/art.geojson',
	});

	map.loadImage('http://a.tiles.mapbox.com/v3/marker/pin-s+c0392b.png', (error, image) => {
		map.addImage('private-lobby', image);
	});
	map.loadImage('http://a.tiles.mapbox.com/v3/marker/pin-s+e67e22.png', (error, image) => {
		map.addImage('private-outdoor', image);
	});
	map.loadImage('http://a.tiles.mapbox.com/v3/marker/pin-s+2980b9.png', (error, image) => {
		map.addImage('public-lobby', image);
	});
	map.loadImage('http://a.tiles.mapbox.com/v3/marker/pin-s+16a085.png', (error, image) => {
		map.addImage('public-outdoor', image);
	});

	map.addLayer({
		id: 'markers',
		type: 'symbol',
		source: 'works',
		layout: {'icon-image': '{feature-type}'}
	});

	map.on('click', (e) => {
		let features = map.queryRenderedFeatures(e.point, {layers: ['markers']});

		if (!features.length) {
			return;
		}

		let feature = features[0];
		// TODO: Replace strudel template with React component
		let popupTemplate = Strudel.load(template);

		let popup = new mapboxgl.Popup({
			offset: 20,
			closeButton: false,
			maxWidth: '500px',
		})
			.setLngLat(feature.geometry.coordinates)
			.setHTML(popupTemplate(feature.properties))
			.addTo(map);
	});

	map.on('mousemove', (e) => {
		let features = map.queryRenderedFeatures(e.point, {layers: ['markers']});
		map.getCanvas().style.cursor = features.length ? 'pointer' : '';
	});
});
/*
	L.geoJson(geoData, {
		style: function(feature) {
			return {color: feature.properties['marker-color']};
		},
		onEachFeature: function(feature, layer) {
			var properties = feature.properties,
				popupTemplate,
				style,
				styleProps = {};

			if (layer instanceof L.Marker) {
				for (style in markerStyle) {
					if (style in properties) {
						styleProps[style] = properties[style];
					} else {
						styleProps[style] = markerStyle[style];
					}
				}
				if ('feature-type' in properties) {
					styleProps['marker-color'] =
						markerColors[properties['feature-type']];
				}
				layer.setIcon(L.mapbox.marker.icon(styleProps));
			}

			popupTemplate = Strudel.load(template);
			layer.bindPopup(popupTemplate(properties), {minWidth: 400});
		},
	}).addTo(map);
});*/
