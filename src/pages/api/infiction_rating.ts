import {
    getInfictionRating,
    createInfictionRating,
    getInfictionRatingById,
    // get_delete_UserScreenplay
    updateInfictionRating
} from '../../queries/infiction_rating'
import { Amplify } from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({ ...config, ssr: true });

export default async function handle(req, res) {
    try {
        switch (req.method) {
            case 'GET': {
                if (req.query.id) {
                    const rating = await getInfictionRatingById(parseInt(req.query.id))

                    return res.status(200).json({ id: req.query.id, data: rating });
                } else {
                    // Otherwise, fetch all readers
                    const readers = await getInfictionRating()
                    return res.json(readers)
                }
            }

            case 'POST': {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'POST');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                // Create a new reader //reader_id, screenplay_id, rating
                const { screenplay_id, rating, status } = req.body
                const reader = await createInfictionRating(screenplay_id, rating, status)

                return res.status(200).json({ message: 'infiction_rating Created Successfully', data: reader });
            }

            case 'PUT': {
                //update rating = reader_id, screenplay_id, rating
                
                const { reader_id, screenplay_id, rating, feedback, status } = req.body
                // console.log(reader_id, screenplay_id, rating, feedback, status);
                
                // if (reader_id && screenplay_id && rating, feedback, status) {
                try {
                    const inf_rating = await updateInfictionRating(parseInt(reader_id), parseInt(screenplay_id), rating, feedback, status)
                    return res.status(200).json({ message: "Rating Update Successfully", inf_rating });
                } catch (error) {
                    return res.status(500).json({ error, message: `Something went Wrong: ${error}` })
                }

                // }
            }

            // case 'DELETE': {
            //     // Delete an existing user screenplay
            //     const rating = await get_delete_UserScreenplay(req.query.id)
            //     return res.json(rating)
            // }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
                return res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    } catch (error) {
        return res.status(500).json({ error, message: error.message })
    }
}