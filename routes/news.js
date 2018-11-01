var express    = require('express');
var router     = express.Router();
var utils      = require('../public/javascripts/utils');
var sql        = require('../public/javascripts/sql');

router.get('/', (rte_req, rte_res, next) => {

  utils.query(sql.latest, null, function(err, res) {

    if (err) {
      
      rte_res.render('error', {title: 'SQL Query Failed', error: err.stack});

    } else {

      var the_tbl = res.rows[0].tablename;
      var the_sql = sql.protest.replace('$1', the_tbl)

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
