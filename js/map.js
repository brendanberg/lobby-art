mapboxgl.accessToken =
	'pk.eyJ1IjoiYnJlbmRhbmJlcmciLCJhIjoiWXVvZHV6VSJ9.6wcfcCqUfRnFd2EUT_9QGw';

// Disable scrolling
/*document.body.addEventListener('touchmove', (e) => {
	if (!e._isScroller) {
		e.preventDefault();
	}
}, { passive: false });

let overscroll = (elt) => {
	elt.addEventListener('touchstart', (e) => {
		let top = elt.scrollTop;
		let totalScroll = elt.scrollHeight;
		let currentScroll = top + elt.offsetHeight;

		if (top === 0) {
			elt.scrollTop = 1;
		} else if (currentScroll === totalScroll) {
			elt.scrollTop = top - 1;
		}
	});

	elt.addEventListener('touchmove', (e) => {
		if (elt.offsetHeight < elt.scrollHeight) {
			e._isScroller = true;
		}
	});
};

overscroll(document.querySelectorAll('.scroll'));
*/
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/brendanberg/cikk9vbhw003hsykput8wm6ry',
	center: [-73.989, 40.738],
	zoom: 13,
	logoPosition: 'top-left',
	attributionControl: false,
})
	.addControl(
		new mapboxgl.AttributionControl({
			compact: true,
		}),
		'top-right'
	).addControl(
		new mapboxgl.NavigationControl({
			showCompass: false,
			showZoom: true,
		}),
		'top-left'
	);

/*
map.legendControl.addLegend(
	document.getElementById('legend-content').innerHTML
);*/
let categoryButton = document.getElementById('categories');
let aboutButton = document.getElementById('about');
let submitFormButton = document.getElementById('submit');

let categoryPane = document.getElementById('legend-categories');
let aboutPane = document.getElementById('legend-about');
let submitFormPane = document.getElementById('legend-submit');

let menuButton = document.getElementById('menu-control');
let menuContainer = document.getElementById('legend-content');
let logoRegion = document.getElementById('logo-region');

categoryButton.addEventListener('click', (e) => {
	aboutPane.classList.add('hidden');
	submitFormPane.classList.add('hidden');
	categoryPane.classList.toggle('hidden');
});

aboutButton.addEventListener('click', (e) => {
	categoryPane.classList.add('hidden');
	submitFormPane.classList.add('hidden');
	aboutPane.classList.toggle('hidden');
});

submitFormButton.addEventListener('click', (e) => {
	aboutPane.classList.add('hidden');
	categoryPane.classList.add('hidden');
	submitFormPane.classList.toggle('hidden');
});

logoRegion.addEventListener('click', (e) => {
	if (menuContainer.classList.contains('closed')) {
		categoryButton.classList.remove('hidden');
		aboutButton.classList.remove('hidden');
		submitFormButton.classList.remove('hidden');

		menuContainer.classList.remove('closed');
		menuContainer.classList.add('open');
	}
});

menuButton.addEventListener('click', (e) => {
	if (menuContainer.classList.contains('open')) {
		categoryButton.classList.add('hidden');
		categoryPane.classList.add('hidden');
		aboutPane.classList.add('hidden');
		aboutButton.classList.add('hidden');
		submitFormPane.classList.add('hidden');
		submitFormButton.classList.add('hidden');

		menuContainer.classList.remove('open');
		menuContainer.classList.add('closed');
	} else {
		categoryButton.classList.remove('hidden');
		aboutButton.classList.remove('hidden');
		submitFormButton.classList.remove('hidden');

		menuContainer.classList.remove('closed');
		menuContainer.classList.add('open');
	}
	e.stopPropagation();
});

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
	// We start with the Collection Filters pane open and close it when the
	// map finishes loading.
	categoryButton.classList.add('hidden');
	aboutButton.classList.add('hidden');
	submitFormButton.classList.add('hidden');
	menuContainer.classList.remove('open');
	menuContainer.classList.add('closed');


	map.addSource('works', {
		type: 'geojson',
		data:
			'https://raw.githubusercontent.com/brendanberg/lobby-art/master/data/art.geojson',
	});

	// Load marker images
	map.loadImage(
		'https://a.tiles.mapbox.com/v3/marker/pin-s+c0392b.png',
		(error, image) => {
			map.addImage('private-lobby', image);
		}
	);
	map.loadImage(
		'https://a.tiles.mapbox.com/v3/marker/pin-s+e67e22.png',
		(error, image) => {
			map.addImage('private-outdoor', image);
		}
	);
	map.loadImage(
		'https://a.tiles.mapbox.com/v3/marker/pin-s+2980b9.png',
		(error, image) => {
			map.addImage('public-lobby', image);
		}
	);
	map.loadImage(
		'https://a.tiles.mapbox.com/v3/marker/pin-s+16a085.png',
		(error, image) => {
			map.addImage('public-outdoor', image);
		}
	);

	map.addLayer({
		id: 'private-lobby',
		type: 'symbol',
		source: 'works',
		filter: ['==', ['get', 'feature-type'], 'private-lobby'],
		layout: {'icon-image': '{feature-type}', 'visibility': 'visible'},
	});

	map.addLayer({
		id: 'private-outdoor',
		type: 'symbol',
		source: 'works',
		filter: ['==', ['get', 'feature-type'], 'private-outdoor'],
		layout: {'icon-image': '{feature-type}', 'visibility': 'visible'},
	});

	// Show popup cards when markers are clicked
	map.on('click', (e) => {
		let features = map.queryRenderedFeatures(e.point, {
			layers: ['private-lobby', 'private-outdoor'],
		});

		if (!features.length) {
			return;
		}

		let feature = features[0];
		// TODO: Replace strudel template with React component
		let popupTemplate = Strudel.load(template);

		let popup = new mapboxgl.Popup({
			offset: 20,
			closeButton: true,
			maxWidth: '500px',
		})
			.setLngLat(feature.geometry.coordinates)
			.setHTML(popupTemplate(feature.properties))
			.addTo(map);
	});

	// Change cursor to pointer when hovering over markers
	map.on('mousemove', (e) => {
		let features = map.queryRenderedFeatures(e.point, {
			layers: ['private-lobby', 'private-outdoor'],
		});
		map.getCanvas().style.cursor = features.length ? 'pointer' : '';
	});

	// Select layer filter checkboxes and connect layer visibility changes
	document.querySelectorAll('input.marker').forEach((elt) => {
		elt.addEventListener('click', (e) => {
			let layerName = e.target.getAttribute('data-layer-name');
			e.stopPropagation();

			let visibility = map.getLayoutProperty(layerName, 'visibility');

			if (visibility === 'visible') {
				map.setLayoutProperty(layerName, 'visibility', 'none');
			} else {
				map.setLayoutProperty(layerName, 'visibility', 'visible');
			}
		});
	});
});

//https://api.mapbox.com/geocoding/v5/mapbox.places/401%20broadway.json?access_token=pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1560399326898&autocomplete=true&country=us&types=address&proximity=-73.99425476311615%2C40.74389042077257
