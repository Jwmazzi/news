module.exports = {

    a:`
           select tablename from pg_catalog.pg_tables 
           where left(tablename, 4) = 'geom'
           order by tablename desc limit 1
           `
        ,

    d:`
           select globaleventid
           from $1
           where left(eventcode, 2) in ('$2')
           and numarticles::integer >= 25 and actor2name != ''
           order by avgtone asc
           limit 500;
           `
        
        ,

    b:`
            select
            globaleventid,
            left(title, 75) as title,
            sourceurl as source, 
            actor1name as name_one,
            actor2name as name_two,
            round(avgtone::numeric, 2) as avgtone,
            goldsteinscale as goldstein
            from $1
            where left(eventcode, 2) in ('$2') and numarticles::integer >= 25 and actor2name != ''
            order by avgtone asc
            limit 500;
            `
        ,

    e: `
            select
            globaleventid,
            left(title, 75) as title,
            sourceurl as source, 
            actor1name as name_one,
            actor2name as name_two,
            round(avgtone::numeric, 2) as avgtone,
            goldsteinscale as goldstein
            from $1
            where globaleventid in ($2)

            `

        ,

    c:`
            SELECT jsonb_build_object(
                'type',     'FeatureCollection',
                'features', jsonb_agg(feature)
            )
            FROM (
            SELECT jsonb_build_object(
                'type',       'Feature',
                'id',         globaleventid,
                'geometry',   ST_AsGeoJSON(geom)::jsonb,
                'properties', to_jsonb(row) - 'geom'
            ) AS feature
            FROM (
                SELECT * 
                FROM $1 
                where globaleventid in ($2)
                order by avgtone asc
                limit 500
            ) row) features;
           `
}