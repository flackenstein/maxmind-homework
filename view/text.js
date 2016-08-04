'use strict';

const table = require( 'text-table' );

module.exports = function( report_data ) {
    return new Promise( function( resolve, reject ) {

        report_data.map( function( report ) {
            let keys, table_data = [], text, report_text;

            // Header row...
            keys = Object.keys( report.data[0] );
            table_data.push( keys );

            // Convert JSON data to value array
            report.data.map( function( data ) {
                let row = [], value;

                keys.map( function( key ) {
                    value = data[ key ];
                    value = value.length > 50 ? `${ value.substr( 0, 25 ) }.....` : value;
                    row.push( value );
                });

                table_data.push( row );
            });

            // Format json data in text column layout
            text = table( table_data, {
                align: [ 'l', 'c', 'l', 'c' ]
            });

            // Report template
            report_text = `\n[Report: ${ report.title }]\n\n${ text }\n`;

            // Output text report
            console.log( report_text );

        });

        resolve( report_text );
    });
};
