const getUserBid = async () => {
    const response = await fetch(`/api/bid`);
    const data = await response.json();
  
    return data;
  }
  
  const getBidbyScreenplayID = async (screenplay_id) => {
    const response = await fetch(`/api/bid?screenplay_id=${screenplay_id}`);
    const Alldata = await response.json();
  
    return Alldata;
  }
  
  export { getUserBid, getBidbyScreenplayID }