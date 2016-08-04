'use strict';

const prettyjson = require( 'prettyjson' );

module.exports = function( report_data ) {
    return new Promise( function( resolve, reject ) {

        let json_report = {
            Reports: report_data
        };

        console.log( `\n${ prettyjson.render( json_report, {} ) }\n` );

        resolve( json_report );
    });
};