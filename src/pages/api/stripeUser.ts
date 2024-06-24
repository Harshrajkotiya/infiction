import {
    createUser,
    getUser,
    getAllUser,
    deleteUser,
    updateUser,
  } from '../../queries/users';
  import {Amplify} from 'aws-amplify';
  import config from "src/aws-exports"
  
  Amplify.configure({...config,ssr:true});
  
  export default async function handle(req, res) {
    try {
      switch (req.method) {
        case 'GET': {
          if (req.query.user_id) {
            // Get a single user if id is provided is the query
            // api/screenplay?user_id=1
            const users = await getUser(req.query.user_id)
  
            return res.status(200).json(users)
          } 
          else {
            // Otherwise, fetch all users
            const users = await getAllUser()
  
            return res.json(users)
          }
        }
  
        case 'POST': {
          // Create a new user
          const { stripeId, email, user_id} = req.body
          const created_user = await createUser(stripeId, email, user_id)
  
          return res.status(201).json({ message: 'User Created Successfully', data: created_user });
        }
  
        case 'PUT': {
          // Update an existing user screenplay
          const { id, ...updateData } = req.body
          const user = await updateUser(id, updateData)
          return res.json(user)
        }
  
        case 'DELETE': {
          // Delete an existing user screenplay
          const user = await deleteUser(req.query.id)
          return res.json(user)
        }
        default:
          res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
          return res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    } catch (error) {
      return res.status(500).json({ ...error, message: error.message })
    }
  }