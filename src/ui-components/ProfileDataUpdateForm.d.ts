/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { ProfileData } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ProfileDataUpdateFormInputValues = {
    name?: string;
    infiction_username?: string;
    email?: string;
    dob?: string;
    phone?: string;
    highest_educatio?: string;
    short_bio?: string;
};
export declare type ProfileDataUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    infiction_username?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    dob?: ValidationFunction<string>;
    phone?: ValidationFunction<string>;
    highest_educatio?: ValidationFunction<string>;
    short_bio?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProfileDataUpdateFormOverridesProps = {
    ProfileDataUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    infiction_username?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    dob?: PrimitiveOverrideProps<TextFieldProps>;
    phone?: PrimitiveOverrideProps<TextFieldProps>;
    highest_educatio?: PrimitiveOverrideProps<TextFieldProps>;
    short_bio?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ProfileDataUpdateFormProps = React.PropsWithChildren<{
    overrides?: ProfileDataUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    profileData?: ProfileData;
    onSubmit?: (fields: ProfileDataUpdateFormInputValues) => ProfileDataUpdateFormInputValues;
    onSuccess?: (fields: ProfileDataUpdateFormInputValues) => void;
    onError?: (fields: ProfileDataUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProfileDataUpdateFormInputValues) => ProfileDataUpdateFormInputValues;
    onValidate?: ProfileDataUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ProfileDataUpdateForm(props: ProfileDataUpdateFormProps): React.ReactElement;
