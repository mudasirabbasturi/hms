import React, { useState, useEffect } from "react";

import {
    /** Inertia.js - For page navigation and routing */
    router,
    /** Ant Design Components - UI components from Ant Design */
    Modal, Select, Input, DatePicker,
    /** Ant Design Icons - For using Ant Design's pre-built icons */
    CloseOutlined,
    /** Day.js - For date manipulation and formatting */
    dayjs,
    /**React International Phone - For phone number input with international validation */
    PhoneInput,
} from "@shared/Ui";
const { TextArea } = Input;

const AddPatient = ({ open, onCancel, departments }) => {
    const defaultValues = {
        name: '', gender: '', dob: '', email: '', phone: '', cnic: '', departments: '',
        blood_group: '', symptoms: '', visit_purpose: '', patient_father_name: '',
        patient_mother_name: '', patient_address: '', insurance_name: '', insurance_number: '',
        insurance_holder: '', insurance_type: ''
    };
    const [values, setValues] = useState(defaultValues)
    const [loading, setLoading] = useState(false)

    const onChange = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }));
    }

    const onSubmit = () => {
        setLoading(true)
        router.post('/patient/store', values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues)
                onCancel()
            },
            onError: () => setLoading(false),
            onFinish: () => setLoading(false),
        })
    }

    return (
        <>
            <Modal
                title={
                    <div className="d-flex justify-content-between">
                        <span>Add Patient</span>
                        <span>
                            <CloseOutlined onClick={() => {
                                setValues(defaultValues)
                                onCancel()
                            }} />
                        </span>
                    </div>
                }
                open={open}
                onCancel={() => {
                    setValues(defaultValues)
                    onCancel()
                }}
                onOk={onSubmit}
                okText="Add Patient" maskClosable={false} closeIcon={false}
                styles={{
                    body: {
                        padding: "20px 0px"
                    },
                    content: {
                        borderRadius: 0, maxHeight: "80vh",
                        overflowY: "auto", padding: "0 20px"
                    }
                }}
                // width={600}
                centered confirmLoading={loading}
                okButtonProps={{ loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Name:</label>
                            <Input className="w-100" placeholder="Name" allowClear
                                value={values.name}
                                onChange={(e) => onChange("name", e.target.value)}
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
                                onChange={(gender) => onChange("gender", gender ?? null)}
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
                                onChange={(date, dateString) => onChange("dob", dateString)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Email:</label>
                            <Input className="w-100" placeholder="Email" type="email" allowClear
                                value={values.email}
                                onChange={(e) => onChange("email", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Phone:</label>
                            <PhoneInput
                                style={{ zIndex: "1000" }}
                                defaultCountry="usa"
                                value={values.phone}
                                onChange={(value) => onChange("phone", value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Cnic:</label>
                            <Input className="w-100" placeholder="CNIC" allowClear
                                value={values.cnic}
                                onChange={(e) => onChange("cnic", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Department:</label>
                            <Select
                                className="w-100 mb-2"
                                placeholder="Select Department"
                                allowClear showSearch
                                optionFilterProp="label"
                                value={values.departments || null}
                                onChange={(data) => onChange("departments", data ?? null)}
                                options={departments.map((dep) => ({
                                    value: dep.name,
                                    label: dep.name,
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
                                onChange={(data) => onChange("blood_group", data ?? null)}
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
                                onChange={(e) => onChange("symptoms", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="me-1">Purpose Of Visit:</label>
                            <Input className="w-100" placeholder="General Checkup, Consultation" allowClear
                                value={values.visit_purpose}
                                onChange={(e) => onChange("visit_purpose", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Father:</label>
                            <Input className="w-100" placeholder="Patient Father Name" allowClear
                                value={values.patient_father_name}
                                onChange={(e) => onChange("patient_father_name", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Mother:</label>
                            <Input className="w-100" placeholder="Patient Mother Name" allowClear
                                value={values.patient_mother_name}
                                onChange={(e) => onChange("patient_mother_name", e.target.value)}
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
                                onChange={(e) => onChange("patient_address", e.target.value)}
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
                                onChange={(data) => onChange("insurance_name", data ?? null)}
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
                                onChange={(e) => onChange("insurance_number", e.target.value)}
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
                                onChange={(data) => onChange("insurance_holder", data ?? null)}
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
                                onChange={(data) => onChange("insurance_type", data ?? null)}
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
            </Modal>
        </>
    )
}
export default AddPatient