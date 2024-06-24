import { useState } from "react";

export default function FeedBackRating(props) {
  // console.log("props", props);
  
  const [ratingInput, setRatingInput] = useState();
  const [FeedbackInput, setFeedbackInput] = useState();
  const [isRatingValid, setIsRatingValid] = useState(false);

  const rate_limit = props.type === 'infiction_reader' ? 5 : 10;
  function handleRatingInput(e) {
  // console.log(props.type, rate_limit);
  
    if (e.target.value > rate_limit) {
      setIsRatingValid(true);
    } else {
      setIsRatingValid(false);
      setRatingInput(e.target.value);
    }
    //console.log("Rating update:", e.target.value);
  }

  function handleFeedbackInput(e) {
    e.preventDefault();
    setFeedbackInput(e.target.value.replace(/\n/g, "<br/>"));
  }

  async function handleRatingSubmit(e) {
    e.preventDefault();
    if (!isRatingValid) {
      // console.log("Results:-", props.showReview);
      const ratingData = {
        reader_id: props.showReview?.reader_id,
        screenplay_id: props.showReview?.id,
        rating: ratingInput ? ratingInput : props.showReview?.rating,
        feedback: FeedbackInput ? FeedbackInput : props.showReview?.feedback,
        status: props.showReview?.status
      }
      const response = await fetch(
        `/api/${props.type === 'infiction_reader' ? "infiction_rating" : "industries_rating"}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ratingData)
        }
      );
      const ratingUpdate = await response.json();
      // console.log("rating up------------:", ratingUpdate.message);
      handleModalClose(); // dismiss modal
      updateTable();
    }
  }

  function handleModalClose() {
    props.onClose();
  }

  function updateTable() {
    props.refreshTable();
  }

  return (
    <>
      <style jsx>{`
        .main_div {
          background-color: #424242;
          padding: 20px;
          border-radius: 10px;
          font-family: courier;
        }
        .error {
          color: red !important;
        }

        .btn_hover {
          border: 1px solid white;
          color: white;
        }

        .btn_hover:hover {
          color: #f3ae09 !important;
          border: 1px solid #f3ae09 !important;
          background-color: transparent !important;
        }
        input,
        textarea {
          background: black;
          border-color: black;
          color: white;
        }

        input{
          background: black;
          border-color: black;
          padding: 12px 10px 12px 10px;
        }

        input:focus,
        textarea:focus {
          background-color: #000000;
          color: white;
        }

        ::placeholder {
          color: #b8b8b8;
          opacity: 1;
        }

        :-ms-input-placeholder {
          color: #b8b8b8;
        }

        ::-ms-input-placeholder {
          color: #b8b8b8;
        }
      `}</style>
      <div className="main_div">
        <h3 className="text-white text-center fw-bold">Rate Screenplay </h3>
        <form>
          <div className="form-group">
            <label className="ms-0 fs-6" htmlFor="formRating">
              Rating
            </label>
            <input
              type="text"
              onChange={handleRatingInput}
              defaultValue={props.showReview?.rating ? props.showReview?.rating : 0}
              name="rating"
              className="form-control"
              id="formRating"
              placeholder="Enter Rating"
            />
            {isRatingValid && (
              <p className="error">You cannot set a rating higher than {rate_limit}.</p>
            )}
          </div>
          <div className="form-group mt-3">
            <label className="ms-0 fs-6" htmlFor="formFeedback">
              Feedback{" "}
            </label>
            
            <textarea
              className="form-control"
              onChange={handleFeedbackInput}
              defaultValue={props.showReview?.feedback?.replace(/<br\/>/g, "\n")}
              name="feedback"
              id="formFeedback"
              placeholder="Enter Feedback"
              style={{ whiteSpace: "pre-wrap"}}
            />
          </div>
          <div className="mt-5 d-flex justify-content-between" style={{ textAlign: "right" }}>
            <button
              type="button"
              onClick={() => handleModalClose()} //dismiss modal
              className={`btn-lg btn btn-outline-secondary mx-2 btn_hover }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleRatingSubmit}
              className={`btn-lg btn btn-outline-secondary  btn_hover }`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
