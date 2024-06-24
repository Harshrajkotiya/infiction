const { Pool } = require('pg');

const conn = new Pool({
    connectionString: process.env.DBConnectionString,
})

export const getIndustriesRating = async () => {

}

export const getIndustriesRatingById = async (id) => {
    //     const screenplays = await conn.query("SELECT * FROM public.screenplay");
    //     return screenplays
}

export const updateIndustriesRating = async (reader_id, screenplay_id, rating, feedback, status) => {
    let query = { text: "", values: [] }
    if (feedback != undefined) {
        query = {
            text: 'update public.industry_rating set rating = $1, feedback=$4, status=$5 where reader_id=$2 and screenplay_id=$3 RETURNING *',
            values: [rating, reader_id, screenplay_id, feedback, status],
        };
    } else {
        query = {
            text: 'update public.industry_rating set rating = $1, status=$4 where reader_id=$2 and screenplay_id=$3 RETURNING *',
            values: [rating, reader_id, screenplay_id, status],
        };
    }

    const updateInfictionRating = await conn.query(query);
    return updateInfictionRating
}

export const createIndustriesRating = async (screenplay_id, rating, is_applied, status) => {
    const query = {
        text: `INSERT INTO public.industry_rating (reader_id, screenplay_id, rating, is_applied, status)
        SELECT r.reader_id, $1, $2, $3, $4
        FROM reader r
        LEFT JOIN 
            (SELECT reader_id, COUNT(*) as count_of_active
            FROM public.industry_rating
            WHERE status = 'Active'
            GROUP BY reader_id) ct 
        ON r.reader_id = ct.reader_id
        WHERE r.reader_type = 'industries_reader' 
        ORDER BY COALESCE(count_of_active, 0) ASC
        LIMIT 1 RETURNING *`,
        values: [screenplay_id, rating, is_applied, status],
    };

    const reader = await conn.query(query)
    return reader
}