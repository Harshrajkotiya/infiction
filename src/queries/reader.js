const { Pool } = require('pg');

const conn = new Pool({
    connectionString: process.env.DBConnectionString,
})

//get reader data from id 
export const getReadrById = async id => {
    const query = {
        text: 'SELECT * FROM public.reader WHERE reader_id = $1',
        values: [parseInt(id)],

    };
    const readers = await conn.query(query)
    return readers
}

//get Screenplay for (infiction) data from reader id -- get sp by reader id for reader dashboard
export const getScreenplayByInfictionReaderId = async id => {
    const query = {
        text: `SELECT 
        sp.*, sp.id, infiction_rating.feedback, infiction_rating.reader_id,
        CASE
          WHEN -1 = ANY (array_agg(infiction_rating.rating)) THEN '0'
          ELSE ROUND(CAST(infiction_rating.rating AS NUMERIC),1)::text
        END AS rating,
        infiction_rating.status
        FROM 
            screenplay AS sp
        JOIN 
            infiction_rating ON infiction_rating.screenplay_id = sp.id
        WHERE 
            infiction_rating.reader_id = (
            SELECT reader_id FROM public.reader WHERE user_id = $1
            )
        GROUP BY 
            sp.*, sp.id, infiction_rating.rating, infiction_rating.feedback, infiction_rating.reader_id, infiction_rating.status
        ORDER BY 
            sp.id ASC;`,
        values: [id]
    };
    // console.log("query", query);
    const spByReaderId = await conn.query(query)
    return spByReaderId
}

//get Screenplay for (industries) data from reader id -- get sp by reader id for reader dashboard
export const getScreenplayByIndustriesReaderId = async id => {
    const query = {
        text: `SELECT 
        sp.*, sp.id, industry_rating.feedback, industry_rating.reader_id,
        CASE
          WHEN -1 = ANY (array_agg(industry_rating.rating)) THEN '0'
          ELSE ROUND(CAST(industry_rating.rating AS NUMERIC),1)::text
        END AS rating,
        industry_rating.status
        FROM 
            screenplay AS sp
        JOIN 
            industry_rating ON industry_rating.screenplay_id = sp.id
        WHERE 
            industry_rating.reader_id = (
            SELECT reader_id FROM public.reader WHERE user_id = $1
            )
        GROUP BY 
            sp.*, sp.id, industry_rating.rating, industry_rating.feedback, industry_rating.reader_id, industry_rating.status
        ORDER BY 
            sp.id ASC;`,
        values: [id]
    };
    const spByReaderId = await conn.query(query)
    return spByReaderId
}

//get all readers 
export const getAllReader = async () => {
    const query = {
        text: 'SELECT * FROM public.reader'
    };
    const allReaders = await conn.query(query)
    return allReaders
}

//get reader list by reader Type (infiction or industries)
export const getReaderByType = async (readerType) => {
    const query = {
        text: 'SELECT * FROM public.reader where reader_type = $1',
        values: [readerType]
    };
    const readerByTypeRes = await conn.query(query)
    return readerByTypeRes
}
export const getReaderWithEmail = async (reader_email) => {
    const query = {
        text: 'SELECT * FROM public.reader where reader_email = $1',
        values: [reader_email]
    };
    const readerByTypeRes = await conn.query(query)
    return readerByTypeRes
}

export const readerSubIdCognito = async (readerSubIdCognito) => {
    const query = {
        text: 'SELECT * FROM public.reader where user_id = $1',
        values: [readerSubIdCognito]
    };
    const readerByTypeRes = await conn.query(query)
    return readerByTypeRes
}

// CREATE
export const createReader = async (reader_name, reader_type, reader_email, user_id) => {
    const query = {
        text: 'INSERT INTO public.reader (reader_name, reader_type, reader_email, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
        values: [reader_name, reader_type, reader_email, user_id],
    };

    const reader = await conn.query(query)
    return reader
}

//update reader user_id with sub from cognito
export const updateReaderSubId = async (subId, reader_email) => {
    const query = {
        text: 'UPDATE public.reader SET user_id = $1 WHERE reader_email = $2 RETURNING *',
        values: [subId, reader_email],
    };

    const reader = await conn.query(query)
    return reader
}

//Get random readers By type = 1.infiction, 2.industries
export const getRandomReadersByType = async (reader_type) => {
    try {
        let limit = 1;
        const queryCount = {
            text: 'SELECT COUNT(*) FROM public.reader WHERE reader_type = $1',
            values: [reader_type],
        };
        if (reader_type === "infiction") {
            limit = 2;
        }

        const queryGet = {
            text: `SELECT r.reader_id, COUNT(ir.screenplay_id) AS workload
                    FROM reader r
                    LEFT JOIN infiction_rating ir ON r.reader_id = ir.reader_id
                    WHERE r.reader_type = $1
                    GROUP BY r.reader_id
                    ORDER BY workload ASC
                    LIMIT $2;`,
            values: [reader_type, limit],
        };

        // const readerCount = await conn.query(queryCount)

        // const skip = Math.floor(Math.random() * (readerCount - 1));
        const readers = await conn.query(queryGet)

        if (readers.length === 0) {
            throw new Error('Reader Not Found or something went wrong');
        }
        return readers;

    } catch (error) {
        console.error('Error:', error);
        return null; // or handle the error in some other way
    }
}

export const deleteReader = async (user_id) => {
    const query = {
      text: 'DELETE FROM public.reader WHERE user_id = $1 RETURNING *',
      values: [user_id],
    };
    // console.log("query", query);
    const reader = conn.query(query);
  
    return reader
  }
