"use strict";

const assert = require( 'assert' ),
    view_json = require( '../view/json' ),
    view_text = require( '../view/text' );

describe( 'View', function() {
    describe( 'json', function() {
        it( 'should return report object when the value is present', function() {
            view_json( { test: 1234 } )
                .then( function( data ) {
                    assert.equal( {
                        "Reports": {
                            "test": 1234
                        },
                        data
                    })
                })
                .catch( function( error ) {
                    assert.ifError( error );
                });
        });
    });

    describe('text', function() {
        it('should return text table string when the value is present', function() {
            view_text( [
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
                        }
                    ]
                }
            ] )
                .then( function( data ) {
                    assert.equal( [
                            "\n[Report: Top 10 Countries]\n\ngeo_country    visits  resource                        hits\nUnited States   14505  /region/1                        61\nNetherlands     3216   /search/by-lat-long/9.250.....   11\n",
                            "\n[Report: Top 10 States]\n\ngeo_state_full  visits  resource     hits\nCalifornia       5681   /region/218   26\nWashington       3153   /region/1     61\n"
                        ] ),
                        data
                })
                .catch( function( error ) {
                    assert.ifError( error );
                });
        });
    });

});