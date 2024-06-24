import { UserContext } from '@/store/CognitoUser/CognitoUserContext';
import { Auth } from 'aws-amplify';
import router from 'next/router'
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form';

interface IFormInput {
    name: string;
    username: string;
    dob: string;
    email: string;
    phone_number: string;
    education: string;
    user_bio: string;
    picture: string;
    inf_username: String;
    picture_prefix: String;
    website: String;
  }

export default function EditUser() {
    const [user, setUser] = useState("");
    const { cognitoUsers, setCognitoUsers } = useContext(UserContext);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<IFormInput>();

    useEffect(() => {
        const curUserData = cognitoUsers.filter((user) => user.Username === router.query["user_id"]);

        const updatedArray = curUserData.map(item => {
            const { Attributes, ...rest } = item;
            return rest;
        });

        const expandedAttributes = curUserData[0] && curUserData[0].Attributes.reduce((acc, attr) => {
            acc[attr.Name] = attr.Value;
            return acc;
        }, {});

        const updatedcurUserData = { ...updatedArray[0], ...expandedAttributes };
        setUser(updatedcurUserData)
    }, [cognitoUsers])

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {

        data.phone_number = data.phone_number || user?.phone_number;
        data.name = data.name || user?.name;
        data.dob = data.dob || user?.birthdate;
        data.inf_username = data.inf_username || user["custom:inf_username"];

        // const result = await updateUserData(data);
        console.log("form data", data);
    }
    return (
        <div className='container'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                // autoComplete="off"
                method="post"
            // className={`${styles.rightRadius}`}
            >

                <Form.Group>
                    <Form.Label className="text-dark m-0 fw-bold fs-6 p-0">
                        Infiction ID
                    </Form.Label>
                    <br />
                    <Form.Control
                        className="mt-2 mb-2"
                        placeholder="Enter Infiction ID"
                        type="text"
                        defaultValue={user?.Username || ""}
                        disabled
                        {...register("id")}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label className="text-dark m-0 fw-bold fs-6 p-0">
                        Infiction Username
                    </Form.Label>
                    <br />
                    <Form.Control
                        className="mt-2 mb-2"
                        placeholder="Enter infiction username"
                        defaultValue={
                            user?.["custom:inf_username"] || ""
                        }
                        type="text"
                        {...register("username")}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label className="text-dark m-0 fw-bold fs-6 p-0">
                        Role
                    </Form.Label>
                    <br />
                    <Form.Control
                        className="mt-2 mb-2"
                        placeholder="Enter role"
                        type="text"
                        disabled
                        defaultValue={
                            user?.["custom:role"] || ""
                        }
                        {...register("role")}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label className="text-dark m-0 fw-bold fs-6 p-0">
                        Name
                    </Form.Label>
                    <br />
                    <Form.Control
                        className="mt-2 mb-2"
                        placeholder="Enter name"
                        type="text"
                        defaultValue={user?.name || ""}
                        {...register("name")}
                    />
                </Form.Group>
                {/* Email */}
                <Form.Group>
                    <Form.Label className="text-dark mx-0 mt-2 mb-2 fw-bold fs-6 p-0">
                        Email
                    </Form.Label>
                    <br />
                    <div className="input-group">
                        <Form.Control
                            className="mt-2 mb-2"
                            type="email"
                            // isInvalid={errors.email ? true : false}
                            defaultValue={user?.email || ""}
                            placeholder="Enter email"
                            {...register("email")}
                        />
                        {/* <Form.Control.Feedback type="invalid">
                            {errors.email ? errors.email.message : null}
                        </Form.Control.Feedback> */}

                    </div>
                </Form.Group>
                <Form.Group>
                    <Form.Label className="text-dark mx-0 mt-2 mb-2 fw-bold fs-6 p-0">
                        phone number
                    </Form.Label>
                    <br />
                    <Form.Text className="text-muted">
                        Enter a phone number,including + and the country code , for example:+1234567892
                    </Form.Text>
                    <Form.Control
                        className="mt-2 mb-2"
                        type="text"
                        // isInvalid={errors.email ? true : false}
                        placeholder="Enter Phone Number"
                        defaultValue={user?.phone_number || ""}
                        {...register("phone_number")}
                    />
                </Form.Group>
                <Form.Group controlId="dob">
                    <Form.Label className="text-dark m-0 fw-bold fs-6 p-0">
                        DOB
                    </Form.Label>
                    <Form.Control
                        className="mt-2 mb-2"
                        type="date"
                        placeholder="DOB"
                        defaultValue={user?.birthdate || ""}
                        {...register("dob")}
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
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}
