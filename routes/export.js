var archiver   = require('archiver');
var express    = require('express');
var router     = express.Router();
var utils      = require('../public/javascripts/utils');
var uuidv1     = require('uuid/v1');
var config     = require('dotenv').config().parsed;
var path       = require('path');
var sql        = require('../public/javascripts/sql');
var cp         = require('child_process');
var fs         = require('fs');


router.post('/', (rte_req, rte_res) => {

    // Grab Incoming Parameters
    global_ids = rte_req.body.ids;
    table_name = rte_req.body.table;

    // Format SQL to Fetch Based on IDs
    var feature_sql = sql.f.replace('$1', table_name);
    var feature_sql = feature_sql.replace('$2', global_ids);

    // Get Job Name
    var job_id = uuidv1();
    var job_path = path.join(path.dirname(path.join(__dirname)), 'public', 'jobs', job_id);
    var shp_path = path.join(job_path, 'export.shp');
    var zip_path = path.join(job_path, 'gdelt.zip');

    // Make Directory, Build Zipped Shape, and Return to Client
    fs.mkdir(job_path, (err) => {

        if (err) {console.log('Error Building File')}

    });

    // Build Shapefile with PGSQL2SHP
    cp.execSync(
        `C:\\"Program Files"\\PostgreSQL\\10\\bin\\pgsql2shp.exe -f ${shp_path} -h localhost -u postgres -P postgres gdelt "${feature_sql};"`,
        {shell: true}
    );

    // Create Archive File
    var output = fs.createWriteStream(zip_path);
    var archive = archiver('zip', {zlib: { level: 9 }});

    archive.on('error', function(err) {
        console.log('Error While Building Zip Archive');
    });

    archive.pipe(output);

    // Return Zip When Finished
    output.on('close', function() {

        console.log(`Exported File Size (Bytes): ${archive.pointer()}`);

        rte_res.send({zip_path: `jobs/${job_id}/gdelt.zip`});

      });

    fs.readdirSync(job_path).forEach(file => {

        if (!file.endsWith('zip')) {

            archive.file(path.join(job_path, file), {name: file});
        }
        
    });

    archive.finalize();

});

module.exports = router;