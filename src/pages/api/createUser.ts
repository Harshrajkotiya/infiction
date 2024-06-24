import AWS from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({...config,ssr:true});


AWS.config.update({ region: 'ap-south-1', 'accessKeyId': process.env.AMP_ACCESS_KEY_ID, 'secretAccessKey': process.env.AMP_SECRET_ACCESS_KEY });


const createUSer = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const userData = req.body;
        const cognito = new AWS.CognitoIdentityServiceProvider();

        const params = {
            UserPoolId: process.env.AMP_USER_POOL_ID,
            Username: `${userData.email}`,
            DesiredDeliveryMediums: ['EMAIL'],
            TemporaryPassword: `${userData.password}`,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: `${userData.email}`
                },
                {
                    Name: 'custom:role',
                    Value: `${userData.reader_type}`
                }
            ],
            // MessageAction: 'SUPPRESS'
        };

        await cognito.adminCreateUser(params, function (err, data) {
            if (err) {
                return res.status(400).json({statusCode:400, message: err });

            } else {
                return res.status(200).json({statusCode:200, message: data });
            }
        })

    } catch (e) {
        return res.status(400).json({ statusCode:400, message: e });
    }
};

export default createUSer;