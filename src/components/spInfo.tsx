import { useState } from "react";
import PDFViewer from "./pdfViewer";
import { GetUserImg } from "./get_profile_img";
import { Button } from "react-bootstrap";

export default function SPInfo(props) {
  const [SPurl, setSPurl] = useState("");
  const [SPname, setSPname] = useState("");
  const [OpenPDF, setOpenPDF] = useState(false);
  const [isClickOnName, setisClickOnName] = useState(false);

  function openPDF(row) {
    // console.log("row", row);

    setSPname(row?.screenplay_url);
    setOpenPDF(true);
    GetUserImg(row?.screenplay_url)
      .then((screenplay_url) => {
        setSPurl(screenplay_url);
      })
      .catch((err) => console.log(err));
    setisClickOnName(true);
  }

  function handlePDFClose() {
    setOpenPDF(false);
  }

  function handleModalClose() {
    props.onClose();
  }

  function splitOptions(cell) {
    return cell.split(",").slice(0, 2);
  }
  const TagButtonStyle = {
    borderRadius: '40px',
    textTransform: 'uppercase',
    fontSize: '12px',
  };

  return (
    <>
      <style jsx>{`
        .main_div {
          background-color: rgba(56, 56, 56, 56);
          padding: 20px;
          border-radius: 10px;
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
      `}</style>
      <div className="main_div">
        <h3 className="text-white text-center">Screenplay</h3>
        <form>
          <div className="form-group">
            <label className="ms-0 mt-3" htmlFor="formRating">
              Logline
            </label>
            <input
              type="text"
              defaultValue={props.showReview?.logline}
              name="Logline"
              className="form-control"
              placeholder="Enter Logline"
              readOnly
            />
          </div>

          <div className="form-group">
            <label className="ms-0 mt-3" htmlFor="formRating">
              Synopsis
            </label>
            <input
              type="text"
              defaultValue={props.showReview?.synposis}
              name="synposis"
              className="form-control"
              placeholder="Enter synposis"
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="ms-0 mt-3" htmlFor="formRating">
              Genre
            </label><br />
            {splitOptions(props.showReview?.genre).map((option) => (
              <span key={option}>
                <Button variant="outline-warning genre_style" style={TagButtonStyle} size="sm">{option}</Button>{' '}
              </span>
            ))}
          </div>
          <div className="form-group">
            <label className="ms-0 mt-3" htmlFor="formRating">
              Tags
            </label><br />
            {splitOptions(props.showReview?.tags).map((option) => (
              <span key={option}>
                <Button variant="outline-warning genre_style" style={TagButtonStyle} size="sm">{option}</Button>{' '}
              </span>
            ))}
          </div>
          <div
            style={{ cursor: "pointer" }}
            className="text-nowrap ms-0 ps-0 mt-3 form-group"
          >
            <label className="ms-0 mt-3" htmlFor="formRating">
            Screenplay PDF
            </label><br />
            <span
              className="badge rounded-pill text-light py-3 rating_bg"
              style={{ backgroundColor: "#424242", width: "fit-content" }}
              onClick={() => {
                openPDF(props.showReview);
              }}
            >
              
              {props.showReview?.screenplay_url}
            </span>
          </div>
          <div className="mt-3" style={{ textAlign: "right" }}>
            <button
              type="button"
              onClick={() => handleModalClose()} //dismiss modal
              className={`btn-lg btn btn-outline-secondary mx-2 btn_hover }`}
            >
              Cancel
            </button>
          </div>
        </form>
        {isClickOnName && (
          <PDFViewer
            SP={SPurl}
            name={SPname}
            isTitle={true}
            OpenPDF={OpenPDF}
            PDFClose={handlePDFClose}
          />
        )}
      </div>
    </>
  );
}
