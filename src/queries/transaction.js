const { Pool } = require('pg');

const conn = new Pool({
    connectionString: process.env.DBConnectionString,
})

// READ
export const getAllTransaction = async () => {
    const transactions = await conn.query("SELECT * FROM public.transaction");
    return transactions
}

export const getTransactionById = async id => {
    const query = {
        text: `SELECT transaction.stripeid, transaction.trx_id, transaction.trx_type, transaction.trx_amount,transaction.status, transaction.created_at, transaction.userid FROM public.transaction
        JOIN public."StripeUser" ON "StripeUser".stripeid = transaction.stripeid
        WHERE "StripeUser".user_id = $1;`,
        values: [id],
    };
    const transaction = await conn.query(query);
    return transaction
}

export const getTransactionByAgg = async id => {
    const query = {
        text: `SELECT 
        SUM(CASE WHEN trx_amount > 0 THEN trx_amount ELSE 0 END) AS topup,
        SUM(CASE WHEN trx_amount < 0 THEN trx_amount ELSE 0 END) AS withdraw,
        SUM(trx_amount) AS balance
    FROM public.transaction
    JOIN public."StripeUser" ON "StripeUser".stripeid = transaction.stripeid
    WHERE "StripeUser".user_id = $1;`,
        values: [id],
    };
    const transaction = await conn.query(query);
    // console.log("query", query);
    return transaction
}

// CREATE
export const createTransaction = async (userid, stripeid, trx_type, trx_amount, status) => {
    const query = {
        text: 'INSERT INTO public.transaction (userid, stripeid, trx_type, trx_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        values: [userid, stripeid, trx_type, trx_amount, status],
    };
    const created_transaction = await conn.query(query);

    return created_transaction
}


// DELETE
export const deleteTransaction = async (trx_id) => {
    const query = {
        text: 'DELETE FROM public.transaction WHERE transaction.trx_id = $1 RETURNING *',
        values: [trx_id],
    };
    const transaction = conn.query(query);

    return transaction
}


