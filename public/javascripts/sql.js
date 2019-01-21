module.exports = {

    latest:`
           select tablename from pg_catalog.pg_tables 
           where left(tablename, 4) = 'geom'
           order by tablename desc limit 1
           `
        ,

    base:`
            select distinct sourceurl, goldsteinscale::float, numarticles::integer from $1
            where left(eventcode, 2) in ('$2') and numarticles::integer >= 25
            order by goldsteinscale::float asc, numarticles::integer desc 
            limit 50;
            `

}