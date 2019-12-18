// variables for data. 
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"; 
var faultLinesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// setting circle size for magnitude of earthquake 
function markerSize(magnitude) {
    return magnitude * 4;
};

// setting color for each earthquake size 
function magColor(mag) {
    if (mag > 5) {
        return 'red'
    }
    else if (mag > 4) {
        return 'peru'
    }
    else if (mag > 3) {
        return 'darkorange'
    }
    else if (mag > 2) {
        return 'gold'
    }
    else if (mag > 1) {
        return 'greenyellow'
    }
    else {
        return 'chartreuse'
    }
}; 

// creating layer of variables for earthquake points 
var earthquake =  new L.LayerGroup(); 

d3.json(earthquakeURL, function(quakes) {
    L.geoJSON(quakes.features, {
        pointToLayer: function (point, latlng) {
            return L.circleMarker(latlng, {radius: markerSize(point.properties.mag)});
        },

        style: function (feature) {
            return {
                fillColor: magColor(feature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'
            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquake);
});

// creating faultline layer 
var faultline = new L.LayerGroup();

d3.json(faultLinesURL, function (lines) {
    L.geoJSON(lines.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2,
                color: '#f8d409'
            }
        },
    }).addTo(faultline);
}); 

// create map

function makeMap() {
    // creating basemaps to display
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
      });
    var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
      });
    // assinging basemaps to variable for overlay legend 
    var baseMaps = {
        "Dark Map": darkmap,
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };
    // creating overlays for the data shown on the map
    var overlayMaps = {
        "Fault Lines": faultline,
        "Earthquakes": earthquake
      };

    // creating map
    var myMap = L.map("map", {
        center: [37.6872, -97.3301], // <-- wichita ks 
        zoom: 3.5, 
        layers: [darkmap, earthquake, faultline]
    }); 

    // adding the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

    // creating legend for map
    var legend = L.control({ position: 'bottomright'});

    legend.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    legend.addTo(myMap);

    document.querySelector(".legend").innerHTML=displayLegend();
    
    function displayLegend(){
        var legendInfo = [{
        limit: "Mag: 0-1",
        color: "chartreuse"
    },{
        limit: "Mag: 1-2",
        color: "greenyellow"
    },{
        limit:"Mag: 2-3",
        color:"gold"
    },{
        limit:"Mag: 3-4",
        color:"DarkOrange"
    },{
        limit:"Mag: 4-5",
        color:"Peru"
    },{
        limit:"Mag: 5+",
        color:"red"
    }];
    
        var header = "<h3>Magnitude</h3><hr>";
    
        var strng = "";
       
        for (i = 0; i < legendInfo.length; i++){
            strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
        }
        
        return header+strng;
    
    }

}; 
makeMap(); 
