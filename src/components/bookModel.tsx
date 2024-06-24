import { Modal } from "react-bootstrap";

export default function BookModal(props) {

  return (
    <>
      <Modal
        centered
        className={`myModal modal-xl`}
        show={props.showModal}
        onHide={() => props.onClose()}
        keyboard={false}
        style={{ backgroundColor: "transparent" }}
      >
        {props.component}
      </Modal>
    </>
  );
}
