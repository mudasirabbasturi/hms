import React, { useMemo, useState, useEffect } from "react";

import { Link, router, usePage } from "@inertiajs/react";

import { notification, Breadcrumb, Tooltip, Popconfirm, Modal, Button, Select, Input, DatePicker, InputNumber } from "antd";
const { TextArea } = Input;
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, CloseOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

import dayjs from "dayjs";

import useDynamicHeight from "../../Shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "../../Shared/AgGridConfig";

const Index = ({ vitals, doctors, patients }) => {
    {/**  Dynamic Height Start */ }
    const dynamicHeight = useDynamicHeight();
    {/**  Dynamic Height End */ }

    {/** Render User Data Inside AG-GRID Start */ }
    const [selectedPatientName, setSelectedPatientName] = useState(null);
    const [filteredData, setFilteredData] = useState(vitals);

    useEffect(() => {
        if (vitals) {
            setFilteredData(vitals);
        }
    }, [vitals]);

    const handleFilterChange = (PatientName) => {
        setSelectedPatientName(PatientName);
        if (PatientName) {
            const filteredVitals = vitals.filter(vital => vital.patient_name === PatientName);
            setFilteredData(filteredVitals);
        } else {
            setFilteredData(vitals);
        }
    };

    const colDefs = useMemo(() => [
        { field: "token_number", headerName: "Token", pinned: 'left', width: 100, maxWidth: 100 },
        { field: "patient_name", headerName: "Patient", pinned: 'left' },
        { field: "pulse", headerName: "Pulse", width: 100, maxWidth: 100 },
        { field: "temperature", headerName: "Temprature", width: 100, maxWidth: 100 },
        { field: "systolic_bp", headerName: "Systolic BP", width: 100, maxWidth: 100 },
        { field: "diastolic_bp", headerName: "Diastolic BP", width: 100, maxWidth: 100 },
        { field: "respiratory_rate", headerName: "Respiratory Rate", width: 150, maxWidth: 150 },
        { field: "blood_sugar", headerName: "Blood Sugar", width: 100, maxWidth: 100 },
        { field: "weight", headerName: "Weight", width: 100, maxWidth: 100 },
        { field: "height", headerName: "Height", width: 100, maxWidth: 100 },
        { field: "bmi", headerName: "BMI", width: 100, maxWidth: 100 },
        { field: "bsa", headerName: "BSA", width: 100, maxWidth: 100 },
        { field: "oxygen_saturation", headerName: "Oxigen Saturation" },
        {
            field: "action",
            headerName: "Action",
            filter: false,
            sortable: false,
            pinned: 'right',
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Edit / View Vitals`} color="volcano" placement="leftTop">
                        <button
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            style={{ border: "1px dashed rgb(154, 250, 28)" }}
                            onClick={() => (updateVitalModal(
                                params.data.id,
                                params.data.token_number,
                                params.data.patient_id,
                                params.data.pulse,
                                params.data.temperature,
                                params.data.systolic_bp,
                                params.data.diastolic_bp,
                                params.data.respiratory_rate,
                                params.data.blood_sugar,
                                params.data.weight,
                                params.data.height,
                                params.data.bmi,
                                params.data.bsa,
                                params.data.oxygen_saturation,
                            )
                            )}>
                            <EditOutlined /> / <EyeInvisibleOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title={`Delete vital`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete vital ?`}
                            onConfirm={() => confirmDelVital(params.data.id)}
                            okText="Yes"
                            cancelText="No">
                            <DeleteOutlined
                                style={{ border: "1px dashed red" }}
                                className="btn btn-sm  me-1 pt-1 pb-1 ps-2 pe-2" />
                        </Popconfirm>
                    </Tooltip>
                </>
            ),
        },
    ], []);

    {/** Render User Data Inside AG-GRID End */ }

    {/**  User CRUD Start */ }

    const [loading, setLoading] = useState(false);
    const [isAddVitalShow, setIsVitalAddShow] = useState(false);

    // user input default value
    const defaultValues = {
        patient_id: '', appointment_id: '', pulse: '', temperature: '', systolic_bp: '',
        diastolic_bp: '', respiratory_rate: '', blood_sugar: '', weight: '', height: '',
        bmi: '', bsa: '', oxygen_saturation: '',
    }
    const [values, setValues] = useState(defaultValues);

    // add prescription modal
    const addVitalModal = () => {
        setIsVitalAddShow(true);
    }

    // cancel and close add patients modal
    const cancelAddVitalModal = () => {
        setValues(defaultValues);
        setIsVitalAddShow(false);
    }

    const onChangeVitalVal = (key, value) => {
        setValues((prev) => ({
            ...prev,
            [key]: value,
            ...(key === "patient_id" ? { appointment_id: null } : {}),
        }));

        if (key === "patient_id") {
            fetchAppointments(value);
        }
    };

    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const fetchAppointments = async (patientId) => {
        if (!patientId) return;
        setLoadingAppointments(true);
        try {
            const res = await axios.get(`/appointments/by-patient/${patientId}`);
            setAppointments(res.data);
        } catch (err) {
            console.error("Error loading appointments", err);
        } finally {
            setLoadingAppointments(false);
        }
    };

    // submit prescription data 
    const onSubmitVitalData = () => {
        setLoading(true);
        router.post('/vital/store', values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsVitalAddShow(false);
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    }

    // update prescription data 
    const [isUpdateVitalShow, setIsUpdateVitalShow] = useState(false);
    const updateVitalModal = (
        id = null,
        token_number = null,
        patient_id = null,
        pulse = null,
        temperature = null,
        systolic_bp = null,
        diastolic_bp = null,
        respiratory_rate = null,
        blood_sugar = null,
        weight = null,
        height = null,
        bmi = null,
        bsa = null,
        oxygen_saturation = null,
    ) => {
        setValues(prev => ({
            ...prev,
            id: id || '',
            token_number: token_number || '',
            patient_id: patient_id || '',
            pulse: pulse || '',
            temperature: temperature || '',
            systolic_bp: systolic_bp || '',
            diastolic_bp: diastolic_bp || '',
            respiratory_rate: respiratory_rate || '',
            blood_sugar: blood_sugar || '',
            weight: weight || '',
            height: height || '',
            bmi: bmi || '',
            bsa: bsa || '',
            oxygen_saturation: oxygen_saturation || '',
        }));
        setIsUpdateVitalShow(true);
    }

    // cancel and close update prescription modal
    const cancelUpdateVitalModal = () => {
        setValues(defaultValues);
        setIsUpdateVitalShow(false);
    }

    // update prescription data 
    const onUpdateVitalData = () => {
        setLoading(true);
        router.put(`/vital/update/${values.id}`, values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsUpdateVitalShow(false);
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    }

    // Popconfirm Patients Delete
    const confirmDelVital = (id) =>
        new Promise((resolve) => {
            router.delete(`/vital/destroy/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed to delete vital");
                },
            });
        });

    {/**  Patients CRUD End */ }

    {/** Flash Messages */ }
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
                                    { title: "Prescriptions" },
                                    {
                                        title: (
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder="Select Patient"
                                                onChange={handleFilterChange}>
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
                            <Button
                                className="btn btn-outline-primary btn-sm"
                                style={{ borderStyle: "dashed" }}
                                onClick={addVitalModal}>
                                <PlusCircleOutlined className="me-1" />
                                Vital
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div
                        className="col-12"
                        style={{ height: dynamicHeight, overflow: "hidden", }}>
                        <AgGridReact
                            rowData={filteredData} columnDefs={colDefs}
                            defaultColDef={{
                                ...defaultColDef,
                                flex: undefined, // or 0 if you want to remove flexible sizing
                            }}
                            theme={gridTheme} pagination={true} paginationAutoPageSize={true}
                        />
                    </div>
                </div>
            </div>
            {/** Add Vital Modal Start */}
            <Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Add Vitals</span>
                            <span><CloseOutlined onClick={cancelAddVitalModal} /></span>
                        </div>
                    </>
                }

                open={isAddVitalShow}
                onCancel={cancelAddVitalModal}
                onOk={onSubmitVitalData}
                okText="Add Vitals"

                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex flex-wrap align-items-center mb-2">
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Patient:</label>
                                <Select
                                    style={{ width: "100%" }}
                                    className="me-1"
                                    value={values.patient_id || null}
                                    onChange={(data) => onChangeVitalVal("patient_id", data)}
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
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Token#:</label>
                                <Select
                                    style={{ width: "100%" }}
                                    className="me-1"
                                    value={values.appointment_id || null}
                                    onChange={(data) => onChangeVitalVal("appointment_id", data)}
                                    placeholder="Select Appointment"
                                    allowClear
                                    showSearch
                                    options={appointments.map((appt) => ({
                                        value: appt.id,
                                        label: `Token #${appt.token_number}`,
                                    }))}
                                    disabled={!values.patient_id || loadingAppointments}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Pulse:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Pulse"
                                    value={values.pulse}
                                    onChange={(value) => onChangeVitalVal("pulse", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Temperature:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Temperature"
                                    value={values.temperature}
                                    onChange={(value) => onChangeVitalVal("temperature", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Systolic Bp:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Systolic Bp"
                                    value={values.systolic_bp}
                                    onChange={(value) => onChangeVitalVal("systolic_bp", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Diastolic Bp:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Diastolic Bp"
                                    value={values.diastolic_bp}
                                    onChange={(value) => onChangeVitalVal("diastolic_bp", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Respiratory Rate:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Respiratory Rate"
                                    value={values.respiratory_rate}
                                    onChange={(value) => onChangeVitalVal("respiratory_rate", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Blood Sugar:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Blood Sugar"
                                    value={values.blood_sugar}
                                    onChange={(value) => onChangeVitalVal("blood_sugar", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Weight:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Weight"
                                    value={values.weight}
                                    onChange={(value) => onChangeVitalVal("weight", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Height:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Height"
                                    value={values.height}
                                    onChange={(value) => onChangeVitalVal("height", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">BMI:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="BMI"
                                    value={values.bmi}
                                    onChange={(value) => onChangeVitalVal("bmi", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">BSA:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="BSA"
                                    value={values.bsa}
                                    onChange={(value) => onChangeVitalVal("bsa", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Oxygen Saturation:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Oxygen Saturation"
                                    value={values.oxygen_saturation}
                                    onChange={(value) => onChangeVitalVal("oxygen_saturation", value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/** Add Vital Modal End */}

            {/** Update Vital Modal Start */}
            <Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Update Vitals</span>
                            <span><CloseOutlined onClick={cancelUpdateVitalModal} /></span>
                        </div>
                    </>
                }

                open={isUpdateVitalShow}
                onCancel={cancelUpdateVitalModal}
                onOk={onUpdateVitalData}
                okText="Update Vitals"

                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex flex-wrap align-items-center mb-2">
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Patient:</label>
                                <Select
                                    style={{ width: "100%" }}
                                    className="me-1"
                                    value={values.patient_id || null}
                                    onChange={(data) => onChangeVitalVal("patient_id", data)}
                                    placeholder="Select Patient"
                                    allowClear
                                    showSearch
                                    options={patients.map((pat) => ({
                                        value: pat.id,
                                        label: pat.name,
                                    }))}
                                    disabled
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Token#:</label>
                                <Select
                                    style={{ width: "100%" }}
                                    className="me-1"
                                    value={values.token_number || null}
                                    onChange={(data) => onChangeVitalVal("appointment_id", data)}
                                    placeholder="Select Appointment"
                                    allowClear
                                    showSearch
                                    options={appointments.map((appt) => ({
                                        value: appt.id,
                                        label: `Token #${appt.token_number}`,
                                    }))}
                                    disabled
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Pulse:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Pulse"
                                    value={values.pulse}
                                    onChange={(value) => onChangeVitalVal("pulse", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Temperature:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Temperature"
                                    value={values.temperature}
                                    onChange={(value) => onChangeVitalVal("temperature", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Systolic Bp:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Systolic Bp"
                                    value={values.systolic_bp}
                                    onChange={(value) => onChangeVitalVal("systolic_bp", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Diastolic Bp:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Diastolic Bp"
                                    value={values.diastolic_bp}
                                    onChange={(value) => onChangeVitalVal("diastolic_bp", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Respiratory Rate:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Respiratory Rate"
                                    value={values.respiratory_rate}
                                    onChange={(value) => onChangeVitalVal("respiratory_rate", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Blood Sugar:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Blood Sugar"
                                    value={values.blood_sugar}
                                    onChange={(value) => onChangeVitalVal("blood_sugar", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Weight:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Weight"
                                    value={values.weight}
                                    onChange={(value) => onChangeVitalVal("weight", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Height:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Height"
                                    value={values.height}
                                    onChange={(value) => onChangeVitalVal("height", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">BMI:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="BMI"
                                    value={values.bmi}
                                    onChange={(value) => onChangeVitalVal("bmi", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">BSA:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="BSA"
                                    value={values.bsa}
                                    onChange={(value) => onChangeVitalVal("bsa", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Oxygen Saturation:</label>
                                <InputNumber
                                    className="me-1"
                                    placeholder="Oxygen Saturation"
                                    value={values.oxygen_saturation}
                                    onChange={(value) => onChangeVitalVal("oxygen_saturation", value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/** Update Vital Modal End */}
        </>
    )
}
export default Index