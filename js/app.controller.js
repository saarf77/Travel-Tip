import { locService } from './services/loaction.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js';


window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLoc = onDeleteLoc;
window.onCopyLocation = onCopyLocation;
window.onAddLoc = onAddLoc;
window.onGoToLoc = onGoToLoc;


function onInit() {
    checkParams()
        .then(mapService.initMap)
        .then(() => {
            console.log('Map is ready');
        })
        .then(renderLocations)
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector(".user-pos").innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
            // document.querySelector('.wind span').innerText = weatherRes.wind;
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onCopyLocation() {
    getPosition().then(({ coords }) => [coords.latitude, coords.longitude]).then((latLng) => {
        window.navigator.clipboard.writeText(`https://saarf77.github.io/Travel-Tip/?lat=${latLng.join('&lng=')}`)
    }).then(openCopyModal)
}


function openCopyModal() {
    console.log('opening modal')
}

function checkParams() {
    const params = new URLSearchParams(window.location.search)
    return Promise.resolve(
        {
            lat: +params.get('lat') || 52.5200,
            lng: +params.get('lng') || 13.4050
        }
    )
}

function onDeleteLoc(id) {
    locService.deleteLoc(id)
    renderLocations()
}


function onPanTo() {
    console.log('Panning the Map')
    // mapService.addMarker({lat, lng })
    mapService.panTo(35.6762, 139.6503)
}

function onGoToLoc(lat, lng) {
    mapService.panTo(lat, lng);
    renderWeather(lat, lng)
}

function onAddLoc(ev, lat, lng) {
    // infoWindow.close()
    ev.preventDefault()
    // console.log(ev.target[0].value);
    const newLocName = ev.target[0].value
    locService.addLoc(newLocName, lat, lng)
    renderLocations()
}

function renderLocations() {
    locService.getLocs().then((locs) => {
        console.log("Locations:", locs);
        var strHtml = locs.map(
            (loc) =>
                `<tr>
              <td>${loc.name}</td>
              <td>${loc.lat}</td>
              <td>${loc.lng}</td>
              <td><button onclick="onGoToLoc(${loc.lat}, ${loc.lng})">Go</button></td>
              <td><button onclick="onDeleteLoc(${loc.lat}, ${loc.lng})">Delete</button></td>
          </tr>`
        );
        document.querySelector(".locs").innerHTML = strHtml.join("");
    });
}

function renderWeather(lat, lng) {
    locService.getPlaceAddress(lat, lng).then((address) => {
        weatherService.getWeather(lat, lng).then(weatherRes => {
            console.log('weatherRes:', weatherRes);
            document.querySelector('.country').innerText = address;
            document.querySelector('.temp').innerText = weatherRes.temp
            document.querySelector('.min-temp').innerText = weatherRes.minTemp;
            document.querySelector('.max-temp').innerText = weatherRes.maxTemp;
            document.querySelector('.wind span').innerText = weatherRes.wind;
        })
            .catch(err => { console.log(err); })
    });
}


// function onCopyLocation(lat, lng) {
//     const params = new URL(
//       `https://saarf77.github.io/Travel-Tip/index.html?${lat}=1&${lng}=2`
//     );
//     window.location.assign(`${params}`);
//   }

//<td><button onclick="onCopyLocation(${loc.lat}, ${loc.lng})">Copy Link</button></td>