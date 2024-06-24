const getUserHold= async () => {
    const response = await fetch(`/api/hold`);
    const data = await response.json();
  
    return data;
  }
  
  const getHoldbyScreenplayID = async (screenplay_id) => {
    const response = await fetch(`/api/hold?screenplay_id=${screenplay_id}`);
    const Alldata = await response.json();
    // console.log("Alldata", Alldata);
    
    return Alldata;
  }
  
  export { getUserHold, getHoldbyScreenplayID }