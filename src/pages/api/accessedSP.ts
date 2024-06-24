
import {
  createAccessedScreenplay, getAccessedScreenplay
} from '../../queries/accessed_screenplay';
import { Amplify } from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({ ...config, ssr: true });

export default async function handle(req, res) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.user_id) {
          const accessed_sp = await getAccessedScreenplay(req.query.user_id)
          return res.status(200).json({ id: req.query.id, data: accessed_sp });
        }
      }
      case 'POST': {
        const { screenplay_id, user_id } = req.body
        const created_accessed_sp = await createAccessedScreenplay(screenplay_id, user_id)

        return res.status(201).json({ message: 'Accessed Screenplay Created Successfully', data: created_accessed_sp });
      }
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    // console.log("user err:", res.method, res);
    return res.status(500).json({ ...error, message: error.message })
  }
}