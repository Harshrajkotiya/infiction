const { Pool } = require('pg');

const conn = new Pool({
    connectionString: process.env.DBConnectionString,
})

// READ
export const getAllWishlist = async () => {
    const wishlists = await conn.query("SELECT * FROM public.wishlist");
    return wishlists
}

export const getWishlistById = async id => {
    const query = {
        text: 'SELECT * FROM public.wishlist WHERE id = $1',
        values: [id],
    };
    const wishlist = await conn.query(query);
    return wishlist
}


// CREATE
export const createWishlist= async (user_id, screenplay_id, is_wished, is_bought) => {
    const query = {
        text: `
        INSERT INTO public.wishlist (user_id, screenplay_id, is_wished, is_bought)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, screenplay_id)
        DO UPDATE
        SET is_wished = EXCLUDED.is_wished,
            is_bought = EXCLUDED.is_bought RETURNING *;
      `,
        values: [user_id, screenplay_id, is_wished, is_bought],
    };
    const created_wishlist = await conn.query(query);
    // console.log("created_wishlist",query );
    return created_wishlist
}

export const updateWishlist = async (user_id, screenplay_id, is_wished) => {
    // console.log("query", user_id, screenplay_id, updateData);
    // const columns = Object.keys(updateData).map(key => `${key} = '${updateData[key]}'`).join(', ');
    // const values = Object.values(updateData);
    const query = {
        text: `UPDATE public.wishlist SET is_wished=$3 WHERE user_id = $1 AND screenplay_id = $2 RETURNING *`,
        values: [user_id, screenplay_id, is_wished],
    };
    const wishlist = await conn.query(query);
    return wishlist
}

// DELETE
export const deleteUserWishlist = async (spId, userId) => {
    const query = {
        text: 'DELETE FROM public.wishlist WHERE wishlist.screenplay_id = $1 AND wishlist.user_id = $2 RETURNING *',
        values: [parseInt(spId), userId],
    };
    const wishlist = conn.query(query);

    return wishlist
}


