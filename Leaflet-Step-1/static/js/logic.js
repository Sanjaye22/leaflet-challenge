// Create our map, giving it the satellitemap and earthquakes layers to display on load
var myMap = L.map("map").setView([37.09, -95.71], 5);

//Grab URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  console.log(data)
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define satellitemap and darkmap layers
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    // tileSize: 512,
    maxZoom: 18,
    id: "mapbox/satellite-streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  });

  var grayScale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/light-v10",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  });

  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/outdoors-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  });


  //Array to holds all circles
  var circleArray = [];

  //Loop through the location array and create one marker for each earthquake object

  for (var i = 0; i < earthquakeData.length; i++) {
    coordinates = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]]
    properties = earthquakeData[i].properties;

    //   // Conditionals for countries points
    var color = "";

    if (properties.mag < 1) {
      color = "green";
    }
    else if (properties.mag < 2) {
      color = "yellow";
    }
    else if (properties.mag < 3) {
      color = "orange";
    }
    else if (properties.mag < 4) {
      color = "purple";
    }
    else {
      color = "red";
    }

    // Add circles to map
    var myCircle = L.circle(coordinates, {
      fillOpacity: 0.7,
      color: color,
      fillColor: color,
      // Adjust radius
      radius: (properties.mag * 20000)
    }).bindPopup("<h1>" + properties.place + "</h1> <hr> <h3>Magnitud: " + properties.mag.toFixed(2) + "</h3>");
    //Add the cricle to the array
    circleArray.push(myCircle);

    //Create the layer for the circles
    var earthquakes = L.layerGroup(circleArray);
  };

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satelite": satellite,
    "GrayScale": grayScale,
    "Outdoors": outdoors
  };

  // Create overlay object to hold our overlay layer
  //Earthquake data from geojson
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  //Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);

  // Custom legend control
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var mag = ["0-1", "1-2", "2-3", "3-4", "5+"],
    // var getColor = ["#00ccbc", "#90eb9d", "#f9d057", "#f29e2e", "#e76818", "#d7191c"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag.length; i++) {
      div.innerHTML +=
        '<i style="background-color:' + color(mag[i] + 1) + '"></i> ' +
        mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');

      return div;
    }
  };

  //Add the legend by default
  legend.addTo(map);

  //Overlay listener for adding
  myMap.on('overlayadd', function (a) {
    //Add the legend
    legend.addTo(myMap);
  });

  //Overlay listener for remove
  myMap.on('overlayremove', function (a) {
    //Remove the legend
    myMap.removeControl(legend);
  });

};
