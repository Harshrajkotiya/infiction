export const updateHold = async (formData) => {
    try {
        const formDataString = JSON.stringify(formData)  
      const response = await fetch("/api/hold", {
        method: "PUT",
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
      console.error("Unable to update Hold:", error);
      return error;
    }
  };  
  