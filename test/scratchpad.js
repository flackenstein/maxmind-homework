#!/usr/bin/env node
'use strict';

const table = require( 'text-table' );

let json_report =
        [
            {
                "title": "Top 10 Countries",
                "data": [
                    {
                        "geo_country": "United States",
                        "visits": 14505,
                        "resource": "/region/1",
                        "hits": 61
                    },
                    {
                        "geo_country": "Netherlands",
                        "visits": 3216,
                        "resource": "/search/by-lat-long/9.250043,-83.859123/filter/category_id=1;category_id=2;category_id=3;category_id=4;category_id=5;category_id=6;category_id=7;category_id=8;category_id=9?limit=10;unit=km;distance=10",
                        "hits": 11
                    },
                    {
                        "geo_country": "China",
                        "visits": 1464,
                        "resource": "/entry/",
                        "hits": 9
                    },
                    {
                        "geo_country": "Germany",
                        "visits": 1246,
                        "resource": "/entry/18343/reviews",
                        "hits": 26
                    },
                    {
                        "geo_country": "France",
                        "visits": 699,
                        "resource": "/entry/2299",
                        "hits": 4
                    },
                    {
                        "geo_country": "United Kingdom",
                        "visits": 296,
                        "resource": "/region/52",
                        "hits": 7
                    },
                    {
                        "geo_country": "Canada",
                        "visits": 220,
                        "resource": "/entry/6843",
                        "hits": 3
                    },
                    {
                        "geo_country": "Mexico",
                        "visits": 118,
                        "resource": "/entry/19178",
                        "hits": 2
                    },
                    {
                        "geo_country": "Israel",
                        "visits": 66,
                        "resource": "/site/recent.atom?entries_only=1",
                        "hits": 11
                    },
                    {
                        "geo_country": "Japan",
                        "visits": 64,
                        "resource": "/entry/10400/map",
                        "hits": 4
                    }
                ]
            },
            {
                "title": "Top 10 States",
                "data": [
                    {
                        "geo_state_full": "California",
                        "visits": 5681,
                        "resource": "/region/218",
                        "hits": 26
                    },
                    {
                        "geo_state_full": "Washington",
                        "visits": 3153,
                        "resource": "/region/1",
                        "hits": 61
                    },
                    {
                        "geo_state_full": "Virginia",
                        "visits": 2356,
                        "resource": "/entry/20255",
                        "hits": 20
                    },
                    {
                        "geo_state_full": "New Jersey",
                        "visits": 695,
                        "resource": "/region/2",
                        "hits": 48
                    },
                    {
                        "geo_state_full": "New York",
                        "visits": 230,
                        "resource": "/site/help",
                        "hits": 23
                    },
                    {
                        "geo_state_full": "Minnesota",
                        "visits": 207,
                        "resource": "/region/13",
                        "hits": 30
                    },
                    {
                        "geo_state_full": "Texas",
                        "visits": 203,
                        "resource": "/apple-touch-icon.png",
                        "hits": 26
                    },
                    {
                        "geo_state_full": "Pennsylvania",
                        "visits": 202,
                        "resource": "/site",
                        "hits": 19
                    },
                    {
                        "geo_state_full": "unknown",
                        "visits": 195,
                        "resource": "/region/131",
                        "hits": 4
                    },
                    {
                        "geo_state_full": "Illinois",
                        "visits": 175,
                        "resource": "/site/recent.rss?entries_only=1",
                        "hits": 16
                    }
                ]
            }
        ];

json_report.map( function( report ) {

    let keys, table_data = [];

    keys = Object.keys( report.data[0] );

    // Header row...
    table_data.push( keys );

    // Convert JSON data to value array
    report.data.map( function( data ) {
        let row = [], value = '';

        keys.map( function( key ) {
            value = data[ key ];
            value = value.length > 50 ? `${ value.substr( 0, 25 ) }.....` : value;
            row.push( value );
        });

        table_data.push( row );
    });

    // Format json data in text column layout
    let text = table( table_data, { align: [ 'l', 'c', 'l', 'c' ] });

    // Output text report
    console.log( `\n[Report: ${ report.title }]\n\n${ text }\n` );

});


