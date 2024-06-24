export const deleteNotification = async (formData) => {
    try {
      const responseNotification = await fetch(`/api/notification?user_id=${formData.user_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dataNotification = await responseNotification.json();
      const codeNotification = await responseNotification.status;
      // console.log("Delete Wishlist with Code:", {
      //   [codeWishlist]: dataWishlist,
      // });
      return dataNotification;
    } catch (error) {
      // Code to handle error
      console.error("Unable to Delete Notification:", error);
    } 
  };
  