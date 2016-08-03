'use strict';

require( './sql_format' );

const reports = [
    {
        "title": "Top 10 Countries",
        "sql": `WITH page AS (
                    SELECT
                        geo_country,
                        resource,
                        count( resource ) AS "hits"
                    FROM access_log
                    WHERE
                        lower( resource  ) NOT LIKE '%css%'
                        AND lower( resource ) NOT LIKE '%.rss'
                        AND lower( resource ) NOT LIKE '%.atom'
                        AND lower( resource ) NOT LIKE '%images/%'
                        AND lower( resource ) NOT lIKE '%/js/%'
                        AND lower( resource ) NOT lIKE '/static/%'
                        AND lower( resource ) NOT lIKE '/robots.txt%'
                        AND lower( resource ) NOT lIKE '/favicon.ico'
                        AND resource != '/'
                    GROUP BY geo_country, resource
                    HAVING count( resource ) > 0
                    ORDER BY geo_country ASC, count( resource ) DESC
                )
                SELECT
                    c.geo_country,
                    c.visits,
                    p.resource,
                    p.hits
                FROM (
                    SELECT 
                        geo_country,
                        count(*) AS "visits"
                    FROM access_log
                    WHERE lower( resource  ) NOT LIKE '%css%'
                        AND lower( resource ) NOT LIKE '%.rss'
                        AND lower( resource ) NOT LIKE '%.atom'
                        AND lower( resource ) NOT LIKE '%images/%'
                        AND lower( resource ) NOT lIKE '%/js/%'
                        AND lower( resource ) NOT lIKE '/static/%'
                        AND lower( resource ) NOT lIKE '/robots.txt%'
                        AND lower( resource ) NOT lIKE '/favicon.ico'
                    GROUP BY geo_country
                    HAVING count( geo_country ) > 0
                    ORDER BY count( geo_country ) DESC
                    LIMIT 10 ) c
                    LEFT JOIN (
                        SELECT 
                            geo_country, 
                            resource, 
                            MAX( hits ) AS "hits"
                        FROM page
                        GROUP BY geo_country
                    )	p ON c.geo_country = p.geo_country`.sql_format()
    },
    {
        "title": "Top 10 States",
        "sql": `WITH page AS (
                    SELECT
                        geo_state_full,
                        resource,
                        count( resource ) AS "hits"
                    FROM access_log
                    WHERE
                        geo_country = 'United States'
                        AND lower( resource  ) NOT LIKE '%css%'
                        AND lower( resource ) NOT LIKE '%.rss'
                        AND lower( resource ) NOT LIKE '%.atom'
                        AND lower( resource ) NOT LIKE '%images/%'
                        AND lower( resource ) NOT lIKE '%/js/%'
                        AND lower( resource ) NOT lIKE '/static/%'
                        AND lower( resource ) NOT lIKE '/robots.txt%'
                        AND lower( resource ) NOT lIKE '/favicon.ico'
                        AND resource != '/'
                    GROUP BY geo_country, resource
                    HAVING count( resource ) > 0
                    ORDER BY geo_state_full, count( resource ) DESC
                )
                SELECT
                    s.geo_state_full,
                    s.visits,
                    p.resource,
                    p.hits
                FROM (
                    SELECT 
                        geo_state_full,
                        count(*) AS "visits"
                    FROM access_log
                    WHERE geo_country = 'United States'
                        AND lower( resource  ) NOT LIKE '%css%'
                        AND lower( resource ) NOT LIKE '%.rss'
                        AND lower( resource ) NOT LIKE '%.atom'
                        AND lower( resource ) NOT LIKE '%images/%'
                        AND lower( resource ) NOT lIKE '%/js/%'
                        AND lower( resource ) NOT lIKE '/static/%'
                        AND lower( resource ) NOT lIKE '/robots.txt%'
                        AND lower( resource ) NOT lIKE '/favicon.ico'
                    GROUP BY geo_state_full
                    HAVING count( geo_state_full ) > 0
                    ORDER BY count( geo_state_full ) DESC
                    LIMIT 10 ) s
                    LEFT JOIN (
                        SELECT 
                            geo_state_full, 
                            resource, 
                            MAX( hits ) AS "hits"
                        FROM page
                        GROUP BY geo_state_full
                    )	p ON s.geo_state_full = p.geo_state_full`.sql_format()
    }
];

module.exports = reports;