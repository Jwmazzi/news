var express    = require('express');
var router     = express.Router();
var utils      = require('../public/javascripts/utils');

var sql_a = `
            select tablename from pg_catalog.pg_tables 
            where left(tablename, 4) = 'geom'
            order by tablename desc limit 1
            `

var sql_b = `
            select distinct sourceurl, goldsteinscale::float, numarticles::integer from $1
            where left(eventcode, 2) in ('14') and numarticles::integer >= 25
            order by goldsteinscale::float asc, numarticles::integer desc 
            limit 5;
            `

router.get('/', (rte_req, rte_res, next) => {

  utils.query(sql_a, null, function(err, res) {

    if (err) {

      rte_res.render('error', {title: 'SQL Query Failed', error: err.stack});
      
    } else {

      var the_tbl = res.rows[0].tablename;
      var the_sql = sql_b.replace('$1', the_tbl)

      utils.query(the_sql, null, function(err, res) {

        if (err) { 
          rte_res.render('error', {title: 'SQL Query Failed', error: err.stack});
        } else {
          rte_res.render('news', {title: 'GDELT News', stories: res.rows});
        }

      });

    }

  });

});

module.exports = router;
