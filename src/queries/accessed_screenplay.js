const { Pool } = require('pg');

const conn = new Pool({
    connectionString: process.env.DBConnectionString,
})

export const getAccessedScreenplay = async (user_id) => {
    const countQuery = `SELECT screenplay_id, COUNT(*) AS access_count
    FROM public.accessed_screenplay
    WHERE user_id = $1
      AND EXTRACT(MONTH FROM accessed_at) = EXTRACT(MONTH FROM CURRENT_DATE)
    GROUP BY screenplay_id`;

    const query = {
        text: countQuery,
        values: [user_id],
    };

    const accessCountResult = await conn.query(query);
    const accessCount = accessCountResult.rows;

    return accessCount;
}

// CREATE
export const createAccessedScreenplay = async (screenplay_id, user_id) => {
    const insertQuery = `
        INSERT INTO public.accessed_screenplay (screenplay_id, user_id)
        SELECT $1, $2
        WHERE NOT EXISTS (
          SELECT 1 FROM public.accessed_screenplay
          WHERE screenplay_id = $1 AND user_id = $2
        )
        RETURNING *
      `;

    const query = {
        text: insertQuery,
        values: [screenplay_id, user_id],
    };

    const created_user = await conn.query(query);
    return created_user.rows[0];
}



