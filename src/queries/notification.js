const { Pool } = require('pg');

const conn = new Pool({
    connectionString: process.env.DBConnectionString,
})

// READ
export const getAllNotification = async () => {
    const notification = await conn.query("SELECT * FROM public.notification");
    return notification
}

export const getNotificationById = async id => {
    const query = {
        text: 'SELECT * FROM public.notification WHERE user_id = $1',
        values: [id],
    };
    const notification = await conn.query(query);
    return notification
}


// CREATE
export const createNotification= async (user_id, message) => {
    const query = {
        text: `INSERT INTO public.notification (user_id, message) VALUES ($1, $2) RETURNING *`,
        values: [user_id, message],
    };
    const created_notification = await conn.query(query);

    return created_notification
}

// DELETE
export const deleteUserNotification = async (user_id) => {
    const query = {
        text: 'DELETE FROM public.notification WHERE notification.user_id = $1 RETURNING *',
        values: [user_id],
    };
    // console.log("query", query);
    const notification = conn.query(query);

    return notification
}


