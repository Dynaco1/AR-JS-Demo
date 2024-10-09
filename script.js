const distance = 30;
const fixedScale = 0.5;

// Array of locations with their corresponding latitudes and longitudes
let locations = [

    { lat: 30.860040788078813, long: 75.838315842982 },  // Location 1
    { lat: 30.860279187301085, long: 75.83833163651067 },  // Location 2
    { lat: 30.859752419312105, long: 75.83829357522256 },  // Location 3

    // Add more locations here
];

window.onload = () => {
    let entities = []; // Array to store entities for each location
    const el = document.querySelector("[gps-camera]");
    // event clicker function
    AFRAME.registerComponent('cursor-listener', {
        init: function() {
        var data = this.data;
        var el = this.el;
        el.addEventListener('click', function(evt) {
            const isExists = el.getAttribute('animation-mixer').hasOwnProperty('clip');
            if (isExists && el.getAttribute('animation-mixer')['clip'] !== 'Armature|2_Open Action_Armature') {
                el.setAttribute('animation-mixer', {
                        loop: 'repeat',
                        clip: 'Armature|2_Open Action_Armature',
                    });
            } else {
                el.setAttribute('animation-mixer', {
                    loop: 'repeat',
                    clip: 'Armature|1_Shake_Armature',
                });
            }
            // alert('click');
        });
        }
    });

    // update camera position
    window.addEventListener("gps-camera-update-position", e => {
        if(entities.length === 0) { 

            alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            locations.forEach((location, index) => {
                const entity = document.createElement("a-entity");
                entity.setAttribute('gltf-model', '#animated-asset');
                // to animation if the animation available then use below code:
                entity.setAttribute('animation-mixer', {
                    loop: 'repeat',
                    clip: 'Armature|1_Shake_Armature',  // Plays all animations
                });
                entity.setAttribute("scale", {x: fixedScale, y: fixedScale, z: fixedScale});
                entity.setAttribute("look-at", "[gps-camera]");
                entity.setAttribute('gps-entity-place', {
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
    if (isInRadius <= distance && isInRadius > 1) {
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