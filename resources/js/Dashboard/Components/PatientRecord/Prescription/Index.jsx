import React, { useMemo, useState, useEffect } from "react";

import { Link, router, usePage } from "@inertiajs/react";

import { notification, Breadcrumb, Tooltip, Popconfirm, Modal, Button, Select, Input, DatePicker } from "antd";
const { TextArea } = Input;
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, CloseOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

import dayjs from "dayjs";

import useDynamicHeight from "../../Shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "../../Shared/AgGridConfig";

const Index = ({ prescriptions, doctors, patients }) => {
    {/**  Dynamic Height Start */ }
    const dynamicHeight = useDynamicHeight();
    {/**  Dynamic Height End */ }

    {/** Render User Data Inside AG-GRID Start */ }
    const [selectedDoctorName, setSelectedDoctorName] = useState(null);
    const [selectedPatientName, setSelectedPatientName] = useState(null);
    const [filteredData, setFilteredData] = useState(prescriptions);

    useEffect(() => {
        if (prescriptions) {
            setFilteredData(prescriptions);
        }
    }, [prescriptions]);

    const handleFilterChange = (type, value) => {
        const updatedDoctorName = type === 'doctor' ? value : selectedDoctorName;
        const updatedPatientName = type === 'patient' ? value : selectedPatientName;
        setSelectedDoctorName(updatedDoctorName);
        setSelectedPatientName(updatedPatientName);
        const filteredPrescriptions = prescriptions.filter(pres => {
            const doctorMatch = updatedDoctorName ? pres.doctor_name === updatedDoctorName : true;
            const patientMatch = updatedPatientName ? pres.patient_name === updatedPatientName : true;
            return doctorMatch && patientMatch;
        });
        setFilteredData(filteredPrescriptions);
    };

    const colDefs = useMemo(() => [
        { field: "token_number", headerName: "Token" },
        { field: "patient_name", headerName: "Patient" },
        { field: "doctor_name", headerName: "Doctor" },
        {
            field: "diagnosis",
            headerName: "Diagnoses",
            editable: true,
            cellEditor: "agLargeTextCellEditor",
            cellEditorPopup: true,
        },
        {
            field: "notes",
            headerName: "Notes",
            editable: true,
            cellEditor: "agLargeTextCellEditor",
            cellEditorPopup: true,
        },
        { field: "prescribed_at", headerName: "Prescribed At" },
        {
            field: "action",
            headerName: "Action",
            filter: false,
            sortable: false,
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Edit / View Prescription`} color="volcano" placement="leftTop">
                        <button
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            style={{ border: "1px dashed rgb(154, 250, 28)" }}
                            onClick={() => (updatePrescriptionModal(
                                params.data.id,
                                params.data.doctor_id,
                                params.data.patient_id,
                                params.data.diagnosis,
                                params.data.notes,
                                params.data.prescribed_at,
                            )
                            )}>
                            <EditOutlined /> / <EyeInvisibleOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title={`Delete Prescription`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete prescription ?`}
                            onConfirm={() => confirmDelPrescription(params.data.id)}
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
    const [isAddPrescriptionShow, setIsAddPrescriptionShow] = useState(false);

    // user input default value
    const defaultValues = {
        patient_id: '', doctor_id: '', appointment_id: '', diagnosis: '', notes: '',
        prescribed_at: '',
    }
    const [values, setValues] = useState(defaultValues);

    // add prescription modal
    const addPrescriptionModal = () => {
        setIsAddPrescriptionShow(true);
    }

    // cancel and close add patients modal
    const cancelAddPrescriptionModal = () => {
        setValues(defaultValues);
        setIsAddPrescriptionShow(false);
    }

    // onChange prescription value input
    const onChangePrescriptiontVal = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    // submit prescription data 
    const onSubmitPrescriptionData = () => {
        setLoading(true);
        router.post('/prescription/store', values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsAddPrescriptionShow(false);
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
    const [isUpdatePrescriptionShow, setIsUpdatePrescriptionShow] = useState(false);
    const updatePrescriptionModal = (
        id = null,
        doctor_id = null,
        patient_id = null,
        diagnosis = null,
        notes = null,
        prescribed_at = null,
    ) => {
        setValues(prev => ({
            ...prev,
            id: id || '',
            doctor_id: doctor_id || '',
            patient_id: patient_id || '',
            diagnosis: diagnosis || '',
            notes: notes || '',
            prescribed_at: prescribed_at || '',
        }));
        setIsUpdatePrescriptionShow(true);
    }

    // cancel and close update prescription modal
    const cancelUpdatePrescriptionModal = () => {
        setValues(defaultValues);
        setIsUpdatePrescriptionShow(false);
    }

    // update prescription data 
    const onUpdatePrescriptionData = () => {
        setLoading(true);
        router.put(`/prescription/update/${values.id}`, values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsUpdatePrescriptionShow(false);
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
    const confirmDelPrescription = (id) =>
        new Promise((resolve) => {
            router.delete(`/prescription/destroy/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed to delete department");
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
                            <Button
                                className="btn btn-outline-primary btn-sm"
                                style={{ borderStyle: "dashed" }}
                                onClick={addPrescriptionModal}>
                                <PlusCircleOutlined className="me-1" />
                                Prescription
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div
                        className="col-12"
                        style={{ height: dynamicHeight, overflow: "hidden", }}>
                        <AgGridReact
                            rowData={filteredData} columnDefs={colDefs} defaultColDef={defaultColDef}
                            theme={gridTheme} pagination={true} paginationAutoPageSize={true}
                        />
                    </div>
                </div>
            </div>
            {/** Add Prescription Modal Start */}
            <Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Add Prescriptions</span>
                            <span><CloseOutlined onClick={cancelAddPrescriptionModal} /></span>
                        </div>
                    </>
                }

                open={isAddPrescriptionShow}
                onCancel={cancelAddPrescriptionModal}
                onOk={onSubmitPrescriptionData}
                okText="Add Prescriptions"

                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Doctor:</label>
                            <Select
                                style={{ width: "100%" }}
                                className="mb-2"
                                value={values.doctor_id || null}
                                onChange={(data) => onChangePrescriptiontVal("doctor_id", data)}
                                placeholder="Select Doctor"
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
                                className="mb-2"
                                value={values.patient_id || null}
                                onChange={(data) => onChangePrescriptiontVal("patient_id", data)}
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
                            <label className="me-1">Diagnoses:</label>
                            <TextArea
                                rows={2}
                                placeholder="General illness or diagnosis for patient #50"
                                allowClear
                                value={values.diagnosis}
                                onChange={(e) => onChangePrescriptiontVal("diagnosis", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="me-1">Notes:</label>
                            <TextArea
                                rows={2}
                                placeholder="Prescribed by Dr. Twila O'Keefe"
                                allowClear
                                value={values.notes}
                                onChange={(e) => onChangePrescriptiontVal("notes", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="">Prescribed Date:</label>
                            <DatePicker
                                className="w-100"
                                placeholder="Date Of Prescribtion"
                                allowClear
                                value={values.prescribed_at ? dayjs(values.prescribed_at) : null}
                                onChange={(date, dateString) => onChangePrescriptiontVal("prescribed_at", dateString)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
            {/** Add Prescription Modal End */}

            {/** Update Prescription Modal Start */}
            <Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Update Prescriptions</span>
                            <span><CloseOutlined onClick={cancelUpdatePrescriptionModal} /></span>
                        </div>
                    </>
                }

                open={isUpdatePrescriptionShow}
                onCancel={cancelUpdatePrescriptionModal}
                onOk={onUpdatePrescriptionData}
                okText="Update Prescriptions"

                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Doctor:</label>
                            <Select
                                style={{ width: "100%" }}
                                className="mb-2"
                                value={values.doctor_id || null}
                                onChange={(data) => onChangePrescriptiontVal("doctor_id", data)}
                                placeholder="Select Doctor"
                                allowClear
                                showSearch
                                options={doctors.map((doc) => ({
                                    value: doc.id,
                                    label: doc.name,
                                }))}
                                disabled
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Patient:</label>
                            <Select
                                style={{ width: "100%" }}
                                className="mb-2"
                                value={values.patient_id || null}
                                onChange={(data) => onChangePrescriptiontVal("patient_id", data)}
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
                        <div className="mb-2">
                            <label className="me-1">Diagnoses:</label>
                            <TextArea
                                rows={2}
                                placeholder="General illness or diagnosis for patient #50"
                                allowClear
                                value={values.diagnosis}
                                onChange={(e) => onChangePrescriptiontVal("diagnosis", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="me-1">Notes:</label>
                            <TextArea
                                rows={2}
                                placeholder="Prescribed by Dr. Twila O'Keefe"
                                allowClear
                                value={values.notes}
                                onChange={(e) => onChangePrescriptiontVal("notes", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="">Prescribed Date:</label>
                            <DatePicker
                                className="w-100"
                                placeholder="Date Of Prescribtion"
                                allowClear
                                value={values.prescribed_at ? dayjs(values.prescribed_at) : null}
                                onChange={(date, dateString) => onChangePrescriptiontVal("prescribed_at", dateString)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
            {/** Update Prescription Modal End */}
        </>
    )
}
export default Index