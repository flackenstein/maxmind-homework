'use strict';

// The ARGV class will validate the user provided parameters and provide the necessary options to run the geo reports.

const config = require( 'config' ),
    Promise = require( 'bluebird' ),
    fs = require( 'fs' ),
    winston = require( 'winston' ),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({'timestamp':true})
        ]
    }),
    parse = require( 'minimist' ),
    argv = parse( process.argv.slice(2), {
        alias: {
            h: 'help',
            m: 'mmdb',
            f: 'format'
        },
        boolean: [ 'help' ],
        default: {
            mmdb: config.default.mmdb,
            format: config.default.format
        }
    });

let options = {
    access_log: '',
    mmdb: '',
    format: '',
};

class ARGV {
    constructor () {
        options.access_log = argv._[0] || null;
        options.mmdb = argv.mmdb;
        options.format = argv.format
    }

    // Validate ARGV parameters
    validate() {
        logger.log( 'info', 'Validating Arguments' );

        // Check if "help" parameter is passed
        if ( argv.help ) {
            this.help();
        }

        return new Promise( function( resolve, reject ) {
            // Check if access log exists
            try { fs.accessSync( options.access_log ); }
            catch ( error ) {
                reject( error );
                return;
            }

            // Check if mmdb database exists
            try { fs.accessSync( options.mmdb ); }
            catch ( error ) {
                reject( error );
                return;
            }

            // Verify output format is valid
            if ( !!options.format == false ) {
                reject( 'Error: --format invalid.' );
                return;
            }

            logger.log( 'info', `Arguments: ${ JSON.stringify( options )}`);

            resolve( options );
        });
    }

    get access_log() {
        return options.access_log;
    }

    set access_log( log ) {
        options.access_log = log;
    }

    get mmdb() {
        return options.mmdb;
    }

    set mmdb( mmdb ) {
        options.mmdb = mmdb;
    }

    get format() {
        return options.format;
    }

    set format( format ) {
        options.format = format;
    }

    help() {
        let help_text =
`
Usage: geo-report [OPTIONS]... [ACCESS.LOG FILE]
Parse an Apache log file and output reports stored in the "sql_reports.js" file.

Arguments to long options are mandatory for short options too.
  -h, --help                 this help page
  -m, --mmdb                 Optional - full filename for MaxMind geo city mmdb database
                             defaults to "./db/GeoLite2-City.mmdb".
  -f, --format               Optional - output format for repots.  Valid options: "json", "text"
                             defaults to "json".

Requirements / Disclaimer:
The geo-report appliction was tested using Linux / Mac which by default include Sqlite.  Code has not
been tested on Windows.

Setup:
This is a node.js applicatio, source code does not include the node module dependencies.  Must run "npm install" from 
root folder prior to executing "geo-report.js" to install node dependencies.  Make sure geo-report has execute
permissions - Example "chmod +x geo-report"

Usage:
"geo-reports" can be run via unix/linux shell.
[1] Node.js: node geo-reports.js -l "path-to-access.log-file" -m "optional-path-to-mmdb-geo-database" -f "optional-format-[json, pretty]"
[2] Bash: ./geo-reports -l "path-to-access.log-file" -m "optional-path-to-mmdb-geo-database" -f "optional-format-[json, pretty]"

`;
        console.log( help_text );
        process.exit(0);
    }

}

module.exports = new ARGV();