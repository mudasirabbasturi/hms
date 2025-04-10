import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import {
    Breadcrumb, Modal, Select, DatePicker,
    TimePicker, Collapse, InputNumber,
    Input
} from "antd";
import {
    CloseOutlined
} from "@ant-design/icons"
import moment from "moment"
const { TextArea } = Input;

const { RangePicker } = TimePicker;
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeBalham } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const gridTheme = themeBalham.withParams({
    spacing: 6,
    accentColor: "blue",
    wrapperBorder: false
});

const Index = ({ appointments, doctors, patients }) => {
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedToken, setSelectedToken] = useState(null);

    useEffect(() => {
        generateGridData();
    }, [appointments, doctors]);

    const generateGridData = () => {
        const dynamicColumns = [
            {
                field: "token_id",
                headerName: "Token #",
                width: 120,
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
        const rows = Array.from({ length: 1000 }, (_, i) => {
            let tokenNumber = i + 1;
            let row = { token_id: `#${String(tokenNumber).padStart(4, "0")}` };
            doctors.forEach(doctor => {
                const appointment = appointments.find(
                    appt => appt.token_number === tokenNumber && appt.user_id === doctor.id
                );
                row[`doctor_${doctor.id}`] = appointment ? "Booked" : "";
            });
            return row;
        });

        setRowData(rows);
    };

    const handleCellClick = (params) => {
        const field = params.colDef.field;
        const tokenNumber = params.data.token_id;
        if (field.startsWith("doctor_")) {
            const doctorId = field.split("_")[1];
            const doctor = doctors.find(d => d.id == doctorId);
            if (doctor) {
                setSelectedDoctor(doctor);
                setSelectedToken(tokenNumber);
                setIsModalOpen(true);
            }
        }
    };

    {/** Add token start */ }
    const [addTokenValue, setAddTokenValue] = useState(
        {
            user_id: "",
            patient_id: "",
            pulse: "",
            temperature: "",
            systolic_bp: "",
            diastolic_bp: "",
            respiratory_rate: "",
            blood_sugar: "",
            weight: "",
            height: "",
            bmi: "",
            bsa: "",
            oxygen_saturation: "",
            status: "",
            token_number: "",
            appointment_date: "",
            start_time: "",
            end_time: "",
            appointment_type: "",
            amount: "",
        }
    )
    const addTokenOnChange = (key, value) => {
        setAddTokenValue(prevValues => ({
            ...prevValues,
            [key]: value,
        }))
    }

    const addTokenForm = () => {
        const formData = {
            ...addTokenValue
        }
        console.log(formData)
    }
    {/** Add token end */ }
    return (
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
                                <span>Doctor: </span>
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
                                        onClick={() => setIsModalOpen(false)} />
                                </div>
                            </div>
                        </div>
                    </>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
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
                onOk={addTokenForm}
            >
                <>
                    <div className='d-flex align-items-center justify-content-between mb-1'>
                        <div className="me-1 w-100">
                            <label className="" htmlFor="name">Appointment Date:</label>
                            <DatePicker
                                id="apointment_date"
                                placeholder="Appointment Date"
                                style={{ width: "100%" }}
                                allowClear
                                value={addTokenValue.appointment_date ? moment(addTokenValue.appointment_date) : null}
                                onChange={(date, dateString) => addTokenOnChange('appointment_date', dateString)}
                            />
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
                            <label className="" htmlFor="name">Select Patient:</label>
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Select Patient"
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={patients.map((patient) => ({
                                    value: patient.id,
                                    label: patient.name,
                                }))}
                                id="patient_id"
                                value={addTokenValue.patient_id || null}
                                onChange={(data) => addTokenOnChange("patient_id", data)}
                            />
                        </div>
                        <div className="w-100">
                            <label className="" htmlFor="name">Select Patient is:</label>
                            <Select
                                style={{ width: "100%" }}
                                id="status"
                                placeholder="Select Patient is"
                                allowClear
                                showSearch
                                options={
                                    [
                                        {
                                            value: "Scheduled",
                                            label: "Scheduled"
                                        },
                                        {
                                            value: "Confirmed",
                                            label: "Confirmed"
                                        },
                                        {
                                            value: "Checked In",
                                            label: "Checked In"
                                        },
                                        {
                                            value: "Checked Out",
                                            label: "Checked Out"
                                        },
                                        {
                                            value: "No Show",
                                            label: "No Show"
                                        },
                                    ]
                                }
                            />
                        </div>
                    </div>
                    <Collapse
                        className="mb-1"
                        size="small"
                        items={
                            [
                                {
                                    key: '1',
                                    label: 'Payments',
                                    children:
                                        <>
                                            <div className="d-flex flex-wrap justify-content-start">
                                                <div className="mb-1 me-1 d-flex flex-column">
                                                    <label htmlFor="">Select Procedure</label>
                                                    <Select
                                                        className=""
                                                        placeholder="Select Procedure"
                                                        allowClear
                                                        showSearch
                                                        optionFilterProp="label"
                                                        options={patients.map((patient) => ({
                                                            value: patient.id,
                                                            label: patient.name,
                                                        }))} />
                                                </div>
                                                <div className="mb-1 me-1 d-flex flex-column">
                                                    <label htmlFor="">Amount</label>
                                                    <InputNumber
                                                        className=""
                                                        value={addTokenValue.amount}
                                                        onChange={(value) => addTokenOnChange("amount", value)} />
                                                </div>
                                                <div className="mb-1 me-1 d-flex flex-column">
                                                    <label htmlFor="">Discount</label>
                                                    <InputNumber className="" />
                                                </div>
                                                <div className="mb-1 me-1 d-flex flex-column">
                                                    <label htmlFor="">Disc. Type</label>
                                                    <Select
                                                        className=""
                                                        placeholder="Select Patient"
                                                        allowClear
                                                        showSearch
                                                        optionFilterProp="label"
                                                        options={patients.map((patient) => ({
                                                            value: patient.id,
                                                            label: patient.name,
                                                        }))} />
                                                </div>
                                                <div className="mb-1 me-1 d-flex flex-column">
                                                    <label htmlFor="">Tax</label>
                                                    <InputNumber className="" />
                                                </div>
                                                <div className="mb-1 d-flex flex-column">
                                                    <label htmlFor="">Quantity</label>
                                                    <InputNumber className="" />
                                                </div>
                                            </div>
                                        </>,
                                },
                                {
                                    key: '2',
                                    label: 'Vitals',
                                    children:
                                        <>
                                            <div className="container-fluid p-0 m-0">
                                                <div className="row p-0 m-0 mb-1">
                                                    <div className="col-md-6">
                                                        <label htmlFor="" className="me-1">Pulse Heart Rate:</label>
                                                        <InputNumber min={1} max={10} defaultValue={3} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="" className="me-1">Systolic blood pressure:</label>
                                                        <InputNumber min={1} max={10} defaultValue={3} />
                                                    </div>
                                                </div>
                                                <div className="row p-0 m-0 mb-1">
                                                    <div className="col-md-6">
                                                        <label htmlFor="" className="me-1">Diastolic blood pressue:</label>
                                                        <InputNumber min={1} max={10} defaultValue={3} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="" className="me-1">Respiratory rate:</label>
                                                        <InputNumber min={1} max={10} defaultValue={3} />
                                                    </div>
                                                </div>
                                                <div className="row p-0 m-0 mb-1">
                                                    <div className="col-md-6">
                                                        <label htmlFor="" className="me-1">Blood sugar:</label>
                                                        <InputNumber min={1} max={10} defaultValue={3} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="" className="me-1">Weight:</label>
                                                        <InputNumber min={1} max={10} defaultValue={3} />
                                                    </div>
                                                </div>
                                                <div className="row p-0 m-0 mb-1">
                                                    <div className="col-md-6">
                                                        <label htmlFor="" className="me-1">Height (cm):</label>
                                                        <InputNumber min={1} max={10} defaultValue={3} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="" className="me-1">Body mass index:</label>
                                                        <InputNumber min={1} max={10} defaultValue={3} />
                                                    </div>
                                                </div>
                                                <div className="row p-0 m-0 mb-1">
                                                    <div className="col-md-6">
                                                        <label htmlFor="" className="me-1">Body surface area:</label>
                                                        <InputNumber min={1} max={10} defaultValue={3} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="" className="me-1">Oxygen saturation:</label>
                                                        <InputNumber min={1} max={10} defaultValue={3} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>,
                                },
                            ]
                        }
                        defaultActiveKey={['1']} />
                    <div className="mb-2">
                        <label htmlFor="comment">Comment:</label>
                        <TextArea rows={4} placeholder="Comment" maxLength={6} />
                    </div>
                </>
            </Modal>
            {/* Modal for adding token end */}

            {/* Modal to update and view token start */}
            {/* Modal to update and view token end */}
        </div >
    );
};

export default Index;
