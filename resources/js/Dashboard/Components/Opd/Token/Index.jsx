import React, { useMemo, useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    notification, Breadcrumb, Tooltip,
    Popconfirm, Select, Modal, DatePicker,
    Input, Popover
} from "antd";
const { TextArea } = Input;
import dayjs from "dayjs";
import {
    PlusCircleOutlined, EditOutlined, EyeOutlined,
    DeleteOutlined, CloseOutlined, MedicineBoxOutlined,
    FileDoneOutlined, BgColorsOutlined, MoneyCollectOutlined,
    DollarOutlined, MoreOutlined
} from "@ant-design/icons";
import useDynamicHeight from "../../Shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "../../Shared/AgGridConfig";
import axios from "axios";

const { Option } = Select;

const Index = ({ tokens, doctors, patients }) => {
    { /** Dynamic Height Start*/ }
    const dynamicHeight = useDynamicHeight();
    {/** Dynamic Height End*/ }

    /** Token Crud Start */

    const defaultTokenValues = {
        user_id: '', patient_id: '', status: 'Scheduled',
        appointment_date: '', appointment_type: 'token', comment: ''
    }
    const [loading, setLoading] = useState(false);
    const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false)
    const [tokenValues, setTokenValues] = useState(defaultTokenValues)
    const addToken = (id = null, user_id = null, patient_id = null) => {
        setTokenValues(prev => ({
            ...defaultTokenValues,
            token_id: id || '',
            user_id: user_id || '',
            patient_id: patient_id || '',
        }));
        setIsAddTokenModalOpen(true)
    }

    const onChangeAddTokenVal = (key, value) => {
        setTokenValues(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    const cancelAddTokenModal = () => {
        setTokenValues(defaultTokenValues)
        setIsAddTokenModalOpen(false)
    }

    const onSubmitTokenData = () => {
        setLoading(true);
        router.post('/opd/token/store', tokenValues, {
            preserveScroll: true,
            onSuccess: () => {
                setTokenValues(defaultTokenValues);
                setIsAddTokenModalOpen(false);
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    }

    const [isUpdateTokenModalOpen, setIsUpdateTokenModalOpen] = useState(false)
    const updateToken = (id = null, user_id = null, patient_id = null, status = null, appointment_date = null, comment = null) => {
        setTokenValues(prev => ({
            ...defaultTokenValues,
            token_id: id || '',
            user_id: user_id || '',
            patient_id: patient_id || '',
            status: status || '',
            appointment_date: appointment_date || '',
            comment: comment || '',
        }));
        setIsUpdateTokenModalOpen(true)
    }
    const cancelUpdateTokenModal = () => {
        setIsUpdateTokenModalOpen(false)
    }
    const onSubmitUpdateTokenData = () => {
        setLoading(true);
        router.put(`/opd/token/update/${tokenValues.token_id}`, tokenValues, {
            preserveScroll: true,
            onSuccess: () => {
                setTokenValues(defaultTokenValues);
                setIsUpdateTokenModalOpen(false)
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
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

    /** Token Crud End */

    /** Token Data Ag-Grid Start */
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        if (tokens) {
            setRowData(tokens);
            setFilteredData(tokens);
        }
    }, [tokens]);

    // Define columns for AG-Grid
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
            headerName: 'Appointment Date',
            field: "appointment_date",
            cellEditor: "agDateCellEditor",
        },
        {
            headerName: 'Comment',
            field: "comment",
            editable: true,
            cellEditor: "agLargeTextCellEditor",
            cellEditorPopup: true,
        },
        {
            field: "action",
            headerName: "Action",
            filter: false,
            sortable: false,
            pinned: 'right',
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Add Another Token`} color="green" placement="leftTop">
                        <PlusCircleOutlined
                            style={{ border: "1px dashed rgb(117, 250, 28)" }}
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            onClick={() => addToken(params.data.id, params.data.user_id, params.data.patient_id)}
                        />
                    </Tooltip>
                    <Tooltip title={`Update Token`} color="volcano" placement="leftTop">
                        <EditOutlined
                            style={{ border: "1px dashed #FA541C" }}
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            onClick={() => updateToken(
                                params.data.id,
                                params.data.user_id,
                                params.data.patient_id,
                                params.data.status,
                                params.data.appointment_date,
                                params.data.comment
                            )}
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
                    <Tooltip title={`Click To More Action`} color="red" placement="leftTop">
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
                    </Tooltip>
                </>
            ),
        },
    ], []);

    /** Token Data Ag-Grid End */

    const [selectedDoctorName, setSelectedDoctorName] = useState(null);
    const [selectedPatientName, setSelectedPatientName] = useState(null);
    const [filteredData, setFilteredData] = useState(tokens);


    const handleFilterChange = (type, value) => {
        // Update selected filter values
        const updatedDoctorName = type === 'doctor' ? value : selectedDoctorName;
        const updatedPatientName = type === 'patient' ? value : selectedPatientName;

        setSelectedDoctorName(updatedDoctorName);
        setSelectedPatientName(updatedPatientName);

        // Now filter based on updated values
        const filteredTokens = tokens.filter(token => {
            const doctorMatch = updatedDoctorName ? token.doctor_name === updatedDoctorName : true;
            const patientMatch = updatedPatientName ? token.patient_name === updatedPatientName : true;
            return doctorMatch && patientMatch;
        });

        setFilteredData(filteredTokens);
    };



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
                                                onChange={(value) => handleFilterChange('doctor', value)}
                                            >
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
                                                onChange={(value) => handleFilterChange('patient', value)}
                                            >
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
                                onClick={() => addToken()}>
                                <PlusCircleOutlined className="me-1" />
                                Token
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{ height: dynamicHeight, overflow: "hidden" }}>
                        <AgGridReact
                            rowData={filteredData}
                            columnDefs={colDefs}
                            defaultColDef={defaultColDef}
                            theme={gridTheme}
                            pagination={true}
                            paginationAutoPageSize={true}
                        />
                    </div>
                </div>
            </div>
            {/** add token modal  */}
            <Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Add Token</span>
                            <span><CloseOutlined onClick={cancelAddTokenModal} /></span>
                        </div>
                    </>
                }

                open={isAddTokenModalOpen}
                onCancel={cancelAddTokenModal}
                onOk={onSubmitTokenData}
                okText="Add Token"

                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="d-flex align-items-center mb-2">
                        <label className="me-1">Doctor:</label>
                        <Select
                            style={{ width: "100%" }}
                            value={tokenValues.user_id || null}
                            onChange={(data) => onChangeAddTokenVal("user_id", data)}
                            placeholder="Select Doctors"
                            allowClear
                            showSearch
                            options={doctors.map((doc) => ({
                                value: doc.id,
                                label: doc.name,
                            }))}
                            disabled={loading}
                        />
                    </div>
                    <div className="d-flex align-items-center mb-2">
                        <label className="me-1">Patient:</label>
                        <Select
                            style={{ width: "100%" }}
                            value={tokenValues.patient_id || null}
                            onChange={(data) => onChangeAddTokenVal("patient_id", data)}
                            placeholder="Select Patient"
                            allowClear
                            showSearch
                            options={patients.map((pat) => ({
                                value: pat.id,
                                label: pat.name,
                            }))}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="me-1">Staus (default: Scheduled):</label>
                        <Select
                            className="w-100"
                            placeholder="Select Status"
                            allowClear
                            value={tokenValues.status || null}
                            onChange={(data) => onChangeAddTokenVal("status", data)}
                            options={[
                                { value: 'Scheduled', label: 'Scheduled' },
                                { value: 'Confirmed', label: 'Confirmed' },
                                { value: 'Checked In', label: 'Checked In' },
                                { value: 'Checked Out', label: 'Checked Out' },
                                { value: 'No Show', label: 'No Show' },
                            ]}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="">Appointment Date (Default: Current):</label>
                        <DatePicker
                            className="w-100"
                            placeholder="Appointment Date"
                            allowClear
                            showTime
                            value={tokenValues.appointment_date ? dayjs(tokenValues.appointment_date) : null}
                            onChange={(date, dateString) => onChangeAddTokenVal("appointment_date", dateString)}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="">Comment:</label>
                        <TextArea
                            autoSize={{ minRows: 2 }}
                            placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                            allowClear
                            value={tokenValues.comment}
                            onChange={(e) => onChangeAddTokenVal("comment", e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
            </Modal >
            {/** update token modal */}
            <Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Update Token</span>
                            <span><CloseOutlined onClick={cancelUpdateTokenModal} /></span>
                        </div>
                    </>
                }

                open={isUpdateTokenModalOpen}
                onCancel={cancelUpdateTokenModal}
                onOk={onSubmitUpdateTokenData}
                okText="Update Token"

                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="d-flex align-items-center mb-2">
                        <label className="me-1">Doctor:</label>
                        <Select
                            style={{ width: "100%" }}
                            value={tokenValues.user_id || null}
                            onChange={(data) => onChangeAddTokenVal("user_id", data)}
                            placeholder="Select Doctors"
                            allowClear
                            showSearch
                            options={doctors.map((doc) => ({
                                value: doc.id,
                                label: doc.name,
                            }))}
                            // disabled={loading}
                            disabled
                        />
                    </div>
                    <div className="d-flex align-items-center mb-2">
                        <label className="me-1">Patient:</label>
                        <Select
                            style={{ width: "100%" }}
                            value={tokenValues.patient_id || null}
                            onChange={(data) => onChangeAddTokenVal("patient_id", data)}
                            placeholder="Select Patient"
                            allowClear
                            showSearch
                            options={patients.map((pat) => ({
                                value: pat.id,
                                label: pat.name,
                            }))}
                            // disabled={loading}
                            disabled
                        />
                    </div>
                    <div className="mb-2">
                        <label className="me-1">Staus (default: Scheduled):</label>
                        <Select
                            className="w-100"
                            placeholder="Select Status"
                            allowClear
                            value={tokenValues.status || null}
                            onChange={(data) => onChangeAddTokenVal("status", data)}
                            options={[
                                { value: 'Scheduled', label: 'Scheduled' },
                                { value: 'Confirmed', label: 'Confirmed' },
                                { value: 'Checked In', label: 'Checked In' },
                                { value: 'Checked Out', label: 'Checked Out' },
                                { value: 'No Show', label: 'No Show' },
                            ]}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="">Appointment Date (Default: Current):</label>
                        <DatePicker
                            className="w-100"
                            placeholder="Appointment Date"
                            allowClear
                            showTime
                            value={tokenValues.appointment_date ? dayjs(tokenValues.appointment_date) : null}
                            onChange={(date, dateString) => onChangeAddTokenVal("appointment_date", dateString)}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="">Comment:</label>
                        <TextArea
                            autoSize={{ minRows: 2 }}
                            placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                            allowClear
                            value={tokenValues.comment}
                            onChange={(e) => onChangeAddTokenVal("comment", e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
            </Modal >
        </>
    )
}

export default Index;