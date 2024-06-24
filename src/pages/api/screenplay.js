import {
  createScreenplay,
  getUserScreenplay,
  getAllScreenplay,
  deleteUserScreenplay,
  updateScreenplay,
  getScreenplay,
  getTopRatedScreenplay,
  getDetailedScreenplay,
  getMemberScreenplay
} from '../../queries/screenplay'
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({...config,ssr:true});

export default async function handle(req, res) {
  try {
    switch (req.method) {
      case 'GET': {
        if(req.query.detailed){
          const screenplay = await getDetailedScreenplay()

          return res.status(200).json(screenplay)
        }
        else if(req.query.isMember && req.query.user_id){
          const screenplay = await getMemberScreenplay(req.query.user_id)

          return res.status(200).json(screenplay)
        }
        else if(req.query.topRated && req.query.user_id){
          const screenplay = await getTopRatedScreenplay(req.query.user_id)

          return res.status(200).json(screenplay)
        }
        else if (req.query.user_id) {
          // Get a single user if id is provided is the query
          // api/screenplay?user_id=1
          const screenplays = await getUserScreenplay(req.query.user_id)

          return res.status(200).json(screenplays)
        } else if(req.query.id){
          const screenplay = await getScreenplay(req.query.id)

          return res.status(200).json(screenplay)
        } 
        else {
          // Otherwise, fetch all users
          const screenplays = await getAllScreenplay()

          return res.json(screenplays)
        }
      }

      case 'POST': {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        // Create a new user
        const { user_id, title, genre, tags, logline, synposis, screenplay_url, ihf} = req.body
        const created_screenplay = await createScreenplay(user_id, title, genre, tags, logline, synposis, screenplay_url, ihf)

        return res.status(201).json({ message: 'Screenplay Created Successfully', data: created_screenplay });
      }

      case 'PUT': {
        // Update an existing user screenplay
        const { id, ...updateData } = req.body
        const screenplay = await updateScreenplay(id, updateData)
        return res.json(screenplay)
      }

      case 'DELETE': {
        // Delete an existing user screenplay
        const screenplay = await deleteUserScreenplay(req.query.id)
        return res.json(screenplay)
      }
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message })
  }
}