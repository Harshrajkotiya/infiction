const { Pool } = require('pg');

const conn = new Pool({
    connectionString: process.env.DBConnectionString,
})

export const getInfictionRating = async () => {

    try {
        const readerCount = await conn.query(`SELECT COUNT(*) FROM public.infiction_rating`);
        const skip = Math.floor(Math.random() * readerCount);

        const queryGet = {
            text: `SELECT r.reader_id, COUNT(ir.screenplay_id) AS workload
                   FROM reader r
                   LEFT JOIN infiction_rating ir ON r.reader_id = ir.reader_id
                   WHERE r.reader_type = $1
                   GROUP BY r.reader_id
                   ORDER BY workload ASC
                   LIMIT $2;`,
            values: ['infiction',  2],
        };

        const readers = await conn.query(queryGet)
        return readers;

    } catch (error) {
        console.error('Error:', error);
        return null; // or handle the error in some other way
    }
}

export const getInfictionRatingById = async id => {
    const query = {
        text: 'SELECT * FROM public.infiction_rating WHERE screenplay_id = $1',
        values: [parseInt(id)],
    };

    const infiction_rating = await conn.query(query)
    return infiction_rating;

}

// CREATE
export const createInfictionRating = async (screenplay_id, rating, status) => {
    const query = {
        text: `INSERT INTO infiction_rating (reader_id, screenplay_id, rating, status)
        SELECT r.reader_id, $1, $2, $3
        FROM reader r
        LEFT JOIN 
            (SELECT reader_id, COUNT(*) as count_of_active
            FROM public.infiction_rating
            WHERE status = 'Active'
            GROUP BY reader_id) ct 
        ON r.reader_id = ct.reader_id
        WHERE r.reader_type = 'infiction_reader' 
        ORDER BY COALESCE(count_of_active, 0) ASC
        LIMIT 2 RETURNING *;
        `,
        values: [screenplay_id, rating, status],
    };
    const reader = await conn.query(query);
    return reader
}

//update infiction rating with reader id and rating
export const updateInfictionRating = async (reader_id, screenplay_id, rating, feedback, status) => {
    // console.log(reader_id, screenplay_id, rating, feedback, status,feedback != "undefined");
    let query = {text: "", values: []}
    if(feedback != undefined){
        query = {
            text: 'update public.infiction_rating set rating = $1, feedback=$4, status=$5 where reader_id=$2 and screenplay_id=$3 RETURNING *',
            values: [rating, reader_id, screenplay_id, feedback, status],
        };
    }else{
        query = {
            text: 'update public.infiction_rating set rating = $1, status=$4 where reader_id=$2 and screenplay_id=$3 RETURNING *',
            values: [rating, reader_id, screenplay_id, status],
        }; 
    }
    // console.log("query", query);
    const updateInfictionRating = await conn.query(query);
    return updateInfictionRating
}
