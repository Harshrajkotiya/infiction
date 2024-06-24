const getNotification = async () => {
    const response = await fetch(`/api/notification`);
    const data = await response.json();
    return data;
  }
  
  const getNotificationDetails = async (user_id) => {
    const response = await fetch(`/api/notification?user_id=${user_id}`);
    const Alldata = await response.json();
  
    return Alldata;
  }
  
  export { getNotification, getNotificationDetails }