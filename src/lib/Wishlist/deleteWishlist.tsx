export const deleteWishlist = async (formData) => {
    try {
      const responseWishlist = await fetch(`/api/wishlist?spId=${formData.screenplay_id}&userId=${formData.user_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dataWishlist = await responseWishlist.json();
      const codeWishlist = await responseWishlist.status;
      // console.log("Delete Wishlist with Code:", {
      //   [codeWishlist]: dataWishlist,
      // });
      return dataWishlist;
    } catch (error) {
      // Code to handle error
      console.error("Unable to Delete Wishlist:", error);
    } 
  };
  