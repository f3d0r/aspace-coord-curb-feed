//PACKAGE IMPORTS
var request = require('request');
var pLimit = require('p-limit');
var turf = require('@turf/turf');
var Logger = require('logdna');
var ip = require('ip');
var os = require('os');

//CONSTANTS
const limit = pLimit(5);
const constants = require('./config');

//LOGGING SET UP
var logger = Logger.setupDefaultLogger(process.env.LOG_DNA_API_KEY, {
    hostname: os.hostname(),
    ip: ip.address(),
    app: process.env.APP_NAME,
    env: process.env.ENV_NAME,
    index_meta: true,
    tags: process.env.APP_NAME + ',' + process.env.ENV_NAME + ',' + os.hostname()
});
console.log = function (d) {
    process.stdout.write(d + '\n');
    logger.log(d);
};
logger.write = function (d) {
    console.log(d);
};

//MAIN SCRIPT
execute();

async function execute() {
    console.log("URLS #                     : " + constants.COORD_FEATURES.length);
    console.log("STARTING DOWNLOAD");
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
    console.log("DONE DOWNLOADING, RECEIVED : " + responses.length);
    var curbRules = [];
    responses.forEach(function (currentResponse) {
        curbRules = curbRules.concat(currentResponse.features);
    });
    console.log("---------------------------------");
    console.log("TOTAL RULES RECEIVED       : " + curbRules.length);
    var curbIDs = curbRules.map(curb => curb.properties.metadata.curb_id);
    console.log(curbIDs.length);
    console.log(hasDuplicates(curbIDs));
}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
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