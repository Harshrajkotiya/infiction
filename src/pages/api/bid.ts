import {
    createBid,
    deleteBid,
    getAllBids, getBidById, updateBid

} from '../../queries/bid'
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({...config,ssr:true});

export default async function handle(req, res) {
    try {
        switch (req.method) {
            case 'GET': {
                if (req.query.screenplay_id) {
                    const bid = await getBidById(parseInt(req.query.screenplay_id))
                    // console.log("bid", bid);
                    
                    return res.status(200).json({ screenplay_id: req.query.screenplay_id, data: bid });
                } else {
                    const bids = await getAllBids()
                    return res.json(bids)
                }
            }

            case 'POST': {
                const { screenplay_id, bider_id, bid_amount, status } = req.body
                const bid = await createBid(screenplay_id, bider_id, bid_amount, status)

                return res.status(200).json({ message: 'Bid Created Successfully', data: bid });
            }

            case 'PUT': {
                const { screenplay_id, bider_id, status } = req.body
                const bid = await updateBid(screenplay_id, bider_id, status)

                return res.status(200).json({ message: 'Bid Updated Successfully', data: bid });
            }

            case 'DELETE': {
                const bid = await deleteBid(req.query.screenplay_id, req.query.bider_id)
                return res.json(bid)
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
                return res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    } catch (error) {
        return res.status(500).json({ error, message: error.message })
    }
}