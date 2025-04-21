import React, { useState, useEffect } from "react";
import {
    /** Inertia.js */
    Link, usePage, router,
    /** Ant Design Components */
    notification, Breadcrumb, Card, Avatar, Collapse,
    Input, Checkbox, Tooltip, Modal, Select, DatePicker,
    Popconfirm,
    /** Ant Design Icons */
    PlusCircleOutlined, UserOutlined, MoreOutlined, PlusOutlined,
    EditOutlined, CloseOutlined, DeleteOutlined,
    /** Day js */
    dayjs, PhoneInput

} from "@shared/Ui";

const { Meta } = Card;
const { Panel } = Collapse;
const { TextArea } = Input;

const Show = ({ patient, profile, medicalRecords, doctors, templates, departments, tokens }) => {
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

    const records = medicalRecords.length > 0
        ? medicalRecords.map((item, index) => ({
            key: String(index),
            label: `Medical Records For : ${patient.name} | Created At : ${dayjs(item.created_at).format('DD MMM YYYY, hh:mm A')}`,
            children: (
                <Collapse accordion>
                    {/* Panels... */}
                    <Panel header="Complaint" key="complaint">
                        {/* {item.complaint} */}
                        {item.complaint && item.complaint.trim() !== ''
                            ? item.complaint
                            : "No complaint provided. Click 'Update Medical Record' to add details."}
                    </Panel>
                    <Panel header="Medical History" key="history">
                        {/* {item.medical_history} */}
                        {item.medical_history && item.medical_history.trim() !== ''
                            ? item.medical_history
                            : "No medical history provided. Click 'Update Medical Record' to add details."}
                    </Panel>
                    <Panel header="Examination" key="examination">
                        {/* {item.examination} */}
                        {item.examination && item.examination.trim() !== ''
                            ? item.examination
                            : "No examination provided. Click 'Update Medical Record' to add details."}
                    </Panel>
                    <Panel header="Treatment" key="treatment">
                        {/* {item.treatment} */}
                        {item.treatment && item.treatment.trim() !== ''
                            ? item.treatment
                            : "No treatment provided. Click 'Update Medical Record' to add details."}
                    </Panel>
                    <Panel header="Prescription" key="prescription">
                        {/* {item.prescription} */}
                        {item.prescription && item.prescription.trim() !== ''
                            ? item.prescription
                            : "No prescription provided. Click 'Update Medical Record' to add details."}
                    </Panel>
                    <Panel header="Medication" key="medication">
                        <p>Pending Need Some Advise From Client.</p>
                    </Panel>

                    <div className="d-flex justify-content-end pt-3 pb-3 border border-start-0 border-top-0 border-end-0">
                        {/* Update Button */}
                        <Tooltip title="Update Medical Record" color="volcano" placement="top">
                            <button
                                style={{ border: "1px dashed rgb(252, 165, 4)" }}
                                className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                onClick={() => {
                                    setMode("update");
                                    setValues({ ...item });
                                    setShowModal(true);
                                }}>
                                <EditOutlined />
                            </button>
                        </Tooltip>
                        {/* Add Another Button */}
                        <Tooltip title="Add Another Medical Record" color="volcano" placement="top">
                            <button
                                style={{ border: "1px dashed #FA541C" }}
                                className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                                onClick={() => {
                                    setMode("add");
                                    setValues({
                                        patient_id: item.patient_id,
                                        user_id: item.user_id,
                                    });
                                    setShowModal(true);
                                }}>
                                <PlusOutlined />
                            </button>
                        </Tooltip>
                        {/* Add Another Button */}
                        <Tooltip title={`Delete Medical Record`} color="red" placement="top">
                            <Popconfirm title={`Are you sure you want to delete Record ?`}
                                onConfirm={() => confirmDelMedicalRecord(item.id)}
                                okText="Yes"
                                cancelText="No">
                                <DeleteOutlined
                                    style={{ border: "1px dashed red" }}
                                    className="btn btn-sm  me-1 pt-1 pb-1 ps-2 pe-2" />
                            </Popconfirm>
                        </Tooltip>
                    </div>
                </Collapse>
            ),
        }))
        : [{
            key: "0",
            label: `No Medical Records Found For: ${patient.name}`,
            children: (
                <div className="text-center pt-4 pb-4">
                    <p>No medical records found for this patient.</p>
                    <Tooltip
                        title="Add First Medical Record"
                        color="volcano"
                        placement="top">
                        <button
                            style={{ border: "1px dashed #FA541C" }}
                            className="btn btn-sm pt-1 pb-1 ps-3 pe-3"
                            onClick={() => {
                                setMode("add");
                                setValues({
                                    patient_id: patient.id,
                                    user_id: '',
                                });
                                setShowModal(true);
                            }}>
                            <PlusOutlined /> Add First Record
                        </button>
                    </Tooltip>
                </div>
            ),
        }];


    const defaultProValues = {
        id: patient.id ?? '',
        name: patient.name ?? '',
        gender: patient.gender ?? '',
        dob: patient.dob ?? '',
        email: patient.email ?? '',
        phone: patient.phone ?? '',
        cnic: patient.cnic ?? '',
        departments: patient.departments ?? '',
        blood_group: patient.blood_group ?? '',
        symptoms: patient.symptoms ?? '',
        visit_purpose: patient.visit_purpose ?? '',
        patient_father_name: patient.patient_father_name ?? '',
        patient_mother_name: patient.patient_mother_name ?? '',
        patient_address: patient.patient_address ?? '',
        insurance_name: patient.insurance_name ?? '',
        insurance_number: patient.insurance_number ?? '',
        insurance_holder: patient.insurance_holder ?? '',
        insurance_type: patient.insurance_type ?? ''
    }
    // State for profile form values
    const [profileForm, setProfileForm] = useState(defaultProValues);

    // Modal open/close state
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Open profile modal
    const openProfileModal = () => {
        setIsProfileModalOpen(true);
    };

    // Close profile modal
    const closeProfileModal = () => {
        setIsProfileModalOpen(false);
    };

    // Handle field value change
    const handleProfileInputChange = (field, value) => {
        setProfileForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Submit handler

    const handleProfileSubmit = () => {
        setLoading(true);
        router.put(`/patient/update/${profileForm.id}`, profileForm, {
            preserveScroll: true,
            onSuccess: () => {
                setProfileForm(defaultProValues);
                setIsProfileModalOpen(false);
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
    const confirmDelMedicalRecord = (id) =>
        new Promise((resolve) => {
            router.delete(`/medical-record/destroy/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed to delete department");
                },
            });
        });

    // Token Crud
    const defaultTokenValue = {
        id: null, user_id: '', patient_id: '', status: 'Scheduled',
        appointment_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        appointment_type: 'token', comment: ''
    }
    const [tokenValue, setTokenValue] = useState(defaultTokenValue)
    const [isTokenModalShow, setIsTokenModalShow] = useState(null)
    const openTokenModal = (userId) => {
        setTokenValue((prev) => ({
            ...prev,
            user_id: userId
        }))
        setIsTokenModalShow(true)
    }
    const cancelTokenModal = () => {
        setIsTokenModalShow(false)
    }

    const onChangeToken = (key, value) => {
        setTokenValue(prev => ({
            ...prev,
            [key]: value,
        }));
    }
    const handelSubmitToken = () => {
        setLoading(true);
        const method = mode === 'update' ? 'put' : 'post';
        const url =
            mode === 'update'
                ? `/opd/token/update/${values.token_id}`
                : `/opd/token/store`;

        router[method](url, values, {
            preserveScroll: true,
            onSuccess: () => {
                setTokenValue(defaultTokenValue);
                onCancel();
            },
            onError: () => setLoading(false),
            onFinish: () => setLoading(false),
        });
    }

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
                                style={{ borderStyle: "dashed" }}
                                onClick={() => openTokenModal(patient.id)}>
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
                                                        className="btn btn-sm btn-primary"
                                                        onClick={openProfileModal}>
                                                        Update Profile
                                                    </button>
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
                                <div className="col-md-8">
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
                                <div className="col-md-4">
                                    <Card
                                        styles={{
                                            header: {
                                                backgroundColor: "#eee",
                                                minHeight: "44px",
                                            },
                                        }}
                                        title={
                                            <div className="d-flex justify-content-between">
                                                <div>OPD</div>
                                            </div>
                                        }>
                                        <div>
                                            {tokens && tokens.length > 0 ? (
                                                tokens.map((token) => (
                                                    <div key={token.id}
                                                        className="mb-2">
                                                        <div>
                                                            <span className="me-2">Token No:</span>
                                                            <strong>{token.token_number}</strong>
                                                        </div>

                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => openTokenModal(token.user_id, token)}
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>
                                                    <div>
                                                        No OPD tokens yet. Please Add
                                                    </div>
                                                    <button
                                                        className="btn btn-outline-primary btn-sm"
                                                        style={{ borderStyle: "dashed" }}
                                                        onClick={() => openTokenModal(patient.id)}>
                                                        <PlusCircleOutlined className="me-1" />
                                                        Token
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </Card>

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
            <Modal
                title={
                    <div className="d-flex justify-content-between">
                        <span>Update Profile</span>
                        <span>
                            <CloseOutlined onClick={closeProfileModal} />
                        </span>
                    </div>
                }
                open={isProfileModalOpen}
                onCancel={closeProfileModal}
                onOk={handleProfileSubmit}
                okText="Update Profile"
                maskClosable={false} closeIcon={false}
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
                        <div className="col-12">
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Name:</label>
                                <Input className="w-100" placeholder="Name" allowClear
                                    value={profileForm.name}
                                    onChange={(e) => handleProfileInputChange("name", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Gender:</label>
                                <Select
                                    className="w-100"
                                    placeholder="Select Gender"
                                    allowClear
                                    value={profileForm.gender || null}
                                    onChange={(gender) => handleProfileInputChange("gender", gender ?? null)}
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
                                    value={profileForm.dob ? dayjs(profileForm.dob) : null}
                                    onChange={(date, dateString) => handleProfileInputChange("dob", dateString)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Email:</label>
                                <Input className="w-100" placeholder="Email" type="email" allowClear
                                    value={profileForm.email}
                                    onChange={(e) => handleProfileInputChange("email", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Phone:</label>
                                <PhoneInput
                                    style={{ zIndex: "1000" }}
                                    defaultCountry="usa"
                                    value={profileForm.phone}
                                    onChange={(value) => handleProfileInputChange("phone", value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Cnic:</label>
                                <Input className="w-100" placeholder="CNIC" allowClear
                                    value={profileForm.cnic}
                                    onChange={(e) => handleProfileInputChange("cnic", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Department:</label>
                                <Select
                                    style={{ width: "100%" }}
                                    className="mb-2"
                                    value={profileForm.departments || null}
                                    onChange={(data) => handleProfileInputChange("departments", data)}
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
                                    value={profileForm.blood_group || null}
                                    onChange={(data) => handleProfileInputChange("blood_group", data ?? null)}
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
                                    value={profileForm.symptoms}
                                    onChange={(e) => handleProfileInputChange("symptoms", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="me-1">Purpose Of Visit:</label>
                                <Input className="w-100" placeholder="General Checkup, Consultation" allowClear
                                    value={profileForm.visit_purpose}
                                    onChange={(e) => handleProfileInputChange("visit_purpose", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Father:</label>
                                <Input className="w-100" placeholder="Patient Father Name" allowClear
                                    value={profileForm.patient_father_name}
                                    onChange={(e) => handleProfileInputChange("patient_father_name", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Mother:</label>
                                <Input className="w-100" placeholder="Patient Mother Name" allowClear
                                    value={profileForm.patient_mother_name}
                                    onChange={(e) => handleProfileInputChange("patient_mother_name", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="me-1">Patient Address:</label>
                                <TextArea
                                    rows={2}
                                    placeholder="456 Elm Street, Suite 3, Los Angeles, CA 90001, USA"
                                    allowClear
                                    value={profileForm.patient_address}
                                    onChange={(e) => handleProfileInputChange("patient_address", e.target.value)}
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
                                    value={profileForm.insurance_name || null}
                                    onChange={(data) => handleProfileInputChange("insurance_name", data ?? null)}
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
                                    value={profileForm.insurance_number}
                                    onChange={(e) => handleProfileInputChange("insurance_number", e.target.value)}
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
                                    value={profileForm.insurance_holder || null}
                                    onChange={(data) => handleProfileInputChange("insurance_holder", data ?? null)}
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
                                    value={profileForm.insurance_type || null}
                                    onChange={(data) => handleProfileInputChange("insurance_type", data ?? null)}
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
                </div>
            </Modal>
            <Modal
                title={
                    <div className="d-flex justify-content-between">
                        <span>{mode === 'update' ? 'Update Token' : 'Add Token'}</span>
                        <span>
                            <CloseOutlined onClick={cancelTokenModal} />
                        </span>
                    </div>
                }
                open={isTokenModalShow}
                onCancel={cancelTokenModal}
                onOk={handelSubmitToken}
                okText={mode === 'update' ? 'Update Token' : 'Add Token'}
                maskClosable={false} closeIcon={false}
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
                <div className="row">
                    <div className="d-flex align-items-center mb-3">
                        <label className="me-1">Doctor:</label>
                        <Select
                            className="w-100"
                            placeholder="Select Doctors"
                            allowClear showSearch
                            value={tokenValue.user_id || null}
                            onChange={(data) => onChangeToken("user_id", data)}
                            options={doctors.map((doc) => ({
                                value: doc.id,
                                label: doc.name,
                            }))}
                            disabled={loading}
                        />
                    </div>
                    <div className="d-flex align-items-center mb-3">
                        <label className="me-1">Patient:</label>
                        <Select
                            className="w-100"
                            placeholder="Select Patient"
                            allowClear showSearch
                            optionFilterProp="label"
                            value={tokenValue.patient_id || null}
                            onChange={(data) => onChangeToken("patient_id", data)}
                            // options={patients.map((pat) => ({
                            //     value: pat.id,
                            //     label: pat.name,
                            // }))}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="me-1">Staus (default: Scheduled):</label>
                        <Select
                            className="w-100"
                            placeholder="Select Status"
                            allowClear
                            value={tokenValue.status || null}
                            onChange={(data) => onChangeToken("status", data)}
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
                    <div className="mb-3">
                        <label className="">Comment:</label>
                        <TextArea
                            autoSize={{ minRows: 2 }}
                            placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                            allowClear
                            value={tokenValue.comment}
                            onChange={(e) => onChangeToken("comment", e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="">Appointment Date (Default: Current):</label>
                        <DatePicker
                            className="w-100"
                            placeholder="Appointment Date"
                            allowClear showTime
                            value={tokenValue.appointment_date ? dayjs(tokenValue.appointment_date) : null}
                            onChange={(date, dateString) => onChangeToken("appointment_date", dateString)}
                            disabled={loading}
                        />
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default Show