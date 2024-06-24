import { useState } from "react";
import Select, { StylesConfig } from "react-select";
import styles from "../styles/Profile.module.css";
import React from "react";

export default function SelectInputs({
  userData,
  setFilteredData,
  onClose,
  selectedGenres,
  setSelectedGenres,
  selectedTags,
  setSelectedTags,
}) {
  const handleFilter = (data) => {
    setFilteredData(data);
    onClose();
  };

  const [selectedGenreOptions, setselectedGenreOptions] = useState(
    selectedGenres || []
  );
  const [selectedTagOptions, setselectedTagOptions] = useState(
    selectedTags || []
  );
  const [filteredData, setfilteredData] = useState(userData || []);

  function Filter({
    data,
    setselectedOptions,
    selectedOptions,
    selectOptions,
    selectedDefaultOptions,
    defaultOptions,
    placeholder,
  }) {
    const optionsValue = selectOptions.filter((option) =>
      data.some((item) => item.genre === option.value)
    );

    const handleFilterChange = (selectedOptions) => {
      setselectedOptions(selectedOptions);
      selectedDefaultOptions(selectedOptions);

      if (selectedOptions.length != 0) {
        var filteredData = [];
        if (placeholder === "Genre") {
          filteredData = data.filter((item) =>
            selectedOptions.some((option) => item.genre.includes(option.value))
          );
        } else {
          filteredData = data.filter((item) =>
            selectedOptions.some((option) => item.tags.includes(option.value))
          );
        }
        setfilteredData(filteredData);
      } else {
        setfilteredData(data);
      }
    };

    const FiltercustomStyles = {
      control: (provided, state) => ({
        ...provided,
        background: "black",
        boxShadow: "none",
        // borderColor: "white",
        border: "none",
        cursor: "pointer",
        "&:hover": { borderColor: "#F3AE09" },
      }),
      menuList: (provided) => ({
        ...provided,
        backgroundColor: "#1F1F1F",
        color: "white",
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#F3AE09" : "#1F1F1F",
        color: "#666873",
        "&:active": { borderColor: "#F3AE09" },
      }),
      multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#F3AE09",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "white",
      }),
      indicatorContainer: (provided) => ({
        ...provided,
        color: "grey",
      }),
    };
    return (
      <>
        <style jsx>{`
          .FilterSelectInput {
            width: 100%;
          }
          
          
        `}</style>
        <div className=" mpfilter w-100">
          <label className="mx-0 fw-bold">{placeholder}</label>
          <Select
            isMulti
            options={selectOptions}
            value={selectedOptions}
            defaultValue={defaultOptions}
            onChange={handleFilterChange}
            className="FilterSelectInput"
            placeholder=""
            styles={FiltercustomStyles}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx>
        {`
      .filter_responsive
        {
          height: 45vh;
          width: 30%;
          background: rgba(51, 51, 51, 1);
          borderRadius: 10px;
        }

        @media only screen and (max-width: 426px) {
          .filter_responsive {
            height: 100%;
            width: 100%;
        
          }
        }
      `}
      </style>
      <div
        className="filter_responsive"
        // style={{
        //   height: "35vh",
        //   width: "30 %",
        //   background: " rgba(51, 51, 51, 1)",
        //   borderRadius: "10px",
        // }}
      >
        <div className="d-flex flex-column align-items-start p-4 gap-4">
          <Filter
            data={userData}
            setselectedOptions={setselectedGenreOptions}
            selectedOptions={selectedGenreOptions}
            selectOptions={genresOptions}
            selectedDefaultOptions={setSelectedGenres}
            defaultOptions={selectedGenres}
            placeholder="Genre"
          />
          <Filter
            data={userData}
            setselectedOptions={setselectedTagOptions}
            selectedOptions={selectedTagOptions}
            selectOptions={tagsOptions}
            selectedDefaultOptions={setSelectedTags}
            defaultOptions={selectedTags}
            placeholder="Tags"
          />
        </div>
        <div className="d-flex justify-content-between p-4">
          <button
            className={`btn-md btn btn-outline-secondary ${styles.cancel_btn}`}
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button
            className={`btn-md btn btn-outline-secondary ${styles.cancel_btn}`}
            onClick={() => {
              handleFilter(filteredData);
              onClose();
            }}
          >
            Filter
          </button>
        </div>
      </div >
    </>
  );
}

const genresOptions = [
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

const tagsOptions = [
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
