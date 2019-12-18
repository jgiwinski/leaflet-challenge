// variable for data. 
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"; 

// create map
var myMap = L.map("map", {
    center: [], 
    zoom: 18
}); 

// create tile layer for background of map. 
var tileURL = "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}";
var tileAttribution = "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>";
var lightmap = L.tileLayer(tileURL, {
    attribution: tileAttribution,
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});.addTo(myMap);

