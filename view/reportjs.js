'use strict';

const Promise = require( 'bluebird' ),
    argv = require( '../lib/argv' ),
    sqlite = require( '../lib/sqlite_init' ),
    sql_reports = require( '../lib/sql_reports' ),
    winston = require( 'winston' ),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({'timestamp':true})
        ]
    });

// Report Views
const view_json = require( './json' ),
    view_text = require( './text' );

// Default Reports export
let reports;

class Reports {
    constructor( view ) {
        this.dbh = sqlite.dbh;
    }

    // Generate a report for each of the defined report objects in lib/sql_reports.js
    generate() {
        let self = this;

        return new Promise( function( resolve, reject ) {

            Promise.resolve( sql_reports )
                .mapSeries( function( rpt ) {
                    return self.get_report_data( rpt.title, rpt.sql );
                } )
                .then( function( report_data ) {
                    return self.view_report_data( report_data );
                })
                .then( resolve() )
                .catch( function( error ) {
                    reject( error );
                });

        });

    }

    // Query returns report data in json format
    get_report_data( title, sql ) {
        let self = this;

        logger.log( 'info', `Building report ${ title }` );

        return new Promise( function( resolve, reject ) {
            self.dbh.all( sql, function( error, data ) {
                if ( error ) {
                    reject( error );
                } else {
                    let report_data = {
                        title: title,
                        data: data
                    };
                    resolve( report_data );
                }
            });
        });
    }

    // View formatted report data
    view_report_data( report_data ) {
        return new Promise( function( resolve, reject ) {

            switch( argv.format.toLowerCase() ) {
                case 'json':
                    return view_json( report_data );
                    break;
                case 'text':
                    return view_text( report_data );
                    break;
                default:
                    reject( `Error: invalid / unsupported view format: ${ argv.format }` );
            }

        });

    }

}

if ( typeof reports == 'undefined' ) {
    reports = new Reports();
}

module.exports = reports;
