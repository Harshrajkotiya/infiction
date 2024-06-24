/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { ProfileData } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function ProfileDataCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    infiction_username: "",
    email: "",
    dob: "",
    phone: "",
    highest_educatio: "",
    short_bio: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [infiction_username, setInfiction_username] = React.useState(
    initialValues.infiction_username
  );
  const [email, setEmail] = React.useState(initialValues.email);
  const [dob, setDob] = React.useState(initialValues.dob);
  const [phone, setPhone] = React.useState(initialValues.phone);
  const [highest_educatio, setHighest_educatio] = React.useState(
    initialValues.highest_educatio
  );
  const [short_bio, setShort_bio] = React.useState(initialValues.short_bio);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setInfiction_username(initialValues.infiction_username);
    setEmail(initialValues.email);
    setDob(initialValues.dob);
    setPhone(initialValues.phone);
    setHighest_educatio(initialValues.highest_educatio);
    setShort_bio(initialValues.short_bio);
    setErrors({});
  };
  const validations = {
    name: [],
    infiction_username: [],
    email: [],
    dob: [],
    phone: [],
    highest_educatio: [],
    short_bio: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name,
          infiction_username,
          email,
          dob,
          phone,
          highest_educatio,
          short_bio,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(new ProfileData(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "ProfileDataCreateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              infiction_username,
              email,
              dob,
              phone,
              highest_educatio,
              short_bio,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Infiction username"
        isRequired={false}
        isReadOnly={false}
        value={infiction_username}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              infiction_username: value,
              email,
              dob,
              phone,
              highest_educatio,
              short_bio,
            };
            const result = onChange(modelFields);
            value = result?.infiction_username ?? value;
          }
          if (errors.infiction_username?.hasError) {
            runValidationTasks("infiction_username", value);
          }
          setInfiction_username(value);
        }}
        onBlur={() =>
          runValidationTasks("infiction_username", infiction_username)
        }
        errorMessage={errors.infiction_username?.errorMessage}
        hasError={errors.infiction_username?.hasError}
        {...getOverrideProps(overrides, "infiction_username")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              infiction_username,
              email: value,
              dob,
              phone,
              highest_educatio,
              short_bio,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Dob"
        isRequired={false}
        isReadOnly={false}
        value={dob}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              infiction_username,
              email,
              dob: value,
              phone,
              highest_educatio,
              short_bio,
            };
            const result = onChange(modelFields);
            value = result?.dob ?? value;
          }
          if (errors.dob?.hasError) {
            runValidationTasks("dob", value);
          }
          setDob(value);
        }}
        onBlur={() => runValidationTasks("dob", dob)}
        errorMessage={errors.dob?.errorMessage}
        hasError={errors.dob?.hasError}
        {...getOverrideProps(overrides, "dob")}
      ></TextField>
      <TextField
        label="Phone"
        isRequired={false}
        isReadOnly={false}
        value={phone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              infiction_username,
              email,
              dob,
              phone: value,
              highest_educatio,
              short_bio,
            };
            const result = onChange(modelFields);
            value = result?.phone ?? value;
          }
          if (errors.phone?.hasError) {
            runValidationTasks("phone", value);
          }
          setPhone(value);
        }}
        onBlur={() => runValidationTasks("phone", phone)}
        errorMessage={errors.phone?.errorMessage}
        hasError={errors.phone?.hasError}
        {...getOverrideProps(overrides, "phone")}
      ></TextField>
      <TextField
        label="Highest educatio"
        isRequired={false}
        isReadOnly={false}
        value={highest_educatio}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              infiction_username,
              email,
              dob,
              phone,
              highest_educatio: value,
              short_bio,
            };
            const result = onChange(modelFields);
            value = result?.highest_educatio ?? value;
          }
          if (errors.highest_educatio?.hasError) {
            runValidationTasks("highest_educatio", value);
          }
          setHighest_educatio(value);
        }}
        onBlur={() => runValidationTasks("highest_educatio", highest_educatio)}
        errorMessage={errors.highest_educatio?.errorMessage}
        hasError={errors.highest_educatio?.hasError}
        {...getOverrideProps(overrides, "highest_educatio")}
      ></TextField>
      <TextField
        label="Short bio"
        isRequired={false}
        isReadOnly={false}
        value={short_bio}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              infiction_username,
              email,
              dob,
              phone,
              highest_educatio,
              short_bio: value,
            };
            const result = onChange(modelFields);
            value = result?.short_bio ?? value;
          }
          if (errors.short_bio?.hasError) {
            runValidationTasks("short_bio", value);
          }
          setShort_bio(value);
        }}
        onBlur={() => runValidationTasks("short_bio", short_bio)}
        errorMessage={errors.short_bio?.errorMessage}
        hasError={errors.short_bio?.hasError}
        {...getOverrideProps(overrides, "short_bio")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
