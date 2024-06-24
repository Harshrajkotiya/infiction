export const addBidWithNotification = async (screenplay_id, user_id, bid_amount, biddedUsers, AddMutation, AddNotifictionMutation) => {
  // console.log("biddedUsers",biddedUsers);
    
  const bidData = {
    screenplay_id: screenplay_id,
    bider_id: user_id,
    bid_amount: bid_amount,
    status: "pending",
  };
  AddMutation.mutate(bidData);

  biddedUsers && biddedUsers.map((bid, index) => {
    if (index === 0) {
    console.log("in.......");
        
      const notificationData = {
        user_id: bid.owner_id,
        message: "New bid added",
      };
      AddNotifictionMutation.mutate(notificationData);
    }
    const notificationData = {
      user_id: bid.bider_id,
      message: "New bid added",
    };
    AddNotifictionMutation.mutate(notificationData);
  });

  return true;
}
