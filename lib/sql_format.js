"use strict";

// This library is a collection of String extensions to add additional functionality to string objects

// Extend the String object to include a sql formatter option.
//
// Example:
//
//      let sql = `
//              select
//                  *  --sql_format will remove line comments
//              /*  sql_format will also remove block comments
//                  a,
//                  b,
//                  c
//              */
//              from
//                  tablename
//      `.sql_format();
//
// Result: 'select * from tablename'
String.prototype.sql_format = function () {
    return this
        .replace( /--.*/g, '' ) //remove any '--' comments
        .replace( /[\n\t]+/g, ' ' ) //replace newline and tabs with space
        .replace( /\/\*.*\*\//g, '' ) //remove any '/*...*/' comments
        .replace( /(^\s+|\s+$)/g, '' ) //remove leading and trailing spaces
        .replace( /\s+/g, ' ' ) //replace multiple spaces with single space
        ;
};
