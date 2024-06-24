export const updateWishlist = async (formData) => {
    try {
        const formDataString = JSON.stringify({
            user_id: formData.user_id,
            screenplay_id: formData.screenplay_id, 
            ...formData,
          })  
      const response = await fetch("/api/wishlist", {
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
      console.error("Unable to update Wishlist:", error);
      return error;
    }
  };  
  