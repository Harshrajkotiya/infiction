const getUserTransactions = async (userId) => {
  const response = await fetch(`/api/transaction?user_id=${userId}&sum=false`);
  const data = await response.json();

  return data;
}

const getTransactionDetails = async (userId) => {
  const response = await fetch(`/api/transaction?user_id=${userId}&sum=true`);
  const Alldata = await response.json();

  return Alldata;
}

export { getUserTransactions, getTransactionDetails }