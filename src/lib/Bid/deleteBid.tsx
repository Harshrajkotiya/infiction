export const deleteWishlist = async (formData) => {
    try {
      const responseBid = await fetch(`/api/wishlist?screenplay_id=${formData.screenplay_id}&bider_id=${formData.bider_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dataWishlist = await responseBid.json();
      const codeWishlist = await responseBid.status;
      // console.log("Delete Wishlist with Code:", {
      //   [codeWishlist]: dataWishlist,
      // });
      return dataWishlist;
    } catch (error) {
      // Code to handle error
      console.error("Unable to Delete Bid:", error);
    } 
  };
  