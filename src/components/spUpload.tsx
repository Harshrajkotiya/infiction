//import { useState, useEffect } from 'react';
import { FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "../styles/Profile.module.css";
import Select, { StylesConfig } from "react-select";
import { Auth } from "aws-amplify";
import { handleupdateScreenplay } from "../lib/Screenplay/updateScreenplay";
import { FileUploader } from "react-drag-drop-files";
import { useRouter } from "next/router";
import { GetUserImg } from "./get_profile_img";
import { useForm } from "react-hook-form";
import PDFViewer from "./pdfViewer";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getScreenplay, getUserScreenplays } from "@/lib/Screenplay/Sphelpers";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { updateUserDataImg } from "./upload_profile_img";

export default function Profile(props) {
  // console.log("props", props);

  const [user, setUser] = useState(null);
  const [userSP, setUserScreenplay] = useState(null);
  // const [defaultGenres, setDefaultGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  // const [defaultTags, setDefaultTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [formError, setError] = useState(null);
  const [largePdfFile, setLargePdfFile] = useState(false);
  const [isSelectPDFErrMsg, setIsSelectPDFErrMsg] = useState(false);
  // const [file, setFile] = useState<any>();
  const [imgfileName, setFileName] = useState<any>();
  const [fileSizePDF, setFileSizePDF] = useState<any>();
  const [fileNamePDF, setFileNamePDF] = useState<any>();
  const [filePDF, setFilePDF] = useState<any>();
  // const [SPimg, setSPimg] = useState("");
  const [SP, setSP] = useState("");
  const [show, setShow] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputFilePDF = useRef(null);
  // const inputFile = useRef(null);
  const formRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();

  const UpdateMutation = useMutation(
    (newData) => handleupdateScreenplay(props.id, newData, props.onCancel),
    {
      onSuccess: async (data) => {
        // queryClient.setQueryData(["UserscreenplayData", props.user_id], data);
        queryClient.prefetchQuery(["UserscreenplayData", props.user_id], () =>
          getUserScreenplays(props.user_id)
        );
        queryClient.prefetchQuery(["screenplayData", parseInt(props.id)], () =>
          getScreenplay(parseInt(props.id))
        );
      },
    }
  );

  const { isLoading, isError, data, error } = useQuery(
    ["screenplayData", parseInt(props.id)],
    () => getScreenplay(parseInt(props.id))
  );

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

  const [SPFormData, setSPFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const storedFormData = JSON.parse(localStorage.getItem("SPFormData"));
      const defaultGenresArray = storedFormData.genre
        ? storedFormData.genre.trim().split(/\s*,\s*/)
        : [];
      // console.log("defaultGenresArray", data?.genre, defaultGenresArray);

      const defaultGenresOptions = defaultGenresArray?.map((genre) => ({
        value: genre,
        label: genre,
      }));

      setSelectedGenres(defaultGenresOptions);

      const defaultTagsArray = storedFormData.tags
        ? storedFormData.tags.trim().split(/\s*,\s*/)
        : [];
      const defaultTagsOptions = defaultTagsArray?.map((tag) => ({
        value: tag,
        label: tag,
      }));
      // setDefaultTags(defaultTagsArray);
      setSelectedTags(defaultTagsOptions);
      return storedFormData !== null ? storedFormData : {};
    } else {
      return {};
    }
  });

  // if (props.user_id) {
  function GetUserSPData() {
    console.log("data", data);

    // setUserScreenplay(data?.rows?.[0] ?? []);
    const openedSP = data?.rows?.[0] ?? [];

    GetUserImg(openedSP?.screenplay_url)
      .then((screenplay_url) => {
        setSP(screenplay_url);
        // console.log("data?.screenplay_url", data?.screenplay_url);
        // console.log("screenplay_url....", screenplay_url);
      })
      .catch((err) => console.log(err));

    const defaultGenresArray =
      props.steplen === 1
        ? data?.rows[0]?.genre?.trim().split(/\s*,\s*/)
        : SPFormData.genre
        ? SPFormData.genre.trim().split(/\s*,\s*/)
        : openedSP?.genre
        ? data?.rows[0]?.genre?.trim().split(/\s*,\s*/)
        : [];
    // console.log("defaultGenresArray", data?.genre, defaultGenresArray);

    const defaultGenresOptions = defaultGenresArray?.map((genre) => ({
      value: genre,
      label: genre,
    }));

    setSelectedGenres(defaultGenresOptions);

    const defaultTagsArray =
      props.steplen === 1
        ? data?.rows[0]?.tags?.trim().split(/\s*,\s*/)
        : SPFormData.tags
        ? SPFormData.tags.trim().split(/\s*,\s*/)
        : openedSP?.tags
        ? data?.rows[0]?.tags?.trim().split(/\s*,\s*/)
        : [];
    const defaultTagsOptions = defaultTagsArray?.map((tag) => ({
      value: tag,
      label: tag,
    }));
    // setDefaultTags(defaultTagsArray);
    setSelectedTags(defaultTagsOptions);
  }

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUser(user);
        // setSPimg(user?.attributes.picture);
      })
      .catch((error) => console.log("error", error));
  }, []);

  useEffect(() => {
    setUserScreenplay(data?.rows?.[0] ?? []);
    GetUserSPData();
  }, [data]);

  // Define a reusable function to handle changes to the selected options
  const handleSelectChange = (
    selectedOptions: any,
    maxOptions: number,
    setOptions: any,
    formField: string,
    setError: any
  ) => {
    if (selectedOptions.length > maxOptions) {
      setError(
        <Snackbar
          open={setError ? true : false}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setError(null)} severity="warning">
            You can only select up to {maxOptions} options.
          </Alert>
        </Snackbar>
      );
    }

    if (selectedOptions && selectedOptions.length > maxOptions) {
      selectedOptions = selectedOptions.slice(0, maxOptions); // limit the selection to the maximum value
    }

    // setError(null);
    setOptions(selectedOptions);

    // Update the form data or state with the selected options
    const optionList = selectedOptions.map(({ value }) => value).join(",");
    formData[formField] = optionList;

    // console.log(`${formField}: `, optionList);
  };

  // Handle Genre change and validation
  const handleChangeGenre = (selectedOptions: any) => {
    handleSelectChange(
      selectedOptions,
      5,
      setSelectedGenres,
      "genre",
      setError
    );
  };

  // Handle Tags changes and validation
  const handleChangeTags = (selectedOptions: any) => {
    handleSelectChange(selectedOptions, 15, setSelectedTags, "tags", setError);
  };

  const uploadFilenPDF = () => {
    if (inputFilePDF.current != null) {
      inputFilePDF.current.click();
    }
  };

  //get file size and units
  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    // console.log("-------- ", bytes);

    if (bytes > 5000000) {
      setError(
        <Snackbar
          open={setError ? true : false}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setError(null)} severity="warning">
            You can not upload file more than 5MB
          </Alert>
        </Snackbar>
      );
      setLargePdfFile(true);
      setFileSizePDF(null);
      setFilePDF(null);
      setFileNamePDF(null);
      setUploadProgress(0);
      return;
    }

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
  }

  const selectFilePDF = (e: any) => {
    //if (!largePdfFile) {
    if (e.target.files[0]) {
      setFilePDF(URL.createObjectURL(e.target.files[0]));
      setFileSizePDF(e.target.files[0].size);
      setFileNamePDF(e.target.files[0]);
      let size = formatBytes(fileSizePDF);
      setIsSelectPDFErrMsg(false);
      setLargePdfFile(false);
      // console.log("Upload file data is :", e.target.files[0]);

      const desiredUploadSpeed = 100000; // 100KB/s
      const uploadTime = (e.target.files[0].size / desiredUploadSpeed) * 1000;
      setUploadProgress(0);

      //if (fileSizePDF != null) {
      const interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          } else {
            return prevProgress + 10;
          }
        });
      }, uploadTime / 10);

      const timer = setTimeout(() => {
        clearInterval(interval);
      }, uploadTime);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  };

  const updateData = async (event) => {
    event.preventDefault();
    formData.user_id = user?.attributes?.sub;
    // formData.profile_url = imgfileName ? imgfileName : "";
    // formData.profile_prefix = "sp_profile";
    // console.log("formData", formData);

    // handleupdateScreenplay(props, formData);
    const updateData = Object.assign({}, formData);
    await UpdateMutation.mutate(updateData);
    props.onCancel();
  };

  const handleFormSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    //  console.log("formData",formData);

    formData.genre = formData.genre ? formData.genre : SPFormData.genre;
    formData.tags = formData.tags ? formData.tags : SPFormData.tags;
    formData.logline = formData.logline ? formData.logline : SPFormData.logline;
    formData.synposis = formData.synposis
      ? formData.synposis
      : SPFormData.synposis;
    formData.title = formData.title ? formData.title : SPFormData.title;
    formData.user_id = user?.attributes?.sub;

    if (fileNamePDF) {
      updateUserDataImg(fileNamePDF, "sp");
    }
    formData.screenplay_url = fileNamePDF
      ? fileNamePDF
      : SPFormData.screenplay_url || "";
    formData.screenplay_prefix = "sp";

    if (formRef?.current.checkValidity()) {
      console.log("in......");
      if (fileNamePDF || SPFormData.screenplay_url.name) {
        props.handleData(formData);
        props.nextStep();
      } else {
        
        setIsSelectPDFErrMsg(true);
        setError(
          <Snackbar
            open={setError ? true : false}
            autoHideDuration={6000}
            onClose={() => setError(null)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={() => setError(null)} severity="warning">
              Please Select Screenplay PDF File
            </Alert>
          </Snackbar>
        );
      }

      // handleScreenplayUpload(props, formData, readerData);
    }
  };

  //Select tag Conf for style
  const colourStyles: StylesConfig<ColourOption, true> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "black",
      border: "0px",
      padding: "5px",
      color: "white",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: "black",
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled,
        },
        ":hover": {
          color: "white",
        },
      };
    },
    multiValue: (styles, { data }) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: "white",
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      ":hover": {
        backgroundColor: "red",
        color: "white",
      },
    }),
  };

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    // console.log("Fomm data on change: ", formData);
  };

  return (
    <>
      <style jsx>
        {`
          * {
            color: white;
            font-family: courier;
          }

          input.input-box,
          textarea {
            background: black;
            border-color: black;
          }

          input.input-box,
          input {
            background: black;
            border-color: black;
            padding: 12px 10px 12px 10px;
          }

          input:focus,
          textarea:focus {
            background-color: #000000;
            color: white;
          }

          ::placeholder {
            color: #b8b8b8;
            opacity: 1;
          }

          :-ms-input-placeholder {
            color: #b8b8b8;
          }

          ::-ms-input-placeholder {
            color: #b8b8b8;
          }
          .select_style {
            background: black;
            border: none;
            border-color: none;
            outline: none;
          }
          .Select_style {
            background: black;
            border: none;
            border-color: none;
            outline: none;
          }

          .progressivebar_bg {
            display: flex;
            justify-content: center;
            align-items: center;
            background: black;
            height: 11%;
            display: flex;
            border-radius: 10px;
            width: 25%;
          }
          select {
            text-align: center;
            text-align-last: center;
            /* webkit*/
          }
          option {
            text-align: left;
            /* reset to left*/
          }
        `}
      </style>
      <div className="">
        <div className="row" style={{ background: "black" }}>
          <div className={`card  ${styles.cardBg}`}>
            <div className="card-body text-center text-white">
              <h3 className="fw-bold">Please enter screenplay details</h3>
              {/* <hr className="mb-4" style={{ width: "100px", margin: "auto" }} /> */}
              {formError}
              <form
                className="mt-4"
                ref={formRef}
                method="post"
                onSubmit={handleFormSubmit}
              >
                <div className="row">
                  <div
                    className={`col-lg-2 col-md-2 col-sm-12 ${styles.upload_sp_imges}`}
                  >
                    <img
                      className={`img-thumbnail ${styles.imgCircleUploadSp}`}
                      src="../upload_screen_img.svg"
                      alt="SPupload_img"
                    />
                    {props.steplen === 1 && (
                      <input style={{ display: "none" }} required />
                    )}

                    {/* {!file && (
                      <img
                        className={`img-thumbnail ${styles.img_thumb_uploadsp}`}
                        src="/upload.png"
                        alt=""
                        onClick={uploadFilen}
                      />
                    )} */}
                  </div>

                  <div className="col-lg-10 col-md-10 col-sm-12 mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Title"
                      name="title"
                      defaultValue={
                        props.steplen === 1
                          ? userSP?.title
                          : SPFormData.title ||
                            formData.title ||
                            userSP?.title ||
                            ""
                      }
                      onChange={handleChange}
                      required
                      // {...register("title", { required: true })}
                    />
                    <div className="d-flex mt-3">
                      <Select
                        placeholder="Genres"
                        className="w-50 me-2 Select_style basic-multi-select"
                        aria-label=".form-select-sm example"
                        value={selectedGenres}
                        isMulti
                        instanceId="long-value-select"
                        id="long-value-select"
                        name="genre"
                        options={genresOptions}
                        styles={colourStyles}
                        classNamePrefix="select"
                        maxMenuHeight={200}
                        onChange={handleChangeGenre}
                        maxValue={5}
                        required
                      />

                      <Select
                        placeholder="Tags"
                        className="w-50 me-2 Select_style basic-multi-select"
                        aria-label=".form-select-sm example"
                        value={selectedTags}
                        isMulti
                        instanceId="long-value-select"
                        id="long-value-select"
                        name="tags"
                        options={tagsOptions}
                        styles={colourStyles}
                        classNamePrefix="select"
                        maxValue={15}
                        onChange={handleChangeTags}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-4 ">
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Logline"
                      name="logline"
                      defaultValue={
                        props.steplen === 1
                          ? userSP?.logline
                          : SPFormData.logline ||
                            formData.logline ||
                            userSP?.logline ||
                            ""
                      }
                      onChange={handleChange}
                      required
                    />
                    <textarea
                      className="form-control mt-4"
                      id="exampleFormControlTextarea1"
                      rows={3}
                      placeholder="synposis"
                      name="synposis"
                      defaultValue={
                        props.steplen === 1
                          ? userSP?.synposis
                          : SPFormData.synposis ||
                            formData.synposis ||
                            userSP?.synposis ||
                            ""
                      }
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row d-flex justify-content-between">
                  <div className="col-12 my-3 mx-2">
                    <div className="col-6">
                      {SP ? (
                        <PDFViewer SP={SP} name={userSP?.screenplay_url} />
                      ) : (
                        <div
                          className={`row ${styles.uploadPdfDotted}`}
                          onClick={uploadFilenPDF}
                        >
                          <div className="col-lg-3 col-md-3 col-sm-12 bg-gray">
                            <img src="../file_blank_fill.svg" alt="" />
                          </div>
                          <input
                            className="file-upload"
                            // name="screenplayFile"
                            type="file"
                            id="picture"
                            accept="application/pdf,application/vnd.ms-excel"
                            onChange={(e) => selectFilePDF(e)}
                            style={{ display: "none" }}
                            ref={inputFilePDF}
                            disabled={props.steplen === 1 || SPFormData.screenplay_url}
                            required
                          />
                          <div className="col-lg-9 col-md-9 col-sm-12">
                            <h6>Click to upload or drag and drop</h6>
                            <p style={{ color: "#ffffff96;" }}>
                              Maximum file size 5MB and Only PDF
                            </p>
                            {(fileNamePDF || SPFormData.screenplay_url) && (
                              <div
                                className="progressivebar_bg mt-2"
                                style={{ width: "100%" }}
                              >
                                <div className="me-2 ms-2">
                                  <p style={{ display: "contents" }}>
                                    {SPFormData.screenplay_url?.size
                                      ? formatBytes(
                                          SPFormData.screenplay_url.size
                                        )
                                      : "0MB" || fileSizePDF
                                      ? formatBytes(fileSizePDF)
                                      : "0MB"}
                                  </p>
                                </div>
                                <div
                                  className="progressivebar progress"
                                  style={{
                                    width: "70%",
                                    height: "5px",
                                    background: "#333333",
                                  }}
                                >
                                  <div
                                    className="progress-bar"
                                    // role="progressbar"
                                    style={{
                                      width: `${
                                        SPFormData.screenplay_url != ""
                                          ? 100
                                          : largePdfFile
                                          ? 0
                                          : uploadProgress
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="ms-2 me-2">
                                  <p style={{ display: "contents" }}>
                                    {SPFormData.screenplay_url != ""
                                      ? 100
                                      : largePdfFile
                                      ? 0
                                      : uploadProgress}
                                    %
                                  </p>
                                </div>
                              </div>
                            )}

                            <h6>
                              {fileNamePDF?.name ||
                                SPFormData.screenplay_url?.name}
                            </h6>
                          </div>
                        </div>
                      )}
                      {isSelectPDFErrMsg && (
                        <p
                          style={{
                            color: "red",
                            textAlign: "left",
                            fontSize: "18px",
                          }}
                        >
                          Please Select Screenplay PDF File
                        </p>
                      )}
                    </div>
                    <div className="col-6">
                      {/* <FileUploader handleChange={handleChangenn} name="file" maxSize={1} types={fileTypes} /> */}
                    </div>
                  </div>
                </div>
                <div className="column d-flex justify-content-between">
                  <div
                    className={`col-lg-2 col-md-4 col-sm-5`}
                    style={{ textAlign: "left" }}
                  >
                    {/* <a href="../../dashboard"> */}
                    <button
                      type="button"
                      onClick={props.prevStep}
                      className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
                    >
                      {props.steplen === 1 ? "Cancel" : "Back"}
                    </button>
                    {/* </a> */}
                  </div>

                  <div
                    className="col-lg-2 col-md-4 col-sm-5"
                    style={{ textAlign: "right" }}
                  >
                    {props.steplen === 1 ? (
                      <button
                        onClick={updateData}
                        type="button"
                        className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
                      >
                        Done
                      </button>
                    ) : (
                      <button
                        // onClick={() => {props.handleData(formData); props.nextStep()}}
                        type="submit"
                        className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export const genresOptions: readonly ColourOption[] = [
  { value: "Action", label: "Action", color: "#00B8D9" },
  { value: "Animation", label: "Animation", color: "#0052CC" },
  { value: "Comedy", label: "Comedy", color: "#5243AA" },
  { value: "Drama", label: "Drama", color: "#FF5630" },
  { value: "Fantasy", label: "Fantasy", color: "#FF8B00" },
  { value: "Horror", label: "Horror", color: "#FFC400" },
  { value: "Mystery", label: "Mystery", color: "#36B37E" },
  { value: "Romance", label: "Romance", color: "#00875A" },
  { value: "Science_fiction", label: "Science Fiction", color: "#253858" },
  { value: "Thriller", label: "Thriller", color: "#666666" },
];

export interface TagOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export const tagsOptions: readonly TagOption[] = [
  { value: "Adventure", label: "Adventure", color: "#00B8D9" },
  { value: "Crime", label: "Crime", color: "#00B8D9" },
  { value: "Musical", label: "Musical", color: "#00B8D9" },
  { value: "War", label: "War", color: "#00B8D9" },
  { value: "Historical", label: "Historical", color: "#00B8D9" },
  { value: "Documentary", label: "Documentary", color: "#00B8D9" },
  { value: "Biographical", label: "Biographical", color: "#00B8D9" },
  { value: "Sports", label: "Sports", color: "#00B8D9" },
  { value: "Experimental", label: "Experimental", color: "#00B8D9" },
  { value: "Art-house", label: "Art-house", color: "#00B8D9" },
  { value: "Noir", label: "Noir", color: "#00B8D9" },
  { value: "Road trip", label: "Road trip", color: "#00B8D9" },
  { value: "Female Lead", label: "Female Lead", color: "#00B8D9" },
  { value: "Child Protagonist", label: "Child Protagonist", color: "#00B8D9" },
  { value: "LGBTQ+", label: "LGBTQ+", color: "#00B8D9" },
  { value: "Pet-centric", label: "Pet-centric", color: "#00B8D9" },
  { value: "Coming of age", label: "Coming of age", color: "#00B8D9" },
  { value: "Family Friendly", label: "Family Friendly", color: "#00B8D9" },
  { value: "Urban", label: "Urban", color: "#00B8D9" },
  { value: "Small Town", label: "Small Town", color: "#00B8D9" },
  { value: "Rural", label: "Rural", color: "#00B8D9" },
  { value: "Foreign Location", label: "Foreign Location", color: "#00B8D9" },
  { value: "Psychological", label: "Psychological", color: "#00B8D9" },
  { value: "Period", label: "Period", color: "#00B8D9" },
  { value: "Dark", label: "Dark", color: "#00B8D9" },
  { value: "Slice of life", label: "Slice of life", color: "#00B8D9" },
  { value: "Plot-twist", label: "Plot-twist", color: "#00B8D9" },
  {
    value: "Non-linear narrative",
    label: "Non-linear narrative",
    color: "#00B8D9",
  },
  { value: "Flashbacks", label: "Flashbacks", color: "#00B8D9" },
  {
    value: "Multiple storylines",
    label: "Multiple storylines",
    color: "#00B8D9",
  },
  { value: "First-person POV", label: "First-person POV", color: "#00B8D9" },
  { value: "Love Triangle", label: "Love Triangle", color: "#00B8D9" },
  { value: "Revenge", label: "Revenge", color: "#00B8D9" },

  { value: "Survival", label: "Survival", color: "#00B8D9" },
  { value: "Superhero", label: "Superhero", color: "#00B8D9" },
  { value: "Time travel", label: "Time travel", color: "#00B8D9" },
  {
    value: "Based on a true story",
    label: "Based on a true story",
    color: "#00B8D9",
  },
  { value: "Ensemble cast", label: "Ensemble cast", color: "#00B8D9" },
  { value: "Satire", label: "Satire", color: "#00B8D9" },
  { value: "Social Commentary", label: "Social Commentary", color: "#00B8D9" },
  { value: "Supernatural", label: "Supernatural", color: "#00B8D9" },
  { value: "Whodunit", label: "Whodunit", color: "#00B8D9" },
  { value: "Adaptation", label: "Adaptation", color: "#00B8D9" },
  { value: "Political", label: "Political", color: "#00B8D9" },
  { value: "Realist", label: "Realist", color: "#00B8D9" },
];
