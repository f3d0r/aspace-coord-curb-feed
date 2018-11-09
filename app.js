var request = require('request');
var fs = require('fs');
var pLimit = require('p-limit');
var turf = require('@turf/turf');

const limit = pLimit(5);
const constants = require('./config')

execute();
async function execute() {
    var reqs = [];
    constants.COORD_FEATURES.forEach(function (currentFeature) {
        var coordinates = currentFeature.coordinates;
        var options = {
            units: 'kilometers'
        };
        var circle = turf.circle([coordinates.lng, coordinates.lat], constants.SEARCH_PARAMS.RADIUS_KM, options);
        var bbox = turf.bbox(circle);
        reqs.push(limit(() => getCurbRules(bbox)));
    });
    var responses = await Promise.all(reqs);
    console.log(responses[0]);
}

function getCurbRules(bbox) {
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'GET',
            url: constants.BASE_URLS.COORD,
            qs: {
                min_latitude: bbox[1],
                max_latitude: bbox[3],
                min_longitude: bbox[0],
                max_longitude: bbox[2],
                access_key: constants.API_KEYS.COORD
            },
            timeout: 60000,
            json: true
        };

        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}