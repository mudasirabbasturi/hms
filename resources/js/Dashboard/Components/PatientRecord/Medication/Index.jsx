import React, { useMemo, useState, useEffect } from "react";

import { Link, router, usePage } from "@inertiajs/react";

import { notification, Breadcrumb, Tooltip, Popconfirm, Modal, Button, Select, Input, DatePicker, InputNumber } from "antd";
const { TextArea } = Input;
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, CloseOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

import dayjs from "dayjs";

import useDynamicHeight from "../../Shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "../../Shared/AgGridConfig";

const Index = ({ medications, doctors, patients }) => {
    {/**  Dynamic Height Start */ }
    const dynamicHeight = useDynamicHeight();
    {/**  Dynamic Height End */ }

    {/** Render User Data Inside AG-GRID Start */ }

    const [selectedDoctorName, setSelectedDoctorName] = useState(null);
    const [selectedPatientName, setSelectedPatientName] = useState(null);
    const [filteredData, setFilteredData] = useState(medications);

    useEffect(() => {
        if (medications) {
            setFilteredData(medications);
        }
    }, [medications]);

    const handleFilterChange = (type, value) => {
        const updatedDoctorName = type === 'doctor' ? value : selectedDoctorName;
        const updatedPatientName = type === 'patient' ? value : selectedPatientName;
        setSelectedDoctorName(updatedDoctorName);
        setSelectedPatientName(updatedPatientName);
        const filteredMedications = medications.filter(medic => {
            const doctorMatch = updatedDoctorName ? medic.doctor_name === updatedDoctorName : true;
            const patientMatch = updatedPatientName ? medic.patient_name === updatedPatientName : true;
            return doctorMatch && patientMatch;
        });
        setFilteredData(filteredMedications);
    };

    const colDefs = useMemo(() => [
        { field: "token_number", headerName: "Token#", pinned: 'left', width: 100, maxWidth: 100 },
        { field: "patient_name", headerName: "Patient" },
        { field: "doctor_name", headerName: "Doctor" },
        { field: "medicine_name", headerName: "Name" },
        { field: "dosage", headerName: "Dose" },
        { field: "frequency", headerName: "Frequency" },
        { field: "duration", headerName: "Duration" },
        { field: "instructions", headerName: "Instructions" },
        {
            field: "action",
            headerName: "Action",
            filter: false,
            sortable: false,
            pinned: 'right',
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Edit / View Medication`} color="volcano" placement="leftTop">
                        <button
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            style={{ border: "1px dashed rgb(154, 250, 28)" }}
                            onClick={() => (
                                updateMedicationModal(
                                    params.data.id,
                                    params.data.diagnosis,
                                    params.data.medicine_name,
                                    params.data.dosage,
                                    params.data.frequency,
                                    params.data.duration,
                                    params.data.instructions,
                                )
                            )}>
                            <EditOutlined /> / <EyeInvisibleOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title={`Delete vital`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete medication ?`}
                            onConfirm={() => confirmDelMedication(params.data.id)}
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
    const [isAddMedicationShow, setIsMedicationAddShow] = useState(false);

    // user input default value
    const defaultValues = {
        prescription_id: '', medicine_name: '', dosage: '', frequency: '', duration: '',
        instructions: '',
    }
    const [values, setValues] = useState(defaultValues);

    // add prescription modal
    const addMedicationModal = () => {
        setIsMedicationAddShow(true);
    }

    // cancel and close add patients modal
    const cancelAddMedicationModal = () => {
        setValues(defaultValues);
        setIsMedicationAddShow(false);
    }

    const [prescriptions, setPrescriptions] = useState([]);
    const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

    const fetchPrescriptions = async (patientId) => {
        if (!patientId) return;
        setLoadingPrescriptions(true);
        try {
            const res = await axios.get(`/prescription/by-patient/${patientId}`);
            setPrescriptions(res.data);
        } catch (err) {
            console.error("Error loading prescriptions", err);
        } finally {
            setLoadingPrescriptions(false);
        }
    };

    const onChangeMedicationVal = (key, value) => {
        setValues((prev) => ({
            ...prev,
            [key]: value,
            ...(key === "patient_id" ? { appointment_id: null } : {}),
        }));

        if (key === "patient_id") {
            fetchPrescriptions(value);
        }
    };

    // submit prescription data 
    const onSubmitMedicationData = () => {
        setLoading(true);
        router.post('/medication/store', values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsMedicationAddShow(false);
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
    const [isUpdateMedicationShow, setIsUpdateMedicationShow] = useState(false);
    const updateMedicationModal = (
        id = null,
        diagnosis = null,
        medicine_name = null,
        dosage = null,
        frequency = null,
        duration = null,
        instructions = null,
    ) => {
        setValues(prev => ({
            ...prev,
            id: id || '',
            diagnosis: diagnosis || '',
            medicine_name: medicine_name || '',
            dosage: dosage || '',
            frequency: frequency || '',
            duration: duration || '',
            instructions: instructions || '',
        }));
        setIsUpdateMedicationShow(true);
    }

    // cancel and close update prescription modal
    const cancelUpdateVitalModal = () => {
        setValues(defaultValues);
        setIsUpdateMedicationShow(false);
    }

    // update prescription data 
    const onUpdateVitalData = () => {
        setLoading(true);
        router.put(`/medication/update/${values.id}`, values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsUpdateMedicationShow(false);
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
    const confirmDelMedication = (id) =>
        new Promise((resolve) => {
            router.delete(`/medication/destroy/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed to delete medication");
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
                                    { title: "Medications" },
                                    {
                                        title: (
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder="Select Doctor"
                                                onChange={(value) => handleFilterChange('doctor', value)}
                                            >
                                                {doctors.map((doc) => (
                                                    <Option key={doc.id} value={doc.name}>
                                                        {doc.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )
                                    },
                                    {
                                        title: (
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder="Select Patient"
                                                onChange={(value) => handleFilterChange('patient', value)}
                                            >
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
                                onClick={addMedicationModal}>
                                <PlusCircleOutlined className="me-1" />
                                Medication
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div
                        className="col-12"
                        style={{ height: dynamicHeight, overflow: "hidden", }}>
                        <AgGridReact
                            rowData={filteredData} columnDefs={colDefs}
                            defaultColDef={defaultColDef}
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
                            <span>Add Medication</span>
                            <span><CloseOutlined onClick={cancelAddMedicationModal} /></span>
                        </div>
                    </>
                }

                open={isAddMedicationShow}
                onCancel={cancelAddMedicationModal}
                onOk={onSubmitMedicationData}
                okText="Add Medication"

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
                                onChange={(data) => onChangeMedicationVal("patient_id", data)}
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
                            <label className="me-1">Prescription:</label>
                            <Select
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.prescription_id || null}
                                onChange={(data) => onChangeMedicationVal("prescription_id", data)}
                                placeholder="Select Prescription"
                                allowClear
                                showSearch
                                options={prescriptions.map((presc) => ({
                                    value: presc.id,
                                    label: `Prescription #${presc.diagnosis}`,
                                }))}
                                disabled={!values.patient_id || loadingPrescriptions}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label style={{ width: "25%" }} className="me-1">Medicine Name:</label>
                            <Input
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.medicine_name || null}
                                onChange={(e) => onChangeMedicationVal("medicine_name", e.target.value)}
                                placeholder="Medicine Name"
                                allowClear
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Dosage:</label>
                            <Input
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.dosage || null}
                                onChange={(e) => onChangeMedicationVal("dosage", e.target.value)}
                                placeholder="Dosage"
                                allowClear
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Frequency:</label>
                            <Input
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.frequency || null}
                                onChange={(e) => onChangeMedicationVal("frequency", e.target.value)}
                                placeholder="Frequency"
                                allowClear
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Duration:</label>
                            <Input
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.duration || null}
                                onChange={(e) => onChangeMedicationVal("duration", e.target.value)}
                                placeholder="Duration"
                                allowClear
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="me-1">Instructions:</label>
                            <TextArea
                                rows={2}
                                placeholder="Shake well before use"
                                allowClear
                                value={values.instructions}
                                onChange={(e) => onChangeMedicationVal("instructions", e.target.value)}
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
                            <span>Update Medication</span>
                            <span><CloseOutlined onClick={cancelUpdateVitalModal} /></span>
                        </div>
                    </>
                }

                open={isUpdateMedicationShow}
                onCancel={cancelUpdateVitalModal}
                onOk={onUpdateVitalData}
                okText="Update Medication"

                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Prescription:</label>
                            <Input
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.diagnosis}
                                disabled
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label style={{ width: "25%" }} className="me-1">Medicine Name:</label>
                            <Input
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.medicine_name || null}
                                onChange={(e) => onChangeMedicationVal("medicine_name", e.target.value)}
                                placeholder="Medicine Name"
                                allowClear
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Dosage:</label>
                            <Input
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.dosage || null}
                                onChange={(e) => onChangeMedicationVal("dosage", e.target.value)}
                                placeholder="Dosage"
                                allowClear
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Frequency:</label>
                            <Input
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.frequency || null}
                                onChange={(e) => onChangeMedicationVal("frequency", e.target.value)}
                                placeholder="Frequency"
                                allowClear
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Duration:</label>
                            <Input
                                style={{ width: "100%" }}
                                className="me-1"
                                value={values.duration || null}
                                onChange={(e) => onChangeMedicationVal("duration", e.target.value)}
                                placeholder="Duration"
                                allowClear
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="me-1">Instructions:</label>
                            <TextArea
                                rows={2}
                                placeholder="Shake well before use"
                                allowClear
                                value={values.instructions}
                                onChange={(e) => onChangeMedicationVal("instructions", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
            {/** Update Vital Modal End */}
        </>
    )
}
export default Index