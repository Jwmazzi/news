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

            // Collect Table Name from Response
            var the_tbl = res.rows[0].tablename;

            // Replace SQL Values
            // TODO - Leverage PG Module to Handle This Problem
            var the_sql = sql.c.replace('$1', the_tbl);
            var the_sql = the_sql.replace('$2', cameo_code);

            // Collect Target Values
            utils.query(the_sql, null, function(err, res) {

                if (err) {

                    rte_res.render('error', {title: 'SQL Query Failed', error: err.stack});

                } else {

                    var geojson_collection = res.rows[0].jsonb_build_object;

                    rte_res.send(geojson_collection);

                }

            });

        }

    });
  
});
  
module.exports = router;