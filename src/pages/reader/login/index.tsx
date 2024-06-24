import Header from "@/components/header";
import LoginSignup from "@/pages/login_signup";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";



export default function ReaderLogin() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    setShowModal(router.query["open"] === 'true');
  },[router.query["open"]]);


  return (
    <>
      <Header imgSrc="/email_logo.png" />
      <Modal
        centered
        className="modal-xl modal-dialog-centered"
        show={showModal}
        backdrop="static"
        onHide={() => {
          setShowModal(false);
        }}
      >
        {/* <Modal.Header closeButton/> */}
        <LoginSignup userRole={"reader"} />
      </Modal>
    </>
  );
}
