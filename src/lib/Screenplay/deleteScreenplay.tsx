export const deleteScreenplay = async (id: string) => {
  try {
    const responseScreenplay = await fetch(`/api/screenplay?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Code to handle successful screenplay deleteion
    const dataScreenplay = await responseScreenplay.json();
    const codeScreenplay = await responseScreenplay.status;
    // console.log("Delete Screenplay with Code:", {
      // [codeScreenplay]: dataScreenplay,
    // });
    return dataScreenplay;
  } catch (error) {
    // Code to handle error
    console.error("Unable to Delete Screenplay:", error);
  } 
};
