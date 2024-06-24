import { Snackbar } from "@material-ui/core";
import { Alert, Form, Toast } from "react-bootstrap";
import { FaAngleDown, FaEnvelopeOpen, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import AdminSideBar from "@/components/admin";
import styles from "../../../../../styles/admin.module.css";
import CreateReader from "@/components/admin/CreateReader";

export default function createReader() {
    return (
        <>
            <main className={`p-3 w-100 bg-light ${styles.adminPanelChild}`}>
                <div className="row gap-3">
                    <div className="row">
                        <div className="col-12">
                            <h3>Create Reader</h3>
                        </div>
                    </div>
                    <div className="row w-75">
                        <div className="col-12 bg-white border p-0 ms-2">
                            <CreateReader />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
