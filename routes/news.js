var express = require('express');
var router = express.Router();
var dateformat = require('dateformat');

// PG Connection Values
require('dotenv').config();
const { Client } = require('pg');
const client = new Client();
client.connect();

// TODO - Replace This With Call for the Follwing
/* 
select tablename from pg_catalog.pg_tables
where left(tablename, 4) = 'geom'
order by tablename asc limit 1
*/
let today   = new Date();
let yesterday = today.setDate(today.getDate() - 2);
let the_sql = `
                select distinct sourceurl, goldsteinscale::float, numarticles::integer 
                from geom_${dateformat( yesterday, 'yyyymmdd')}
                where left(eventcode, 2) in ('14') and numarticles::integer >= 25
                order by goldsteinscale::float asc, numarticles::integer desc 
                limit 5;
                `

router.get('/', (req, res, next) => {

  client.query(the_sql, (pg_err, pg_res) => {

    if (pg_err) {
      res.render(
        'error', 
        { title: 'SQL Query Failed', error: pg_err.stack}
      );
    } else {
      res.render(
        'news',
        {title: 'GDELT News', stories: pg_res.rows}
      );
    }
    
  });

});

module.exports = router;
