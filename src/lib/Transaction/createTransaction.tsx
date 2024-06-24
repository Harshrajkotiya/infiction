export const createTransaction = async (formData) => {
  try {
    let url = "";
    const formDataString = JSON.stringify(formData);
    
    if (process.env.CLIENT_URL) {
      url = `${process.env.CLIENT_URL}/api/transaction`
    } else {
      url = `/api/transaction`
    }
    const response = await fetch(url, {
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
    console.error("Unable to Create Transaction:", error);
    return error;
  }
};
