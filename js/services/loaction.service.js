import { utilService } from './util.service.js'
import { storageService } from './storage.service.js'

export const locService = {
    getLocs,
    addLoc,
    deleteLoc,
    getPlaceAddress,
}

const gLocs = storageService.loadFromStorage('locsDB') || [
    _makeLoc('Greatplace', 32.047104, 34.832384),
    _makeLoc('Neveragain', 32.047201, 34.832581)
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs);
        }, 2000)
    });
}

function addLoc(name, lat, lng) {
    gLocs.push(_makeLoc(name, lat, lng))
    saveLocations()
}

function deleteLoc(id) {
    let idx = gLocs.findIndex((loc) => loc.id === id)
    gLocs.splice(idx, 1)
    saveLocations()
    console.log('gLocs',gLocs)
}

function saveLocations() {
    storageService.saveToStorage('locsDB', gLocs)
}

function _makeLoc(name, lat, lng, weather) {
    return {
        id: utilService.makeId(),
        name,
        lat,
        lng,
        weather,
        createdAt: new Date().now,
        updatedAt: new Date().now
    }
}

function getPlaceAddress(lat, lng) {
    console.log(lat, lng);
     //TODO: Enter your API Key
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY_GEO}`)
    .then((res) => {
        console.log(res.data);
        const address = res.data.results[0].formatted_address
        return address
    })
    .catch((err) => {console.log('Error', err);})
}