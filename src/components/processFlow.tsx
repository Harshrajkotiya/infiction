import React, { useEffect, useState } from "react";
import SPupload from "./spUpload";
import SPPayment from "./spPayment";
import SPpreview from "./spPreview";
import Policy from "./policy";

export default function SPProfile(props) {

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    user_id: "",
    title: "",
    genre: "",
    tags: "",
    logline: "",
    synposis: "",
    // profile_url: "",
    screenplay_url: "",
    ihf: "No",
    // profile_prefix: "",
    screenplay_prefix: "",
  });


  function handleModalClose() {
    props.onClose();
  }

  const setData = (data) => {
    const fileObject = {
      lastModified:  data.screenplay_url.lastModified,
      lastModifiedDate: data.screenplay_url.lastModifiedDate,
      name:  data.screenplay_url.name,
      size:  data.screenplay_url.size,
      type:  data.screenplay_url.type
    };
    setFormData(data);
    data.screenplay_url = fileObject;
    // console.log("data process", typeof data.screenplay_url);
    // typeof window !== 'undefined' && localStorage.setItem('SPFormData', JSON.stringify({})); 
    typeof window !== 'undefined' && localStorage.setItem('SPFormData', JSON.stringify(data)); 
  };

  // Proceed to next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Go back to prev step
  const prevStep = () => {
    setStep(step - 1);
  };

  if (props.steplen === 1) {
    switch (step) {
      case 1:
        return (
          <SPupload
            id={props.id}
            nextStep={nextStep}
            prevStep={prevStep}
            handleData={setData}
            steplen={props.steplen}
            onCancel={handleModalClose}
            user_id={props.user_id}
          />
        );
      default:
        return null;
    }
  } else {
    switch (step) {
      case 1:
        return (
          <>
          <style jsx>
            {`
            @media only screen and (max-width: 426px) {
              .policy_responsive {
               padding-left: 0px;
            }
            }
            `}
          </style>
        <Policy  className="policy_responsive" nextStep={nextStep} onCancel={handleModalClose} />
        </>
        );
      // case 2:
      //   return <Policy_terms nextStep={nextStep} prevStep={prevStep} />;
      case 2:
        return (
          <SPupload
            id={props.id}
            nextStep={nextStep}
            prevStep={prevStep}
            handleData={setData}
            steplen={props.steplen}
            onCancel={handleModalClose}
            user_id={props.user_id}
          />
        );
      case 3:
        return <SPPayment onCancel={handleModalClose} prevStep={prevStep} user_id={formData.user_id} formData={formData}/>;
      case 4:
        return (
          <SPpreview
            prevStep={prevStep}
            formData={formData}
            onCancel={handleModalClose}
            setUserScreenplay={props.setUserScreenplay}
          />
        );
      default:
        return null;
    }
  }
}
