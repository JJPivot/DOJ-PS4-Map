// ---------------- Utility Classes & Functions ----------------

class MapboxGLButtonControl {
	constructor({
		className = "",
		title = "",
		eventHandler = evtHndlr
	}) {
		this._className = className;
		this._title = title;
		this._eventHandler = eventHandler;
	}

	onAdd(map) {
		this._btn = document.createElement("button");
		this._btn.className = "mapboxgl-ctrl-icon" + " " + this._className;
		this._btn.type = "button";
		this._btn.title = this._title;
		this._btn.onclick = this._eventHandler;

		this._container = document.createElement("div");
		this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
		this._container.appendChild(this._btn);

		return this._container;
	}

	onRemove() {
		this._container.parentNode.removeChild(this._container);
		this._map = undefined;
	}
}

// Creates a MapboxGL popup object based on a clickable layer
function createPopup(e) {
	// if any of the values from the layer are null, the || operators will default it to the other non-null value on the right-hand side
	var popupContent = "<h1>" + (e.features[0].properties.name || "Missing Name!") + "</h1>";
	popupContent += "\n<h2>" + (e.features[0].properties.address || "") + "</h2>";

	// don't add line or body text if there is none
	if (e.features[0].properties.about) {
		popupContent += "<hr>" + (e.features[0].properties.about || "");
	}

	// add the popup to the map
	new mapboxgl.Popup({offset: [0.0, -12.0]}).setLngLat(e.features[0].geometry.coordinates.slice()).setHTML(popupContent).addTo(map);
}

// ---------------- Map-specific Configuration ----------------

mapCenter = [0.030, -0.044];
defaultZoom = 13.25;
minimumZoom = 13.0;

// Mapbox public access token
// This can be found at https://account.mapbox.com/ under Access Tokens, or in the Share menu for your Mapbox map style
mapboxgl.accessToken = "pk.eyJ1IjoiZG9qcHM0IiwiYSI6ImNrdXFnMDZ0aTJ6MzAycW14ZDRtaTFkbmYifQ.koSV3HH2Cb8xOr2EkpSCLw";

// Create a new MapboxGL map, change its default settings
var map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/dojps4/ckur58fk5015614qrrbh3cd49",
	center: mapCenter,
	zoom: defaultZoom,
	maxZoom: 17.0,
	minZoom: minimumZoom,
	maxPitch: 0,
	maxBounds: [[-1.5,-1.5],[1.5,1.5]]
});

// Add various controls to the map, including a fullscreen button, navigation controls, and attribution.
// Be kind and don't remove the attribution.
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new MapboxGLButtonControl({ className: "mapbox-gl-home", title: "Reset view", eventHandler: function(e) {map.flyTo({	center: mapCenter, zoom: defaultZoom, pitch: 0, bearing: 0, speed: 0.5 });} } , "top-right"));
map.addControl(new mapboxgl.AttributionControl({customAttribution: "<a href='https://www.fiverr.com/neonfable/make-you-an-interactive-map-for-your-roleplaying-game'> <img src='assets/neonfable.svg' alt='Neon Fable logo' class='inline-icon'> Crafted by <b>Neon Fable</b>"}));

// ---------------- JavaScript Events ----------------

// enable click events for clickable layers
map.on("click", "points-of-interest", createPopup);
map.on("click", "properties-info", createPopup);

// Change the cursor when it enters and leaves clickable layers
map.on("mouseenter", "properties-info", function() { map.getCanvas().style.cursor = "pointer"; });
map.on("mouseenter", "points-of-interest", function() { map.getCanvas().style.cursor = "pointer"; });
map.on('mouseleave', "properties-info", function () { map.getCanvas().style.cursor = ''; });
map.on('mouseleave', "points-of-interest", function () { map.getCanvas().style.cursor = ''; });