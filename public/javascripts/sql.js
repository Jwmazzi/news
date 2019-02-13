module.exports = {

    a:`
           select tablename from pg_catalog.pg_tables 
           where left(tablename, 4) = 'geom'
           order by tablename desc limit 1
           `
        ,

    b:`
            select distinct 
            left(title, 50) as title,
            sourceurl as source, 
            actor1name as name_one,
            actor2name as name_two,
            round(avgtone::numeric, 2) as avgtone 
            from $1
            where left(eventcode, 2) in ('$2') and numarticles::integer >= 25 and actor2name != ''
            order by avgtone asc
            limit 10;
            `
        ,
    
    c:`
            select st_asgeojson(geom) as geo
            from $1
            where left(eventcode, 2) in ('$2')
            limit 50;
            `

}