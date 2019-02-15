var express    = require('express');
var router     = express.Router();
var utils      = require('../public/javascripts/utils');
var cameo      = require('../public/javascripts/cameo');
var sql        = require('../public/javascripts/sql');
var url        = require('url');

router.get('/', (rte_req, rte_res) => {

    // Parse Incoming Query Parameters
    var the_params = url.parse(rte_req.url, true).query;
    var cameo_code = cameo[the_params.category];

    // Set Cameo Type & Code
    if (Object.keys(the_params).length == 0) {
        var cameo_code = '14';
    } else {
        var cameo_code = cameo[the_params.category];
    }

    // Collect Current Table
    utils.query(sql.a, null, function(err, res) {

        if (err) {

            rte_res.render('error', {title: 'SQL Query Failed', error: err.stack});

        } else {

            // Collect Name of Daily GDELT Table
            var the_tbl = res.rows[0].tablename;

            // Query for Target IDs
            var id_sql = sql.d.replace('$1', the_tbl);
            var id_sql = id_sql.replace('$2', cameo_code);

            // Collect Target Values
            utils.query(id_sql, null, function(err, res) {

                if (err) {

                    rte_res.render('error', {title: 'SQL Query Failed', error: err.stack});

                }

                // Unpack Global Ids to Array
                var id_array = res.rows.map(row => row.globaleventid);

                // Format SQL to Fetch Based on IDs
                var feature_sql = sql.c.replace('$1', the_tbl);
                var feature_sql = feature_sql.replace('$2', id_array);

                utils.query(feature_sql, null, function(err, res) {

                    if (err) {

                        rte_res.render('error', {title: 'SQL Query Failed', error: `${err.stack.slice(0, 120)} . . .`});
                    
                    }

                    rte_res.send(res.rows[0].jsonb_build_object);

                });

            });

        }

    });
  
});
  
module.exports = router;