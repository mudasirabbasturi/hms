import React, { useMemo, useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { notification, Breadcrumb, Tooltip, Popconfirm, Modal, Button, Select, Input } from "antd";
const { TextArea } = Input;
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import useDynamicHeight from "../Shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "../Shared/AgGridConfig";
import axios from "axios";

const Index = ({ departments }) => {

    { /**  Dynamic Height Start*/ }
    const dynamicHeight = useDynamicHeight();
    {/**  Dynamic Height End */ }

    {/** Render Department Data Inside AG-GRID Start */ }

    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        if (departments) {
            setRowData(departments);
        }
    }, [departments]);

    const colDefs = useMemo(() => [
        { field: "id" },
        { field: "name" },
        {
            headerName: "Parent",
            field: "parent_name",
            valueGetter: (params) => params.data.parent_name || "No Parent",
        },
        { field: "description" },
        {
            field: "action",
            headerName: "Action",
            filter: false,
            sortable: false,
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Update Department`} color="volcano" placement="leftTop">
                        <EditOutlined
                            style={{ border: "1px dashed #FA541C" }}
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            onClick={() => { updateDepModal(params.data.id) }}
                        />
                    </Tooltip>
                    <Tooltip title={`Delete Department`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete "${params.data.name}"?`}
                            onConfirm={() => confirmDelDepartment(params.data.id)}
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

    {/** Render Department Data Inside AG-GRID End */ }

    {/**  Department CRUD Start */ }

    const [loading, setLoading] = useState(false);
    const [isAddDepShow, setIsAddDepShow] = useState(false);
    const [isUpdateDepShow, setIsUpdateDepShow] = useState(false);

    // department input default value
    const defaultValues = {
        "parent_id": null,
        "name": "",
        "description": "",
    }

    const [values, setValues] = useState(defaultValues);

    // add department modal
    const addDepModal = () => {
        setIsAddDepShow(true);
    }

    // cancel and close add department modal
    const cancelAddDepModal = () => {
        setIsAddDepShow(false);
    }

    // update department
    const updateDepModal = async (id) => {
        try {
            const response = await axios.get(`/department/${id}`);
            setValues((prevValues) => ({
                ...prevValues,
                ...response.data,
                id: id
            }));
            setIsUpdateDepShow(true);
        } catch (error) {
            console.error("Failed to fetch department:", error);
        }
    };

    const cancelUpdateDepModal = () => {
        setLoading(false);
        setValues(defaultValues);
        setIsUpdateDepShow(false);
    }

    // onChange department value input
    const onChangeDepVal = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }));
    }

    // onSubmit new department record
    const onSubmitDepData = () => {
        setLoading(true);
        router.post('/department/store', values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsAddDepShow(false);
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    }

    // onUpdate department record
    const onUpdateDepData = (id) => {
        setLoading(true);
        router.put(`/department/${id}`, values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsUpdateDepShow(false);
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    }

    // Popconfirm Department Delete
    const confirmDelDepartment = (id) =>
        new Promise((resolve) => {
            router.delete(`/department/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed to delete department");
                },
            });
        });

    {/**  Department CRUD End*/ }

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
                                    { title: "Department" },
                                ]}
                            />
                        </div>
                        <div>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                style={{ borderStyle: "dashed" }}
                                onClick={addDepModal}>
                                <PlusCircleOutlined className="me-1" />
                                Department
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
            {/* Add Department Modal Start */}
            <Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Add Department</span>
                            <span><CloseOutlined onClick={cancelAddDepModal} /></span>
                        </div>
                    </>
                }
                open={isAddDepShow}
                maskClosable={false}
                closeIcon={false}
                styles={{
                    content: {
                        borderRadius: 0,
                        maxHeight: "80vh",
                        overflowY: "auto",
                        padding: "0 20px"
                    },
                }}
                width={600}
                centered
                footer={[
                    <Button
                        onClick={cancelAddDepModal} disabled={loading}>
                        Cancel
                    </Button>,
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={onSubmitDepData}>
                        Add Department
                    </Button>,
                ]}
            >
                <div className="mb-2">
                    <label>Department Name:</label>
                    <Input
                        className="w-100"
                        placeholder="Department Name"
                        allowClear
                        value={values.name}
                        onChange={(e) => onChangeDepVal("name", e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="mb-2">
                    <label>Select Parent</label>
                    <Select
                        className="w-100"
                        placeholder="Select Parent"
                        allowClear
                        value={values.parent_id}
                        onChange={(id) => onChangeDepVal("parent_id", id ?? null)}
                        options={departments.map((dep) => ({
                            value: dep.id,
                            label: dep.name,
                        }))}
                        disabled={loading}
                    />
                </div>
                <div className="mb-2">
                    <label>Description:</label>
                    <TextArea
                        rows={4}
                        placeholder="Department Description"
                        allowClear
                        value={values.description}
                        onChange={(e) => onChangeDepVal("description", e.target.value)}
                        disabled={loading}
                    />
                </div>
            </Modal>
            {/** Add Department Modal End */}

            {/** Update Department Modal Start */}
            <Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Update Department</span>
                            <span><CloseOutlined onClick={cancelUpdateDepModal} /></span>
                        </div>
                    </>
                }
                open={isUpdateDepShow}
                maskClosable={false}
                closeIcon={false}
                styles={{
                    content: {
                        borderRadius: 0,
                        maxHeight: "80vh",
                        overflowY: "auto",
                        padding: "0 20px"
                    },
                }}
                width={600}
                centered
                onCancel={cancelUpdateDepModal}
                onOk={() => onUpdateDepData(values.id)}
                okText="Update Department"
                confirmLoading={loading}
                okButtonProps={{ loading: loading }}
                cancelButtonProps={{ disabled: loading }}>
                <div className="mb-2">
                    <label>Department Name:</label>
                    <Input
                        className="w-100"
                        placeholder="Department Name"
                        allowClear
                        value={values.name}
                        onChange={(e) => onChangeDepVal("name", e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="mb-2">
                    <label>Select Parent</label>
                    <Select
                        className="w-100"
                        placeholder="Select Parent"
                        allowClear
                        value={values.parent_id}
                        onChange={(id) => onChangeDepVal("parent_id", id ?? null)}
                        options={departments.map((dep) => ({
                            value: dep.id,
                            label: dep.name,
                        }))}
                        disabled={loading}
                    />
                </div>
                <div className="mb-2">
                    <label>Description:</label>
                    <TextArea
                        rows={4}
                        placeholder="Department Description"
                        allowClear
                        value={values.description}
                        onChange={(e) => onChangeDepVal("description", e.target.value)}
                        disabled={loading}
                    />
                </div>
            </Modal>
            {/** Update Department Modal End */}
        </>
    );
};

export default Index;