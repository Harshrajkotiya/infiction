import Preview from "@/components/spPreview";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Amplify, Storage } from 'aws-amplify';


export default function SubscriptionStatus() {
  // console.log("typof window", typeof window);
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(router.query["open"] === 'true');
  }, [router.query["open"]]);

  const [SPFormData, setSPFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const storedFormData = localStorage.getItem("SPFormData");
      return storedFormData !== null ? storedFormData : {};
    } else {
      return {};
    }
  });

  const [curSPData, setcurSPData] = useState(() => {
    if (typeof window !== "undefined") {
      const storedSPData = localStorage.getItem("curSPData");
      return storedSPData !== null ? storedSPData : {};
    } else {
      return {};
    }
  });

  const paymentType = typeof window !== "undefined" && localStorage.getItem("paymentType");
  const BidAmount = typeof window !== "undefined" && localStorage.getItem("BidAmount");


  async function deletePDF() {
    await Storage.remove(SPFormData && JSON.parse(SPFormData).screenplay_prefix + '_' + JSON.parse(SPFormData).screenplay_url.name, { level: "public" })
  }

  if (router.query["status"] === "cancel") {
    deletePDF();
  }

  return (
    <div>

      <Modal
        backdrop="static"
        centered
        className="modal-xl admin_login modal-dialog-centered"
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        {router.query["status"] === "success" ? (
          <h2>
            <Preview
              user_id={router.query["user_id"]}
              formData={SPFormData}
              paymentType={paymentType}
              curUser={curSPData}
              status={router.query["status"]}
              BidAmount={BidAmount}
            />
          </h2>
        ) : (
          <Preview
            user_id={router.query["user_id"]}
            status={router.query["status"]}
          />
        )}

      </Modal>
    </div>

  );
}
