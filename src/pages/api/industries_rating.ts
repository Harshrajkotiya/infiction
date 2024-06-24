import {
    getIndustriesRating,
    createIndustriesRating,
    getIndustriesRatingById,
    updateIndustriesRating
} from '../../queries/industries_rating'

import { Amplify, withSSRContext } from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({ ...config, ssr: true });

export default async function handle(req, res) {
    try {
        //console.log("form readers:", res.method);
        switch (req.method) {
            case 'GET': {
                if (req.query.id) {
                    const rating = await getIndustriesRatingById(parseInt(req.query.id))
                    return res.status(200).json({ id: req.query.id, data: rating });
                } else {
                    // Otherwise, fetch all readers
                    const readers = await getIndustriesRating()
                    return res.json(readers)
                }
            }

            case 'POST': {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'POST');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                // Create a new reader //reader_id, screenplay_id, rating
                const { screenplay_id, rating, is_applied, status } = req.body
                const reader = await createIndustriesRating(screenplay_id, rating, is_applied, status);

                return res.status(200).json({ message: 'infiction_rating Created Successfully', data: reader });
            }

            case 'PUT': {
                //update raing 
                const { reader_id, screenplay_id, rating, feedback, status } = req.body

                try {
                    const ind_rating = await updateIndustriesRating(parseInt(reader_id), parseInt(screenplay_id), rating, feedback, status)
                    return res.status(200).json({ message: "Rating Update Successfully", ind_rating })
                } catch (error) {
                    return res.status(500).json({ error, message: `Something went Wrong: ${error}` })
                }

                // const rating = await updateInfictionRating(parseInt(req.query.id))

                // return res.status(200).json({ message : "Update Successfully", rating });
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
                return res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    } catch (error) {
        console.log("form screenplay err:", res.method);
        return res.status(500).json({ ...error, message: error.message })
    }
}