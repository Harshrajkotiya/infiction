import AWS from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { Amplify } from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({ ...config, ssr: true });


const listEditors = async (req: NextApiRequest, res: NextApiResponse) => {
    AWS.config.update({ region: 'ap-south-1', 'accessKeyId': process.env.AMP_ACCESS_KEY_ID, 'secretAccessKey': process.env.AMP_SECRET_ACCESS_KEY });
    try {
        const cognito = new AWS.CognitoIdentityServiceProvider();

        const params = {
            UserPoolId: process.env.AMP_USER_POOL_ID,
        };

        await cognito.listUsers(params, function (err, data) {
            if (err) {
                return res.status(400).json({ message: err });
            } else {
                return res.status(200).json({ message: data.Users });
            }
        })

    } catch (e) {
        return res.status(400).json({ message: e });
    }

};

export default listEditors;