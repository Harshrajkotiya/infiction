export const createNotification = async (formData) => {
  try {

    const formDataString = JSON.stringify(formData);
    const response = await fetch("/api/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formDataString,
    });

    // Code to handle successful post creation
    const data = await response.json();
    const code = await response.status;

    console.log("Success with Code:", { [code]: data });
    return data;
  } catch (error) {
    console.error("Unable to Create Notification:", error);
    return error;
  }
};  

