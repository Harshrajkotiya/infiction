const { Pool } = require('pg');

const conn = new Pool({
    connectionString: process.env.DBConnectionString,
})

// READ
export const getAllHolds = async () => {
    const holds = await conn.query(`SELECT h.*, s.*, h.user_id as holder_id
    FROM public.hold AS h
    JOIN public.screenplay AS s ON h.screenplay_id = s.id`);
    return holds
}

export const getHoldById = async (id) => {
    const query = {
        text: `SELECT h.*, s.user_id AS owner_id
        FROM public.hold AS h
        JOIN public.screenplay AS s ON h.screenplay_id = s.id
        WHERE h.screenplay_id = $1;
        `,
        values: [id],
    };
    const bid = await conn.query(query);
    return bid
}


// CREATE
export const createHold= async (screenplay_id, user_id, status) => {
    const query = {
        text: `INSERT INTO public.hold (screenplay_id, user_id, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (screenplay_id, user_id)
        DO UPDATE SET status = EXCLUDED.status
        RETURNING *`,
        values: [screenplay_id, user_id, status],
    };
    const created_hold = await conn.query(query);

    return created_hold
}

export const updateHold = async (screenplay_id, user_id, status) => {
    const query = {
        text: `UPDATE public.hold SET status=$3 WHERE screenplay_id = $1 AND user_id = $2 RETURNING *`,
        values: [screenplay_id, user_id, status],
    };
    const hold = await conn.query(query);
    return hold
}

// DELETE
export const deleteHold = async (screenplay_id, user_id) => {
    const query = {
        text: 'DELETE FROM public.hold WHERE hold.screenplay_id = $1 AND hold.user_id = $2 RETURNING *',
        values: [screenplay_id, user_id],
    };
    const hold = conn.query(query);

    return hold
}

export const deleteExpiredHold = async () => {

    const query = {
        text: `DELETE FROM hold
        WHERE createdat <  (NOW() - INTERVAL '$1 days') RETURNING *;`,
        values: [parseInt(process.env.NEXT_PUBLIC_HOLDING_PERIOD)],
    };
    const hold = conn.query(query);

    return hold
}


