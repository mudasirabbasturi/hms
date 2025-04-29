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

const Index = ({ invoices, patients }) => {
    {/**  Dynamic Height Start */ }
    const dynamicHeight = useDynamicHeight();
    {/**  Dynamic Height End */ }

    {/** Render User Data Inside AG-GRID Start */ }
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        if (invoices) {
            setRowData(invoices);
        }
    }, [invoices]);

    const colDefs = useMemo(() => [
        { field: "invoice_number", headerName: "Invoice#" },
        { field: "patient_name", headerName: "Patient" },
        { field: "invoice_date", headerName: "Invoice Date" },
        { field: "subtotal", headerName: "SubTotal" },
        { field: "discount", headerName: "Discount" },
        { field: "discount_type", headerName: "Disc Type" },
        { field: "tax", headerName: "Tax" },
        { field: "total", headerName: "Total" },
        { field: "status", headerName: "Staus" },
        { field: "payment_method", headerName: "Payment Method" },
        { field: "notes", headerName: "Notes" },
        {
            field: "action",
            headerName: "Action",
            filter: false,
            sortable: false,
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Update Invoice`} color="volcano" placement="leftTop">
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
                    <Tooltip title={`Delete Invoice`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete "${params.data.name}"?`}
                            onConfirm={() => confirmDelInvoice(params.data.id)}
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
        invoice_number: "",
        patient_id: "",
        invoice_date: "",
        subtotal: "",
        discount: "",
        tax: "",
        total: "",
        total_paid: "",
        status: "",
        payment_method: "",
        notes: "",
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
    const confirmDelInvoice = (id) =>
        new Promise((resolve) => {
            router.delete(`/item/destroy/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed To Delete Invoice");
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
                                    { title: "Invoices" },
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
                                Invoice
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
                            <span>{mode === 'update' ? 'Update Invoice' : 'Add Invoice'}</span>
                            <span><CloseOutlined onClick={closeModal} /></span>
                        </div>
                    </>
                }
                open={isModelShow}
                onCancel={closeModal}
                onOk={handleSubmit}
                okText={mode === 'update' ? 'Update Invoice' : 'Add Invoice'}
                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={700} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex align-items-center mb-3">
                                <label className="me-1">Patients:</label>
                                <Select
                                    className="w-25"
                                    placeholder="Select Patients"
                                    allowClear
                                    value={inputValues.patient_id}
                                    onChange={(data) => onChangeValues("patient_id", data)}
                                    showSearch
                                    optionFilterProp="label"
                                    options={patients.map(pat => ({
                                        value: pat.id,
                                        label: pat.name
                                    }))}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-flex align-items-center flex-wrap mb-3">
                                <div className="pe-2 mb-2 w-25">
                                    <label className="">Amount:</label>
                                    <Input placeholder="Amount" allowClear
                                        value={inputValues.name}
                                        onChange={(e) => onChangeValues("name", e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="pe-2 mb-2 w-25">
                                    <label className="">Discount:</label>
                                    <Input placeholder="Discount" allowClear
                                        value={inputValues.name}
                                        onChange={(e) => onChangeValues("name", e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="pe-2 mb-2 w-25">
                                    <label className="">Disc. Type:</label>
                                    <Select
                                        className="w-100"
                                        placeholder="Select Disc. Type"
                                        allowClear
                                        value={inputValues.patient_id}
                                        onChange={(data) => onChangeValues("patient_id", data)}
                                        showSearch
                                        optionFilterProp="label"
                                        options={[
                                            { value: 'value', label: 'Value' },
                                            { value: 'percent', label: '%' },
                                        ]}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="pe-2 mb-2 w-25">
                                    <label className="">Tax:</label>
                                    <Input placeholder="Tax" allowClear
                                        value={inputValues.name}
                                        onChange={(e) => onChangeValues("name", e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="pe-2 mb-2 w-25">
                                    <label className="">Quantity:</label>
                                    <Input placeholder="Quantity" allowClear
                                        value={inputValues.name}
                                        onChange={(e) => onChangeValues("name", e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-end align-items-center mb-2">
                                <span className="me-2"><b>Total Discount:</b></span>
                                <span>
                                    <Input
                                        style={{ borderRadius: "5px" }}
                                        disabled value={1000.00} />
                                </span>
                            </div>
                            <div className="d-flex justify-content-end align-items-center mb-2">
                                <span className="me-2"><b>Grand Total:</b></span>
                                <span>
                                    <Input
                                        style={{ borderRadius: "5px" }}
                                        disabled value={1000.00} />
                                </span>
                            </div>
                            <div className="d-flex justify-content-end align-items-center mb-3">
                                <span className="me-2"><b>Paid:</b></span>
                                <span>
                                    <Input placeholder="Paid" allowClear
                                        value={inputValues.total_paid}
                                        onChange={(e) => onChangeValues("total_paid", e.target.value)}
                                        disabled={loading}
                                    />
                                </span>
                            </div>
                            <div className="d-flex align-items-center flex-wrap mb-3">
                                <div className="pe-2 mb-2 w-25">
                                    {/* <label className="">Invoice Date:</label> */}
                                    <DatePicker
                                        className="w-100"
                                        placeholder="Invoice Date"
                                        allowClear
                                        value={inputValues.invoice_date ? dayjs(inputValues.invoice_date) : null}
                                        onChange={(date, dateString) => onChangeValues("invoice_date", dateString)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="pe-2 mb-2" style={{ width: "30%" }}>
                                    {/* <label className="">Invoice Date:</label> */}
                                    <Select
                                        className="w-100"
                                        placeholder="Select Payment Status"
                                        allowClear
                                        value={inputValues.status}
                                        onChange={(data) => onChangeValues("status", data)}
                                        showSearch
                                        optionFilterProp="label"
                                        options={[
                                            { value: 'unpaid', label: 'Unpaid' },
                                            { value: 'paid', label: 'Paid' },
                                            { value: 'partially paid', label: 'Partially Paid' },
                                            { value: 'cancelled', label: 'Cancelled' },
                                        ]}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="pe-2 mb-2" style={{ width: "40%" }}>
                                    {/* <label className="">Invoice Date:</label> */}
                                    <Select
                                        className="w-100"
                                        placeholder="Select Payment Method"
                                        allowClear
                                        value={inputValues.payment_method}
                                        onChange={(data) => onChangeValues("payment_method", data)}
                                        showSearch
                                        optionFilterProp="label"
                                        options={[
                                            { value: 'cash', label: 'Cash' },
                                            { value: 'check', label: 'Check' },
                                            { value: 'debit/credit card', label: 'Debit/Credit Card' },
                                            { value: 'online payment', label: 'Online Payment' },
                                        ]}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* Modal End */}
        </>
    )
}
export default Index
