const { Pool } = require('pg');

const conn = new Pool({
    connectionString: process.env.DBConnectionString,
})

// READ
export const getAllUser = async () => {
    const users = await conn.query(`SELECT * FROM public."StripeUser"`);
    return users
}

export const getUser = async (user_id) => {
    const query = {
        text: `SELECT * FROM public."StripeUser" WHERE user_id = $1`,
        values: [user_id],
    };
    // console.log("query", query);
    const user = await conn.query(query);
    return user
}

// CREATE
export const createUser = async (stripeId, email, user_id) => {
    const query = {
        text: `INSERT INTO public."StripeUser" (stripeid, email, user_id) VALUES ($1, $2, $3) RETURNING *`,
        values: [stripeId, email, user_id],
    };
    // console.log("query", query);
    const created_user = await conn.query(query);

    return created_user
}

// UPDATE
export const updateUser = async (id, updateData) => {
    const columns = Object.keys(updateData).map(key => `${key} = '${updateData[key]}'`).join(', ');
   
    columns.isSubscribed && columns.isSubscribed === 'true' ? true : false;

    const query = { text: "", values: [] };

    query.text = `UPDATE public."StripeUser" SET ${columns} WHERE stripeId = $1 RETURNING *`;
    query.values = [id];

    const user = await conn.query(query);
    return user
}

// DELETE
export const deleteUser = async (id) => {
    const query = {
        text: `DELETE FROM public."StripeUser" WHERE id = $1 RETURNING *`,
        values: [parseInt(id)],
    };
    const user = conn.query(query);

    return user
}


