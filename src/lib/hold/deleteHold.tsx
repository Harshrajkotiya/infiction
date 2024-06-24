const deleteHold = async (formData) => {
    try {
      const responseBid = await fetch(`/api/hold?screenplay_id=${formData.screenplay_id}&user_id=${formData.user_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dataHold = await responseBid.json();
      const codeHold = await responseBid.status;
      // console.log("Delete Wishlist with Code:", {
      //   [codeWishlist]: dataWishlist,
      // });
      return codeHold;
    } catch (error) {
      // Code to handle error
      console.error("Unable to Delete Hold:", error);
    } 
  };

  const deleteExpiredHold = async (formData) => {
    try {
      const responseBid = await fetch(`/api/hold`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dataHold = await responseBid.json();
      const codeHold = await responseBid.status;
      // console.log("Delete Wishlist with Code:", {
      //   [codeWishlist]: dataWishlist,
      // });
      return codeHold;
    } catch (error) {
      // Code to handle error
      console.error("Unable to Delete Expired Hold:", error);
    } 
  };
  
export {deleteHold, deleteExpiredHold}