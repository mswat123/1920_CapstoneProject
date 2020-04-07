let markedDiseases = [];
let lastKnownLocation = null;
let map = null;

// Arrays containing data from Firebase
var CoronaLatitudes = [];
var CoronaLongitudes = [];
var CoronaTimes = [];
var CoronaLocations = [];
var CoronaCount = [];
var CoronaKeys = [];

var FluLatitudes = [];
var FluLongitudes = [];
var FluTimes = [];
var FluLocations = [];
var FluCount = [];
var FluKeys = [];

var currentlocation = "";
var currentlat = "";
var currentlong = "";

// Initialize the Google Maps API to display to user, zoom into middle of Monmouth County
function initMap() {
    var mapProp = {
        center: new google.maps.LatLng(40.375401, -74.256844),
        zoom: 10
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    // var markers = [
    //     {
    //         coords: { lat: 42.4668, lng: -70.9495 },
    //         iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    //         content: '<h1>Lynn MA</h1>'
    //     },
    //     {
    //         coords: { lat: 42.8584, lng: -70.9300 },
    //         content: '<h1>Amesbury MA</h1>'
    //     },
    //     {
    //         coords: { lat: 42.7762, lng: -71.0773 }
    //     }
    // ];


    // addMarker({ coords: { lat: 42.3601, lng: -71.0589 }, iconImage: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" })
    // addMarker({ coords: { lat: 50.2301, lng: -80.2842 }, iconImage: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" })
}

// HTTP client for API calls
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}


// Event listener if a new Coronavirus case is entered into database
firebase.database().ref("Coronavirus").on("child_added", function(snapshot, prevChildKey) {
    var newPost = snapshot.val();
    CoronaLatitudes.push(newPost.Latitute);
    CoronaLongitudes.push(newPost.Longitude);
    CoronaTimes.push(newPost.Timestamp);
    CoronaLocations.push(newPost.Location);
    CoronaCount.push(newPost.Count);
    CoronaKeys.push(newPost.key);
    CoronaPopulateTable();
});

// Event listener if a new Influenza case is entered into database
firebase.database().ref("Influenza").on("child_added", function(snapshot, prevChildKey) {
    var newPost = snapshot.val();
    FluLatitudes.push(newPost.Latitute);
    FluLongitudes.push(newPost.Longitude);
    FluTimes.push(newPost.Timestamp);
    FluLocations.push(newPost.Location);
    FluCount.push(newPost.Count);
    FluKeys.push(newPost.key);
    InfluenzaPopulateTable();
});

// Once arrays are populated with data, display the data in an updated table in HTML
function InfluenzaPopulateTable(){
    $("#InfluenzaMap tr").remove(); 
        
        var tablestring = "";
        tablestring += "<tr> <th>Timestamp</th><th>Location</th><th>Count</th><th>Latitude</th><th>Longitude</th></tr>"

        // Append to tablestring and display lat/long coordinate as marker in map
        for (var x = 0; x<FluLongitudes.length; x++) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(FluLatitudes[x], FluLongitudes[x]),
                icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                }
            });
            marker.setMap(map);
            tablestring += "<tr>" + "<td>" + FluTimes[x] + "</td>" + "<td>" + FluLocations[x] +"</td>" + "<td>" + FluCount[x] +"</td>" + "<td>" + FluLatitudes[x] + "</td>" + "<td>" + FluLongitudes[x] + "</td>" + "</tr>"
        }
        $("#InfluenzaMap tbody").append(
            tablestring
        );
}

// Once arrays are populated with data, display the data in an updated table in HTML
function CoronaPopulateTable() {
    $("#CoronavirusMap tr").remove(); 
        
        var tablestring = "";
        tablestring += "<tr> <th>Timestamp</th><th>Location</th><th>Count</th><th>Latitude</th><th>Longitude</th></tr>"

        // Append to tablestring and display lat/long coordinate as marker in map
        for (var x = 0; x<CoronaLongitudes.length; x++) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(CoronaLatitudes[x], CoronaLongitudes[x]),
                icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                }
            });
            marker.setMap(map);
            tablestring += "<tr>" + "<td>" + CoronaTimes[x] + "</td>" + "<td>" + CoronaLocations[x]+"</td>" + "<td>" + CoronaCount[x]+"</td>" + "<td>" + CoronaLatitudes[x] + "</td>" + "<td>" + CoronaLongitudes[x] + "</td>" + "</tr>"
        }
        $("#CoronavirusMap tbody").append(
            tablestring
        );
}

// Read data from firebase when a new point is added, repopulate arrays to ensure that all data is up to date
function firebaseRead(position, location) {
    var data; 
    
    // Coronavirus firebase call
    var starCountRef = firebase.database().ref('Coronavirus');
       starCountRef.on('value', function(snapshot) {
        data = snapshot.val();
        CoronaLatitudes = [];
        CoronaLongitudes = [];
        CoronaCount = [];
        CoronaKeys = [];
        CoronaLocatons = [];
        var five = 0;
        var twenty = 0;
        for (var key in data) {
            CoronaLatitudes.push(data[key]["Latitute"]);
            CoronaLongitudes.push(data[key]["Longitude"]);
            CoronaCount.push(data[key]["Count"]);
            CoronaLocations.push(data[key]["Location"]);
            CoronaKeys.push(key);
        }

        // Get Coronavirus cases within 5 and 20 miles of user's location
        for (var x = 0; x<CoronaLatitudes.length; x++){
            if (distance(CoronaLatitudes[x], CoronaLongitudes[x], position.coords.latitude, position.coords.longitude) < 5){
                five += CoronaCount[x];
            }
            if (distance(CoronaLatitudes[x], CoronaLongitudes[x], position.coords.latitude, position.coords.longitude) < 20){
                twenty += CoronaCount[x];
            }
            let z = document.getElementById("user-location");
            z.innerHTML=location + "<br><br> Coronavirus Cases Within 5 Miles - " + five + "<br><br> Coronavirus Cases Within 20 Miles - " + twenty;
        }
        console.log(twenty);
    });

    // Influenza firebase call
    starCountRef = firebase.database().ref('Influenza');
    starCountRef.on('value', function(snapshot) {
        data = snapshot.val();
        FluLatitudes = [];
        FluLongitudes = [];
        FluCount = [];
        FluKeys = [];
        FluLocatons = [];
        for (var key in data) {
            FluLatitudes.push(data[key]["Latitute"]);
            FluLongitudes.push(data[key]["Longitude"]);
            FluCount.push(data[key]["Count"]);
            FluLocations.push(data[key]["Location"]);
            FluKeys.push(key);
        }
        });
}

// Remove diplicates from array to ensure more accurate data is used
function removeDuplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b)
  };

// Add marker to Google map
function addMarker(props) {
    var marker = new google.maps.Marker({
        position: props.coords,
        map: map,
        //icon:props.iconImage
    });

    // Check for customicon
    if (props.iconImage) {
        // Set icon image
        marker.setIcon(props.iconImage);
    }

    // Check content
    if (props.content) {
        var infoWindow = new google.maps.InfoWindow({
            content: props.content
        });

        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });
    }
}

// Get the location of the user
function getLocation(){
    let x = document.getElementById("user-location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    function success(position) {
        console.log("hello");
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        currentlat = position.coords.latitude;
        currentlong = position.coords.longitude;
        lastKnownLocation = {lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)};
        var client = new HttpClient();
        var location = "";

        // Convert lat/long to string location using MapQuest API
        $.get("http://open.mapquestapi.com/geocoding/v1/reverse?key=NDkND6V5C8FbkqUA0F0AUSEEhkFnyHHH&location=" + currentlat + "," + currentlong + "&includeRoadMetadata=true&includeNearestIntersection=true", function(response) {
            location = response["results"][0]["locations"][0]["adminArea5"];
            console.log(location);
            currentlocation = location;
          firebaseRead(position, location);
          x.innerHTML=location;
        }, "jsonp");
    }
    function error(err) {
        console.log(err)
    }
}

// Get euclidian distance in miles between 2 lat/long points
function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

// Add a point to the direbase database
function addPoint(lat, long, disease, location){
    var client = new HttpClient();

    // Use MapQuest API to convert lat/long to string location
    client.get('http://open.mapquestapi.com/geocoding/v1/reverse?key=NDkND6V5C8FbkqUA0F0AUSEEhkFnyHHH&location=' + lat + ',' + long + '&includeRoadMetadata=true&includeNearestIntersection=true', function(response) {

        location = JSON.parse(response)["results"][0]["locations"][0]["adminArea5"];
        var today = new Date();

        // Perform the correct firebase entry based on disease and whether an entry for the town has already been done
        if (disease == "Coronavirus") {
            CoronaLocations = removeDuplicates(CoronaLocations);
            var index = CoronaLocations.indexOf(location);

            // Add 1 to the count if there are already cases in the town
            if (index >= 0) {
                firebase.database().ref(disease+ '/' + CoronaKeys[index]).set({
                    Latitute: lat,
                    Longitude: long,
                    Location: location,
                    Count: CoronaCount[index] + 1,
                    Timestamp: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
                });

            // If there was not already a case, make a new entry and make the count 1
            } else {
                firebase.database().ref(disease).push({
                    Latitute: lat,
                    Longitude: long,
                    Location: location,
                    Count: 1,
                    Timestamp: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
                });
            }
        } else {
            FluLocations = removeDuplicates(FluLocations);
            var index = FluLocations.indexOf(location);
            if (index >= 0) {
                firebase.database().ref(disease+ '/' + FluKeys[index]).set({
                    Latitute: lat,
                    Longitude: long,
                    Location: location,
                    Count: FluCount[index] + 1,
                    Timestamp: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
                });
            } else {
                firebase.database().ref(disease).push({
                    Latitute: lat,
                    Longitude: long,
                    Location: location,
                    Count: 1,
                    Timestamp: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
                });
            }
        }
        });

}

// Report the case when the user clicks button
function report(){
    let x = document.getElementById("disease-submitted");
    x.innerHTML = "Submitting...";
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
console.log(lastKnownLocation);
    var latsend = currentlat;
    var longsend = currentlong;

    // Collect the data inputted by the user and alert them of progress or errors
    var radios = document.getElementsByName("disease")
    var disease = "";
    if (currentlocation != "") {
        if (radios[0].checked == true) {
            addPoint(latsend, longsend, "Coronavirus", location)
            x.innerHTML = "<strong>Status:</strong> Submitted!";
        } else if (radios[1].checked == true) {
            addPoint(latsend, longsend, "Influenza", location)
            x.innerHTML = "<strong>Status:</strong> Submitted!";
        } else {
            x.innerHTML = "Please Select Disease!";
        }
    } else {
        x.innerHTML = "Please Get Location!";
    }
    
    
    
    
    /*
    for (let i = 0; i < radios.length; i++){
        if (radios[i].checked){
            addMarker({coords: lastKnownLocation, content: radios[i].value});
            console.log(lastKnownLocation);
            break;
        }
    }
    */
    console.log("Finished");
}