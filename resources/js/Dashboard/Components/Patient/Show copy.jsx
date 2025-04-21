import React, { useRef, useState, useEffect } from "react";
import {
    /** Inertia.js */
    Link, usePage, router,
    /** Ant Design Components */
    notification, Breadcrumb, Card, Avatar, Collapse,
    Input, Checkbox, Tooltip, Modal, Select,
    /** Ant Design Icons */
    PlusCircleOutlined, UserOutlined, MoreOutlined, PlusOutlined,
    EditOutlined, CloseOutlined,
    /** Day js */
    dayjs

} from "@shared/Ui";

const { Meta } = Card;
const { Panel } = Collapse;
const { TextArea } = Input;

const Show = ({ patient, profile, medicalRecords, doctors, templates }) => {
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(false);

    const defaultValues = {
        id: null, patient_id: '', user_id: '', complaint: '',
        examination: '', treatment: '', prescription: '',
        medical_history: '',
    };
    const [values, setValues] = useState(defaultValues)
    const [ShowModal, setShowModal] = useState(false);
    const [mode, setMode] = useState("add");

    const [templateTargetFields, setTemplateTargetFields] = useState({});

    const openModal = () => {
        setMode("add");
        setShowModal(true);
    };

    const CancelModal = () => {
        setValues(defaultValues);
        setShowModal(false);
    };

    const onChange = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }));
    }

    const handleSubmit = () => {
        setLoading(true);
        const method = mode === 'update' ? 'put' : 'post';
        const url =
            mode === 'update'
                ? `/medical-record/update/${values.id}`
                : `/medical-record/store`;

        router[method](url, values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setShowModal(false);
            },
            onError: () => setLoading(false),
            onFinish: () => setLoading(false),
        });
    };

    const records = medicalRecords.map((item, index) => ({
        key: String(index),
        label: `Medical Records For : ${patient.name} | Created At : ${dayjs(item.created_at).format('DD MMM YYYY, hh:mm A')}`,
        children: (
            <Collapse accordion>
                {/* Complaint */}
                <Panel header="Complaint" key="complaint">
                    {item.complaint}
                </Panel>
                {/* Medical History */}
                <Panel header="Medical History" key="history">
                    {item.medical_history}
                </Panel>
                {/* Examination */}
                <Panel header="Examination" key="examination">
                    {item.examination}
                </Panel>
                {/* Treatment */}
                <Panel header="Treatment" key="treatment">
                    {item.treatment}
                </Panel>
                {/* Prescription */}
                <Panel header="Prescription" key="prescription">
                    {item.prescription}
                </Panel>
                {/* Medication (Optional - adjust if you have data) */}
                <Panel header="Medication" key="medication">
                    <p>No medication info provided.</p>
                </Panel>
                <div className="d-flex justify-content-end pt-3 pb-3 border border-start-0 border-top-0 border-end-0">
                    <Tooltip
                        title={`Update Medical Record`} color="volcano" placement="top">
                        <button
                            style={{ border: "1px dashed rgb(235, 250, 28)" }}
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            onClick={() => {
                                setMode("update");
                                setValues({
                                    id: item.id,
                                    patient_id: item.patient_id,
                                    user_id: item.user_id,
                                    complaint: item.complaint,
                                    examination: item.examination,
                                    treatment: item.treatment,
                                    prescription: item.prescription,
                                    medical_history: item.medical_history,
                                });
                                setShowModal(true);
                            }}>
                            <EditOutlined /> Update Medical Record
                        </button>
                    </Tooltip>
                    <Tooltip
                        title={`Add Another Medical Record`} color="volcano" placement="top">
                        <button
                            style={{ border: "1px dashed #FA541C" }}
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            onClick={() => {
                                setMode("add");
                                setValues({
                                    id: item.id,
                                    patient_id: item.patient_id,
                                    user_id: item.user_id,
                                });
                                setShowModal(true);
                            }}>
                            <PlusOutlined /> Add Another Record
                        </button>
                    </Tooltip>
                </div>
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
            <Modal
                title={
                    <div className="d-flex justify-content-between">
                        <span>{mode === 'update' ? 'Update Medical Records' : 'Add Medical Records'}</span>
                        <span>
                            <CloseOutlined onClick={CancelModal} />
                        </span>
                    </div>
                }
                open={ShowModal}
                onCancel={CancelModal}
                onOk={handleSubmit}
                okText={mode === 'update' ? 'Update Record' : 'Add Record'}
                maskClosable={false} closeIcon={false}
                width={900}
                styles={{
                    body: {
                        padding: "20px 0px"
                    },
                    content: {
                        borderRadius: 0, maxHeight: "80vh",
                        overflowY: "auto", padding: "0 20px"
                    }
                }}
                centered confirmLoading={loading}
                okButtonProps={{ loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center mb-3">
                                <label className="me-1">Doctor</label>
                                <Select
                                    className="w-100"
                                    placeholder="Select Doctors"
                                    allowClear showSearch
                                    value={values.user_id || null}
                                    onChange={(data) => onChange("user_id", data)}
                                    optionFilterProp="label"
                                    options={doctors.map((doc) => ({
                                        value: doc.id,
                                        label: doc.name,
                                    }))}
                                    disabled={loading || mode === 'update'}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="me-1">Complaint:</label>
                                <TextArea
                                    autoSize={{ minRows: 2 }}
                                    placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                                    allowClear
                                    value={values.complaint || null}
                                    onChange={(e) => onChange("complaint", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="me-1">Medical History:</label>
                                <TextArea
                                    autoSize={{ minRows: 2 }}
                                    placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                                    allowClear
                                    value={values.medical_history || null}
                                    onChange={(e) => onChange("medical_history", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="me-1">Examination:</label>
                                <TextArea
                                    autoSize={{ minRows: 2 }}
                                    placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                                    allowClear
                                    value={values.examination || null}
                                    onChange={(e) => onChange("examination", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="me-1">Treatment:</label>
                                <TextArea
                                    autoSize={{ minRows: 2 }}
                                    placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                                    allowClear
                                    value={values.treatment || null}
                                    onChange={(e) => onChange("treatment", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="me-1">Prescription:</label>
                                <TextArea
                                    autoSize={{ minRows: 2 }}
                                    placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                                    allowClear
                                    value={values.prescription || null}
                                    onChange={(e) => onChange("prescription", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div
                                style={{ position: "sticky", top: "0" }}>
                                <label htmlFor="">Templates by Doctor</label>
                                <Select
                                    className="w-100 mb-3"
                                    placeholder="Select Doctor From Left Side"
                                    value={values.user_id || null}
                                    optionFilterProp="label"
                                    options={doctors.map((doc) => ({
                                        value: doc.id,
                                        label: doc.name,
                                    }))}
                                    disabled
                                />

                                <Collapse accordion>
                                    {values.user_id ? (
                                        templates.filter((tpl) => tpl.user_id === values.user_id).length === 0 ? (
                                            <div className="text-muted text-center pb-2 pt-2">
                                                No templates have been added by this doctor.
                                            </div>
                                        ) : (
                                            templates
                                                .filter((tpl) => tpl.user_id === values.user_id)
                                                .map((tpl) => {
                                                    const parsedChoices = Array.isArray(tpl.choices)
                                                        ? tpl.choices
                                                        : JSON.parse(tpl.choices || '[]');

                                                    const targetField = templateTargetFields?.[tpl.id] || "complaint";

                                                    return (
                                                        <Panel key={tpl.id} header={tpl.name}>
                                                            <div className="mb-2 d-flex align-items-center">
                                                                <label className="me-2">Apply to:</label>
                                                                <Select
                                                                    style={{ width: 200 }}
                                                                    value={targetField}
                                                                    onChange={(val) =>
                                                                        setTemplateTargetFields((prev) => ({
                                                                            ...prev,
                                                                            [tpl.id]: val,
                                                                        }))
                                                                    }
                                                                    options={[
                                                                        { label: "Complaint", value: "complaint" },
                                                                        { label: "Medical History", value: "medical_history" },
                                                                        { label: "Examination", value: "examination" },
                                                                        { label: "Treatment", value: "treatment" },
                                                                        { label: "Prescription", value: "prescription" },
                                                                    ]}
                                                                />
                                                            </div>

                                                            <Checkbox.Group
                                                                options={parsedChoices.map((choice) => ({
                                                                    label: choice,
                                                                    value: choice,
                                                                }))}
                                                                value={parsedChoices.filter((item) =>
                                                                    (values[targetField] || "").split("\n").includes(item)
                                                                )}
                                                                onChange={(checkedValues) => {
                                                                    const oldValue = values[targetField] || "";
                                                                    const oldLines = oldValue
                                                                        .split("\n")
                                                                        .map(line => line.trim())
                                                                        .filter(Boolean);

                                                                    const cleaned = oldLines.filter(
                                                                        line => !parsedChoices.includes(line)
                                                                    );

                                                                    const finalLines = [...cleaned, ...checkedValues];
                                                                    const finalText = finalLines.join("\n");

                                                                    onChange(targetField, finalText);
                                                                }}
                                                            />
                                                        </Panel>
                                                    );
                                                })
                                        )
                                    ) : null}

                                </Collapse>

                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default Show