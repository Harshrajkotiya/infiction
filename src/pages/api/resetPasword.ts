import AWS from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({...config,ssr:true});


AWS.config.update({ region: 'ap-south-1', 'accessKeyId': process.env.AMP_ACCESS_KEY_ID, 'secretAccessKey': process.env.AMP_SECRET_ACCESS_KEY });


const resetPassword = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const cognito = new AWS.CognitoIdentityServiceProvider();
        const params = {
            UserPoolId: process.env.AMP_USER_POOL_ID,
            Password: req.body.password,
            Permanent: true,
            Username: req.body.email,
          };
        

          await cognito.adminSetUserPassword(params, function (err, data) {
            if (err) {
                res.status(400).json({ message: err });

            } else {
                res.status(200).json({ message: `User ${req.body.email} password has been set.`, statusCode: 200 });
            }    
        })

    } catch (e) {
        res.status(400).json({ message: e });
    }
};

export default resetPassword;