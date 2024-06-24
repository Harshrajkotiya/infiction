export const getAccessedSP = async (user_id) => {
    const response = await fetch(`/api/accessedSP/?user_id=${user_id}`);
    const accessedSP = await response.json();
  
    return accessedSP;
  }