import { updateUserDataImg } from "@/components/upload_profile_img";

export const handleupdateScreenplay = async (id, formData, onCancel = () => {}) => {
  // console.log("formData update upload.......", formData);

  // if (formData.profile_url) {
  //   updateUserDataImg(formData.profile_url, formData.profile_prefix);
  // }
  if (formData.screenplay_url) {
    updateUserDataImg(formData.screenplay_url, formData.screenplay_prefix);
  }
  try {
  //   // no need to update if profile_url not updated
  //   formData.profile_url =
  //     formData.profile_url.name === undefined
  //       ? ""
  //       : formData.profile_prefix + "_" + formData.profile_url.name;

  //   delete formData.profile_prefix;

    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => value !== null && value !== ""
      )
    );
    
    const formDataString = JSON.stringify({
      id: parseInt(id),
      ...filteredFormData,
    });

    // console.log("filtered formData upload.......", filteredFormData);
    const response = await fetch("/api/screenplay", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: formDataString,
    });

    // Code to handle successful screenplay updation
    const data = await response.json();
    const code = await response.status;

    // console.log("Update with Code:", { [code]: data });
    onCancel()
  } catch (error) {
    // Code to handle error
    console.error("Unable to Update Screenplay:", error);
  }
};
