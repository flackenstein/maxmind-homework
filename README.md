**MaxMind GEO Reports Application**

Usage: geo-report [OPTIONS]... [ACCESS.LOG FILE]
Parse an Apache log file and output reports stored in the "sql_reports.js" file.

Arguments to long options are mandatory for short options too.

| Options  | Description |
|---|---|
| -h, --help | this help page |
| -m, --mmdb | Optional - full filename for MaxMind geo city mmdb database<br/>defaults to "./db/GeoLite2-City.mmdb". |
| -f, --format | Optional - output format for repots.  Valid options: "json", "pretty"<br/>defaults to "json". |

**Requirements / Disclaimer:**
The geo-report appliction was tested using Linux / Mac which by default include Sqlite.  Code has not
been tested on Windows.

**Setup:**
This is a node.js applicatio, source code does not include the node module dependencies.  Must run "npm install" from 
root folder prior to executing "geo-report.js" to install node dependencies.  Make sure geo-report has execute
permissions - Example "chmod +x geo-report"

**Usage:**
"geo-reports" can be run via unix/linux shell.
1. Node.js: node geo-reports.js -l "path-to-access.log-file" -m "optional-path-to-mmdb-geo-database" -f "optional-format-[json, pretty]"
2. Bash: ./geo-reports -l "path-to-access.log-file" -m "optional-path-to-mmdb-geo-database" -f "optional-format-[json, pretty]"

**Defaults:**
Default option values can be configured via the config/defaults.json file.