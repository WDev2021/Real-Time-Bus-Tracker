var map;
var markers = [];

// load map
mapboxgl.accessToken = 'pk.eyJ1Ijoid2ViZGV2MjAyMSIsImEiOiJja29od2N0aDkwcWNlMndvYTVveXU2M2xzIn0.xQfYLQKMYZUPHrT6DLL-3A';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [-71.094915, 42.360175],
	zoom: 12.7
	
});

map.on('load', function () {
	map.addSource('route', {
		'type': 'geojson',
		'data': {
			'type': 'Feature',
			'properties': {},
			'geometry': {
				'type': 'LineString',
				'coordinates': [
				[-71.083892, 42.329903],
				[-71.082641, 42.330967],
				[-71.081259, 42.332322],
				[-71.079590, 42.332025],
				[-71.076352, 42.331676],
				[-71.073566, 42.333841],
				[-71.074944, 42.334976],
				[-71.076949, 42.336618],
				[-71.080341, 42.339470],
				[-71.083089, 42.341566],
				[-71.084232, 42.342467],
				[-71.087082, 42.345529], 
				[-71.093729, 42.359244],
				[-71.094915, 42.360175],
				[-71.0958, 42.360698],
				[-71.099558, 42.362953],
				[-71.103476, 42.365248],
				[-71.106067, 42.366806],
				[-71.108717, 42.368355],
				[-71.110799, 42.369192],
				[-71.113095, 42.370218],
				[-71.115476, 42.372085],
				[-71.117585, 42.373016],
				[-71.11744079074705, 42.373143738772235],
				]
			}
		}
	});

	map.addLayer({
		'id': 'route',
		'type': 'line',
		'source': 'route',
		'layout': {
			'line-join': 'round',
			'line-cap': 'round'
		},
		'paint': {
			'line-color': '#888',
			'line-width': 8
		}
	});
});

// Add bus markers to map
async function addMarkers(){
	// get bus data
	var locations = await getBusLocations();

	// loop through data, add bus markers
	locations.forEach(function(bus){
		var marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});

	// timer
	console.log(new Date());
	setTimeout(addMarkers,15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=1&include=trip';	
	var response = await fetch(url);
	var json     = await response.json();
	return json.data;
}

function addMarker(bus){
	var icon = getIcon(bus);
	var marker = new mapboxgl.Marker({
	    position: {
	    	lat: bus.attributes.latitude, 
	    	lng: bus.attributes.longitude
	    },
	    map: map,
	    icon: icon,
	    id: bus.id
	});
	markers.push(marker);
}

function getIcon(bus){
	// select icon based on bus direction
	if (bus.attributes.direction_id === 0) {
		return 'red.png';
	}
	return 'blue.png';	
}

function moveMarker(marker,bus) {
	// change icon if bus has changed direction
	var icon = getIcon(bus);
	marker.setIcon(icon);

	// move icon to new lat/lon
    marker.setPosition( {
    	lat: bus.attributes.latitude, 
    	lng: bus.attributes.longitude
	});
}

function getMarker(id){
	var marker = markers.find(function(item){
		return item.id === id;
	});
	return marker;
}

addMarkers();