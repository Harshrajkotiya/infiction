// all user
export const getUserScreenplays = async (userId) => {
  const response = await fetch(`/api/screenplay?user_id=${userId}`);
  const data = await response.json();

  const newDataWithRating = data?.rows?.map((inr) => {
    if (inr.infiction_rating && !inr.industry_rating) {
      inr.industry_rating = "Apply";
    }

    return inr;
  });

  return newDataWithRating;
}

export const getScreenplay = async (id) => {
  const response = await fetch(`/api/screenplay?id=${id}`);
  const data = await response.json();

  return data;
}

export const getTopRatedScreenplay = async (id) => {
  const response = await fetch(`/api/screenplay?user_id=${id}&topRated=true`);
  const data = await response.json();

  return data;
}

export const getDetailedScreenplay = async () => {
  const response = await fetch(`/api/screenplay?detailed=true`);
  const data = await response.json();

  return data;
}

export const getMemberScreenplay = async (id) => {
  const response = await fetch(`/api/screenplay?user_id=${id}&isMember=true`);
  const data = await response.json();

  return data;
}