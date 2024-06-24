const { Pool } = require('pg');

const conn = new Pool({
  connectionString: process.env.DBConnectionString,
})

// READ
export const getAllScreenplay = async () => {
  const screenplays = await conn.query("SELECT * FROM public.screenplay");
  return screenplays
}

export const getScreenplay = async id => {
  const query = {
    text: 'SELECT * FROM public.screenplay WHERE id = $1',
    values: [id],
  };
  const screenplay = await conn.query(query);
  return screenplay
}

export const getDetailedScreenplay = async () => {
  const query = {
    text: `SELECT screenplay.*,
    CASE
      WHEN -1 = ANY (array_agg(infiction_rating.rating)) THEN 'Pending'
      ELSE ROUND(AVG(CAST(infiction_rating.rating AS NUMERIC)),1)::text
    END AS infiction_rating,
    CASE
      WHEN (-1 = ANY (array_agg(industry_rating.rating)) and industry_rating.is_applied) or -1 = ANY (array_agg(infiction_rating.rating)) THEN 'Pending'
      WHEN AVG(CAST(industry_rating.rating AS NUMERIC)) < 6 or AVG(CAST(infiction_rating.rating AS NUMERIC)) < 4 THEN 'Not Eligible'
      ELSE ROUND(AVG(CAST(industry_rating.rating AS NUMERIC)),1)::text
    END AS industry_rating,
    (
      SELECT infiction_rating.feedback
      FROM infiction_rating
      WHERE infiction_rating.screenplay_id = screenplay.id
      ORDER BY infiction_rating.feedback DESC
      LIMIT 1
    ) AS infiction_feedback,
    (
          SELECT industry_rating.feedback
          FROM industry_rating
          WHERE industry_rating.screenplay_id = screenplay.id
          ORDER BY industry_rating.feedback DESC
          LIMIT 1
        ) AS industry_feedback,
        CASE
          WHEN (
              SELECT wishlist.is_bought
              FROM wishlist
              WHERE wishlist.screenplay_id = screenplay.id
              LIMIT 1
          ) THEN true
          ELSE false
        END AS is_bought,
        CASE
          WHEN AVG(CAST(industry_rating.rating AS NUMERIC)) >= 6 THEN true
          ELSE false
        END AS is_topRated,
        CASE
          WHEN screenplay.id IN (
              SELECT hold.screenplay_id 
              FROM hold
              WHERE hold.status = 'onhold'
          ) THEN true
          ELSE false
        END AS is_holded 
    FROM screenplay
    LEFT JOIN infiction_rating ON screenplay.id = infiction_rating.screenplay_id
    LEFT JOIN industry_rating ON screenplay.id = industry_rating.screenplay_id
    GROUP BY screenplay.id, industry_rating.is_applied;
    `,
    values: [],
  };
  const screenplay = await conn.query(query);
  return screenplay
}

export const getUserScreenplay = async user_id => {
  // const query = {
  //     text: 'SELECT screenplay.*, ROUND(AVG(CAST(infiction_rating.rating AS NUMERIC)),1) AS rating FROM screenplay LEFT JOIN infiction_rating ON screenplay.id = infiction_rating.screenplay_id WHERE screenplay.user_id = $1 GROUP BY screenplay.id',
  //     values: [user_id],
  // };
  const queryText =
    `SELECT screenplay.*,
        CASE
          WHEN -1 = ANY (array_agg(infiction_rating.rating)) THEN 'Pending'
          ELSE ROUND(AVG(CAST(infiction_rating.rating AS NUMERIC)),1)::text
        END AS infiction_rating,
        CASE
          WHEN (-1 = ANY (array_agg(industry_rating.rating)) and industry_rating.is_applied) or -1 = ANY (array_agg(infiction_rating.rating)) THEN 'Pending'
          WHEN AVG(CAST(industry_rating.rating AS NUMERIC)) < 6 or AVG(CAST(infiction_rating.rating AS NUMERIC)) < 4 THEN 'Not Eligible'
          ELSE ROUND(AVG(CAST(industry_rating.rating AS NUMERIC)),1)::text
        END AS industry_rating,
        (
          SELECT infiction_rating.feedback
          FROM infiction_rating
          WHERE infiction_rating.screenplay_id = screenplay.id
          ORDER BY infiction_rating.feedback DESC
          LIMIT 1
        ) AS infiction_feedback,
		(
          SELECT industry_rating.feedback
          FROM industry_rating
          WHERE industry_rating.screenplay_id = screenplay.id
          ORDER BY industry_rating.feedback DESC
          LIMIT 1
        ) AS industry_feedback,
        CASE
      WHEN (
          SELECT wishlist.is_bought
          FROM wishlist
          WHERE wishlist.screenplay_id = screenplay.id
          LIMIT 1
      ) THEN true
      ELSE false
    END AS is_bought,
    CASE
          WHEN screenplay.id IN (
              SELECT hold.screenplay_id 
              FROM hold
              WHERE hold.status = 'onhold'
          ) THEN true
          ELSE false
        END AS is_holded
FROM screenplay
LEFT JOIN infiction_rating ON screenplay.id = infiction_rating.screenplay_id
LEFT JOIN industry_rating ON screenplay.id = industry_rating.screenplay_id
WHERE screenplay.user_id = $1
GROUP BY screenplay.id, industry_rating.is_applied;
`

  const query = {
    text: queryText,
    values: [user_id],
  };

  const user_screenplay = await conn.query(query);

  return user_screenplay
}

export const getTopRatedScreenplay = async (user_id) => {
  const query = {
    text: `SELECT screenplay.*,
    CASE
      WHEN -1 = ANY(array_agg(infiction_rating.rating)) THEN 'Pending'
      ELSE ROUND(AVG(CAST(infiction_rating.rating AS NUMERIC)), 1)::text
    END AS infiction_rating,
    CASE
      WHEN (-1 = ANY(array_agg(industry_rating.rating)) AND industry_rating.is_applied)
           OR -1 = ANY(array_agg(infiction_rating.rating)) THEN 'Pending'
      WHEN AVG(CAST(industry_rating.rating AS NUMERIC)) < 6
           OR AVG(CAST(infiction_rating.rating AS NUMERIC)) < 4 THEN 'Not Eligible'
      ELSE ROUND(AVG(CAST(industry_rating.rating AS NUMERIC)), 1)::text
    END AS industry_rating,
    CASE
      WHEN (
          SELECT wishlist.is_wished
          FROM wishlist
          WHERE wishlist.screenplay_id = screenplay.id
            AND wishlist.user_id = $1
          LIMIT 1
      ) THEN true
      ELSE false
    END AS is_wished,
    CASE
      WHEN (
          SELECT wishlist.is_bought
          FROM wishlist
          WHERE wishlist.screenplay_id = screenplay.id and wishlist.user_id = $1
          LIMIT 1
      ) THEN true
      ELSE false
    END AS is_bought,
    (
      SELECT wishlist.user_id
      FROM wishlist
      WHERE wishlist.screenplay_id = screenplay.id
          AND wishlist.user_id = $1
      LIMIT 1
    ) AS buyer_id 
  FROM screenplay
  LEFT JOIN infiction_rating ON screenplay.id = infiction_rating.screenplay_id
  LEFT JOIN industry_rating ON screenplay.id = industry_rating.screenplay_id
  LEFT JOIN hold ON screenplay.id = hold.screenplay_id
  WHERE screenplay.is_listed = true 
    or hold.user_id = $1
    AND hold.screenplay_id = screenplay.id
    AND (hold.createdat::date - current_date) <= $2
  GROUP BY screenplay.id, industry_rating.is_applied
  HAVING AVG(CAST(industry_rating.rating AS NUMERIC)) >= 6;`,
    values: [user_id, parseInt(process.env.NEXT_PUBLIC_HOLDING_PERIOD)],
  };
  const screenplays = await conn.query(query);
  return screenplays
}
export const getMemberScreenplay = async (user_id) => {
  const query = {
    text: `SELECT 
    sp.*,
    AVG(ir.rating) AS average_infiction_rating,
    idr.rating AS industry_rating,
    wl.is_bought,
    wl.is_wished
    FROM 
        public.screenplay sp
    INNER JOIN 
        public.infiction_rating ir ON sp.id = ir.screenplay_id
    INNER JOIN 
        public.industry_rating idr ON sp.id = idr.screenplay_id
    INNER JOIN 
        public.wishlist wl ON sp.id = wl.screenplay_id
    WHERE 
        wl.user_id = $1
        AND wl.is_bought = true
    GROUP BY 
        sp.id, idr.rating, wl.is_bought, wl.is_wished
    HAVING 
        idr.rating >= 6;`,
    values: [user_id],
  };
  const screenplays = await conn.query(query);
  return screenplays
}

// CREATE
export const createScreenplay = async (user_id, title, genre, tags, logline, synposis, screenplay_url, ihf) => {
  const query = {
    text: 'INSERT INTO public.screenplay (user_id, title, genre, tags, logline, synposis, screenplay_url, ihf) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    values: [user_id, title, genre, tags, logline, synposis, screenplay_url, ihf],
  };
  const created_screenplay = await conn.query(query);

  return created_screenplay
}

// UPDATE
export const updateScreenplay = async (id, updateData) => {
  const columns = Object.keys(updateData).map(key => `${key} = '${updateData[key]}'`).join(', ');
  const values = Object.values(updateData);
  const query = {
    text: `UPDATE public.screenplay SET ${columns} WHERE id = $1 RETURNING *`,
    values: [parseInt(id)],
  };
  const screenplay = await conn.query(query);
  return screenplay
}

// DELETE
export const deleteUserScreenplay = async (id) => {
  const query = {
    text: 'DELETE FROM public.screenplay WHERE id = $1 RETURNING *',
    values: [parseInt(id)],
  };
  const screenplay = conn.query(query);

  return screenplay
}


