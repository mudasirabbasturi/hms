import React, { useMemo, useState, useEffect } from "react";
import {
    /** Inertia.js - */
    Link, router, usePage,
    /** Ant Design Components  */
    notification, Breadcrumb, Tooltip, Popconfirm, Select,
    Modal, Checkbox, Input, Collapse,
    /** Ant Design Icons - */
    PlusCircleOutlined, EditOutlined, DeleteOutlined,
    CloseOutlined,
    /** Day.js  */
    /** React International Phone */
} from "@shared/Ui"


const { TextArea } = Input
const { Panel } = Collapse;


import useDynamicHeight from "@shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "@shared/AgGridConfig";

const Index = ({ medicalRecords, doctors, users, patients, templates }) => {

    { /**  Dynamic Height Start*/ }
    const dynamicHeight = useDynamicHeight();
    {/**  Dynamic Height End */ }

    {/** Render Template Data Inside AG-GRID Start */ }
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        if (medicalRecords) {
            setRowData(medicalRecords);
        }
    }, [medicalRecords]);

    const colDefs = useMemo(() => [
        {
            headerName: "Added By",
            field: "user_name",
            valueGetter: (params) => {
                const name = params.data.user_name || "Unknown";
                const type = params.data.user_type ? ` (${params.data.user_type})` : "";
                return name + type;
            },
        },
        {
            headerName: "Patient",
            field: "patient_name",
        },
        {
            field: "complaint",
            cellEditor: "agLargeTextCellEditor",
            cellEditorPopup: true,
        },
        {
            field: "examination",
            cellEditor: "agLargeTextCellEditor",
            cellEditorPopup: true,
        },
        {
            field: "treatment",
            cellEditor: "agLargeTextCellEditor",
            cellEditorPopup: true,
        },
        {
            field: "prescription",
            cellEditor: "agLargeTextCellEditor",
            cellEditorPopup: true,
        },
        {
            field: "medical_history",
            cellEditor: "agLargeTextCellEditor",
            cellEditorPopup: true,
        },
        {
            field: "action",
            headerName: "Action",
            filter: false,
            sortable: false,
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Update Medical Record`} color="volcano" placement="leftTop">
                        <EditOutlined
                            style={{ border: "1px dashed #FA541C" }}
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            onClick={() => {
                                setMode("update");
                                setValues({
                                    id: params.data.id,
                                    patient_id: params.data.patient_id,
                                    user_id: params.data.user_id,
                                    complaint: params.data.complaint,
                                    examination: params.data.examination,
                                    treatment: params.data.treatment,
                                    prescription: params.data.prescription,
                                    medical_history: params.data.medical_history,
                                });
                                setShowModal(true);
                            }}
                        />
                    </Tooltip>

                    <Tooltip title={`Delete Medical Record`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete "${params.data.name}"?`}
                            // onConfirm={() => confirmDelMedicalRecord(params.data.id)}
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
    {/** Render Template Data Inside AG-GRID End */ }

    const defaultValues = {
        patient_id: '', user_id: '', complaint: '',
        examination: '', treatment: '', prescription: '',
        medical_history: '',
    };
    const [values, setValues] = useState(defaultValues)
    const [loading, setLoading] = useState(false)
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
                onCancel();
            },
            onError: () => setLoading(false),
            onFinish: () => setLoading(false),
        });
    };

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
                    <div className="col-12 pt-2 pb-2 bg-white 
                           d-flex justify-content-between flex-wrap 
                           align-items-center border border-bottom-1 
                           border-top-0 border-s-0 border-e-0">
                        <div>
                            <Breadcrumb
                                items={[
                                    { title: <Link href="/">Dashboard</Link> },
                                    { title: "Medical Records" },
                                ]}
                            />
                        </div>
                        <div>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                style={{ borderStyle: "dashed" }}
                                onClick={openModal}>
                                <PlusCircleOutlined className="me-1" />
                                Medical Records
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div
                        className="col-12"
                        style={{
                            height: dynamicHeight,
                            overflow: "hidden",
                        }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                            defaultColDef={defaultColDef}
                            theme={gridTheme}
                            pagination={true}
                            paginationAutoPageSize={true}
                        />
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
                                {/* <Select
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
                                /> */}
                                <Select
                                    className="w-100"
                                    placeholder="Select Doctor or Template"
                                    value={values.user_id || null}
                                    optionFilterProp="label"
                                    onChange={(data) => onChange("user_id", data)}
                                    disabled={loading}
                                    options={users.map((doc) => ({
                                        value: doc.id,
                                        label: doc.name,
                                    }))}
                                />

                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label className="me-1">Patient:</label>
                                <Select
                                    className="w-100"
                                    placeholder="Select Patient"
                                    allowClear showSearch
                                    optionFilterProp="label"
                                    value={values.patient_id || null}
                                    onChange={(data) => onChange("patient_id", data)}
                                    options={patients.map((pat) => ({
                                        value: pat.id,
                                        label: pat.name,
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
                                    {templates
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
                                                                { label: "Examination", value: "examination" },
                                                                { label: "Treatment", value: "treatment" },
                                                                { label: "Prescription", value: "prescription" },
                                                                { label: "Medical History", value: "medical_history" },
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
                                                            const oldLines = oldValue.split("\n").map(line => line.trim()).filter(Boolean);

                                                            // Remove previous values from this template
                                                            const cleaned = oldLines.filter(
                                                                line => !parsedChoices.includes(line)
                                                            );

                                                            // Add newly selected ones
                                                            const finalLines = [...cleaned, ...checkedValues];
                                                            const finalText = finalLines.join("\n");

                                                            onChange(targetField, finalText);
                                                        }}
                                                    />
                                                </Panel>
                                            );
                                        })}
                                </Collapse>

                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Index;