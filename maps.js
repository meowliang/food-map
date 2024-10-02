let map;
const sf = { lat: 37.7749, lng: -122.4194};
const SF_BOUNDS = {
  north: 37.839,  // Upper latitude
  south: 37.703,  // Lower latitude
  west: -122.524, // Left longitude
  east: -122.358, // Right longitude
}

let selectedMarkers = 0;
let lastSelectedMarker = null;
let originMarker;
let destinationMarker;

let totalDistance = document.getElementById('total-distance');
let totalTime = document.getElementById('total-time');
let resetButton = document.getElementById('reset-button');

let directionsDiv = document.getElementById('directions');

let list = document.getElementById('list');

let waypointsArray = [];
let polylines = [];



async function initMap() {

  //first call JSON data

  const url = "./restaurants.json";

  try {
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const restaurants = await response.json();
    

    //now call Google Maps API

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { encoding } = await google.maps.importLibrary("geometry")

  //create map

  map = new google.maps.Map(
    document.getElementById("map"), {
      zoom: 13, 
      center: sf, 
      mapId: "58c118b5b2954a2a",
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "cooperative",
      restriction: {
        latLngBounds: SF_BOUNDS,
        strictBounds: false,
      }}
  );

  //loop through icons to place on map

  restaurants.forEach((restaurant, index) => {


    //putting icons on map
    

  const icon = document.createElement("img");
  icon.src = `./assets/${restaurant.number}.png`;
  let iconPosition = { lat: restaurant.lat, lng: restaurant.lng};
  let tagline = `<h2>${restaurant.name}</h2>
                <h3>${restaurant.title}</h3>
                <iframe width="320" height="auto" src="${restaurant.youtube}" title="Melting Spots video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                <p>${restaurant.tagline}</p>
                <p><a href="https://instagram.com/${restaurant.instagram}" target="_blank">${restaurant.instagram}</a></p>
                <input type="button" id="directions-to-${restaurant.number}" value="Directions">`;
  icon.classList.add("restaurant-icon");

  if (restaurant.number === 1) {
    console.log('thanh long marker created');
  }

  const markerContent = document.createElement('div');

  const markerNumber = document.createElement('div');
  markerNumber.textContent = restaurant.number;
  markerNumber.classList.add('number-icon');

  markerContent.appendChild(icon);
  markerContent.appendChild(markerNumber); //append icon image to marker content
  
  if (restaurant.number === 1) {
    console.log(markerContent);
  }


  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: iconPosition,
    title: restaurant.name, 
    map: map, 
    content: markerContent,
  });

  
  if (restaurant.number === 1) {
    console.log(marker);
  }

        //adding restaurant to list

        const listIcon = document.createElement("img");
        listIcon.src = icon.src;
        listIcon.classList.add("list-icon");

        const listItem = document.createElement("div");
        listItem.classList.add("list-item");

        const listName = document.createElement("div");
        listName.classList.add("list-name");
        listName.textContent = restaurant.name;

        const listTitle = document.createElement("div");
        listTitle.classList.add("list-title");
        listTitle.textContent = restaurant.title;

        const textContainer = document.createElement("div");
        textContainer.classList.add("text-container");
        textContainer.appendChild(listName);
        textContainer.appendChild(listTitle);

        const listIconContainer = document.createElement("div");
        listIconContainer.classList.add("list-icon-container");
        listIconContainer.appendChild(listIcon);

        listItem.appendChild(textContainer);
        listItem.appendChild(listIconContainer);
    
        // listItem.innerHTML += `<div class="list-item" style="">
        //                   <div style="display: inline-block">
        //                   <div style="font-size: 20px;">${restaurant.name}</div>
        //                   <div style="font-size: 16px;">${restaurant.title}</div>
        //                   </div>
        //                   <div style="height:48px; width:48px; background-color:#E8F4E6; padding: 8px; border-radius: 12px;">${listIcon}</div>

                          
        //                   </div>`;

        

      list.appendChild(listItem);




    

  //attach description to each icon

  attachDescription(marker, tagline);

  if (restaurant.number === 1) {
    console.log('thanh long desc attached');
  }

  //adding routes

  //addStop(marker, restaurant, restaurant.number);

  marker.addListener("click", () => {

    if(lastSelectedMarker === marker) {
      return;
    }
    
    console.log('marker clicked');
    selectedMarkers++;
    lastSelectedMarker = marker;
    console.log('selected markers: ', selectedMarkers);

    if (selectedMarkers === 1) {
      originMarker = { lat: restaurant.lat, lng: restaurant.lng };
      lastSelectedMarker = marker;
    } else if (selectedMarkers === 6) {
      selectedMarkers = 0;
      originMarker = { lat: restaurant.lat, lng: restaurant.lng };
      resetRoutes();
    } else if (selectedMarkers === 2) {
      destinationMarker = { lat: restaurant.lat, lng: restaurant.lng };
      getRoute(originMarker, destinationMarker);
    } else if (selectedMarkers > 2) {
      waypointsArray.push(destinationMarker);
      destinationMarker = { lat: restaurant.lat, lng: restaurant.lng };
      getRoute(originMarker, destinationMarker, waypointsArray);
    } else {
      console.error('Unexpected state for selectedMarkers:', selectedMarkers);
    }
    
  });

  //adding click event to list item to pan to marker

  listItem.addEventListener("click", () => {
    const latLng = new google.maps.LatLng(marker.position); //how to pass lat and long coords?
    map.panTo(latLng);
    marker.infoWindow.open(map, marker);
  });

  //where is thanh long???

  if (restaurant.number === 1) {
    console.log('thanh long toggled');
  }

  });




} catch (error) {
  console.error(error.message);
}
}

resetButton.addEventListener('click', resetRoutes);

function resetRoutes() {

      selectedMarkers = 1;
      waypointsArray = [];
      polylines.forEach((polyline) => {
        polyline.setMap(null); 
      });

      polylines = [];

      totalDistance.innerHTML = `<p>Total Distance: 0m</p>`;
      totalTime.innerHTML =  `<p>Total Time: 0s</p>`;
}



function attachDescription(marker, description) {

  try {

  marker.infoWindow = new google.maps.InfoWindow({
    content: description,
    maxWidth: 340,
  });

  marker.addListener("click", () => {
    if (marker.infoWindow.getMap()) {
      marker.infoWindow.close();
    } else {
      marker.infoWindow.open(map, marker);
    }
  });


} catch (error) {
  console.error('error in attachDescription:', error);
}

}


// function addStop(marker, restaurant, number) {

//   console.log('adding stop');

//   let addStopButton = document.getElementById(`add-stop-${number}`);

//   addStopButton.addEventListener("click", () => {

//     if(lastSelectedMarker === marker) {
//       return;
//     }
    
//     selectedMarkers++;
//     lastSelectedMarker = marker;
//     console.log('selected markers: ', selectedMarkers);

//     if (selectedMarkers === 1) {
//       originMarker = { lat: restaurant.lat, lng: restaurant.lng };
//       lastSelectedMarker = marker;
//     } else if (selectedMarkers === 6) {
//       selectedMarkers = 0;
//       waypointsArray = [];
//       originMarker = { lat: restaurant.lat, lng: restaurant.lng };
//       resetRoutes();
//     } else if (selectedMarkers === 2) {
//       destinationMarker = { lat: restaurant.lat, lng: restaurant.lng };
//       getRoute(originMarker, destinationMarker);
//     } else if (selectedMarkers > 2) {
//       waypointsArray.push(destinationMarker);
//       destinationMarker = { lat: restaurant.lat, lng: restaurant.lng };
//       getRoute(originMarker, destinationMarker, waypointsArray);
//     } else {
//       console.error('Unexpected state for selectedMarkers:', selectedMarkers);
//     }
//   });

//   console.log('stop added');

// }
// const restaurants = await getRestaurants();
initMap();

//adding original map as clickable overlay upon visiting webpage

const mapImg = document.querySelector("#alexMap img");
const alexMap = document.getElementById("alexMap");

mapImg.addEventListener("click", () => {

  alexMap.classList.add("hidden");

});



let directionsButtons = [];

for (let i=0; i < 39; i++) {
  directionsButtons.push(document.getElementById(`directions-to-${i}`));hjdc2q
}

async function getRoute(origin, destination, waypoints = []) {

  const apiKey = "AIzaSyCth9BzQuA_xiX5nzZb-RU8BocOGefC5Go";
  const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

  //Directions request: https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=YOUR_API_KEY

  const body = {
    origin: {
      location: {
        latLng: {
          latitude: origin.lat,
          longitude: origin.lng
        }
      }
    },
    destination: {
      location: {
        latLng: {
          latitude: destination.lat,
          longitude: destination.lng
        }
      }
    },
    intermediates: waypoints.length
      ? waypoints.map(waypoint => ({
        location: {
          latLng: {
            latitude: waypoint.lat,
            longitude: waypoint.lng
          }
        }
      })) : undefined,
    travelMode: "DRIVE",
    polylineEncoding: "ENCODED_POLYLINE",
    routingPreference: "TRAFFIC_AWARE",
    //departureTime: "2023-10-15T15:01:23.045123456Z",
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false
    },
    languageCode: "en-US",
    units: "IMPERIAL"
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs,routes.legs.polyline,routes.legs.steps.polyline,routes.polyline.encodedPolyline',
  };


  try {
    const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error response:', errorData);
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  console.log('Data:', data);


  //process route and display

  const route = data.routes[0];
  const distance = route.distanceMeters;
  const duration = route.duration;
  // const legs = route.legs;
  // const directions = [];

  // for (let i=0; i < legs.length; i++) {
  //   for(let j=0; j < legs[i].steps.length; j++) {
  //   directions.push(legs[i].steps[j].navigationInstruction.instructions);
  //   }
  // }

  totalDistance.innerHTML = `<p>Total Distance: ${distance}m</p>`;
  totalTime.innerHTML =  `<p>Total Time: ${duration}</p>`;

//   document.addEventListener("DOMContentLoaded", (e) => {

//   directionsDiv.hidden = false;
//   directions.forEach((step) => {
//   directionsDiv.innerHTML += `<p>${step}</p>`;
//   });
// });

  console.log("Route:", route, distance, duration);


  const polyline = route.polyline.encodedPolyline;
  
  console.log("Polyline:", polyline);

  displayRouteOnMap(polyline);

} catch (error) {
  console.error('Error fetching route:', error);
}
}

function displayRouteOnMap(encodedPolyline) {
  const decodedPath = google.maps.geometry.encoding.decodePath(encodedPolyline);
  console.log(decodedPath);
  const routePolyline = new google.maps.Polyline({
    path: decodedPath,
    geodesic: false,
    strokeColor: '#46A9C6',
    strokeOpacity: 0.9,
    strokeWeight: 4,
    map: map,
  });

  polylines.push(routePolyline);

  console.log(routePolyline);

  //routePolyline.setMap(map);
}