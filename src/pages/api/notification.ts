import {
    createNotification,
    deleteUserNotification,
    getAllNotification, getNotificationById,
} from '../../queries/notification'
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({...config,ssr:true});

export default async function handle(req, res) {
    try {
        switch (req.method) {
            case 'GET': {
                if (req.query.user_id) {
                    const wishlist = await getNotificationById((req.query.user_id))

                    return res.status(200).json({ id: req.query.id, data: wishlist });
                } else {
                    // Otherwise, fetch all notification
                    const notification = await getAllNotification()
                    return res.json(notification)
                }
            }

            case 'POST': {
                // Create a new notification
                const { user_id, message } = req.body
                const notification = await createNotification(user_id, message)

                return res.status(200).json({ message: 'Notification Created Successfully', data: notification });
            }

            case 'DELETE': {
                // Delete an existing user notification
                const rating = await deleteUserNotification(req.query.user_id)
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