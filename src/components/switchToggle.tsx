import { Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Alert } from "@material-ui/lab";


const PricingToggle = (props) => {
  console.log("Row", props.row);

  const [selectedOption, setSelectedOption] = useState("list");
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    if (props.isListed === true) {
      setSelectedOption("list")
    } else {
      setSelectedOption("delist")
    }
  })
  const handleOptionChange = (event) => {
    if (event.target.value === "list") {
      if (!props.row.reserved_price) {
        setCheckoutError("Please, enter Reserved price!");
      }
      else if (props.row.is_bought === true) {
        setCheckoutError("Already bought!");
      }
      else {
        setSelectedOption(event.target.value);
        props.toggleIsListed();
      }
    } else {
      setSelectedOption(event.target.value);
      props.toggleIsListed();
    }
  };

  return (
    <>
      <style jsx>{`
        .pricing-toggle {
          background-color: black;
          border-radius: 10px;
          display: inline-block;
          margin-left: 50px;
        }
        .pricing-toggle [name="pricing-${props.toggleKey}"] {
          display: none;
          border-color: transperant;
        }
        .pricing-toggle input[type="radio"] + label {
          background-color: #292929;
          color: white;
          padding: 5px 5px;
          // border-radius: 10px;
          cursor: pointer;
          user-select: none;
          margin-left: 0px;
          width: 55px;
        }
        .pricing-toggle input[type="radio"]:checked + label {
          background-color: #f3ae09;
          color: #00008b;
          border-radius: 10px;
        }
        input#pricing-toggle-list-${props.toggleKey} + label, input#pricing-toggle-list-${props.toggleKey}:checked + label {
          border-radius: 10px 0px 0px 10px;
          padding-left: 10px !important;
        }
        input#pricing-toggle-delist-${props.toggleKey} + label, input#pricing-toggle-delist-${props.toggleKey}:checked + label {
          border-radius: 0px 10px 10px 0px;
          padding-left: 4px !important;
        }
        input#pricing-toggle-list-${props.toggleKey}:disabled + label {
          opacity: 0.7 !important
        }
        input#pricing-toggle-delist-${props.toggleKey}:disabled + label {
          opacity: 0.7 !important
        }

      `}</style>
      {checkoutError && (
        <Snackbar
          open={checkoutError != null}
          autoHideDuration={6000}
          onClose={() => setCheckoutError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setCheckoutError(null)} severity="error">
            {checkoutError}
          </Alert>
        </Snackbar>
      )}
      <div className="pricing-toggle m-0">
        <input
          type="radio"
          id={`pricing-toggle-list-${props.toggleKey}`}
          name={`pricing-${props.toggleKey}`}
          value="list"
          checked={selectedOption === "list"}
          onChange={handleOptionChange}
          disabled={!props.israted && true}
        />
        <label
          className="radio-button"
          htmlFor={`pricing-toggle-list-${props.toggleKey}`}
        >
          List
        </label>

        <input
          type="radio"
          id={`pricing-toggle-delist-${props.toggleKey}`}
          name={`pricing-${props.toggleKey}`}
          value="delist"
          checked={selectedOption === "delist"}
          onChange={handleOptionChange}
          disabled={!props.israted && true}

        />
        <label
          className="radio-button"
          htmlFor={`pricing-toggle-delist-${props.toggleKey}`}
        >
          DeList
        </label>
      </div>
    </>
  );
};

export default PricingToggle;
