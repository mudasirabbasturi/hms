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

const Index = ({ histories, patients }) => {
    {/**  Dynamic Height Start */ }
    const dynamicHeight = useDynamicHeight();
    {/**  Dynamic Height End */ }

    {/** Render User Data Inside AG-GRID Start */ }
    const [selectedPatientName, setSelectedPatientName] = useState(null);
    const [filteredData, setFilteredData] = useState(histories);

    useEffect(() => {
        if (histories) {
            setFilteredData(histories);
        }
    }, [histories]);

    const handleFilterChange = (PatientName) => {
        setSelectedPatientName(PatientName);
        if (PatientName) {
            const filteredHistories = histories.filter(his => his.patient_name === PatientName);
            setFilteredData(filteredHistories);
        } else {
            setFilteredData(histories);
        }
    };

    const colDefs = useMemo(() => [
        { field: "patient_name", headerName: "Patient" },
        { field: "condition", headerName: "Condition" },
        {
            field: "notes",
            headerName: "Notes",
            editable: true,
            cellEditor: "agLargeTextCellEditor",
            cellEditorPopup: true,
        },
        { field: "diagnosed_at", headerName: "Diagnoses", },
        { field: "resolved_at", headerName: "Resolved At", },
        {
            field: "is_chronic",
            headerName: "Chronic",
            valueGetter: (params) => params.data.is_chronic ? "Chronic" : "Not Chronic",
            width: 150,
        },
        {
            field: "action",
            headerName: "Action",
            filter: false,
            sortable: false,
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Edit / View Medical History`} color="volcano" placement="leftTop">
                        <button
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            style={{ border: "1px dashed rgb(154, 250, 28)" }}
                            onClick={() => (updateHistoryModal(
                                params.data.id,
                                params.data.patient_id,
                                params.data.condition,
                                params.data.notes,
                                params.data.diagnosed_at,
                                params.data.resolved_at,
                                params.data.is_chronic,
                            )
                            )}>
                            <EditOutlined /> / <EyeInvisibleOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title={`Delete Medical History`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete medical history ?`}
                            onConfirm={() => confirmDelHistory(params.data.id)}
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
    const [isAddHistoryShow, setIsAddHistoryShow] = useState(false);

    // user input default value
    const defaultValues = {
        patient_id: '', condition: '', notes: '', diagnosed_at: '', resolved_at: '',
        is_chronic: '',
    }
    const [values, setValues] = useState(defaultValues);

    // add prescription modal
    const addHistoryModal = () => {
        setIsAddHistoryShow(true);
    }

    // cancel and close add patients modal
    const cancelAddHistoryModal = () => {
        setValues(defaultValues);
        setIsAddHistoryShow(false);
    }

    // onChange prescription value input
    const onChangeHistoryVal = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    // submit prescription data 
    const onSubmitHistoryData = () => {
        setLoading(true);
        router.post('/medical-history/store', values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsAddHistoryShow(false);
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
    const [isUpdateHistoryShow, setIsUpdateHistoryShow] = useState(false);
    const updateHistoryModal = (
        id = null,
        patient_id = null,
        condition = null,
        notes = null,
        diagnosed_at = null,
        resolved_at = null,
        is_chronic = null,
    ) => {
        setValues(prev => ({
            ...prev,
            id: id || '',
            patient_id: patient_id || '',
            condition: condition || '',
            notes: notes || '',
            diagnosed_at: diagnosed_at || '',
            resolved_at: resolved_at || '',
            is_chronic: is_chronic || '',
        }));
        setIsUpdateHistoryShow(true);
    }

    // cancel and close update history modal
    const cancelUpdateHistoryModal = () => {
        setValues(defaultValues);
        setIsUpdateHistoryShow(false);
    }

    // update history data 
    const onUpdateHistoryData = () => {
        setLoading(true);
        router.put(`/medical-history/update/${values.id}`, values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsUpdateHistoryShow(false);
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
    const confirmDelHistory = (id) =>
        new Promise((resolve) => {
            router.delete(`/medical-history/destroy/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed to delete medical history");
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
                                    { title: "Medical History" },
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
                                onClick={addHistoryModal}>
                                <PlusCircleOutlined className="me-1" />
                                Medical History
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
            {/** Add Vital Modal Start */}
            <Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Add Medical History</span>
                            <span><CloseOutlined onClick={cancelAddHistoryModal} /></span>
                        </div>
                    </>
                }

                open={isAddHistoryShow}
                onCancel={cancelAddHistoryModal}
                onOk={onSubmitHistoryData}
                okText="Add Medical History"

                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Patient:</label>
                            <Select
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.patient_id || null}
                                onChange={(data) => onChangeHistoryVal("patient_id", data)}
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
                            <label className="me-1">Condition:</label>
                            <Input
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.condition || null}
                                onChange={(e) => onChangeHistoryVal("condition", e.target.value)}
                                placeholder="Condition"
                                allowClear
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Notes:</label>
                            <TextArea
                                rows={2}
                                placeholder="Notes"
                                allowClear
                                value={values.notes}
                                onChange={(e) => onChangeHistoryVal("notes", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1" style={{ width: "20%" }}>Diagnosed At:</label>
                            <DatePicker
                                className="w-100"
                                placeholder="Diagnosed At"
                                allowClear
                                value={values.diagnosed_at ? dayjs(values.diagnosed_at) : null}
                                onChange={(date, dateString) => onChangeHistoryVal("diagnosed_at", dateString)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1" style={{ width: "20%" }}>Resolved At:</label>
                            <DatePicker
                                style={{ width: "100%" }}
                                placeholder="Resolved At"
                                allowClear
                                value={values.resolved_at ? dayjs(values.resolved_at) : null}
                                onChange={(date, dateString) => onChangeHistoryVal("resolved_at", dateString)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Chronic:</label>
                            <Select
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.is_chronic ?? null}
                                onChange={(data) => onChangeHistoryVal("is_chronic", data ?? null)}
                                placeholder="Is Chronic"
                                allowClear
                                options={[
                                    { value: 1, label: "Chronic" },
                                    { value: 0, label: "Not Chronic" },
                                ]}
                                disabled={loading}
                            />
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
                            <span>Update Medical History</span>
                            <span><CloseOutlined onClick={cancelUpdateHistoryModal} /></span>
                        </div>
                    </>
                }
                open={isUpdateHistoryShow}
                onCancel={cancelUpdateHistoryModal}
                onOk={onUpdateHistoryData}
                okText="Update Medical History"
                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Patient:</label>
                            <Select
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.patient_id || null}
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
                            <label className="me-1">Condition:</label>
                            <Input
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.condition || null}
                                onChange={(e) => onChangeHistoryVal("condition", e.target.value)}
                                placeholder="Condition"
                                allowClear
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Notes:</label>
                            <TextArea
                                rows={2}
                                placeholder="Notes"
                                allowClear
                                value={values.notes}
                                onChange={(e) => onChangeHistoryVal("notes", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1" style={{ width: "20%" }}>Diagnosed At:</label>
                            <DatePicker
                                className="w-100"
                                placeholder="Diagnosed At"
                                allowClear
                                value={values.diagnosed_at ? dayjs(values.diagnosed_at) : null}
                                onChange={(date, dateString) => onChangeHistoryVal("diagnosed_at", dateString)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1" style={{ width: "20%" }}>Resolved At:</label>
                            <DatePicker
                                style={{ width: "100%" }}
                                placeholder="Resolved At"
                                allowClear
                                value={values.resolved_at ? dayjs(values.resolved_at) : null}
                                onChange={(date, dateString) => onChangeHistoryVal("resolved_at", dateString)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Chronic:</label>
                            <Select
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.is_chronic ?? null}
                                onChange={(data) => onChangeHistoryVal("is_chronic", data ?? null)}
                                placeholder="Is Chronic"
                                allowClear
                                options={[
                                    { value: 1, label: "Chronic" },
                                    { value: 0, label: "Not Chronic" },
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
export default Index