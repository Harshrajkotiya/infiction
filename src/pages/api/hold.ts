import {
    createHold,
    deleteExpiredHold,
    deleteHold,
    getAllHolds, getHoldById, updateHold

} from '../../queries/hold'
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({...config,ssr:true});

export default async function handle(req, res) {
    try {
        switch (req.method) {
            case 'GET': {
                if (req.query.screenplay_id) {
                    const hold = await getHoldById(parseInt(req.query.screenplay_id))
                    return res.status(200).json({ screenplay_id: req.query.screenplay_id, data: hold });
                } else {
                    const holds = await getAllHolds()
                    return res.json(holds)
                }
            }

            case 'POST': {
                const { screenplay_id, user_id, status } = req.body
                const hold = await createHold(screenplay_id, user_id, status)

                return res.status(200).json({ message: 'Hold Created Successfully', data: hold });
            }

            case 'PUT': {
                const { screenplay_id, user_id, status } = req.body
                const hold = await updateHold(screenplay_id, user_id, status)

                return res.status(200).json({ message: 'Hold Updated Successfully', data: hold });
            }

            case 'DELETE': {
                if(req.query.screenplay_id && req.query.user_id){
                    const hold = await deleteHold(req.query.screenplay_id, req.query.user_id)
                    return res.json(hold)
                }else{
                    const hold = await deleteExpiredHold()
                    return res.json(hold)
                }
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
                return res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    } catch (error) {
        return res.status(500).json({ error, message: error.message })
    }
}