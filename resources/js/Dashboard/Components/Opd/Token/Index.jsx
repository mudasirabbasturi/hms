import React, { useMemo, useState, useEffect } from "react"
import {
    /** Inertia.js */
    Link, usePage, router,
    /** Ant Design Components */
    notification, Breadcrumb, Select, Tooltip, Popconfirm,
    Input, Popover,
    /** Ant Design & React Icons */
    PlusCircleOutlined, EditOutlined, EyeOutlined, MedicineBoxOutlined,
    FileDoneOutlined, BgColorsOutlined, DollarOutlined, DeleteOutlined,
    MoreOutlined, MdGeneratingTokens, CiStethoscope, GiMedicines, FaUserDoctor,
    FaFileInvoiceDollar, FcPrint
    /** Day js */

} from "@shared/Ui"

import HandleToken from "@shared/Create/Opd/HandleToken"
import useDynamicHeight from "@shared/DynamicHeight"
import { AgGridReact, gridTheme, defaultColDef } from "@shared/AgGridConfig"

const { Option } = Select
const { TextArea } = Input

const Index = ({ tokens, doctors, patients, departments }) => {
    const [loading, setLoading] = useState(false)
    const dynamicHeight = useDynamicHeight()
    const [tokenModalState, setTokenModalState] = useState({
        open: false,
        mode: "add",
        data: null,
    })
    // AgGrid Token Data 
    const [filteredData, setFilteredData] = useState(tokens)
    useEffect(() => {
        if (tokens) {
            setFilteredData(tokens);
        }
    }, [tokens])

    const colDefs = useMemo(() => [
        {
            field: "action",
            headerName: "Action",
            editable: false,
            filter: false,
            sortable: false,
            pinned: 'right',
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Add | View Health Records`} color="blue" placement="top">
                        <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() =>
                                setTokenModalState({
                                    open: true,
                                    mode: "add-another",
                                    data: {
                                        user_id: params.data.user_id,
                                        patient_id: params.data.patient_id,
                                    },
                                })
                            }>
                            <CiStethoscope />
                        </button>
                    </Tooltip>
                    <Tooltip title={`Add Another Token`} color="blue" placement="top">
                        <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() =>
                                setTokenModalState({
                                    open: true,
                                    mode: "add-another",
                                    data: {
                                        user_id: params.data.user_id,
                                        patient_id: params.data.patient_id,
                                    },
                                })
                            }>
                            <MdGeneratingTokens />
                        </button>
                    </Tooltip>
                    <Tooltip title={`Edit Token`} color="orange" placement="top">
                        <button
                            className="btn btn-sm btn-outline-warning me-1"
                            onClick={() =>
                                setTokenModalState({
                                    open: true,
                                    mode: "update",
                                    data: {
                                        token_id: params.data.id,
                                        user_id: params.data.user_id,
                                        patient_id: params.data.patient_id,
                                        status: params.data.status,
                                        appointment_date: params.data.appointment_date,
                                        comment: params.data.comment,
                                    },
                                })
                            }>
                            <EditOutlined /> <MdGeneratingTokens />
                        </button>
                    </Tooltip>
                    <Tooltip title={`Print Token`} color="default" placement="top">
                        <button
                            className="btn btn-sm btn-outline-secondary me-1"
                            onClick={() =>
                                setTokenModalState({
                                    open: true,
                                    mode: "update",
                                    data: {
                                        token_id: params.data.id,
                                        user_id: params.data.user_id,
                                        patient_id: params.data.patient_id,
                                        status: params.data.status,
                                        appointment_date: params.data.appointment_date,
                                        comment: params.data.comment,
                                    },
                                })
                            }>
                            <FcPrint />
                        </button>
                    </Tooltip>
                    <Tooltip title={`Add / Edit Invoice`} color="blue" placement="top">
                        <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() =>
                                setTokenModalState({
                                    open: true,
                                    mode: "update",
                                    data: {
                                        token_id: params.data.id,
                                        user_id: params.data.user_id,
                                        patient_id: params.data.patient_id,
                                        status: params.data.status,
                                        appointment_date: params.data.appointment_date,
                                        comment: params.data.comment,
                                    },
                                })
                            }>
                            <FaFileInvoiceDollar />
                        </button>
                    </Tooltip>
                    <Tooltip title={`View Patient`} color="#258F7D" placement="top">
                        <Link
                            className="btn btn-sm btn-outline-info me-1"
                            href={`/patient/view/${params.data.patient_id}`}>
                            <EyeOutlined />
                        </Link>
                    </Tooltip>
                    <Tooltip title={`Delete Token`} color="red" placement="top">
                        <Popconfirm title={`Are you sure you want to delete Token`}
                            className="btn btn-sm btn-outline-danger me-1"
                            onConfirm={() => confirmDelToken(params.data.id)}
                            okText="Yes"
                            cancelText="No">
                            <DeleteOutlined />
                        </Popconfirm>
                    </Tooltip>
                </>
            ),
        },
        {
            headerName: "Token#",
            field: "token_number",
        },
        {
            headerName: "Doctors",
            field: "doctor_name",
        },
        {
            headerName: "Patients",
            field: "patient_name",
        },
        {
            headerName: "Comment",
            field: "comment",
        },
        {
            headerName: 'Status',
            field: "status",
            editable: false,
        },
    ], []);

    // Filter Data
    const [selectedDoctorName, setSelectedDoctorName] = useState(null)
    const [selectedPatientName, setSelectedPatientName] = useState(null)
    const handleFilterChange = (type, value) => {
        const updatedDoctorName = type === 'doctor' ? value : selectedDoctorName
        const updatedPatientName = type === 'patient' ? value : selectedPatientName
        setSelectedDoctorName(updatedDoctorName)
        setSelectedPatientName(updatedPatientName)
        // Now filter based on updated values
        const filteredTokens = tokens.filter(token => {
            const doctorMatch = updatedDoctorName ? token.doctor_name === updatedDoctorName : true
            const patientMatch = updatedPatientName ? token.patient_name === updatedPatientName : true
            return doctorMatch && patientMatch
        })
        setFilteredData(filteredTokens)
    }

    // Popconfirm Token Delete
    const confirmDelToken = (id) =>
        new Promise((resolve) => {
            router.delete(`/opd/token_consultation/destroy/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed to delete department");
                },
            });
        });

    // Flash Messages
    const { flash, errors } = usePage().props;
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (flash.message) {
            api.success({
                message: "Success",
                description: flash.message,
                placement: "topRight",
            })
        }
    }, [flash]);

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            Object.entries(errors).forEach(([field, messages]) => {
                const errorText = Array.isArray(messages) ? messages.join(", ") : messages;
                api.error({
                    message: "Validation Error",
                    description: errorText,
                    placement: "topRight",
                })
            })
        }
    }, [errors]);

    {/** Flash Messages End */ }

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
                                    { title: "Tokens" },
                                    {
                                        title: (
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder="Select Doctor"
                                                onChange={(value) => handleFilterChange('doctor', value)}>
                                                {doctors.map((doc) => (
                                                    <Option key={doc.id} value={doc.name}>
                                                        {doc.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )
                                    },
                                    {
                                        title: (
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder="Select Patient"
                                                onChange={(value) => handleFilterChange('patient', value)}>
                                                {patients.map((pat) => (
                                                    <Option key={pat.id} value={pat.name}>
                                                        {pat.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )
                                    }
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
                                        data: null,
                                    })
                                }>
                                <PlusCircleOutlined className="me-1" />
                                Token
                            </button>
                            <HandleToken
                                open={tokenModalState.open}
                                mode={tokenModalState.mode}
                                tokenData={tokenModalState.data}
                                onCancel={() =>
                                    setTokenModalState({ open: false, mode: 'add', data: null })
                                }
                                doctors={doctors}
                                patients={patients}
                                departments={departments}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{ height: dynamicHeight, overflow: "hidden" }}>
                        <AgGridReact
                            rowData={filteredData} columnDefs={colDefs}
                            defaultColDef={defaultColDef}
                            theme={gridTheme} pagination={true}
                            paginationAutoPageSize={true}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default Index;