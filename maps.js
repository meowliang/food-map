let map;
const sf = { lat: 37.7749, lng: -122.4194};
const SF_BOUNDS = {
  north: 37.839,  // Upper latitude
  south: 37.703,  // Lower latitude
  west: -122.524, // Left longitude
  east: -122.358, // Right longitude
}


async function initMap() {

  //first call JSON data

  const url = "http://127.0.0.1:5500/restaurants.json";

  try {
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const restaurants = await response.json();
    

    //now call Google Maps API

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

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

  restaurants.forEach((restaurant) => {
  

  const icon = document.createElement("img");
  icon.src = `./assets/${restaurant.number}.png`;
  let iconPosition = { lat: restaurant.lat, lng: restaurant.lng};
  let tagline = `<h2>${restaurant.name}</h2><h3>${restaurant.title}</h3><iframe width="320" height="auto" src="${restaurant.youtube}" title="Melting Spots video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><p>${restaurant.tagline}</p>`;
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
    title: restaurant.title, 
    map: map, 
    content: markerContent,
  });

  
  if (restaurant.number === 1) {
    console.log(marker);
  }

  //attach description to each icon

  attachDescription(marker, tagline);

  if (restaurant.number === 1) {
    console.log('thanh long desc attached');
  }

  marker.addListener("click", () => {
    console.log('marker clicked');
    toggleHighlight(marker);
  })

  if (restaurant.number === 1) {
    console.log('thanh long toggled');
  }



  // const thanhLongImg = document.createElement("img");
  // thanhLongImg.src = "./assets/1.png";
  // let thanhLongPos = { lat: 37.7655, lng: -122.5067};
  // let thanhLongDesc = '<h2>Thanh Long</h2><h3>Inventing Garlic Noodles</h3><iframe width="320" height="auto" src="https://www.youtube.com/embed/7zfbw1-DEHU?si=q918sV6F1G0WDqNE" title="Melting Spots video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><p>When Diana An stumbled into a small Italian deli in the 1970s, she realized it was her ticket out of war-torn Vietnam. In this Melting Spots story, her granddaughter Monique tells us about a secret family recipe that fused Italian and Asian cuisine to create a Bay Area classic: garlic noodles.</p>';
  // thanhLongImg.classList.add("restaurant-icon");

  // const tlMarkerContent = document.createElement('div');

  // const tlMarkerNumber = document.createElement('div');
  // tlMarkerNumber.textContent = "1";
  // tlMarkerNumber.classList.add('number-icon');

  // tlMarkerContent.appendChild(thanhLongImg);
  // tlMarkerContent.appendChild(tlMarkerNumber); //append icon image to marker content

  // const thanhLongMarker = new google.maps.marker.AdvancedMarkerElement({
  //   position: thanhLongPos,
  //   title: "Thanh Long", 
  //   map: map, 
  //   content: tlMarkerContent,
  // });

  // //attach description to each icon

  // attachDescription(thanhLongMarker, thanhLongDesc);

  // thanhLongMarker.addListener("click", () => {
  //   toggleHighlight(thanhLongMarker);
  // })

  });

} catch (error) {
  console.error(error.message);
}
  //save option
  //directions option
  //add markers of all the restaurants - need to update JSON
  //for loop info into markers
}


function toggleHighlight(marker) {
 
  if (marker.content.classList.contains("highlight")) {
    marker.content.classList.remove("highlight");
    marker.zIndex = null;
  } else {
    marker.content.classList.add("highlight");
    marker.zIndex = 1;
  }

}


function attachDescription(marker, description) {

  try {

  const infoWindow = new google.maps.InfoWindow({
    content: description,
    maxWidth: 340,
  });

  marker.addListener("click", () => {
    infoWindow.open(marker.map, marker);
  });

  const infoWindowContent = infoWindow.getContent();
  if (infoWindowContent) {
    const infoWindowDiv = infoWindowContent.firstChild;
    if (infoWindowDiv) {
      infoWindowDiv.classList.add("restaurant-desc");
    }
  }


} catch (error) {
  console.error('error in attachDescription:', error);
}

}

/*Build info window content sample function
function buildContent(property) {
  const content = document.createElement("div");

  content.classList.add("property");
  content.innerHTML = `
    <div class="icon">
        <i aria-hidden="true" class="fa fa-icon fa-${property.type}" title="${property.type}"></i>
        <span class="fa-sr-only">${property.type}</span>
    </div>
    <div class="details">
        <div class="price">${property.price}</div>
        <div class="address">${property.address}</div>
        <div class="features">
        <div>
            <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="bedroom"></i>
            <span class="fa-sr-only">bedroom</span>
            <span>${property.bed}</span>
        </div>
        <div>
            <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>
            <span class="fa-sr-only">bathroom</span>
            <span>${property.bath}</span>
        </div>
        <div>
            <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="size"></i>
            <span class="fa-sr-only">size</span>
            <span>${property.size} ft<sup>2</sup></span>
        </div>
        </div>
    </div>
    `;
  return content;
}*/

// const restaurants = await getRestaurants();
initMap();