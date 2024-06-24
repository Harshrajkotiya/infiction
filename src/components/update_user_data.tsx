import { Auth } from 'aws-amplify';
import { updateUserDataImg } from '../components/upload_profile_img'
import router from 'next/router';

// Update the user data on form submission
export const updateUserData = async (formData) => {
  if (formData.picture){
    
    updateUserDataImg(formData.picture, formData.picture_prefix)  
  }
  try {
    // Get the currently authenticated user
    const user = await Auth.currentAuthenticatedUser();

    // Update the user attributes
    const updatedAttributes = {};

    if(formData.picture){
      updatedAttributes.picture = formData.picture.name;
    }
    
    if(formData.username){
      updatedAttributes['custom:inf_username'] = formData.username;
    }
    if(formData.email){
      updatedAttributes.email = formData.email;
    }
    if(formData.phone_number){
      updatedAttributes.phone_number = formData.phone_number;
    }
    if(formData.user_bio){
      updatedAttributes['custom:user_desc'] = formData.user_bio;
    }
    if(formData.name){
      updatedAttributes.name = formData.name;
    }
    if(formData.dob){
      updatedAttributes.birthdate = formData.dob;
    }
    if(formData.education){
      updatedAttributes["custom:qualification"] = formData.education;
    }
    if(formData.website){
      updatedAttributes["custom:website"] = formData.website;
    }
    await Auth.updateUserAttributes(user, updatedAttributes);

    // Return success message
    console.log('User data updated successfully' );
    router.push(`../dashboard`);
    
    return { success: true, message: 'User data updated successfully' };
  } catch (error) {
    // Return error message
    return { success: false, message: error.message };
  }
  
};
