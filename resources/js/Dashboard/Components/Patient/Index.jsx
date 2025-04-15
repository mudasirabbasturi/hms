import React, { useMemo, useState, useEffect } from "react";

import {
    /** Inertia.js - */
    Link, router, usePage,
    /** Ant Design Components  */
    notification, Breadcrumb, Tooltip, Popconfirm, Modal, Button, Select, Input, DatePicker,
    /** Ant Design Icons - */
    PlusCircleOutlined, EditOutlined, DeleteOutlined,
    CloseOutlined, EyeInvisibleOutlined,
    /** Day.js  */
    dayjs,
    /**React International Phone */
    PhoneInput,
} from "@shared/Ui"

import HandleToken from "@shared/Create/Opd/HandleToken"

import useDynamicHeight from "@shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "@shared/AgGridConfig";

const { TextArea } = Input;
// import 'react-international-phone/style.css';

const Index = ({ patients, departments }) => {
    {/**  Dynamic Height Start */ }
    const dynamicHeight = useDynamicHeight();
    {/**  Dynamic Height End */ }

    {/** Render User Data Inside AG-GRID Start */ }
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        if (patients) {
            setRowData(patients);
        }
    }, [patients]);

    const colDefs = useMemo(() => [
        { field: "patient_id", headerName: "PatientId" },
        { field: "name", headerName: "Name" },
        { field: "gender", headerName: "Gender" },
        { field: "dob", headerName: "DOB" },
        { field: "email", headerName: "Email" },
        { field: "phone", headerName: "Phone" },
        { field: "cnic", headerName: "Cnic" },
        { field: "blood_group", headerName: "Blood Group" },
        { field: "symptoms", headerName: "Symptoms" },
        { field: "visit_purpose", headerName: "Visit Purpose" },
        {
            field: "action",
            headerName: "Action",
            filter: false,
            sortable: false,
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Edit / View Patient`} color="volcano" placement="leftTop">
                        <Link
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            style={{ border: "1px dashed rgb(154, 250, 28)" }}
                            href={`/patient/view/${params.data.id}`}>
                            <EditOutlined /> / <EyeInvisibleOutlined />
                        </Link>
                    </Tooltip>
                    <Tooltip title={`Delete Department`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete "${params.data.name}"?`}
                            onConfirm={() => confirmDelPatient(params.data.id)}
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
    const [isAddPatientShow, setIsAddPatientShow] = useState(false);

    // user input default value
    const defaultValues = {
        name: '', gender: '', dob: '', email: '', phone: '',
        cnic: '', departments: '', blood_group: '', symptoms: '', visit_purpose: '', patient_father_name: '',
        patient_mother_name: '', patient_address: '', insurance_name: '', insurance_number: '',
        insurance_holder: '', insurance_type: ''
    }
    const [values, setValues] = useState(defaultValues);

    // add patient modal
    const addPatientModal = () => {
        setIsAddPatientShow(true);
    }

    // cancel and close add patients modal
    const cancelAddPatientModal = () => {
        setValues(defaultValues);
        setIsAddPatientShow(false);
    }

    // onChange patients value input
    const onChangePatientVal = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    // submit patients data 
    const onSubmitPatientData = () => {
        setLoading(true);
        router.post('/patient/store', values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsAddPatientShow(false);
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
    const confirmDelPatient = (id) =>
        new Promise((resolve) => {
            router.delete(`/patient/destroy/${id}`, {
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
                                    { title: "Patients" },
                                ]}
                            />
                        </div>
                        <div>
                            <Button
                                className="btn btn-outline-primary btn-sm"
                                style={{ borderStyle: "dashed" }}
                                onClick={addPatientModal}>
                                <PlusCircleOutlined className="me-1" />
                                Patient
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div
                        className="col-12"
                        style={{ height: dynamicHeight, overflow: "hidden", }}>
                        <AgGridReact
                            rowData={rowData} columnDefs={colDefs} defaultColDef={defaultColDef}
                            theme={gridTheme} pagination={true} paginationAutoPageSize={true}
                        />
                    </div>
                </div>
            </div>
            {/** Add Patient Modal Start */}
            < Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Add Patient</span>
                            <span><CloseOutlined onClick={cancelAddPatientModal} /></span>
                        </div>
                    </>
                }

                open={isAddPatientShow}
                onCancel={cancelAddPatientModal}
                onOk={onSubmitPatientData}
                okText="Add Patient"

                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Name:</label>
                            <Input className="w-100" placeholder="Name" allowClear
                                value={values.name}
                                onChange={(e) => onChangePatientVal("name", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Gender:</label>
                            <Select
                                className="w-100"
                                placeholder="Select Gender"
                                allowClear
                                value={values.gender || null}
                                onChange={(gender) => onChangePatientVal("gender", gender ?? null)}
                                options={[
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' },
                                ]}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="">Date Of Birth:</label>
                            <DatePicker
                                className="w-100"
                                placeholder="Date Of Birth"
                                allowClear
                                value={values.dob ? dayjs(values.dob) : null}
                                onChange={(date, dateString) => onChangePatientVal("dob", dateString)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Email:</label>
                            <Input className="w-100" placeholder="Email" type="email" allowClear
                                value={values.email}
                                onChange={(e) => onChangePatientVal("email", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Phone:</label>
                            <PhoneInput
                                style={{ zIndex: "1000" }}
                                defaultCountry="usa"
                                value={values.phone}
                                onChange={(value) => onChangePatientVal("phone", value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Cnic:</label>
                            <Input className="w-100" placeholder="CNIC" allowClear
                                value={values.cnic}
                                onChange={(e) => onChangePatientVal("cnic", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Department:</label>
                            <Select
                                style={{ width: "100%" }}
                                className="mb-2"
                                value={values.departments || null}
                                onChange={(data) => onChangePatientVal("departments", data)}
                                placeholder="Select Department"
                                allowClear
                                showSearch
                                options={departments.map((dept) => ({
                                    value: dept.name,
                                    label: dept.name,
                                }))}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="me-1">Blood Group:</label>
                            <Select
                                className="w-100"
                                placeholder="Select Blood Group"
                                allowClear
                                showSearch
                                value={values.blood_group || null}
                                onChange={(data) => onChangePatientVal("blood_group", data ?? null)}
                                options={[
                                    { value: 'A+', label: 'A+' },
                                    { value: 'A-', label: 'A-' },
                                    { value: 'B+', label: 'B+' },
                                    { value: 'B-', label: 'B-' },
                                    { value: 'AB+', label: 'AB+' },
                                    { value: 'AB-', label: 'AB-' },
                                    { value: 'O+', label: 'O+' },
                                    { value: 'O-', label: 'O-' },
                                ]}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="">Symptoms:</label>
                            <TextArea
                                rows={2}
                                placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                                allowClear
                                value={values.symptoms}
                                onChange={(e) => onChangePatientVal("symptoms", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="me-1">Purpose Of Visit:</label>
                            <Input className="w-100" placeholder="General Checkup, Consultation" allowClear
                                value={values.visit_purpose}
                                onChange={(e) => onChangePatientVal("visit_purpose", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Father:</label>
                            <Input className="w-100" placeholder="Patient Father Name" allowClear
                                value={values.patient_father_name}
                                onChange={(e) => onChangePatientVal("patient_father_name", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Mother:</label>
                            <Input className="w-100" placeholder="Patient Mother Name" allowClear
                                value={values.patient_mother_name}
                                onChange={(e) => onChangePatientVal("patient_mother_name", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="me-1">Patient Address:</label>
                            <TextArea
                                rows={2}
                                placeholder="456 Elm Street, Suite 3, Los Angeles, CA 90001, USA"
                                allowClear
                                value={values.patient_address}
                                onChange={(e) => onChangePatientVal("patient_address", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Insurance:</label>
                            <Select
                                className="w-100"
                                placeholder="Select Insurance"
                                allowClear
                                showSearch
                                value={values.insurance_name || null}
                                onChange={(data) => onChangePatientVal("insurance_name", data ?? null)}
                                options={[
                                    { value: 'Medical aid', label: 'Medical aid' },
                                    { value: 'SNGPL', label: 'SNGPL' },
                                    { value: 'UBL Insurer', label: 'UBL Insurer' },
                                    { value: 'Health Connects', label: 'Health Connects' },
                                    { value: 'BYCO', label: 'BYCO' },
                                    { value: 'PIA', label: 'PIA' },
                                    { value: 'CDC', label: 'CDC' },
                                    { value: 'UMT Stuent', label: 'UMT Stuent' },
                                    { value: 'SEHAT INSAF CARD', label: 'SEHAT INSAF CARD' },
                                    { value: 'jubliee', label: 'jubliee' },
                                    { value: 'Sehat Sahulat Card', label: 'Sehat Sahulat Card' },
                                    { value: 'Sehat Card', label: 'Sehat Card' },
                                    { value: 'EFU', label: 'EFU' },
                                    { value: 'Fundings', label: 'Fundings' },
                                    { value: 'Social Security', label: 'Social Security' },
                                ]}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="me-1">Insurance Number:</label>
                            <Input className="w-100" placeholder="Insurance Number" allowClear
                                value={values.insurance_number}
                                onChange={(e) => onChangePatientVal("insurance_number", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="me-1">Insurance Holder:</label>
                            <Select
                                className="w-100"
                                placeholder="Select Insurance Holder"
                                allowClear
                                showSearch
                                value={values.insurance_holder || null}
                                onChange={(data) => onChangePatientVal("insurance_holder", data ?? null)}
                                options={[
                                    { value: 'personal', label: 'Personal' },
                                    { value: 'family', label: 'Family' },
                                    { value: 'employer', label: 'Employer' },
                                    { value: 'government', label: 'Government' },
                                    { value: 'military', label: 'Military' },
                                    { value: 'corporate', label: 'Corporate' },
                                ]}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="me-1">Insurance Type:</label>
                            <Select
                                className="w-100"
                                placeholder="Select Insurance Type"
                                allowClear
                                showSearch
                                value={values.insurance_type || null}
                                onChange={(data) => onChangePatientVal("insurance_type", data ?? null)}
                                options={[
                                    { value: 'personal', label: 'Personal' },
                                    { value: 'family', label: 'Family' },
                                    { value: 'employer', label: 'Employer' },
                                    { value: 'government', label: 'Government' },
                                    { value: 'military', label: 'Military' },
                                    { value: 'corporate', label: 'Corporate' },
                                ]}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            </Modal >
            {/** Add Patient Modal End */}
        </>
    )
}
export default Index