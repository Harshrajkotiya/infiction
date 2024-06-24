import { Amplify, Storage } from 'aws-amplify';

export const updateUserDataImg = async (file, file_prefix) => {
    try {
        await Storage.put(`${file_prefix}_${file.name}`, file, {
          //contentType: file[0].type,
          contentType: file.type,
          level: 'public',
          progressCallback: (progress) => {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          }
  
        });
      } catch (error) {
        console.log("Error uploading file: ", error);
      }

    
}

