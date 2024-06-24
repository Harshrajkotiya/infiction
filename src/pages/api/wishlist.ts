// pages/api/user
import {
    getAllWishlist,
    getWishlistById,
    createWishlist,
    deleteUserWishlist,
    updateWishlist

} from '../../queries/wishlist'
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({...config,ssr:true});

export default async function handle(req, res) {
    try {
        switch (req.method) {
            case 'GET': {
                if (req.query.id) {
                    const wishlist = await getWishlistById(parseInt(req.query.id))

                    return res.status(200).json({ id: req.query.id, data: wishlist });
                } else {
                    // Otherwise, fetch all readers
                    const wishlists = await getAllWishlist()
                    return res.json(wishlists)
                }
            }

            case 'POST': {
                // Create a new reader //reader_id, screenplay_id, rating
                const { user_id, screenplay_id, is_wished, is_bought } = req.body
                const wishlist = await createWishlist(user_id, screenplay_id, is_wished, is_bought)

                return res.status(200).json({ message: 'Wishlist Created/Updated Successfully', data: wishlist });
            }

            case 'PUT': {
                
                // Create a new reader //reader_id, screenplay_id, rating
                const { user_id, screenplay_id, is_wished } = req.body
                const wishlist = await updateWishlist(user_id, screenplay_id, is_wished)

                return res.status(200).json({ message: 'Wishlist Updated Successfully', data: wishlist });
            }

            case 'DELETE': {
                // Delete an existing user screenplay
                const rating = await deleteUserWishlist(req.query.spId, req.query.userId)
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