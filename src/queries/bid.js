const { Pool } = require('pg');

const conn = new Pool({
    connectionString: process.env.DBConnectionString,
})

// READ
export const getAllBids = async () => {
    const bids = await conn.query(`SELECT b.*, s.*
    FROM public.bid AS b
    JOIN public.screenplay AS s ON b.screenplay_id = s.id`);
    return bids
}

export const getBidById = async (id) => {
    const query = {
        text: `SELECT b.*, s.user_id AS owner_id
        FROM public.bid AS b
        JOIN public.screenplay AS s ON b.screenplay_id = s.id
        WHERE b.screenplay_id = $1;
        `,
        values: [id],
    };
    const bid = await conn.query(query);
    return bid
}


// CREATE
export const createBid= async (screenplay_id, bider_id, bid_amount, status) => {
    const query = {
        text: `INSERT INTO public.bid (screenplay_id, bider_id, bid_amount, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (screenplay_id, bider_id)
        DO UPDATE SET bid_amount = EXCLUDED.bid_amount, status = EXCLUDED.status
        RETURNING *`,
        values: [screenplay_id, bider_id, bid_amount, status],
    };
    const created_bid = await conn.query(query);

    return created_bid
}

export const updateBid = async (screenplay_id, bider_id, status) => {
    const query = {
        text: `UPDATE public.bid SET status=$3 WHERE screenplay_id = $1 AND bider_id = $2 RETURNING *`,
        values: [screenplay_id, bider_id, status],
    };
    const bid = await conn.query(query);
    return bid
}

// DELETE
export const deleteBid = async (screenplay_id, bider_id) => {
    const query = {
        text: 'DELETE FROM public.bid WHERE bid.screenplay_id = $1 AND bid.bider_id = $2 RETURNING *',
        values: [screenplay_id, bider_id],
    };
    const bid = conn.query(query);

    return bid
}


