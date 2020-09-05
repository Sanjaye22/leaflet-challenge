//Day 1, Activity 10
//
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  console.log(data)
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define satellitemap and darkmap layers
  var satellite = L.tileLayer("https://api.mapbox.com/v4/mapbox.satellite/1/0/0@2x.jpg90?", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    // tileSize: 512,
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  var grayScale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satelite": satellite,
    "GrayScale": grayScale,
    "Outdoor": outdoors
    
  };

  // Create overlay object to hold our overlay layer
  //Earthquake data from geojson
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the satellitemap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [-122.7333298, 38.7998352],
    zoom: 5,
    layers: [satellite, earthquakes]
  });

  //Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);

//   // Create two separate layer groups: one for cities and one for states
//   // var states = L.layerGroup(stateMarkers);
//   // var cities = L.layerGroup(cityMarkers);


// };

// // // Loop through the cities array and create one marker for each city object
// // countries.forEach(country => {
// //   var color = "";
// //   switch (true){
// //     case(country.points > 200):
// //       color = "yellow";
// //       break;
// //     case(country.points > 100):
// //       color = "blue";
// //       break;
// //     case(country.points > 90):
// //       color = "green";
// //       break;
// //     default:
// //       color = "red";

};