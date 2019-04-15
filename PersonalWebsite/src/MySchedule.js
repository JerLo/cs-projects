var slideIndex = 0;
var slides = document.getElementsByClassName("slide");
var timer;

/**************************Slideshow Functions********************************/

function slideShow() {
    for(var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if(slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex-1].style.display = "block";
    timer = setTimeout(function(){slideShow();}, 2000);
}

function slideStop() {
    clearTimeout(timer);
}

slideShow();

/**************************Google Map Functions********************************/
var map;
var markers = [];
var infowindow;
var addresses = document.getElementsByClassName("address");
var eventNames = document.getElementsByClassName("name");
var currentLoc;


function initMap() {
    var dirService = new google.maps.DirectionsService;
    var dirDisp = new google.maps.DirectionsRenderer;
	map = new google.maps.Map(document.getElementById("map"), {
		center: {lat: 44.9727, lng:-93.23540000000003},
		zoom: 14
		});
    dirDisp.setMap(map);
    dirDisp.setPanel(document.getElementById('panel'));
    var geocoder = new google.maps.Geocoder();
    for(var i = 0; i < addresses.length; i++) {
        var addr = addresses[i].innerHTML;
        var event = eventNames[i].innerHTML;
        codeAddress(geocoder, map, addr, event);
    }
    var input2 = document.getElementById("enterDir");
    var autocomplete2 = new google.maps.places.Autocomplete(input2);
    document.getElementById("dirBtn").addEventListener('click', function() {
        calcAndDispRoute(dirService, dirDisp);
    })
}

function codeAddress(geocoder, resultMap, address, eventName) {
    var infowindow = new google.maps.InfoWindow({
       content: eventName 
    });
    geocoder.geocode({'address':address}, function(results, status) {
        if(status === google.maps.GeocoderStatus.OK) {
            var marker = new google.maps.Marker({
                map: resultMap,
                position: results[0].geometry.location,
                icon: "Images/gopherhead.png",
                title: address
            });
            markers.push(marker);
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
        }
    });
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function submitPlace() {
    clearMarkers();
    var range = document.getElementById("enterRange").value;
    var select = document.getElementById("dropdown").value;
    var keyword = document.getElementById("locationTextField").value;
    var center = new google.maps.LatLng(44.9727, -93.23540000000003);
    if(select == "other") {
        var request = {
            location: center,
            radius: range,
            keyword: keyword
        };
    } else {
        var request = {
            location: center, 
            radius: range,
            type: [select]
        };
    }
    var services = new google.maps.places.PlacesService(map);
    services.nearbySearch(request, callback);
}

function callback(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
        for(var i = 0; i < results.length; i++){
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    infowindow = new google.maps.InfoWindow();
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    google.maps.event.addListener(marker, "mouseover", function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
    markers.push(marker);
}

function disabler() {
    var select = document.getElementById("dropdown").value;
    if(select == "other") {
        document.getElementById("locationTextField").disabled = false;
    } else {
        document.getElementById("locationTextField").disabled = true;
    }
}


function calcAndDispRoute(dirService, dirDisp) {
    var mode;
    var dest = document.getElementById("enterDir").value;
    if(document.getElementById("walk").checked) {
        mode = "WALKING";
    } else if (document.getElementById("transit").checked) {
        mode = "TRANSIT";
    } else {
        mode = "DRIVING";
    }
    dirService.route({
        origin: {lat: 44.9727, lng:-93.23540000000003},
        destination: dest,
        travelMode: mode
    }, function(response, status) {
        if(status == 'OK') {
            dirDisp.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });   
}
