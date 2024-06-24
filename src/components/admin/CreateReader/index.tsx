import { Alert, Form, Toast } from "react-bootstrap";
import { FaAngleDown, FaEnvelopeOpen, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import styles from "../../../styles/admin.module.css";
import { useRouter } from "next/router";

interface IFormInput {
  email: string;
  password: string;
  reader_type: string;
}

export default function CreateReader() {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const [open, setOpen] = useState(false);
  const [signUpError, setSignUpError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedReader, setSelectedReader] = useState("industries_reader");

  const handleReaderChange = (event) => {
    setSelectedReader(event.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setSelectedReader(router.query["type"])
  }, [router.query["type"]]);
  
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  async function addReaderToDb(readerData) {
    try {
      const response = await fetch("/api/reader", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(readerData),
      });
      const createdReader = await response.json();
      router.back();
      // console.log("api response on createdReader: ", createdReader);
      return createdReader;
    } catch (error) {
      console.error("Unable to create reader:", error);
    }
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    data.reader_type = selectedReader;
    const formDataString = JSON.stringify(data);
    
    const adminCreateReader = async () => {
      try {
        const response = await fetch("/api/createUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: formDataString,
        });
        const data = await response.json();
        // console.log("data", data.message.User.Attributes);
        const readerData = {
          reader_name: "",
          reader_type: selectedReader,
          reader_email: data?.message?.User?.Attributes?.filter((obj) => obj.Name === 'email')[0].Value,
          user_id:data?.message?.User?.Attributes?.filter((obj) => obj.Name === 'sub')[0].Value,        
        };
        
        if(data.statusCode === 200) {
          addReaderToDb(readerData);
        };

        setSignUpError(data.statusCode === 400 && data.message.message);
        setOpen(data.statusCode === 400);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    adminCreateReader();
  };

  return (
    <>
      <style jsx>
        {`
          .input-group > .form-control {
            position: relative !important;
            flex: 1 1 auto;
            width: 1%;
            margin-bottom: 0;
          }
          .input-group > .input-group-append {
            position: absolute !important;
            top: 0;
            right: 0;
            z-index: 99;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 100%;
            pointer-events: all;
          }
          .input-group > .input-group-append > .input-group-text {
            display: flex !important;
            align-items: center !important;
            justify-content: center;
            width: 100% !important;
            height: 100%;
            padding: 0.375rem 0.75rem !important;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #495057;
            text-align: center;
            white-space: nowrap;
            // border: 0;
            background: none;
            border-radius: 0px;
            pointer-events: all;
          }
        `}
      </style>

      <div className={`${styles.user_header} py-2 px-3 border-bottom`}>
        <h4 className="fw-bold">Reader Information</h4>
      </div>
      <div className="row px-3">
        <div className="col-12">
          <div className="errors">
            <Toast
              show={open}
              onClose={handleClose}
              delay={6000}
              className="col-12 w-100"
            >
              <Toast.Header>
                {open}
                {/* <i className="fa-solid fa-circle-exclamation fa-sm" style={{color: "#f24207"}}></i> */}
                <strong className={`mr-auto text-danger`}>{signUpError}</strong>
              </Toast.Header>
            </Toast>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            method="post"
            // className={`${styles.rightRadius}`}
          >
            <Form.Group controlId="email">
              <Form.Label className="text-dark m-0 fw-bold fs-6 p-0">
                Email address
              </Form.Label>
              <br />
              <Form.Text className="text-muted">
                Enter this reader's email address. A reader's email address can
                be used for sign-in.
              </Form.Text>
              <Form.Control
                className="mt-2 mb-2"
                type="email"
                isInvalid={errors.email ? true : false}
                placeholder="Enter an email address"
                {...register("email")}
              />

              <Form.Control.Feedback type="invalid">
                {errors.email ? errors.email.message : null}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password" className="">
              <Form.Label className="text-dark mx-0 mt-2 mb-2 fw-bold fs-6 p-0">
                Temporary Password
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  isInvalid={errors.password ? true : false}
                  placeholder="Enter password"
                  {...register("password")}
                />
                <div
                  className="input-group-append"
                  onClick={toggleShowPassword}
                >
                  <span className="input-group-text">
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.password ? errors.password.message : null}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="text-dark fw-bold mx-0 mt-3 mb-2 fs-6 p-0">
                Reader Type
              </Form.Label>
              <Form.Check
                type="radio"
                label={<span style={{ color: "black" }}>Industry Reader</span>}
                name="reader"
                value="industries_reader"
                checked={selectedReader === "industries_reader"}
                onChange={handleReaderChange}
              />
              <Form.Check
                type="radio"
                label={<span style={{ color: "black" }}>Infiction Reader</span>}
                name="reader"
                value="infiction_reader"
                checked={selectedReader === "infiction_reader"}
                onChange={handleReaderChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2 my-2">
              <button
                className={` btn btn-dark `}
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button className={`btn btn-warning `} type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

const SelectSecurity = ({
  title,
  subTitle,
  radioText1,
  radioText2,
  name,
}: any) => {
  return (
    <>
      <div className="pertmission p-2 fw-bold fs-6">
        <h6 className="fw-bold">Reader Type</h6>

        <div className="form-check py-2 fw-normal">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-inf`}
            id={`radio-inf`}
          />
          <label className="form-check-label" htmlFor={`radio-inf`}>
            Infiction Reader
          </label>
        </div>
        <div className="form-check fw-normal">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-ind`}
            id={`radio-ind`}
            checked
          />
          <label className="form-check-label" htmlFor={`radio-ind`}>
            Industry Reader
          </label>
        </div>
      </div>
    </>
  );
};
