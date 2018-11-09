module.exports = {
    API_KEYS: {
        COORD: "coord_api_key"
    },
    BASE_URLS: {
        COORD: 'https://api.coord.co/v1/search/curbs/bybounds/all_rules'
    },
    SEARCH_PARAMS: {
        RADIUS_KM: 5
    },
    COORD_FEATURES: [{
        'name': 'seattle',
        'coordinates': {
            'lat': 47.606209,
            'lng': -122.332069
        }
    }, {
        'name': 'los_angeles',
        'coordinates': {
            'lat': 34.052235,
            'lng': -118.243683
        }
    }, {
        'name': 'san_francisco',
        'coordinates': {
            'lat': 37.774929,
            'lng': -122.419418
        }
    }, {
        'name': 'new_york_city',
        'coordinates': {
            'lat': 40.712776,
            'lng': -74.005974
        }
    }]
}