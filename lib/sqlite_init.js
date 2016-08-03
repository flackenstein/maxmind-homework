'use strict';

const Promise = require( 'bluebird' ),
    MMDBReader = require( 'mmdb-reader' ),
    mmdb = new MMDBReader( './db/GeoLite2-City.mmdb' ),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database( ':memory:' ),
    fs = require( 'fs' ),
    readline = require( 'readline' ),
    reports = require( './sql_reports' ),
    winston = require( 'winston' ),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({'timestamp':true})
        ]
    }),
    argv = require( './argv' );

// Store Sqlite database handler
let dbh;

class DBH {
    constructor( options ) {
        logger.log( 'info', "Initializing Sqlite database - creating access_log table and indexes in memory" );

        // Create table to store Apache access.log
        db.serialize( function() {
            let sqls = [
                `CREATE TABLE access_log (
                ipv4 VARCHAR(15),
                user VARCHAR(50),
                timestamp DATETIME,
                http_method VARCHAR(10),
                resource text,
                http_version NUMERIC,
                http_status INT,
                http_size INT,
                client text,
                geo_city VARCHAR(50),
                geo_state_short VARCHAR(50),
                geo_state_full VARCHAR(50),
                geo_country VARCHAR(50),
                geo_continent VARCHAR(50)
                )`.sql_format(),
                `CREATE INDEX idx_access_log
                 ON access_log ( geo_city, geo_state_short, geo_state_full, geo_country, geo_continent )`.sql_format()
            ];

            // Create table, indexes
            sqls.map( sql => db.run( sql ) );

        });

    }

    load_access_log () {
        return new Promise( function( resolve, reject ) {
            logger.log( 'info', `Load table with Apache access log and geo data from file: ${ argv.access_log }` );

            // Create filesystem read stream to access.log file
            const rl = readline.createInterface({
                input: fs.createReadStream( argv.access_log )
            });

            // Readstream line event handler - insert access.log record into Sqlite table
            rl.on( 'line', (line) => {
                let l, sql, ipv4, user, timestamp, http_method, resource, http_version, http_status, http_size, client,
                    geo_city, geo_state_short, geo_state_full, geo_country, geo_continent;

                // Regular expression to group Apache access.log fields
                l = /^([0-9.]+)\s-\s(.+)\s\[(.*)\]\s"(\w+)\s(.+)\sHTTP\/([0-9.]+)"\s([0-9]+)\s([0-9]+)\s"-"\s"(.+)"$/.exec( line );

                sql = db.prepare( 'INSERT INTO access_log VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )' );

                // Parse Apache access log fields
                ipv4 = l[1];
                user = l[2];
                timestamp = l[3];
                http_method = l[4];
                resource = l[5];
                http_version = l[6];
                http_status = l[7];
                http_size = l[8];
                client = l[9];

                // Get geo data for ipv4
                let geodata = mmdb.lookup( ipv4 );

                // MMDB Geo Meta Data
                let city = !!geodata.city ? geodata.city.names.en : 'unknown';
                let state_short = !!geodata.subdivisions ? geodata.subdivisions[0].iso_code : 'unknown';
                let state_full = !!geodata.subdivisions ? geodata.subdivisions[0].names.en : 'unknown';
                let country = !!geodata.country ? geodata.country.names.en : 'unknown';
                let continent = !!geodata.continent ? geodata.continent.names.en : 'unknown';

                // Insert Apache access.log record with geo data into Sqlite table 'access_log'
                sql.run( ipv4, user, timestamp, http_method, resource, http_version, http_status, http_size, client, city, state_short, state_full, country, continent );
                sql.finalize();
            });

            // Readstream closed - all records inserted into access_log table
            rl.on( 'close', function() {
                logger.log( 'info', 'Completed table load with all Apache access.log records' );
                resolve();
            });

            // Readstream closed - all records inserted into access_log table
            rl.on( 'error', function( error ) {
                reject( error );
            });

        });

    } // load_access_log

    // Return database handler to Sqlite access_log table - in memory instance
    get dbh() {
        return db;
    }
}

if ( typeof dbh == 'undefined' ) {
    dbh = new DBH();
}

module.exports = dbh;