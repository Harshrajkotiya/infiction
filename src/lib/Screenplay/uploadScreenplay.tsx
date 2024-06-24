import { updateUserDataImg } from "@/components/upload_profile_img";

export const uploadScreenplay = async (formData) => {
  // if (formData.screenplay_url) {
  //   updateUserDataImg(formData.screenplay_url, formData.screenplay_prefix);
  // }

  try {
    formData.screenplay_url =
      formData.screenplay_prefix + "_" + formData.screenplay_url.name;
    delete formData.screenplay_prefix;

    const formDataString = JSON.stringify(formData);
    const response = await fetch("/api/screenplay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formDataString,
    });

    // Code to handle successful post creation
    const data = await response.json();
    const code = await response.status;

    // console.log("Success with Code:", { [code]: data });
    return data;
  } catch (error) {
    console.error("Unable to Upload Screenplay:", error);
    return error;
  }
};  
