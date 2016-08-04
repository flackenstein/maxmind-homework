#!/usr/bin/env node
'use strict';

const Promise = require( 'bluebird' ),
    argv = require( './lib/argv' ),
    winston = require( 'winston' ),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({'timestamp':true})
        ]
    });

logger.log( 'info', `MaxMind New Hire - Geo Report Application - ${ new Date() }` );

// Declared here so the logger info for the start of the application appears in the correct order.
const dbh = require( './lib/sqlite_init' ),
    reports = require( './view/reportjs' );

// MaxMind Geo Report Workflow:
let promise = Promise.resolve();

promise
    .bind( argv ).then( argv.validate )
    .bind( dbh ).then( dbh.load_access_log )
    .bind( reports ).then( reports.generate )
    .catch( function( error ) {
        logger.log( 'error', error );
        argv.help();
    });
