// pages/api/user
import {
    getAllTransaction,
    getTransactionById,
    getTransactionByAgg,
    createTransaction,
    deleteTransaction,

} from '../../queries/transaction';
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports";

Amplify.configure({...config,ssr:true});

export default async function handle(req, res) {
    try {
        switch (req.method) {
            
            case 'GET': {
                if (req.query.user_id && req.query.sum === 'true'){
                    const transaction = await getTransactionByAgg(req.query.user_id)
                    return res.status(200).json({ id: req.query.id, data: transaction });
                }else if (req.query.user_id && req.query.sum === 'false') {
                    const transaction = await getTransactionById(req.query.user_id)
                    return res.status(200).json({ id: req.query.id, data: transaction });
                } else {
                    const transactions = await getAllTransaction()
                    return res.json(transactions)
                }
            }

            case 'POST': {
                const { userid, stripeid, trx_type, trx_amount, status } = req.body
                const transaction = await createTransaction(userid, stripeid, trx_type, trx_amount, status)

                return res.status(200).json({ message: 'Transaction Created Successfully', data: transaction });
            }

            case 'DELETE': {
                const rating = await deleteTransaction(req.query.trxId)
                return res.json(rating)
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
                return res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    } catch (error) {
        return res.status(500).json({ error, message: error.message })
    }
}