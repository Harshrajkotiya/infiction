export const AssignIndustriesReaders = async (sp_id) => {
  const readerData = {
    // reader_id: parseInt(item),
    screenplay_id: sp_id,
    rating: "-1",
    is_applied: true,
    status:"Active"
  };
  try {
    const response = await fetch("/api/industries_rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(readerData),
    });
    const inficRatingRes = await response.json();
    // console.log("api response industries: ", inficRatingRes);
    return inficRatingRes;

  } catch (error) {
    console.error("get reader error:", error);
  }
  
};
