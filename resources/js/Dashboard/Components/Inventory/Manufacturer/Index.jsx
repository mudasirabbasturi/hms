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


import useDynamicHeight from "@shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "@shared/AgGridConfig";

const { TextArea } = Input;
// import 'react-international-phone/style.css';

const Index = ({ items, categories, manufacturers }) => {
    {/**  Dynamic Height Start */ }
    const dynamicHeight = useDynamicHeight();
    {/**  Dynamic Height End */ }

    {/** Render User Data Inside AG-GRID Start */ }
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        if (items) {
            setRowData(items);
        }
    }, [items]);

    const colDefs = useMemo(() => [
        { field: "name", headerName: "Name" },
        { field: "barcode", headerName: "BarCode" },
        { field: "category_name", headerName: "Category" },
        { field: "manufacturer_name", headerName: "Maufacturer" },
        { field: "unit", headerName: "Unit" },
        { field: "reorder_level", headerName: "Record Level" },
        {
            field: "action",
            headerName: "Action",
            filter: false,
            sortable: false,
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Update`} color="volcano" placement="leftTop">
                        <EditOutlined
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            style={{ border: "1px dashed rgb(154, 250, 28)" }}
                            onClick={() => {
                                setInputValues(
                                    {
                                        id: params.data.id,
                                        name: params.data.name,
                                        barcode: params.data.barcode,
                                        category_id: params.data.category_id,
                                        manufacturer_id: params.data.manufacturer_id,
                                        unit: params.data.unit,
                                        reorder_level: params.data.reorder_level,
                                    }
                                )
                                setMode("update")
                                openModal()
                            }}
                        />
                    </Tooltip>
                    <Tooltip title={`Delete Item`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete "${params.data.name}"?`}
                            onConfirm={() => confirmDelItem(params.data.id)}
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

    {/** Render Item Data Inside AG-GRID End */ }

    /** 
     * Item Crud Start
     */

    const [mode, setMode] = useState("add")
    const [loading, setLoading] = useState(false);
    const defaultValues = {
        id: null,
        name: "",
        barcode: "",
        category_id: null,
        manufacturer_id: null,
        unit: "",
        reorder_level: "",
    }
    const [inputValues, setInputValues] = useState(defaultValues)
    const [isModelShow, setIsModalShow] = useState(null)

    const openModal = () => {
        setIsModalShow(true)
    }

    const closeModal = () => {
        setInputValues(defaultValues)
        setIsModalShow(false)
    }

    const onChangeValues = (key, value) => {
        setInputValues(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const generateBarcode = () => {
        if (!inputValues.barcode) {
            const randomCode = "BC-" + Date.now();
            onChangeValues("barcode", randomCode);
        } else {
            alert("Barcode already exists. Clear it before generating a new one.");
        }
    };

    // Add or Update Item
    const handleSubmit = () => {
        setLoading(true);
        const method = mode === 'update' ? 'put' : 'post';
        const url =
            mode === 'update'
                ? `/item/update/${inputValues.id}`
                : `/item/store`;

        router[method](url, inputValues, {
            preserveScroll: true,
            onSuccess: () => {
                setInputValues(defaultValues);
                setIsModalShow(false);
            },
            onError: () => setLoading(false),
            onFinish: () => setLoading(false),
        });
    }

    // Popconfirm Item Delete
    const confirmDelItem = (id) =>
        new Promise((resolve) => {
            router.delete(`/item/destroy/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed To Delete Item");
                },
            })
        })

    /** 
     * Item Crud End 
     */

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
                                    { title: "Inventory" },
                                    { title: "Items" },
                                ]}
                            />
                        </div>
                        <div>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                style={{ borderStyle: "dashed" }}
                                onClick={() => {
                                    setMode("add")
                                    openModal()
                                }}>
                                <PlusCircleOutlined className="me-1" />
                                Item
                            </button>
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
            {/* Modal Start */}
            <Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>{mode === 'update' ? 'Update Item' : 'Add Item'}</span>
                            <span><CloseOutlined onClick={closeModal} /></span>
                        </div>
                    </>
                }
                open={isModelShow}
                onCancel={closeModal}
                onOk={handleSubmit}
                okText={mode === 'update' ? 'Update Item' : 'Add Item'}
                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex align-items-center mb-3">
                                <label className="me-1">Name:</label>
                                <Input className="w-100" placeholder="Name" allowClear
                                    value={inputValues.name}
                                    onChange={(e) => onChangeValues("name", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label className="me-1">Barcode:</label>
                                <Input className="w-100" placeholder="Barcode" allowClear
                                    value={inputValues.barcode}
                                    onChange={(e) => onChangeValues("barcode", e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary ms-1"
                                    onClick={generateBarcode}
                                    disabled={loading}>
                                    Generate
                                </button>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label className="me-1">Category:</label>
                                <Select
                                    className="w-100"
                                    placeholder="Select Category"
                                    allowClear
                                    value={inputValues.category_id}
                                    onChange={(data) => onChangeValues("category_id", data)}
                                    showSearch
                                    optionFilterProp="label"
                                    options={categories.map(category => ({
                                        value: category.id,
                                        label: category.name
                                    }))}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label className="me-1">Manufacturer:</label>
                                <Select
                                    className="w-100"
                                    placeholder="Select Manufacturer"
                                    allowClear
                                    value={inputValues.manufacturer_id}
                                    onChange={(data) => onChangeValues("manufacturer_id", data)}
                                    showSearch
                                    optionFilterProp="label"
                                    options={manufacturers.map(manuf => ({
                                        value: manuf.id,
                                        label: manuf.name
                                    }))}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label className="me-1">Unit:</label>
                                <Input className="w-100" placeholder="Eg: strip or ml or tablet" allowClear
                                    value={inputValues.unit}
                                    onChange={(e) => onChangeValues("unit", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <label className="me-1 w-25">Reorder Level:</label>
                                <Input className="w-100" placeholder="Eg: 1 or 23 or 35" allowClear
                                    value={inputValues.reorder_level}
                                    onChange={(e) => onChangeValues("reorder_level", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            {/* <div className="mb-2">
                                <label className="">Symptoms:</label>
                                <TextArea
                                    autoSize={{ minRows: 2 }}
                                    placeholder="Fever,Cough,Nausea,Dizziness,Vomiting"
                                    allowClear
                                    value={inputValues.symptoms}
                                    onChange={(e) => onChangeValues("symptoms", e.target.value)}
                                    disabled={loading}
                                />
                            </div> */}
                        </div>
                    </div>
                </div>
            </Modal>
            {/* Modal End */}
        </>
    )
}
export default Index
