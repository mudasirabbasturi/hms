import React, { useMemo, useState, useEffect } from "react"
import { Link, router, usePage } from "@inertiajs/react"
import {
    Breadcrumb, Card, Tooltip, Button, Modal, Input,
    Select, Checkbox, notification, Avatar, DatePicker
} from 'antd';
const { TextArea } = Input;
import dayjs from "dayjs";

import {
    EditOutlined, SettingOutlined, EllipsisOutlined, PlusCircleOutlined, UserOutlined, EyeOutlined
} from "@ant-design/icons";
const { Meta } = Card;

import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const Show = ({ patient, profile, departments }) => {
    const [imageError, setImageError] = useState(false);
    const { prescriptions } = usePage().props;

    // update single columns on enter
    const defaultValue = {
        name: patient.name || "",
        gender: patient.gender || "",
        dob: patient.dob || "",
        email: patient.email || "",
        phone: patient.phone || "",
        cnic: patient.cnic || "",
        departments: patient.departments || "",
        blood_group: patient.blood_group || "",
        symptoms: patient.symptoms || "",
        visit_purpose: patient.visit_purpose || "",
        patient_father_name: patient.patient_father_name || "",
        patient_mother_name: patient.patient_mother_name || "",
        patient_address: patient.patient_address || "",
        insurance_name: patient.insurance_name || "",
        insurance_number: patient.insurance_number || "",
        insurance_holder: patient.insurance_holder || "",
        insurance_type: patient.insurance_type || ""
    }
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(defaultValue);

    const [original, setOriginal] = useState(defaultValue);

    const inputValueChange = (key, value) => {
        setValue((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    const handleKeyDown = (e, key) => {
        if (e.key === "Enter") {
            setLoading(true);
            router.put(`/patient/upate/column/${patient.id}`, { [key]: value[key] }, {
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        }
    };

    const EditToken = (id) => {
        alert(id)
    }

    {/** Flash Messages */ }
    const { flash, errors } = usePage().props;
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        if (flash.message) {
            api.success({
                message: "Success",
                description: flash.message,
                placement: "topRight",
            });
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
                });
            });
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
                                    { title: <Link href="/patients">Patient</Link> },
                                    { title: patient.name }
                                ]}
                            />
                        </div>
                        <div>
                            <Button
                                className="btn btn-outline-primary btn-sm"
                                style={{ borderStyle: "dashed" }}>
                                <PlusCircleOutlined className="me-1" />
                                Token
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row mt-3 mb-3">
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-12 mb-2">
                                <Card
                                    style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                                    <Meta
                                        description={
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div
                                                        style={{ maxWidth: '150px', backgroundColor: "white" }}>
                                                        {!imageError ? (
                                                            <img
                                                                alt={patient.name}
                                                                src={profile}
                                                                style={{ width: '100%', borderRadius: "50%" }}
                                                                onError={() => setImageError(true)}
                                                            />
                                                        ) : (
                                                            <Avatar size={100} icon={<UserOutlined />} />
                                                        )}
                                                    </div>
                                                </div>
                                                <hr></hr>
                                                <p className="text-center mb-0"><b>Patient ID: </b>{patient.patient_id}</p>
                                                <div className="mb-2">
                                                    <div>
                                                        {value.name !== original.name && (
                                                            <>
                                                                <hr className="mb-1 mt-0"></hr>
                                                                <div
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => inputValueChange("name", original.name)}>
                                                                    <small className="text-info"><b>Previous Name: </b></small>
                                                                    <small className="text-success">{original.name}</small>
                                                                </div>
                                                                <hr className="mb-1 mt-0"></hr>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="d-flex align-items-center ">
                                                        <Input
                                                            style={{ textAlign: "center" }}
                                                            value={value.name}
                                                            allowClear
                                                            onChange={(e) => inputValueChange("name", e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, "name")}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                                <hr></hr>
                                                <div className="d-flex justify-content-center flex-column">
                                                    <div className="mb-2">
                                                        <div>
                                                            {value.gender !== original.gender && (
                                                                <>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => inputValueChange("gender", original.gender)}>
                                                                        <small className="text-info"><b>Previous Gender: </b></small>
                                                                        <small className="text-success">{original.gender}</small>
                                                                    </div>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <label className="me-1">Gender: </label>
                                                            <Select
                                                                className="w-100"
                                                                placeholder="Select Gender"
                                                                value={value.gender}
                                                                allowClear
                                                                onChange={(gender) => inputValueChange("gender", gender ?? null)}
                                                                options={[
                                                                    { value: 'Male', label: 'Male' },
                                                                    { value: 'Female', label: 'Female' },
                                                                    { value: 'Other', label: 'Other' },
                                                                ]}
                                                                onKeyDown={(e) => handleKeyDown(e, "gender")}
                                                                disabled={loading}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-2">
                                                        <div className="">
                                                            {value.phone !== original.phone && (
                                                                <>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => inputValueChange("phone", original.phone)}>
                                                                        <small className="text-info"><b>Previous Phone: </b></small>
                                                                        <small className="text-success">{original.phone}</small>
                                                                    </div>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <label className="me-1">Phone: </label>
                                                            <PhoneInput
                                                                value={value.phone}
                                                                allowClear
                                                                onChange={(value) => inputValueChange("phone", value)}
                                                                inputProps={{
                                                                    onKeyDown: (e) => handleKeyDown(e, "phone")
                                                                }}
                                                                disabled={loading}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-2">
                                                        <div className="">
                                                            {value.dob !== original.dob && (
                                                                <>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => inputValueChange("dob", original.dob)}>
                                                                        <small className="text-info"><b>Previous DOB: </b></small>
                                                                        <small className="text-success">{original.dob}</small>
                                                                    </div>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                </>
                                                            )}
                                                        </div>
                                                        <label className="">Date Of Birth:</label>
                                                        <DatePicker
                                                            className="w-100"
                                                            placeholder="Date Of Birth"
                                                            allowClear
                                                            value={value.dob ? dayjs(value.dob) : null}
                                                            onChange={(date, dateString) => inputValueChange("dob", dateString)}
                                                            onKeyDown={(e) => handleKeyDown(e, "dob")}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <div className="">
                                                            {value.email !== original.email && (
                                                                <>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => inputValueChange("email", original.email)}>
                                                                        <small className="text-info"><b>Previous Email: </b></small>
                                                                        <small className="text-success">{original.email}</small>
                                                                    </div>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <label className="me-1">Email: </label>
                                                            <Input
                                                                type="email"
                                                                value={value.email}
                                                                allowClear
                                                                onChange={(e) => inputValueChange("email", e.target.value)}
                                                                onKeyDown={(e) => handleKeyDown(e, "email")}
                                                                disabled={loading}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-2">
                                                        <div className="">
                                                            {value.cnic !== original.cnic && (
                                                                <>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => inputValueChange("cnic", original.cnic)}>
                                                                        <small className="text-info"><b>Previous CNIC: </b></small>
                                                                        <small className="text-success">{original.cnic}</small>
                                                                    </div>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="d-flex align-items-center mb-2">
                                                            <label className="me-1">CNIC: </label>
                                                            <Input
                                                                value={value.cnic}
                                                                allowClear
                                                                onChange={(e) => inputValueChange("cnic", e.target.value)}
                                                                onKeyDown={(e) => handleKeyDown(e, "cnic")}
                                                                disabled={loading}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-2">
                                                        <div className="">
                                                            {value.departments !== original.departments && (
                                                                <>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => inputValueChange("departments", original.departments)}>
                                                                        <small className="text-info"><b>Previous Department: </b></small>
                                                                        <small className="text-success">{original.departments}</small>
                                                                    </div>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <label className="me-1">Department: </label>
                                                            <Select
                                                                className="w-100"
                                                                placeholder="Select Department"
                                                                showSearch
                                                                allowClear
                                                                options={departments.map((dept) => ({
                                                                    value: dept.name,
                                                                    label: dept.name,
                                                                }))}
                                                                value={value.departments}
                                                                onChange={(data) => inputValueChange("departments", data ?? null)}
                                                                onKeyDown={(e) => handleKeyDown(e, "departments")}
                                                                disabled={loading}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />

                                </Card>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-12 mb-2">
                                <Card
                                    style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                                    <Meta
                                        description={
                                            <>
                                                <div className="d-flex justify-content-center flex-column">
                                                    <div className="mb-2">
                                                        <div className="">
                                                            {value.blood_group !== original.blood_group && (
                                                                <>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => inputValueChange("blood_group", original.blood_group)}>
                                                                        <small className="text-info"><b>Previous Bood Group: </b></small>
                                                                        <small className="text-success">{original.blood_group}</small>
                                                                    </div>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                </>
                                                            )}
                                                        </div>
                                                        <label className="me-1">Blood Group: </label>
                                                        <Select
                                                            className="w-100"
                                                            placeholder="Select Blood Group"
                                                            showSearch
                                                            allowClear
                                                            value={value.blood_group}
                                                            onChange={(data) => inputValueChange("blood_group", data ?? null)}
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
                                                            onKeyDown={(e) => handleKeyDown(e, "blood_group")}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <div className="">
                                                            {value.symptoms !== original.symptoms && (
                                                                <>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => inputValueChange("symptoms", original.symptoms)}>
                                                                        <small className="text-info"><b>Previous Symptoms: </b></small>
                                                                        <small className="text-success">{original.symptoms}</small>
                                                                    </div>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                </>
                                                            )}
                                                        </div>
                                                        <label className="">Symptoms:</label>
                                                        <TextArea
                                                            autoSize={{ minRows: 2 }}
                                                            placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                                                            allowClear
                                                            value={value.symptoms}
                                                            onChange={(e) => inputValueChange("symptoms", e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, "symptoms")}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <div className="">
                                                            {value.visit_purpose !== original.visit_purpose && (
                                                                <>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => inputValueChange("visit_purpose", original.visit_purpose)}>
                                                                        <small className="text-info"><b>Previous Purpose: </b></small>
                                                                        <small className="text-success">{original.visit_purpose}</small>
                                                                    </div>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                </>
                                                            )}
                                                        </div>
                                                        <label className="me-1">Purpose Of Visit: </label>
                                                        <Input
                                                            allowClear
                                                            value={value.visit_purpose}
                                                            onChange={(e) => inputValueChange("visit_purpose", e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, "visit_purpose")}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <div className="">
                                                            {value.patient_father_name !== original.patient_father_name && (
                                                                <>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => inputValueChange("patient_father_name", original.patient_father_name)}>
                                                                        <small className="text-info"><b>Previous Father Name: </b></small>
                                                                        <small className="text-success">{original.patient_father_name}</small>
                                                                    </div>
                                                                    <hr className="mb-1 mt-0"></hr>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <label className="me-1">Father: </label>
                                                            <Input
                                                                value={value.patient_father_name}
                                                                allowClear
                                                                onChange={(e) => inputValueChange("patient_father_name", e.target.value)}
                                                                onKeyDown={(e) => handleKeyDown(e, "patient_father_name")}
                                                                disabled={loading}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <label className="me-1">Mother: </label>
                                                        <Input
                                                            value={value.patient_mother_name}
                                                            onChange={(e) => inputValueChange("patient_mother_name", e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, "patient_mother_name")}
                                                            allowClear
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="">Patient Address:</label>
                                                        <TextArea
                                                            autoSize={{ minRows: 2 }}
                                                            placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                                                            allowClear
                                                            value={value.patient_address}
                                                            onChange={(e) => inputValueChange("patient_address", e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, "patient_address")}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />

                                </Card>
                            </div>
                            <div className="col-12 mb-2">
                                <Card
                                    style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                                    <Meta
                                        description={
                                            <>
                                                <div className="d-flex justify-content-center flex-column">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <label className="me-1">Insurance:</label>
                                                        <Select
                                                            className="w-100"
                                                            placeholder="Select Insurance"
                                                            allowClear
                                                            showSearch
                                                            value={value.insurance_name}
                                                            onChange={(data) => inputValueChange("insurance_name", data ?? null)}
                                                            onKeyDown={(e) => handleKeyDown(e, "insurance_name")}
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
                                                        <label className="me-1">Insurance Number: </label>
                                                        <Input
                                                            value={value.insurance_number}
                                                            onChange={(e) => inputValueChange("insurance_number", e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, "insurance_number")}
                                                            allowClear
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
                                                            value={value.insurance_holder}
                                                            onChange={(data) => inputValueChange("insurance_holder", data ?? null)}
                                                            onKeyDown={(e) => handleKeyDown(e, "insurance_holder")}
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
                                                            value={value.insurance_type}
                                                            onChange={(data) => inputValueChange("insurance_type", data ?? null)}
                                                            onKeyDown={(e) => handleKeyDown(e, "insurance_type")}
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
                                            </>
                                        }
                                    />

                                </Card>
                            </div>
                            <div className="col-12 mb-2">
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-12 mb-2">
                                <Card
                                    title={
                                        <>
                                            <div className="pt-2 pb-2">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <small>Add View Edit - OPD Record</small>
                                                    </div>
                                                    <div>
                                                        <Tooltip title={`Add View Edit - OPD Record`} color="volcano" placement="leftTop">
                                                            <Link
                                                                className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                                                style={{ border: "1px dashed rgb(154, 250, 28)" }}
                                                            // href={`/patient/view/${params.data.id}`}
                                                            >
                                                                <EyeOutlined />
                                                            </Link>
                                                        </Tooltip>
                                                    </div>
                                                </div><hr className="mt-1 mb-1"></hr>
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <small>
                                                            Add View Edit - Medical History
                                                        </small>
                                                    </div>
                                                    <div>
                                                        <Tooltip title={`Add View Edit - Medical History`} color="volcano" placement="leftTop">
                                                            <Link
                                                                className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                                                style={{ border: "1px dashed rgb(154, 250, 28)" }}
                                                            // href={`/patient/view/${params.data.id}`}
                                                            >
                                                                <EyeOutlined />
                                                            </Link>
                                                        </Tooltip>
                                                    </div>
                                                </div><hr className="mt-1 mb-1"></hr>
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <small>
                                                            Add View Edit - Prescriptions
                                                        </small>
                                                    </div>
                                                    <div>
                                                        <Tooltip title={`Add View Edit - Medical History`} color="volcano" placement="leftTop">
                                                            <Link
                                                                className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                                                style={{ border: "1px dashed rgb(154, 250, 28)" }}
                                                            // href={`/patient/view/${params.data.id}`}
                                                            >
                                                                <EyeOutlined />
                                                            </Link>
                                                        </Tooltip>
                                                    </div>
                                                </div><hr className="mt-1 mb-1"></hr>
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <small>
                                                            Add View Edit - Medications
                                                        </small>
                                                    </div>
                                                    <div>
                                                        <Tooltip title={`Add View Edit - Medical History`} color="volcano" placement="leftTop">
                                                            <Link
                                                                className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                                                style={{ border: "1px dashed rgb(154, 250, 28)" }}
                                                            // href={`/patient/view/${params.data.id}`}
                                                            >
                                                                <EyeOutlined />
                                                            </Link>
                                                        </Tooltip>
                                                    </div>
                                                </div><hr className="mt-1 mb-1"></hr>
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <small>Add View Edit - Invoices</small>
                                                    </div>
                                                    <div>
                                                        <Tooltip title={`Add View Edit - Invoices`} color="volcano" placement="leftTop">
                                                            <Link
                                                                className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                                                style={{ border: "1px dashed rgb(154, 250, 28)" }}
                                                            // href={`/patient/view/${params.data.id}`}
                                                            >
                                                                <EyeOutlined />
                                                            </Link>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    variant="borderless">
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Show