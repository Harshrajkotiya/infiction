import {
  createReader,
  getReadrById,
  getRandomReadersByType,
  getAllReader,
  getReaderByType,
  getScreenplayByInfictionReaderId,
  getScreenplayByIndustriesReaderId,
  getReaderWithEmail,
  readerSubIdCognito,
  updateReaderSubId,
  deleteReader
} from "../../queries/reader";

import { Amplify } from "aws-amplify"
import config from "src/aws-exports";

Amplify.configure({ ...config, ssr: true })

export default async function handle(req, res) {
  try {
    switch (req.method) {
      case "GET": {
        if (req.query.id) {
          const readers = await getReadrById(parseInt(req.query.id));
          return res.status(200).json(readers);
        } else if (req.query.reader_type) {
          //let readers
          const readers = await getRandomReadersByType(req.query.reader_type);
          return res.json(readers);
        } else if (req.query.inf_reader_id) {
          //get sp by reader id for reader dashboard
          const getSPById = await getScreenplayByInfictionReaderId(req.query.inf_reader_id);
          return res.status(200).json(getSPById);
        } else if (req.query.ind_reader_id) {
          //get sp by reader id for reader dashboard
          const getSPById = await getScreenplayByIndustriesReaderId(req.query.ind_reader_id);
          return res.status(200).json(getSPById);
        } 
        else if (req.query.readerType) {
          const readerListByType = await getReaderByType(req.query.readerType);
          return res.status(200).json(readerListByType);
        } 
        // get reader by reader with email
        else if (req.query.getReaderWithEmail) {
          const readerListByType = await getReaderWithEmail(req.query.getReaderWithEmail);
          return res.status(200).json(readerListByType);
        }
        // get reader by reader with user_id where Cognito sub as user_id
        else if (req.query.readerSubIdCognito) {
          const readerListByType = await readerSubIdCognito(req.query.readerSubIdCognito);
          return res.status(200).json(readerListByType);
        }
        else {
          const all_readers = await getAllReader();
          return res.status(200).json(all_readers);
        }
      }

      case "POST": {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Create a new reader
        const { reader_name, reader_type, reader_email, user_id } = req.body;
        const reader = await createReader(reader_name, reader_type, reader_email, user_id);

        return res
          .status(200)
          .json({ message: "Reader Created Successfully", data: reader });
      }

      case 'PUT': {
        // Update an existing user screenplay
        const { subId, reader_email } = req.body
        const screenplay = await updateReaderSubId(subId, reader_email)
        return res.json(screenplay)
      }

      case 'DELETE': {
        // constuser_id = req.query.user_id
        console.log("user_id", req.query.userId);
        const reader = await deleteReader(req.query.userId)
        return res.json(reader)
      }
      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
