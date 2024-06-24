import { Storage } from "aws-amplify";

export const GetUserImg = async (fileName) => {
    try{
        if(fileName){
            // console.log("Getting file ---------------...",`${fileName}`);
            Storage.configure({ level: 'public' });
            const result = await Storage.get(`${fileName}`);
            // console.log("result", result);
            
            return result;
        }else{
            return '';
        }
    }catch (error) {
        console.log("Error getting uploaded file: ", error);
      }
  }