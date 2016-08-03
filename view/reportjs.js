'use strict';

const Promise = require( 'bluebird' ),
    argv = require( '../lib/argv' ),
    sqlite = require( '../lib/sqlite_init' ),
    winston = require( 'winston' ),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({'timestamp':true})
        ]
    });

// Default Reports export
let reports;

class Reports {
    constructor( view ) {
        this.dbh = sqlite.dbh;
    }

    generate() {
        let json_array = [];

        reports.map ( function( report ) {

            this.dbh.all( report.sql, function( error, data ) {
                json_array.push( `{"${ report.title }":${ JSON.stringify( data ) }}` );
            });




            console.log( )
        });


    }

}

if ( typeof reports == 'undefined' ) {
    reports = new Reports();
}

module.exports = reports;



/*

// Access log Sqlite insert block


rl.on( 'close', function() {
// Store report data in JSON format
let json_array = [];


reports.map ( function( report ) {

db.all( report.sql, function( error, data ) {
    json_array.push( `{"${ report.title }":${ JSON.stringify( data ) }}` );
});




console.log( )
});

console.log( json_array );


});
*/




