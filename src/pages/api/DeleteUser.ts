import AWS from "aws-sdk";
import { Amplify } from 'aws-amplify';
import config from "src/aws-exports";
import { NextApiRequest, NextApiResponse } from "next";

Amplify.configure({ ...config, ssr: true });

AWS.config.update({ region: 'ap-south-1', 'accessKeyId': process.env.AMP_ACCESS_KEY_ID, 'secretAccessKey': process.env.AMP_SECRET_ACCESS_KEY });


const deleteUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  // console.log("req.query", req.query);
  
  try {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const params = {
      UserPoolId: process.env.AMP_USER_POOL_ID,
      Username: userId,
    };
    await cognito.adminDeleteUser(params, function (err, data) {
      if (err) {
          console.log("err", err);
          return res.status(400).json({ message: err });

      } else {
          // console.log("data", data);
          console.log('User deleted successfully');
          return res.status(200).json({ message: data });
      }
  })
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export default deleteUsers;