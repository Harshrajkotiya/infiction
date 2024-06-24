import { useEffect, useState } from "react";
import { Accordion, Button, Modal } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

export default function FeedbackPopup({ type, screenplay_id, rating, feedback }) {
  const [show, setShow] = useState(false);
  const [ratingFeedback, setRatingFeedback] = useState([]);

  const handleClose = () => setShow(false);
  async function fetchRatingData() {
    const response = await fetch(
      `/api/infiction_rating?id=${screenplay_id}`
    );
    const ratingData = await response.json();
    console.log("ratingData", ratingData);

    setRatingFeedback(ratingData?.data?.rows)
  }

  const handleShow = () => {
    fetchRatingData()
    setShow(true)
  };

  return (
    <>
      <span
        className="badge rounded-pill text-light px-3 py-2 rating_bg ms-2"
        onClick={handleShow}
        style={{
          backgroundColor: "#424242",
          width: "140px",
          color: "white !important",
          cursor: "pointer"
        }}
      >
        <img src="/../table_star.svg" alt="table_star" /> {rating}
      </span>
      {rating != "Apply" && (
        <Modal
          className={`feedbackModal`}
          show={show}
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <strong className="me-auto text-white">
                <FaStar color="#F3AE09" /> {rating}
              </strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            {type === "infiction" ? (
              <Accordion className="bg-dark">
                <Accordion.Item eventKey="0" className="bg-dark text-white">
                  <Accordion.Header className="bg-dark ">
                    <strong className="me-auto">
                      <FaStar color="#F3AE09" /> {ratingFeedback && ratingFeedback[0]?.rating === "-1.00" ? "pending" : ratingFeedback[0]?.rating }
                    </strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    {ratingFeedback && < p
                      dangerouslySetInnerHTML={{ __html: ratingFeedback[0]?.feedback ? ratingFeedback[0]?.feedback : "No Feedback" }}
                      className="contetntext"
                    />}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" className="bg-dark text-white">
                  <Accordion.Header className=""><strong className="me-auto text-dark">
                    <FaStar color="#F3AE09" /> {ratingFeedback && ratingFeedback[1]?.rating === "-1.00" ? "pending" : ratingFeedback[1]?.rating}
                  </strong></Accordion.Header>
                  <Accordion.Body>
                    {ratingFeedback && < p
                      dangerouslySetInnerHTML={{ __html: ratingFeedback[1]?.feedback ? ratingFeedback[1]?.feedback : "No Feedback"  }}
                      className="contetntext"
                    />}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ) : (
              <>
              <div className="text-white">
                {
                  feedback ? <p
                    dangerouslySetInnerHTML={{ __html: feedback }
                    }
                    className="contetntext"
                  /> : "No Feedback"}
              </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
