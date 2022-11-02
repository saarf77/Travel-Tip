export const mapService = {
    initMap,
    addMarker,
    panTo
}

// Var that is used throughout this Module (not global)
let gMap;

//init
function initMap(latLng) {
    console.log('initMap - latLng', latLng)
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: latLng,
                zoom: 15,
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                scaleControl: true,
            })
            console.log('Map!', gMap);
        }).then(addListeners)

}

function addMarker(loc) {
    let marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    console.log(loc);
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
   ; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY_Google}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function addListeners() {
    let infoWindow = new google.maps.InfoWindow()
    gMap.addListener("click", (mapsMouseEvent) => {
        infoWindow.close()
        const lat = mapsMouseEvent.latLng.lat()
        const lng = mapsMouseEvent.latLng.lng()
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng
        });
        infoWindow.setContent(
            `
            <h3 class="info-window">New Location</h3>
            <form onsubmit="onAddLoc(event,${lat},${lng})">
                <input type="text" class="location-input" placeholder="Name the location"></input>
                <button class="btn-save-place">Save</button>
            </form>
            `
        );
        infoWindow.open(gMap)

    });
}