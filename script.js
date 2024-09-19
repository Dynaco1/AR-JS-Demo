const distance = 10;
const destinationLat = 30.8601763;
const destinationLong = 75.8383157;
window.onload = () => {
    let testEntityAdded = false;
    const el = document.querySelector("[gps-new-camera]");
    const entity = document.createElement("a-box");
    el.addEventListener("gps-camera-update-position", e => {
        if(!testEntityAdded) {
            alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            // Add a box to the north of the initial GPS position
            entity.setAttribute("scale", {
                x: 0.2, 
                y: 0.2,
                z: 0.2
            });
            entity.setAttribute("position", {x: 0, y: 0, z: 0});
            entity.setAttribute('gltf-model', 'my_glb.glb');
            entity.setAttribute('gps-new-entity-place', {
                latitude: destinationLat,
                longitude: destinationLong
            });
            document.querySelector("a-scene").appendChild(entity);
        }
        testEntityAdded = true;
        if (testEntityAdded) {
            checkDistance(e, entity);
          }
    });
};

function checkDistance(e, entity) {
    console.log("created entity", entity)
    const currentLat = e.detail.position.latitude;
    const currentLong = e.detail.position.longitude;
    const isInRadius = calculateDistance(
      currentLat,
      currentLong,
      destinationLat,
      destinationLong
    );
    if (isInRadius <= distance) {
      entity.setAttribute("visible", true);
    } else {
      entity.setAttribute("visible", false);
    }
  }
  
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
