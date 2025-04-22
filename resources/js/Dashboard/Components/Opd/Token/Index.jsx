import React, { useMemo, useState, useEffect } from "react"
import {
    /** Inertia.js */
    Link, usePage, router,
    /** Ant Design Components */
    notification, Breadcrumb, Select, Tooltip, Popconfirm,
    Input,
    /** Ant Design Icons */
    PlusCircleOutlined, EditOutlined, EyeOutlined, MedicineBoxOutlined,
    FileDoneOutlined, BgColorsOutlined, DollarOutlined, DeleteOutlined,
    MoreOutlined, CloseOutlined,
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
            headerName: 'Status',
            field: "status",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: [
                    'Scheduled',
                    'Confirmed',
                    'Checked In',
                    'Checked Out',
                    'No Show',
                ],
            },
        },
        {
            field: "action",
            headerName: "Action",
            editable: false,
            filter: false,
            sortable: false,
            pinned: 'right',
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Add Another Token`} color="green" placement="leftTop">
                        <PlusCircleOutlined
                            style={{ border: "1px dashed rgb(117, 250, 28)" }}
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            onClick={() =>
                                setTokenModalState({
                                    open: true,
                                    mode: "add-another",
                                    data: {
                                        user_id: params.data.user_id,
                                        patient_id: params.data.patient_id,
                                    },
                                })
                            }
                        />
                    </Tooltip>
                    <Tooltip title={`View Patient`} color="orange" placement="bottomLeft">
                        <Link
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            style={{ border: "1px solid orange" }}
                            href={`/patient/view/${params.data.patient_id}`}>
                            <EyeOutlined />
                        </Link>
                    </Tooltip>
                    <Tooltip title={`Update Token`} color="volcano" placement="leftTop">
                        <EditOutlined
                            style={{ border: "1px dashed #FA541C" }}
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
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
                            }
                        />
                    </Tooltip>
                    <Tooltip title={`Delete Token`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete Token`}
                            onConfirm={() => confirmDelToken(params.data.id)}
                            okText="Yes"
                            cancelText="No">
                            <DeleteOutlined
                                style={{ border: "1px dashed red" }}
                                className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2" />
                        </Popconfirm>
                    </Tooltip>
                    {/* <Tooltip title={`Click To More Action`} color="red" placement="leftTop">
                        <Popover
                            content={
                                <>
                                    <Tooltip title={`View Patient`} color="orange" placement="bottomLeft">
                                        <Link
                                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                            style={{ border: "1px solid orange" }}
                                            href={`/patient/view/${params.data.patient_id}`}>
                                            <EyeOutlined />
                                        </Link>
                                    </Tooltip>
                                    <Tooltip title={`View Medical History`} color="blue" placement="bottomLeft">
                                        <Link
                                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                            style={{ border: "1px solid rgb(5, 82, 182)" }}
                                            href={`/patient/view/${params.data.patient_id}`}>
                                            <MedicineBoxOutlined />
                                        </Link>
                                    </Tooltip>
                                    <Tooltip title={`View Prescription`} color="indigo" placement="bottomLeft">
                                        <Link
                                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                            style={{ border: "1px solid indigo" }}
                                            href={`/patient/view/${params.data.patient_id}`}>
                                            <FileDoneOutlined />
                                        </Link>
                                    </Tooltip>
                                    <Tooltip title={`View Mediation`} color="pink" placement="bottomLeft">
                                        <Link
                                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                            style={{ border: "1px solid pink" }}
                                            href={`/patient/view/${params.data.patient_id}`}>
                                            <BgColorsOutlined />
                                        </Link>
                                    </Tooltip>
                                    <Tooltip title={`View Invoices`} color="#13c2c2" placement="bottomLeft">
                                        <Link
                                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                            style={{ border: "1px solid #13c2c2" }}
                                            href={`/patient/view/${params.data.patient_id}`}>
                                            <DollarOutlined />
                                        </Link>
                                    </Tooltip>
                                </>
                            }
                            title="More Actions"
                            trigger="click"
                            placement="topLeft">
                            <MoreOutlined
                                style={{ border: "1px dashed red" }}
                                className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2" />
                        </Popover>
                    </Tooltip> */}
                </>
            ),
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