import React, { useMemo, useState, useEffect } from "react"
import {
    /** Inertia.js */
    Link, usePage,
    /** Ant Design Components */
    notification, Breadcrumb,
    /** Ant Design Icons */
    PlusCircleOutlined,
    /** Day js */

} from "@shared/Ui"

import HandleToken from "@shared/Create/Opd/HandleToken"

const Show = ({ patient, profile, departments, doctors, patients }) => {
    const [tokenModalState, setTokenModalState] = useState({
        open: false,
        mode: "add",
    });

    const { flash, errors } = usePage().props;
    const [api, contextHolder] = notification.useNotification();

    /** Flash Success Message */
    useEffect(() => {
        if (flash.message) {
            api.success({
                message: "Success",
                description: flash.message,
                placement: "topRight",
            });
        }
    }, [flash]);

    /** Flash Validation Errors */
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            Object.entries(errors).forEach(([field, messages]) => {
                const errorText = Array.isArray(messages) ? messages.join(", ") : messages;
                api.error({
                    message: "Validation Error",
                    description: errorText,
                    placement: "topRight",
                });
            });
        }
    }, [errors]);

    return (
        <>
            {contextHolder}
            <div className="container-fluid">
                <div className="row bodyHeader mt-2 mb-2">
                    <div className="col-12 pt-2 pb-2 bg-white d-flex justify-content-between flex-wrap align-items-center border border-bottom-1 border-top-0 border-s-0 border-e-0">
                        <div>
                            <Breadcrumb
                                items={[
                                    { title: <Link href="/">Dashboard</Link> },
                                    { title: <Link href="/patients">Patients</Link> },
                                    { title: patient.name }
                                ]}
                            />
                        </div>
                        <div>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                style={{ borderStyle: "dashed" }}
                                onClick={() =>
                                    setTokenModalState({
                                        open: true,
                                        mode: "add",
                                    })
                                }>
                                <PlusCircleOutlined className="me-1" />
                                Token
                            </button>

                            <HandleToken
                                open={tokenModalState.open}
                                mode={tokenModalState.mode}
                                tokenData={{ patient_id: patient.id }}
                                departments={departments}
                                doctors={doctors}
                                patients={patients}
                                onCancel={() =>
                                    setTokenModalState({
                                        open: false,
                                        mode: "add",
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Show