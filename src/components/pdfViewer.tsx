import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import { FaSearchPlus, FaSearchMinus  }  from "react-icons/fa";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer(props) {  
  // console.log("props", props);
  
  // Set the initial state of the number of pages to null
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [scale, setScale] = useState(1);

  // Define a function to handle the loading of the PDF file
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function goToPrevPage() {
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
  }

  function goToNextPage() {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  }

  // Define a function to handle the button click event
  function handleButtonClick() {
    setModalOpen(true);
  }
  const handleZoomIn = () => {
    setScale(scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(scale - 0.1);
  };

  function handleKeyPress(event) {
    event.preventDefault();
  }

  return (
    <>
      <style jsx>{`
        .PDFViewerClose {
          background-color: white;
          width: 100%;
        }
        .PDFcontrols {
          color: black;

          width: 100%;
          display: flex;
          justify-content: space-between;
          background-color: white;
        }
        .PDFcontrols button {
          // background-color: yellow;
        }
      `}</style>
      <div>
        {!props.isTitle && <button onClick={handleButtonClick}>{props.name}</button>}
       
        
        <Modal
          centered
          className={`PDFModal modal-xl`}
          show={props.isTitle ? props.OpenPDF : modalOpen}
          onHide={() => {props.isTitle ? props.PDFClose() : setModalOpen(false)}}
          style={{ backgroundColor: "transparent" }}
        >
          <Modal.Header closeButton></Modal.Header>
          
            <>
              <Document
                file={props.SP}
                onLoadSuccess={onDocumentLoadSuccess}
                onContextMenu={(e) => e.preventDefault()}
                
              >
                <Page pageNumber={pageNumber} renderMode="canvas" scale={scale} />
                <hr className="m-0" />
                <p className="PDFcontrols">
                  <button
                    className="btn btn-outline-secondary m-2"
                    disabled={pageNumber <= 1}
                    onClick={goToPrevPage}
                  >
                    Previous
                  </button>
                  <button className="btn btn-outline-secondary my-2" onClick={handleZoomIn}><FaSearchPlus /></button>
                  <span className="mt-2">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button className="btn btn-outline-secondary my-2" onClick={handleZoomOut}><FaSearchMinus/></button>
                  <button
                    className="btn btn-outline-secondary m-2"
                    disabled={pageNumber >= numPages}
                    onClick={goToNextPage}
                  >
                    Next
                  </button>
                </p>
              </Document>
            </>
        </Modal>
      </div>
    </>
  );
}
