import { createTransaction } from "@/lib/Transaction/createTransaction";
import { processGetuser } from "@/lib/users";

export default async function storeTransation(user_id, amount) {
    try{
        const stripeUser = await processGetuser(user_id);
    
        const userData = { userid: user_id, stripeid: stripeUser.rows[0].stripeid, trx_type: "service_charge", trx_amount: parseInt(`-${amount}`), status: "completed" }
        const createdTransaction = await createTransaction(userData);
        return {code:200, message: "Transaction Stored Succesfully", createdTransaction};
    }catch (error){
        return {code: 400, message: "Transaction failed", error}
    }
}