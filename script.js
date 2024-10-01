const distance = 30;
const fixedScale = 0.15;

// Array of locations with their corresponding latitudes and longitudes
let locations = [

    { lat: 30.856915, long: 75.832428 },  // Location 1
    { lat: 30.860042, long: 75.838332 },  // Location 2
    { lat: 30.8601763, long: 75.8383157 },  // Location 3
    { lat: 30.86051, long: 75.83832 },  // Location 4
    { lat: 30.859756, long: 75.837953 },  // Location 5
    { lat: 30.859966713308765, long: 75.83825672470019 },  // Location 6
    { lat: 30.859731, long: 75.838166 },  // Location 6 
    // Add more locations here
];

window.onload = () => {
    let entities = []; // Array to store entities for each location
    const el = document.querySelector("[gps-new-camera]");
    // event clicker function
    AFRAME.registerComponent('cursor-listener', {
        init: function() {
        var data = this.data;
        var el = this.el;
        el.addEventListener('click', function(evt) {
            alert('click');
        });
        }
    });

    // update camera position
    el.addEventListener("gps-camera-update-position", e => {
        if(entities.length === 0) { 

            alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            locations.forEach((location, index) => {
                const entity = document.createElement("a-entity");
                entity.setAttribute('gltf-model', '#animated-asset');
                // to animation if the animation available then use below code:
                // entity.setAttribute('animation-mixer', {
                //     loop: 'repeat',
                //     clip: '*',  // Plays all animations
                // });
                entity.setAttribute("scale", {x: fixedScale, y: fixedScale, z: fixedScale});
                entity.setAttribute("look-at", "[gps-new-camera]");
                entity.setAttribute('gps-new-entity-place', {
                    latitude: location.lat,
                    longitude: location.long
                });
                entity.setAttribute("cursor-listener", '');
                document.querySelector("a-scene").appendChild(entity);
                entities.push(entity);
            });
        }

        // Check the distance for each entity
        entities.forEach((entity, index) => {
            checkDistance(e, entity, locations[index].lat, locations[index].long);
        });
    });
};

// Function to check distance and update visibility of entity
function checkDistance(e, entity, destinationLat, destinationLong) {
    const currentLat = e.detail.position.latitude;
    const currentLong = e.detail.position.longitude;
    const isInRadius = calculateDistance(
      currentLat,
      currentLong,
      destinationLat,
      destinationLong
    );
    if (isInRadius <= distance && isInRadius > 2) {
      entity.setAttribute("visible", true);
    } else {
      entity.setAttribute("visible", false);
    }
}

// Function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of the Earth in meters
    const radLat1 = (lat1 * Math.PI) / 180;
    const radLat2 = (lat2 * Math.PI) / 180;
    const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(radLat1) *
        Math.cos(radLat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance;
}
