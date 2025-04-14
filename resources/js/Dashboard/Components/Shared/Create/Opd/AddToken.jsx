import React, { useState } from "react"
import {
    /** Inertia.js - For page navigation and routing */
    router,
    /** Ant Design Components - UI components from Ant Design */
    Modal, Select, Input, DatePicker, Tooltip,
    /** Ant Design Icons - For using Ant Design's pre-built icons */
    CloseOutlined, PlusCircleOutlined,
    /** Day.js - For date manipulation and formatting */
    dayjs,
    /**React International Phone - For phone number input with international validation */

} from "@shared/Ui"
import AddPatient from "@shared/Create/Patient/AddPatient"
const { TextArea } = Input

const AddToken = ({ open, onCancel, doctors, patients, departments }) => {
    const [showPatientModal, setShowPatientModal] = useState(false)
    const defaultValues = {
        user_id: '', patient_id: '', status: 'Scheduled',
        appointment_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        appointment_type: 'token', comment: ''
    };
    const [values, setValues] = useState(defaultValues)
    const [loading, setLoading] = useState(false)

    const onChange = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }));
    }

    const onSubmit = () => {
        setLoading(true);
        router.post('/opd/token/store', values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues)
                onCancel()
            },
            onError: () => setLoading(false),
            onFinish: () => setLoading(false),
        })
    }

    return (
        <Modal
            title={
                <div className="d-flex justify-content-between">
                    <span>Add Token</span>
                    <span>
                        <CloseOutlined onClick={() => {
                            setValues(defaultValues)
                            onCancel()
                        }} />
                    </span>
                </div>
            }
            open={open}
            onCancel={() => {
                setValues(defaultValues)
                onCancel()
            }}
            onOk={onSubmit}
            okText="Add Token" maskClosable={false} closeIcon={false}
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
                        value={values.user_id || null}
                        onChange={(data) => onChange("user_id", data)}
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
                    <button
                        className="btn btn-outline-info btn-sm"
                        onClick={() => setShowPatientModal(true)}>
                        <Tooltip title={`Add Patient If Not Found`} color="green" placement="leftTop">
                            <PlusCircleOutlined />
                        </Tooltip>

                    </button>
                    <AddPatient
                        open={showPatientModal}
                        onCancel={() => setShowPatientModal(false)}
                        departments={departments}
                    />
                </div>
                <div className="mb-3">
                    <label className="me-1">Staus (default: Scheduled):</label>
                    <Select
                        className="w-100"
                        placeholder="Select Status"
                        allowClear
                        value={values.status || null}
                        onChange={(data) => onChange("status", data)}
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
                        value={values.comment}
                        onChange={(e) => onChange("comment", e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="mb-3">
                    <label className="">Appointment Date (Default: Current):</label>
                    <DatePicker
                        className="w-100"
                        placeholder="Appointment Date"
                        allowClear showTime
                        value={values.appointment_date ? dayjs(values.appointment_date) : null}
                        onChange={(date, dateString) => onChange("appointment_date", dateString)}
                        disabled={loading}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default AddToken;