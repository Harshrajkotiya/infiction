/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	DBConnectionString
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */


exports.handler = async (event) => {
    const { Pool } = require('pg');

    const DBConnectionString= 'postgres://DhruviTMBS:qoU7nZWlzNT8@ep-little-violet-026767.ap-southeast-1.aws.neon.tech:5432/infictionDB?sslmode=require'
    const conn = new Pool({
        connectionString: DBConnectionString,
    })
    
    const deleteExpiredHold = async () => {
        const interval_period = process.env.process.env.NEXT_PUBLIC_HOLDING_PERIOD
        const query = {
            text: `DELETE FROM hold
            WHERE createdat <  (NOW() - INTERVAL '$1 days') RETURNING *;`,
            values: [parseInt(interval_period)],
        };
        const hold = conn.query(query);
    
        return hold
    }

    const updateScreenplay = async (id) => {
        const query = {
          text: `UPDATE public.screenplay SET is_listed=true WHERE id = $1 RETURNING *`,
          values: [parseInt(id)],
        };
        const screenplay = await conn.query(query);
        return screenplay
      }
    
    console.log(`EVENT: ${JSON.stringify(event)}`);
    try{
        const response = await deleteExpiredHold();
        console.log("Hold Response", response)
        // const listedSP = await updateScreenplay(reponse?.data?.rows[0]?.screenplay_id)
        // console.log("listedSP Response", listedSP)
        return {
            statusCode: 200,
        //  Uncomment below to enable CORS requests
        //  headers: {
        //      "Access-Control-Allow-Origin": "*",
        //      "Access-Control-Allow-Headers": "*"
        //  },
            body: JSON.stringify('Hello from Lambda!'),
        };
    }catch(error){
        console.log("error", error)
        return {
            statusCode: 400,
        //  Uncomment below to enable CORS requests
        //  headers: {
        //      "Access-Control-Allow-Origin": "*",
        //      "Access-Control-Allow-Headers": "*"
        //  },
            body: JSON.stringify(error),
        };
    }
};
