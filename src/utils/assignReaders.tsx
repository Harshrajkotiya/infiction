export const AssignReaders = async (SPData) => {
  //update infiction_rating table assign reader to screenplay
  //reader_id, screenplay_id, rating
  const readerData = {
    // reader_id: parseInt(item),
    screenplay_id: SPData.id,
    rating: "-1",
    status: "Active",
  };

  try {
    const response = await fetch("/api/infiction_rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(readerData),
    });
    const inficRatingRes = await response.json();
    // return inficRatingRes;
    console.log("api response of inficRating: -", inficRatingRes);
  } catch (error) {
    console.error("get reader error:", error);
  }
};
