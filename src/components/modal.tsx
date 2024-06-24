import { Modal } from "react-bootstrap";

export default function Modal1(props) {

  return (
    <>
      <Modal

        centered
        className={`myModal modal-xl`}
        show={props.showModal}
        onHide={() => props.onClose()}
        backdrop="static"
        keyboard={false}
        style={{ backgroundColor: "transparent" }}
      >
        {props.component}
      </Modal>
    </>
  );
}
