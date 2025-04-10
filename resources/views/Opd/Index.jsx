import React, { useState, useEffect } from 'react'
import { Link, usePage, router } from "@inertiajs/react"
import {
    Breadcrumb, Modal, Select, DatePicker,
    TimePicker, Collapse, InputNumber,
    Input, notification, Popconfirm, Button
} from "antd"
import {
    CloseOutlined, DeleteOutlined, PlusCircleOutlined
} from "@ant-design/icons"
import dayjs from 'dayjs'
const { TextArea } = Input

const { RangePicker } = TimePicker
import { AgGridReact } from "ag-grid-react"
import { AllCommunityModule, ModuleRegistry, themeBalham } from "ag-grid-community"

ModuleRegistry.registerModules([AllCommunityModule])

const gridTheme = themeBalham.withParams({
    spacing: 6,
    accentColor: "blue",
    wrapperBorder: false
});

const Index = ({ appointments, doctors, patients, procedure }) => {
    const [rowData, setRowData] = useState([])
    const [columnDefs, setColumnDefs] = useState([])
    useEffect(() => {
        generateGridData()
    }, [appointments, doctors])
    const generateGridData = () => {
        const dynamicColumns = [
            {
                field: "token_id",
                headerName: "Token #",
                width: 70,
                pinned: "left",
                filter: true,
                cellStyle: {
                    borderRight: "1px solid #ddd"
                }
            },
            {
                field: "appointment_date",
                headerName: "Date",
                width: 100,
                pinned: "left",
                filter: true,
            },
            ...doctors.map(doctor => ({
                field: `doctor_${doctor.id}`,
                headerName: `Dr. ${doctor.name}`,
                width: 200,
                maxWidth: 200,
                cellStyle: {
                    borderRight: "1px solid #ddd"
                }
            }))
        ];
        setColumnDefs(dynamicColumns);
        const rows = Array.from({ length: 20 }, (_, i) => {
            let tokenNumber = `#${String(i + 1).padStart(4, "0")}`;
            let row = { token_id: tokenNumber };
            const appointment = appointments.find(appt => appt.token_number === tokenNumber);
            row["id"] = appointment ? appointment.id : "";
            row["appointment_date"] = appointment ? appointment.appointment_date : "";
            doctors.forEach(doctor => {
                const doctorAppointment = appointments.find(
                    appt => appt.token_number === tokenNumber && appt.user_id === doctor.id
                );
                row[`doctor_${doctor.id}`] = doctorAppointment ? doctorAppointment.patient_name : "";
            });
            return row;
        });
        setRowData(rows);
    }
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [selectedToken, setSelectedToken] = useState(null)
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const handleCellClick = (params) => {
        const field = params.colDef.field;
        const tokenNumber = params.data.token_id;
        if (field.startsWith("doctor_")) {
            const doctorId = field.split("_")[1];
            const doctor = doctors.find(d => d.id == doctorId);
            if (doctor) {
                setSelectedDoctor(doctor);
                setSelectedToken(tokenNumber);
                const appointment = appointments.find(
                    appt => appt.token_number === tokenNumber && appt.user_id == doctorId
                );
                if (appointment) {
                    console.log(appointment)
                    setSelectedAppointment(appointment);
                    setIsOpdUpdateTokenModalOpen(true);
                } else {
                    setSelectedAppointment(null);
                    setIsOpdAddTokenModalOpen(true);
                }
            }
        }
    }

    {/** Add token start */ }
    const [isOpdAddTokenModalOpen, setIsOpdAddTokenModalOpen] = useState(false);
    const defaultOpdAddTokenValue = {
        user_id: null, patient_id: null, pulse: null,
        temperature: null, systolic_bp: null, diastolic_bp: null,
        respiratory_rate: null, blood_sugar: null, weight: null,
        height: null, bmi: null, bsa: null, oxygen_saturation: null,
        status: "Scheduled", token_number: null, appointment_date: null,
        start_time: null, end_time: null, appointment_type: "token",
        comment: null
    }
    const [opdAddTokenValue, setOpdAddTokenValue] = useState(defaultOpdAddTokenValue)
    const handleOpdAddTokenModalCancel = () => {
        setOpdAddTokenValue(defaultOpdAddTokenValue)
        setIsOpdAddTokenModalOpen(false)
    }
    const handleOpdTokenChange = (key, value) => {
        setOpdAddTokenValue(prevData => ({
            ...prevData,
            [key]: key === "appointment_date" && value
                ? dayjs(value).format("YYYY-MM-DD")
                : value,
        }));
    }
    const handleOpdAddTokenSubmit = () => {
        const formData = {
            ...opdAddTokenValue,
            user_id: opdAddTokenValue.user_id || selectedDoctor?.id || "N/A",
            token_number: opdAddTokenValue.token_number || selectedToken || "N/A"
        }
        router.post("/opd/add-appointment/", formData, {
            preserveScroll: true,
            onSuccess: () => {
                setOpdAddTokenValue(defaultOpdAddTokenValue)
                setIsOpdAddTokenModalOpen(false)
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    }

    // Add more procedure 
    const addMore = () => {
        //
    }
    {/** Add Token end */ }

    {/** Update Token Start */ }

    const [isOpdUpdateTokenModalOpen, setIsOpdUpdateTokenModalOpen] = useState(false)
    const handleOpdUpdateTokenModalCancel = () => {
        setIsOpdUpdateTokenModalOpen(false)
    }
    {/** Update Token End */ }

    {/** Delete Token Start*/ }
    const confirmDelToken = (id) => {
        new Promise((resolve) => {
            router.delete(`/opd/appointment/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                    setIsOpdUpdateTokenModalOpen(false)
                },
                onError: () => {
                    message.error("Failed to delete department");
                },
            })
        })
    }
    {/** Delete Token End */ }

    {/** Add New Patient  */ }
    const [isAddNewPatientModalOpen, setIsAddNewPatientModalOpen] = useState(false)
    const addNewPatient = () => {
        setIsAddNewPatientModalOpen(true)
    }
    const handleAddNewPatientModalCancel = () => {
        setIsAddNewPatientModalOpen(false)
    }
    {/** Add New Patient End */ }

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
                <div className="row">
                    <div className="col-12 bg-white pt-2 pb-2 d-flex justify-content-between flex-wrap align-items-center">
                        <Breadcrumb
                            items={[
                                { title: <Link href="/">Dashboard</Link> },
                                { title: "Opd" },
                                {
                                    title:
                                        <>
                                            < Select
                                                className="me-1"
                                                placeholder="Select Type"
                                                defaultValue="Token"
                                                optionFilterProp="label"
                                                size="small"
                                                options={
                                                    [
                                                        { value: 'token', label: 'Token' },
                                                        { value: 'consultation', label: 'Consultation' },
                                                    ]
                                                } />
                                            < Select
                                                className=""
                                                placeholder="Select Doctors"
                                                defaultValue="Select Doctors"
                                                optionFilterProp="label"
                                                size="small"
                                                options={
                                                    doctors.map((doctor) => ({
                                                        value: doctor.id,
                                                        label: doctor.name,
                                                    }))
                                                } />
                                        </>
                                }
                            ]}
                        />
                    </div>
                </div>

                <div className="row mb-5 mt-3">
                    <div className="col-12">
                        <div className="ag-theme-balham" style={{ height: 500, width: "100%" }}>
                            <AgGridReact
                                theme={gridTheme}
                                columnDefs={columnDefs}
                                rowData={rowData}
                                defaultColDef={{ resizable: true, sortable: true }}
                                animateRows={true}
                                onCellClicked={handleCellClick}
                            />
                        </div>
                    </div>
                </div>

                {/* Modal for adding token start */}
                <Modal
                    title={
                        <>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <div>
                                        Add Token Data:
                                    </div>
                                    <hr className='mb-1 mt-0' />
                                    <span
                                        style={{ fontWeight: "100" }}>
                                        Doctor:<span> </span>
                                    </span>
                                    <span style={{
                                        display: "inline-block",
                                        color: "blue",
                                        textDecoration: "underline"
                                    }}>
                                        {selectedDoctor?.name || "N/A"}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="me-3">
                                        <span style={{
                                            fontWeight: "normal"
                                        }}>
                                            Token#: {selectedToken || "N/A"}
                                        </span>
                                    </div>

                                    <div>
                                        <CloseOutlined
                                            onClick={handleOpdAddTokenModalCancel} />
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    open={isOpdAddTokenModalOpen}
                    onCancel={handleOpdAddTokenModalCancel}
                    maskClosable={false}
                    okText="Add Token"
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
                    closeIcon={false}
                    onOk={handleOpdAddTokenSubmit}>
                    <>
                        <div className='d-flex align-items-center justify-content-between mb-1'>
                            <div className="me-1 w-100">
                                <label className="" htmlFor="name">Appointment Date:</label>
                                <DatePicker
                                    id="apointment_date"
                                    placeholder="Appointment Date"
                                    style={{ width: "100%" }}
                                    allowClear
                                    value={opdAddTokenValue.appointment_date ? dayjs(opdAddTokenValue.appointment_date) : null}
                                    onChange={(date) => handleOpdTokenChange("appointment_date", date)}
                                />
                            </div>
                            <div className="me-1 w-100">
                                <label className="" htmlFor="name">Select Time Start / End</label>
                                <TimePicker.RangePicker
                                    style={{ width: "100%" }}
                                    use12Hours format="h:mm a"
                                />
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-between mb-1'>
                            <div className="me-1 w-100">
                                <label htmlFor="">Select Patient</label>
                                <div className='d-flex'>
                                    <Select
                                        style={{ width: "100%" }}
                                        className='mb-2'
                                        value={opdAddTokenValue.patient_id || null}
                                        onChange={(data) => handleOpdTokenChange("patient_id", data)}
                                        placeholder="Select Patient"
                                        allowClear
                                        options={patients.map((patient) => ({
                                            value: patient.id, label: patient.name
                                        }))}
                                    />
                                    <Button
                                        className="me-1"
                                        type="primary"
                                        icon={<PlusCircleOutlined />}
                                        onClick={addNewPatient}>
                                    </Button>
                                </div>
                            </div>
                            <div className="w-100">
                                <label className="" htmlFor="name">Select Patient is:</label>
                                <Select
                                    style={{ width: "100%" }}
                                    id="status"
                                    value={opdAddTokenValue.status || "Scheduled"}
                                    onChange={(data) => handleOpdTokenChange("status", data)}
                                    allowClear
                                    options={[
                                        { value: "Scheduled", label: "Scheduled" },
                                        { value: "Confirmed", label: "Confirmed" },
                                        { value: "Checked In", label: "Checked In" },
                                        { value: "Checked Out", label: "Checked Out" },
                                        { value: "No Show", label: "No Show" },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="mb-1">
                            <Collapse size="small"
                                items={[
                                    {
                                        key: '1', label: 'Payments',
                                        children:
                                            <>
                                                <div className="container-fluid m-0 p-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="col-4 p-0 mb-2">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label className='' htmlFor="">Select Procedure</label>
                                                                <Select
                                                                    className='w-100'
                                                                    placeholder="Select Procedure"
                                                                    allowClear
                                                                    showSearch
                                                                    optionFilterProp="label"
                                                                    options={procedure.map((procedure) => ({
                                                                        value: procedure.id, label: procedure.name
                                                                    }))}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 p-0 mb-2">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label className='' htmlFor="">Amount</label>
                                                                <InputNumber className='w-100' />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 p-0 mb-2">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label className='' htmlFor="">Discount</label>
                                                                <InputNumber className='w-100' />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 p-0 mb-2">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label htmlFor="">Discount Type</label>
                                                                <Select
                                                                    className='w-100'
                                                                    placeholder="Select Discount Type"
                                                                    allowClear
                                                                    options={
                                                                        [
                                                                            { value: "value", label: "Value" },
                                                                            { value: "percent", label: "Percent" },
                                                                        ]
                                                                    } />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 p-0">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label htmlFor="">Tax</label>
                                                                <InputNumber className='w-100' />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 p-0">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label htmlFor="">Quantity</label>
                                                                <InputNumber className='w-100' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <button
                                                    className='btn btn-sm btn-primary'
                                                    onClick={addMore}>
                                                    Add More!
                                                </button>
                                            </>,
                                    },
                                    {
                                        key: '2', label: 'Vitals',
                                        children:
                                            <>
                                                <div className="container-fluid p-0 m-0">
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="pulse" className="me-1">Pulse Heart Rate:</label>
                                                            <InputNumber min={30} max={200} placeholder="75"
                                                                id="pulse"
                                                                value={opdAddTokenValue.pulse || null}
                                                                onChange={(data) => handleOpdTokenChange("pulse", data)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="temperature" className="me-1">Temperature (°C):</label>
                                                            <InputNumber min={30} max={45} placeholder="36.5"
                                                                id="temperature"
                                                                value={opdAddTokenValue.temperature || null}
                                                                onChange={(data) => handleOpdTokenChange("temperature", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="systolic_bp" className="me-1">Systolic Blood Pressure:</label>
                                                            <InputNumber min={80} max={200} placeholder="120"
                                                                id="systolic_bp"
                                                                value={opdAddTokenValue.systolic_bp || null}
                                                                onChange={(data) => handleOpdTokenChange("systolic_bp", data)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="diastolic_bp" className="me-1">Diastolic Blood Pressure:</label>
                                                            <InputNumber min={40} max={130} placeholder="80"
                                                                id="diastolic_bp"
                                                                value={opdAddTokenValue.diastolic_bp || null}
                                                                onChange={(data) => handleOpdTokenChange("diastolic_bp", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="respiratory_rate" className="me-1">Respiratory Rate:</label>
                                                            <InputNumber min={10} max={50} placeholder="16"
                                                                id="respiratory_rate"
                                                                value={opdAddTokenValue.respiratory_rate || null}
                                                                onChange={(data) => handleOpdTokenChange("respiratory_rate", data)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="blood_sugar" className="me-1">Blood Sugar:</label>
                                                            <InputNumber min={50} max={500} placeholder="100"
                                                                id="blood_sugar"
                                                                value={opdAddTokenValue.blood_sugar || null}
                                                                onChange={(data) => handleOpdTokenChange("blood_sugar", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="weight" className="me-1">Weight (kg):</label>
                                                            <InputNumber min={1} max={500} placeholder="70"
                                                                id="weight"
                                                                value={opdAddTokenValue.weight || null}
                                                                onChange={(data) => handleOpdTokenChange("weight", data)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="height" className="me-1">Height (cm):</label>
                                                            <InputNumber min={30} max={250} placeholder="170"
                                                                id="height"
                                                                value={opdAddTokenValue.height || null}
                                                                onChange={(data) => handleOpdTokenChange("height", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="bmi" className="me-1">Body Mass Index (BMI):</label>
                                                            <InputNumber min={10} max={50} placeholder="22"
                                                                id="bmi"
                                                                value={opdAddTokenValue.bmi || null}
                                                                onChange={(data) => handleOpdTokenChange("bmi", data)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="bsa" className="me-1">Body Surface Area (BSA):</label>
                                                            <InputNumber min={0.5} max={3.0} placeholder="1.8"
                                                                id="bsa"
                                                                value={opdAddTokenValue.bsa || null}
                                                                onChange={(data) => handleOpdTokenChange("bsa", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="oxygen_saturation" className="me-1">Oxygen Saturation (%):</label>
                                                            <InputNumber min={50} max={100} placeholder="98"
                                                                id="oxygen_saturation"
                                                                value={opdAddTokenValue.oxygen_saturation || null}
                                                                onChange={(data) => handleOpdTokenChange("oxygen_saturation", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>,
                                    },
                                ]
                                }
                                defaultActiveKey={['2']} />
                        </div>
                        <div className="">
                            <label htmlFor="comment">Comment:</label>
                            <TextArea rows={4} placeholder="Comment"
                                id="comment"
                                allowClear
                                value={opdAddTokenValue.comment || null}
                                onChange={(data) => handleOpdTokenChange("comment", data.target.value)} />
                        </div>
                    </>
                </Modal>
                {/* Modal for adding token end */}

                {/* Modal to update and view token start */}
                <Modal
                    title={
                        <>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <div>Update Or Delete Token Data: </div>
                                    <hr className='mb-1 mt-0' />
                                    <span
                                        style={{ fontWeight: "100" }}>
                                        Doctor: <span> </span>
                                    </span>
                                    <span style={{
                                        display: "inline-block",
                                        color: "blue",
                                        textDecoration: "underline"
                                    }}>
                                        {selectedDoctor?.name || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <div className='d-flex justify-content-between'>
                                        <div className="me-3">
                                            <span style={{
                                                fontWeight: "normal"
                                            }}>
                                                Token#: {selectedToken || "N/A"}
                                            </span>
                                        </div>
                                        <div>
                                            <CloseOutlined onClick={handleOpdUpdateTokenModalCancel} />
                                        </div>
                                    </div>
                                    <hr className='mb-1 mt-0' />
                                    <div className='d-flex justify-content-end'>
                                        <Popconfirm
                                            title={`Are You Sure You Want To Delete?`}
                                            onConfirm={() => confirmDelToken(selectedAppointment?.id)}
                                            okText="Yes"
                                            cancelText="No">
                                            <Button className="me-1" color="danger" variant="outlined" size="small">
                                                Delete <DeleteOutlined />
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    open={isOpdUpdateTokenModalOpen}
                    onCancel={handleOpdUpdateTokenModalCancel}
                    maskClosable={false}
                    okText="Update Token"
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
                    closeIcon={false}>
                    <>
                        <div className='d-flex align-items-center justify-content-between mb-1'>
                            <div className="me-1 w-100">
                                <label className="" htmlFor="name">Appointment Date:</label>
                                <DatePicker
                                    id="apointment_date"
                                    placeholder="Appointment Date"
                                    style={{ width: "100%" }}
                                    allowClear
                                    // value={
                                    //     opdAddTokenValue.appointment_date
                                    //         ? dayjs(opdAddTokenValue.appointment_date)
                                    //         : selectedAppointment?.appointment_date
                                    //             ? dayjs(selectedAppointment.appointment_date)
                                    //             : null
                                    // }
                                    // onChange={(date) => handleOpdTokenChange("appointment_date", date)}
                                    value={selectedAppointment?.appointment_date ? dayjs(selectedAppointment.appointment_date) : null}
                                    disabled />
                            </div>
                            <div className="me-1 w-100">
                                <label className="" htmlFor="name">Select Time Start / End</label>
                                <TimePicker.RangePicker
                                    style={{ width: "100%" }}
                                    use12Hours format="h:mm a"
                                    disabled />
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-between mb-1'>
                            <div className="me-1 w-100">
                                <label htmlFor="">Patient</label>
                                <Input value={selectedAppointment?.patient_name} disabled />
                            </div>
                            <div className="w-100">
                                <label className="" htmlFor="name">Change Patient Status:</label>
                                <Select
                                    style={{ width: "100%" }}
                                    id="status"
                                    value={opdAddTokenValue.status || selectedAppointment?.status || "Scheduled"}
                                    onChange={(data) => handleOpdTokenChange("status", data)}
                                    allowClear
                                    options={[
                                        { value: "Scheduled", label: "Scheduled" },
                                        { value: "Confirmed", label: "Confirmed" },
                                        { value: "Checked In", label: "Checked In" },
                                        { value: "Checked Out", label: "Checked Out" },
                                        { value: "No Show", label: "No Show" },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="mb-1">
                            <Collapse size="small"
                                items={[
                                    {
                                        key: '1', label: 'Payments',
                                        children:
                                            <>
                                                <div className="container-fluid m-0 p-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="col-4 p-0">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label className='' htmlFor="">Select Procedure</label>
                                                                <Select
                                                                    className='w-100'
                                                                    placeholder="Select Procedure"
                                                                    allowClear
                                                                    showSearch
                                                                    optionFilterProp="label"
                                                                    options={procedure.map((procedure) => ({
                                                                        value: procedure.id, label: procedure.name
                                                                    }))}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 p-0">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label className='' htmlFor="">Amount</label>
                                                                <InputNumber className='w-100' />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 p-0">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label className='' htmlFor="">Discount</label>
                                                                <InputNumber className='w-100' />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 p-0">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label htmlFor="">Disc. Type</label>
                                                                <Select
                                                                    className='w-100'
                                                                    placeholder="Select Patient"
                                                                    allowClear
                                                                    showSearch
                                                                    optionFilterProp="label" />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 p-0">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label htmlFor="">Tax</label>
                                                                <InputNumber className='w-100' />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 p-0">
                                                            <div className='d-flex flex-column me-1'>
                                                                <label htmlFor="">Quantity</label>
                                                                <InputNumber className='w-100' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <button
                                                    className='btn btn-sm btn-primary'
                                                    onClick={addMore}>
                                                    Add More!
                                                </button>
                                            </>,
                                    },
                                    {
                                        key: '2', label: 'Vitals',
                                        children:
                                            <>
                                                <div className="container-fluid p-0 m-0">
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="pulse" className="me-1">Pulse Heart Rate:</label>
                                                            <InputNumber min={30} max={200} placeholder="75"
                                                                id="pulse"
                                                                value={selectedAppointment?.pulse || null}
                                                                onChange={(data) => handleOpdTokenChange("pulse", data)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="temperature" className="me-1">Temperature (°C):</label>
                                                            <InputNumber min={30} max={45} placeholder="36.5"
                                                                id="temperature"
                                                                value={selectedAppointment?.temperature || opdAddTokenValue.temperature || null}
                                                                onChange={(data) => handleOpdTokenChange("temperature", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="systolic_bp" className="me-1">Systolic Blood Pressure:</label>
                                                            <InputNumber min={80} max={200} placeholder="120"
                                                                id="systolic_bp"
                                                                value={opdAddTokenValue.systolic_bp || null}
                                                                onChange={(data) => handleOpdTokenChange("systolic_bp", data)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="diastolic_bp" className="me-1">Diastolic Blood Pressure:</label>
                                                            <InputNumber min={40} max={130} placeholder="80"
                                                                id="diastolic_bp"
                                                                value={opdAddTokenValue.diastolic_bp || null}
                                                                onChange={(data) => handleOpdTokenChange("diastolic_bp", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="respiratory_rate" className="me-1">Respiratory Rate:</label>
                                                            <InputNumber min={10} max={50} placeholder="16"
                                                                id="respiratory_rate"
                                                                value={opdAddTokenValue.respiratory_rate || null}
                                                                onChange={(data) => handleOpdTokenChange("respiratory_rate", data)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="blood_sugar" className="me-1">Blood Sugar:</label>
                                                            <InputNumber min={50} max={500} placeholder="100"
                                                                id="blood_sugar"
                                                                value={opdAddTokenValue.blood_sugar || null}
                                                                onChange={(data) => handleOpdTokenChange("blood_sugar", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="weight" className="me-1">Weight (kg):</label>
                                                            <InputNumber min={1} max={500} placeholder="70"
                                                                id="weight"
                                                                value={opdAddTokenValue.weight || null}
                                                                onChange={(data) => handleOpdTokenChange("weight", data)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="height" className="me-1">Height (cm):</label>
                                                            <InputNumber min={30} max={250} placeholder="170"
                                                                id="height"
                                                                value={opdAddTokenValue.height || null}
                                                                onChange={(data) => handleOpdTokenChange("height", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="bmi" className="me-1">Body Mass Index (BMI):</label>
                                                            <InputNumber min={10} max={50} placeholder="22"
                                                                id="bmi"
                                                                value={opdAddTokenValue.bmi || null}
                                                                onChange={(data) => handleOpdTokenChange("bmi", data)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="bsa" className="me-1">Body Surface Area (BSA):</label>
                                                            <InputNumber min={0.5} max={3.0} placeholder="1.8"
                                                                id="bsa"
                                                                value={opdAddTokenValue.bsa || null}
                                                                onChange={(data) => handleOpdTokenChange("bsa", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row p-0 m-0 mb-1">
                                                        <div className="col-md-6">
                                                            <label htmlFor="oxygen_saturation" className="me-1">Oxygen Saturation (%):</label>
                                                            <InputNumber min={50} max={100} placeholder="98"
                                                                id="oxygen_saturation"
                                                                value={opdAddTokenValue.oxygen_saturation || null}
                                                                onChange={(data) => handleOpdTokenChange("oxygen_saturation", data)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>,
                                    },
                                ]
                                }
                                defaultActiveKey={['2']} />
                        </div>
                        <div className="">
                            <label htmlFor="comment">Comment:</label>
                            <TextArea rows={4} placeholder="Comment"
                                id="comment"
                                allowClear
                                value={opdAddTokenValue.comment || null}
                                onChange={(data) => handleOpdTokenChange("comment", data.target.value)} />
                        </div>
                    </>
                </Modal>
                {/* Modal to update and view token end */}

                <Modal
                    title="Add New Patient"
                    open={isAddNewPatientModalOpen}
                    onCancel={handleAddNewPatientModalCancel}>

                </Modal>
            </div >
        </>
    )
}

export default Index;
