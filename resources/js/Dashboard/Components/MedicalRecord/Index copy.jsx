import React, { useMemo, useState, useEffect } from "react";
import {
    /** Inertia.js - */
    Link, router, usePage,
    /** Ant Design Components  */
    notification, Breadcrumb, Tooltip, Popconfirm, Select,
    Modal, Checkbox, Drawer, Input, Collapse,
    /** Ant Design Icons - */
    PlusCircleOutlined, EditOutlined, DeleteOutlined,
    CloseOutlined,
    /** Day.js  */
    /** React International Phone */
} from "@shared/Ui"

import Editor, {
    BtnBold,
    BtnItalic,
    Toolbar
} from 'react-simple-wysiwyg';

const { TextArea } = Input
const { Panel } = Collapse;


import useDynamicHeight from "@shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "@shared/AgGridConfig";

const Index = ({ medicalRecords, doctors, patients, templates }) => {

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
        { field: "complaint" },
        { field: "examination" },
        { field: "treatment" },
        { field: "prescription" },
        { field: "medical_history" },
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
    const [openDrawer, setOpenDrawer] = useState(false);
    const showDrawer = () => {
        setOpenDrawer(true);
    };
    const onCloseDrawer = () => {
        setOpenDrawer(false);
    };

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
                                    value={values.patient_id || null}
                                    onChange={(data) => onChange("patient_id", data)}
                                    options={patients.map((pat) => ({
                                        value: pat.id,
                                        label: pat.name,
                                    }))}
                                    disabled={loading}
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
                            <div>
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
                                        .map((tpl) => (
                                            <Panel key={tpl.id} header={tpl.name}>
                                                {/* <Checkbox.Group
                                                    options={(Array.isArray(tpl.choices)
                                                        ? tpl.choices
                                                        : JSON.parse(tpl.choices || '[]')
                                                    ).map((choice) => ({
                                                        label: choice,
                                                        value: choice,
                                                    }))}
                                                    value={['Apple', 'Pear', 'Orange'].filter((item) =>
                                                        (values.complaint || "").includes(item)
                                                    )}
                                                    onChange={(checkedValues) => {
                                                        const original = values.complaint || "";
                                                        let cleaned = original;
                                                        ['Apple', 'Pear', 'Orange'].forEach((item) => {
                                                            const regex = new RegExp(`\\b${item}\\b[,\\s]*`, "gi");
                                                            cleaned = cleaned.replace(regex, "");
                                                        });
                                                        const shouldAddComma = cleaned && !cleaned.trim().endsWith(",") ? ", " : " ";
                                                        const finalText = (cleaned + shouldAddComma + checkedValues.join(", ")).trim();

                                                        onChange("complaint", finalText);
                                                    }}
                                                /> */}
                                                <Checkbox.Group
                                                    options={(Array.isArray(tpl.choices)
                                                        ? tpl.choices
                                                        : JSON.parse(tpl.choices || '[]')
                                                    ).map((choice) => ({
                                                        label: choice,
                                                        value: choice,
                                                    }))}
                                                    value={(Array.isArray(tpl.choices)
                                                        ? tpl.choices
                                                        : JSON.parse(tpl.choices || '[]')
                                                    ).filter((item) => (values.complaint || "").includes(item))}
                                                    onChange={(checkedValues) => {
                                                        const choices = Array.isArray(tpl.choices)
                                                            ? tpl.choices
                                                            : JSON.parse(tpl.choices || '[]');

                                                        let cleaned = values.complaint || "";
                                                        choices.forEach((item) => {
                                                            const regex = new RegExp(`\\b${item}\\b[,\\s]*`, "gi");
                                                            cleaned = cleaned.replace(regex, "");
                                                        });

                                                        const separator = cleaned.trim().length > 0 ? ", " : "";
                                                        const finalText = (cleaned + separator + checkedValues.join(", ")).trim();

                                                        onChange("complaint", finalText);
                                                    }}
                                                />
                                            </Panel>
                                        ))}
                                </Collapse>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* <Drawer
                placement="right"
                width={500}
                title="Add From Template"
                onClose={onCloseDrawer}
                open={openDrawer}>
                <span>Select Doctor </span>
                <Select
                    className="w-100"
                    placeholder="Select Doctors"
                    allowClear showSearch
                    value={values.user_id || null}
                    onChange={(data) => onChange("user_id", data)}
                    optionFilterProp="label"
                    options={doctors.map((doc) => ({
                        value: doc.id,
                        label: `${doc.name}`,
                    }))}
                />
                <hr />
                <Checkbox.Group
                    options={[
                        { label: 'Apple', value: 'Apple' },
                        { label: 'Pear', value: 'Pear' },
                        { label: 'Orange', value: 'Orange' },
                    ]}
                    value={['Apple', 'Pear', 'Orange'].filter((item) =>
                        (values.complaint || "").includes(item)
                    )}
                    onChange={(checkedValues) => {
                        const original = values.complaint || "";
                        let cleaned = original;
                        ['Apple', 'Pear', 'Orange'].forEach((item) => {
                            const regex = new RegExp(`\\b${item}\\b[,\\s]*`, "gi");
                            cleaned = cleaned.replace(regex, "");
                        });
                        const shouldAddComma = cleaned && !cleaned.trim().endsWith(",") ? ", " : " ";
                        const finalText = (cleaned + shouldAddComma + checkedValues.join(", ")).trim();

                        onChange("complaint", finalText);
                    }}
                />
            </Drawer> */}
        </>
    );
};

export default Index;