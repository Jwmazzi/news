var express    = require('express');
var router     = express.Router();
var utils      = require('../public/javascripts/utils');
var cameo      = require('../public/javascripts/cameo');
var sql        = require('../public/javascripts/sql');
var url        = require('url');

router.get('/', (rte_req, rte_res) => {

  // Parse Incoming Query Parameters
  var the_params = url.parse(rte_req.url, true).query;

  // Set Cameo Type & Code
  if (Object.keys(the_params).length == 0) {
    var cameo_type = 'Protest';
    var cameo_code = 14;
  } else {
    var cameo_code = cameo[the_params.category];
    var cameo_type = the_params.category;
  }

  // Query Current Table & Return Appropriate Template
  utils.query(sql.a, null, function(err, res) {

    if (err) {
      
      rte_res.render('error', {title: 'SQL Query Failed', error: err.stack});

    } else {

      // Collect Name of Daily GDELT Table
      var the_tbl = res.rows[0].tablename;

      if (the_params.country) {

        var id_sql = sql.d_1.replace('$1', the_tbl);
        var id_sql = id_sql.replace('$2', cameo_code);
        var id_sql = id_sql.replace('$3', the_params.country.toUpperCase());
        
      } else {

        // Query for Target IDs
        var id_sql = sql.d_1.replace(/\$1/g, the_tbl);
        var id_sql = id_sql.replace('$2', cameo_code);

      }

      utils.query(id_sql, null, function(err, res) {

        if (err) {

          rte_res.render('error', {title: 'SQL Query Failed', error: `${err.stack.slice(0, 120)} . . .`});

        }

        // Unpack Global Ids to Array
        var id_array = res.rows.map(row => row.globaleventid);

        // Format SQL to Fetch Based on IDs
        var table_sql = sql.e.replace('$1', the_tbl);
        var table_sql = table_sql.replace('$2', id_array);

        // Collect Target Values for Building Table
        utils.query(table_sql, null, function(err, res) {

          if (err) {

            rte_res.render('error', {title: 'SQL Query Failed', error: `${err.stack.slice(0, 120)} . . .`});

          } 

          if (rte_req.user) {

            rte_res.render('news', {
              date: the_tbl,
              title: `${cameo_type} Headlines`.toUpperCase(),
              user: rte_req.user._json.name,
              stories: res.rows, 
              cam_type: cameo_type[0].toUpperCase() + cameo_type.slice(1)
            });

          } else {

            rte_res.render('news', {
              date: the_tbl,
              title: `${cameo_type} Headlines`.toUpperCase(),
              user: 'Guest', 
              stories: res.rows, 
              cam_type: cameo_type[0].toUpperCase() + cameo_type.slice(1)
            });

          }

        });
        
      });

    }

  });

});

module.exports = router;
