import React, { useRef, useState, useEffect } from "react";
import {
    /** Inertia.js */
    Link, usePage, router,
    /** Ant Design Components */
    notification, Breadcrumb, Card, Avatar, Collapse,
    Input, Drawer, Checkbox,
    /** Ant Design Icons */
    PlusCircleOutlined, UserOutlined, MoreOutlined, PlusOutlined
    /** Day js */

} from "@shared/Ui";

const { Meta } = Card;
const { Panel } = Collapse;

import Editor, {
    BtnBold,
    BtnItalic,
    Toolbar
} from 'react-simple-wysiwyg';

const Show = ({ patient, profile, medicalRecords, templates }) => {
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedTemplates, setSelectedTemplates] = useState({});
    const showDrawer = (fieldKey, recordId) => {
        setOpen(true);
        setKey({ field: fieldKey, recordId });
    };
    const onClose = () => {
        setOpen(false);
        setKey(null);
    };
    const handleChange = (key, value) => {
        setValues(prev => {
            const uniqueLines = [...new Set(value.split('\n'))].join('\n');
            return {
                ...prev,
                [key]: uniqueLines,
            }
        })
    }
    const defaultValues = {
        complaint: "",
        medical_history: "",
        examination: "",
        treatment: "",
        prescription: "",
    }
    const [values, setValues] = useState(defaultValues);
    const updateRecord = (id) => {
        setLoading(true);
        router.put(`/medical-record/update/${id}`, values, {
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
    const records = medicalRecords.map((item, index) => ({
        key: String(index),
        label: `Medical Records For : ${patient.name}`,
        children: (
            <Collapse accordion>
                {/* Complaint */}
                <Panel header="Complaint" key="complaint">
                    <Editor
                        containerProps={{ style: { resize: 'vertical' } }}
                        value={values.complaint || item.complaint}
                        onChange={(e) => handleChange("complaint", e.target.value)}
                        disabled={loading}
                    />
                    <button
                        className="btn btn-sm border mt-2 me-2"
                        onClick={() => showDrawer("complaint", item.id)}
                        disabled={loading}>
                        Add From Templates
                    </button>
                    <button
                        className="btn btn-sm border mt-2"
                        onClick={() => updateRecord(item.id)}
                        disabled={loading}>
                        Save
                    </button>
                </Panel>
                {/* Medical History */}
                <Panel header="Medical History" key="history">
                    <Editor
                        containerProps={{ style: { resize: 'vertical' } }}
                        value={values.medical_history || item.medical_history}
                        onChange={(e) => handleChange("medical_history", e.target.value)}
                        disabled={loading}
                    />
                    <button
                        className="btn btn-sm border mt-2 me-2"
                        onClick={() => showDrawer("medical_history", item.id)}
                        disabled={loading}>
                        Add From Templates
                    </button>
                    <button
                        className="btn btn-sm border mt-2"
                        onClick={() => updateRecord(item.id)}
                        disabled={loading}>
                        Save
                    </button>
                </Panel>
                {/* Examination */}
                <Panel header="Examination" key="examination">
                    <Editor
                        containerProps={{ style: { resize: 'vertical' } }}
                        value={values.examination || item.examination}
                        onChange={(e) => handleChange("examination", e.target.value)}
                        disabled={loading}
                    />
                    <button
                        className="btn btn-sm border mt-2 me-2"
                        onClick={() => showDrawer("examination", item.id)}
                        disabled={loading}>
                        Add From Templates
                    </button>
                    <button
                        className="btn btn-sm border mt-2"
                        onClick={() => updateRecord(item.id)}
                        disabled={loading}>
                        Save
                    </button>
                </Panel>
                {/* Treatment */}
                <Panel header="Treatment" key="treatment">
                    <Editor
                        containerProps={{ style: { resize: 'vertical' } }}
                        value={values.treatment || item.treatment}
                        onChange={(e) => handleChange("treatment", e.target.value)}
                    />
                    <button
                        className="btn btn-sm border mt-2 me-2"
                        onClick={() => showDrawer("treatment", item.id)}
                        disabled={loading}>
                        Add From Templates
                    </button>
                    <button
                        className="btn btn-sm border mt-2"
                        onClick={() => updateRecord(item.id)}
                        disabled={loading}>
                        Save
                    </button>
                </Panel>
                {/* Prescription */}
                <Panel header="Prescription" key="prescription">
                    <Editor
                        containerProps={{ style: { resize: 'vertical' } }}
                        value={values.prescription || item.prescription}
                        onChange={(e) => handleChange("prescription", e.target.value)}
                        disabled={loading}
                    />
                    <button
                        className="btn btn-sm border mt-2 me-2"
                        onClick={() => showDrawer("prescription", item.id)}
                        disabled={loading}>
                        Add From Templates
                    </button>
                    <button
                        className="btn btn-sm border mt-2"
                        onClick={() => updateRecord(item.id)}
                        disabled={loading}>
                        Save
                    </button>
                </Panel>
                {/* Medication (Optional - adjust if you have data) */}
                <Panel header="Medication" key="medication">
                    <p>No medication info provided.</p>
                </Panel>
            </Collapse>
        ),
    }));
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
                                style={{ borderStyle: "dashed" }}>
                                <PlusCircleOutlined className="me-1" />
                                Token
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <Card
                                    styles={{
                                        header: {
                                            backgroundColor: "#eee",
                                            minHeight: "44px"
                                        },
                                    }}
                                    title={
                                        <>
                                            <div className="d-flex justify-content-between">
                                                <div></div>
                                                <div><MoreOutlined /></div>
                                            </div>
                                        </>
                                    }>
                                    <Meta
                                        description={
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div
                                                        style={{ maxWidth: '200px', backgroundColor: "white" }}>
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
                                                <p className="text-center mb-1"><b>ID: </b>{patient.patient_id}</p>
                                                <p className="text-center mb-1"><b>Name: </b>{patient.name}</p>
                                                <p className="text-center mb-1">
                                                    <b>Gender: </b>{patient.gender} | <b>DOB: </b>{patient.dob}
                                                </p>
                                                <p className="text-center mb-1"><b>Email: </b>{patient.email}</p>
                                                <p className="text-center mb-1"><b>Phone: </b>{patient.phone}</p>
                                                <div className="d-flex justify-content-center mt-3">
                                                    <button
                                                        className="btn btn-sm btn-primary">Add Reminder</button>
                                                </div>
                                            </>
                                        }
                                    />

                                </Card>
                            </div>
                            <div className="col-12 mb-3">
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-9">
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <Card
                                                styles={{
                                                    header: {
                                                        backgroundColor: "#eee",
                                                        minHeight: "44px",
                                                    },
                                                }}
                                                title={
                                                    <>
                                                        <div className="d-flex justify-content-between">
                                                            <div>Medical Records</div>
                                                            <div><PlusOutlined /></div>
                                                        </div>
                                                    </>
                                                }>
                                                <div>
                                                    <Collapse
                                                        styles={{
                                                            contentBg: {
                                                                backgroundColor: "red"
                                                            }
                                                        }}
                                                        accordion
                                                        items={records}
                                                    />
                                                </div>
                                            </Card>
                                        </div>
                                        <div className="col-12 mb-3">
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Drawer
                placement="right"
                width={500}
                title="Add From Template"
                onClose={onClose}
                open={open}>
                <span>Add From Template To <strong>{key}</strong></span>
                <hr />
                {templates && templates.length > 0 ? (
                    <Collapse accordion>
                        {templates.map((template, index) => (
                            <Panel header={template.name} key={index}>
                                <Checkbox.Group
                                    options={Array.isArray(template.choices) ? template.choices : JSON.parse(template.choices)}
                                    value={selectedTemplates[template.name] || []}
                                    onChange={(checkedValues) => {
                                        const dbContent = (medicalRecords[0]?.[key] || '').trim();
                                        const previousSelections = selectedTemplates[template.name] || [];
                                        const newItems = checkedValues.filter(item => !previousSelections.includes(item));
                                        const removedItems = previousSelections.filter(item => !checkedValues.includes(item));
                                        setSelectedTemplates(prev => ({
                                            ...prev,
                                            [template.name]: checkedValues
                                        }));
                                        const currentTemplateValues = (values[key] || '')
                                            .replace(dbContent, '')
                                            .replace(/^,?\s*/, '')
                                            .split(',')
                                            .map(val => val.trim())
                                            .filter(val => val);
                                        const updatedTemplateValues = currentTemplateValues.filter(val => !removedItems.includes(val));
                                        updatedTemplateValues.push(...newItems);
                                        const uniqueTemplates = [...new Set(updatedTemplateValues)];
                                        const finalValue = uniqueTemplates.length > 0
                                            ? `${dbContent}, ${uniqueTemplates.join(', ')}`
                                            : dbContent;
                                        handleChange(key, finalValue);
                                    }}
                                />
                            </Panel>
                        ))}
                    </Collapse>
                ) : (
                    <p>No templates available by the doctor.</p>
                )}
            </Drawer>
        </>
    )
}
export default Show