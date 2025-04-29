import React, { useMemo, useState, useEffect } from "react";
import {
    Link, usePage, router,
    notification, Breadcrumb, Select, Tooltip, Popconfirm,
    Input,
    PlusCircleOutlined, EditOutlined, EyeOutlined,
    DeleteOutlined, MoreOutlined, MdGeneratingTokens,
    CiStethoscope, FaFileInvoiceDollar, FcPrint
} from "@shared/Ui";

import HandleToken from "@shared/Create/Opd/HandleToken";
import useDynamicHeight from "@shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "@shared/AgGridConfig";

const { Option } = Select;

const Index = ({ tokens, doctors, patients, departments }) => {
    const [loading, setLoading] = useState(false);
    const dynamicHeight = useDynamicHeight();
    const [tokenModalState, setTokenModalState] = useState({
        open: false,
        mode: "add",
        data: null,
    });
    const [filteredData, setFilteredData] = useState(tokens);
    const [selectedDoctorName, setSelectedDoctorName] = useState(null);
    const [selectedPatientName, setSelectedPatientName] = useState(null);

    const { flash, errors } = usePage().props;
    const [api, contextHolder] = notification.useNotification();

    // Update filtered data when tokens change
    useEffect(() => {
        if (tokens) setFilteredData(tokens);
    }, [tokens]);

    // Handle flash messages
    useEffect(() => {
        if (flash.message) {
            api.success({
                message: "Success",
                description: flash.message,
                placement: "topRight",
            });
        }
    }, [flash]);

    // Handle validation errors
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

    // Column definitions for AgGrid
    const colDefs = useMemo(() => [
        {
            field: "action",
            headerName: "Action",
            editable: false,
            filter: false,
            sortable: false,
            pinned: "right",
            cellRenderer: (params) => renderActionButtons(params),
        },
        { headerName: "Token#", field: "token_number" },
        { headerName: "Doctors", field: "doctor_name" },
        { headerName: "Patients", field: "patient_name" },
        { headerName: "Comment", field: "comment" },
        { headerName: "Status", field: "status", editable: false },
    ], []);

    // Filter tokens based on doctor and patient selection
    const handleFilterChange = (type, value) => {
        const updatedDoctorName = type === "doctor" ? value : selectedDoctorName;
        const updatedPatientName = type === "patient" ? value : selectedPatientName;

        setSelectedDoctorName(updatedDoctorName);
        setSelectedPatientName(updatedPatientName);

        const filteredTokens = tokens.filter((token) => {
            const doctorMatch = updatedDoctorName ? token.doctor_name === updatedDoctorName : true;
            const patientMatch = updatedPatientName ? token.patient_name === updatedPatientName : true;
            return doctorMatch && patientMatch;
        });

        setFilteredData(filteredTokens);
    };

    // Confirm token deletion
    const confirmDelToken = (id) =>
        new Promise((resolve) => {
            router.delete(`/opd/token_consultation/destroy/${id}`, {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => notification.error({ message: "Failed to delete token" }),
            });
        });

    // Render action buttons for each row
    const renderActionButtons = (params) => (
        <>
            <Tooltip title="Add | View Health Records" color="blue">
                <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => openTokenModal("add-another", params.data)}
                >
                    <CiStethoscope />
                </button>
            </Tooltip>
            <Tooltip title="Edit Token" color="orange">
                <button
                    className="btn btn-sm btn-outline-warning me-1"
                    onClick={() => openTokenModal("update", params.data)}
                >
                    <EditOutlined />
                </button>
            </Tooltip>
            <Tooltip title="Print Token" color="default">
                <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() => openTokenModal("update", params.data)}
                >
                    <FcPrint />
                </button>
            </Tooltip>
            <Tooltip title="Add / Edit Invoice" color="blue">
                <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => openTokenModal("update", params.data)}
                >
                    <FaFileInvoiceDollar />
                </button>
            </Tooltip>
            <Tooltip title="View Patient" color="#258F7D">
                <Link
                    className="btn btn-sm btn-outline-info me-1"
                    href={`/patient/view/${params.data.patient_id}`}
                >
                    <EyeOutlined />
                </Link>
            </Tooltip>
            <Tooltip title="Delete Token" color="red">
                <Popconfirm
                    title="Are you sure you want to delete this token?"
                    onConfirm={() => confirmDelToken(params.data.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined />
                </Popconfirm>
            </Tooltip>
        </>
    );

    // Open token modal
    const openTokenModal = (mode, data) => {
        setTokenModalState({
            open: true,
            mode,
            data: {
                token_id: data.id,
                user_id: data.user_id,
                patient_id: data.patient_id,
                status: data.status,
                appointment_date: data.appointment_date,
                comment: data.comment,
            },
        });
    };

    return (
        <>
            {contextHolder}
            <div className="container-fluid">
                <Header
                    doctors={doctors}
                    patients={patients}
                    handleFilterChange={handleFilterChange}
                    setTokenModalState={setTokenModalState}
                />
                <div className="row">
                    <div className="col-12" style={{ height: dynamicHeight, overflow: "hidden" }}>
                        <AgGridReact
                            rowData={filteredData}
                            columnDefs={colDefs}
                            defaultColDef={defaultColDef}
                            theme={gridTheme}
                            pagination
                            paginationAutoPageSize
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

// Header component for filters and add token button
const Header = ({ doctors, patients, handleFilterChange, setTokenModalState }) => (
    <div className="row bodyHeader mt-2 mb-2">
        <div className="col-12 pt-2 pb-2 bg-white d-flex justify-content-between flex-wrap align-items-center border border-bottom-1 border-top-0 border-s-0 border-e-0">
            <Breadcrumb
                items={[
                    { title: <Link href="/">Dashboard</Link> },
                    { title: "Tokens" },
                    {
                        title: (
                            <Select
                                allowClear
                                showSearch
                                placeholder="Select Doctor"
                                onChange={(value) => handleFilterChange("doctor", value)}
                            >
                                {doctors.map((doc) => (
                                    <Option key={doc.id} value={doc.name}>
                                        {doc.name}
                                    </Option>
                                ))}
                            </Select>
                        ),
                    },
                    {
                        title: (
                            <Select
                                allowClear
                                showSearch
                                placeholder="Select Patient"
                                onChange={(value) => handleFilterChange("patient", value)}
                            >
                                {patients.map((pat) => (
                                    <Option key={pat.id} value={pat.name}>
                                        {pat.name}
                                    </Option>
                                ))}
                            </Select>
                        ),
                    },
                ]}
            />
            <button
                className="btn btn-outline-primary btn-sm"
                style={{ borderStyle: "dashed" }}
                onClick={() =>
                    setTokenModalState({
                        open: true,
                        mode: "add",
                        data: null,
                    })
                }
            >
                <PlusCircleOutlined className="me-1" />
                Token
            </button>
        </div>
    </div>
);

export default Index;