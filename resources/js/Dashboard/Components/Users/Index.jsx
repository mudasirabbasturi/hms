import React, { useMemo, useState, useEffect } from "react";

import { Link, router, usePage } from "@inertiajs/react";

import { notification, Breadcrumb, Tooltip, Popconfirm, Modal, Button, Select, Input, DatePicker } from "antd";
const { TextArea } = Input;
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, CloseOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

import dayjs from "dayjs";

import useDynamicHeight from "../Shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "../Shared/AgGridConfig";

const Index = ({ users, type, departments }) => {
    {/**  Dynamic Height Start */ }
    const dynamicHeight = useDynamicHeight();
    {/**  Dynamic Height End */ }

    {/** Render User Data Inside AG-GRID Start */ }
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        if (users) {
            setRowData(users);
        }
    }, [users]);

    const colDefs = useMemo(() => [
        { field: "user_id", headerName: "UserId" },
        { field: "name", headerName: "Name" },
        { field: "email", headerName: "Email" },
        { field: "phone", headerName: "Phone" },
        { field: "departments", headerName: "Departments" },
        { field: "type", headerName: "Type" },
        {
            field: "action",
            headerName: "Action",
            filter: false,
            sortable: false,
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`Edit / View User`} color="volcano" placement="leftTop">
                        <Link
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            style={{ border: "1px dashed rgb(154, 250, 28)" }}
                            href={`/user/${params.data.id}`}>
                            <EditOutlined /> / <EyeInvisibleOutlined />
                        </Link>
                    </Tooltip>
                    <Tooltip title={`Delete Department`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete "${params.data.name}"?`}
                            onConfirm={() => confirmDelUser(params.data.id)}
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
    const [isAddUserShow, setIsAddUserShow] = useState(false);

    // user input default value
    const defaultValues = {
        name: '', gender: '', phone: '', email: '', password: '',
        departments: '', designation: '', qualification: '', service: '', awards: '',
        expertise: '', registrations: '', professional_memberships: '', languages: '',
        experience: '', degree_completion_date: '', summary_pmdc: '', type: type,
    }
    const [values, setValues] = useState(defaultValues);

    // add User modal
    const addUserModal = () => {
        setIsAddUserShow(true);
    }

    // cancel and close add User modal
    const cancelAddUserModal = () => {
        setValues(defaultValues);
        setIsAddUserShow(false);
    }

    // onChange user value input
    const onChangeUserVal = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    // submit user data 
    const onSubmitUserData = () => {
        setLoading(true);
        router.post('/user/store', values, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsAddUserShow(false);
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    }

    // Popconfirm User Delete
    const confirmDelUser = (id) =>
        new Promise((resolve) => {
            router.delete(`/user/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed to delete department");
                },
            });
        });

    {/**  User CRUD End */ }

    {/** Bread Crumb Routing */ }
    const [route, setRoute] = useState(type)
    const handleChange = (key, value) => {
        setRoute({ [key]: value });
        router.get(value);
    }

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
                                    {
                                        title:
                                            <>
                                                <Link
                                                    style={{ textTransform: "capitalize" }}
                                                    href={`/users/all`}>
                                                    Users
                                                </Link>

                                            </>
                                    },
                                    {
                                        title:
                                            <>
                                                <Select
                                                    style={{ width: 120, textAlign: "center" }}
                                                    labelInValue
                                                    value={{ value: type.toUpperCase() }}
                                                    onChange={(url) => handleChange("type", url.value)}
                                                    options={[
                                                        { value: '/users/nurse/all', label: 'All' },
                                                        { value: '/users/admin', label: 'Admin' },
                                                        { value: '/users/doctor', label: 'Doctor' },
                                                        { value: '/users/receptionist', label: 'Receptionist' },
                                                        { value: '/users/accountant', label: 'Accountant' },
                                                        { value: '/users/nurse', label: 'Nurse' },
                                                    ]}
                                                />
                                            </>
                                    }
                                ]}
                            />
                        </div>
                        <div>
                            <Button
                                className="btn btn-outline-primary btn-sm"
                                style={{ borderStyle: "dashed" }}
                                onClick={addUserModal}>
                                <PlusCircleOutlined className="me-1" />
                                User
                            </Button>
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
            </div >

            {/* Add User Modal Start */}
            < Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>Add User</span>
                            <span><CloseOutlined onClick={cancelAddUserModal} /></span>
                        </div>
                    </>
                }

                open={isAddUserShow}
                onCancel={cancelAddUserModal}
                onOk={onSubmitUserData}
                okText="Add User"

                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Name:</label>
                            <Input className="w-100" placeholder="Name" allowClear
                                value={values.name}
                                onChange={(e) => onChangeUserVal("name", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Gender:</label>
                            <Select
                                className="w-100"
                                placeholder="Select Gender"
                                allowClear
                                value={values.gender || null}
                                onChange={(gender) => onChangeUserVal("gender", gender ?? null)}
                                options={[
                                    { value: 'male', label: 'Male' },
                                    { value: 'female', label: 'Female' },
                                    { value: 'other', label: 'Other' },
                                ]}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Phone:</label>
                            <PhoneInput
                                style={{ zIndex: "1000" }}
                                defaultCountry="usa"
                                value={values.phone}
                                onChange={(value) => onChangeUserVal("phone", value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Email:</label>
                            <Input className="w-100" placeholder="Email" type="email" allowClear
                                value={values.email}
                                onChange={(e) => onChangeUserVal("email", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Password:</label>
                            <Input.Password className="w-100" placeholder="Password" type="password" allowClear
                                value={values.password}
                                onChange={(e) => onChangeUserVal("password", e.target.value)}
                                autoComplete="new-password"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Department:</label>
                            <Select
                                style={{ width: "100%" }}
                                className="mb-2"
                                value={values.departments || null}
                                onChange={(data) => onChangeUserVal("departments", data)}
                                placeholder="Select Department"
                                allowClear
                                options={departments.map((dept) => ({
                                    value: dept.name,
                                    label: dept.name,
                                }))}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Designation:</label>
                            <Input className="w-100" placeholder="designation" allowClear
                                value={values.designation}
                                onChange={(e) => onChangeUserVal("designation", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="">Qualification:</label>
                            <TextArea
                                rows={2}
                                placeholder="MBBS - Completed on July 10, 2010, FCPS (Cardiology) - Completed on August 15, 2015"
                                allowClear
                                value={values.qualification}
                                onChange={(e) => onChangeUserVal("qualification", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="">Degree Completion Date:</label>
                            <DatePicker
                                className="w-100"
                                placeholder="Date Of Completion"
                                allowClear
                                value={values.degree_completion_date ? dayjs(values.degree_completion_date) : null}
                                onChange={(date, dateString) => onChangeUserVal("degree_completion_date", dateString)}
                                disabled={loading}
                            />
                        </div>
                        <div className="for-doctor">
                            <div className="d-flex align-items-center mb-2">
                                <label className="me-1">Languages:</label>
                                <Input className="w-100" placeholder="Spanish, English, Arabic" allowClear
                                    value={values.languages}
                                    onChange={(e) => onChangeUserVal("languages", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="me-1">Awards:</label>
                                <TextArea
                                    rows={2}
                                    placeholder="Best Cardiologist of the Year (2022), Excellence in Pediatric Surgery Award (2020),"
                                    allowClear
                                    value={values.awards}
                                    onChange={(e) => onChangeUserVal("awards", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="me-1">Expertise:</label>
                                <TextArea
                                    rows={2}
                                    placeholder="Cardiovascular Surgery, Pediatric Neurology, Orthopedic Trauma, Dermatology and Aesthetic Medicine, Oncology and Chemotherapy"
                                    allowClear
                                    value={values.expertise}
                                    onChange={(e) => onChangeUserVal("expertise", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="me-1">Experience:</label>
                                <TextArea
                                    rows={2}
                                    placeholder="10+ years as a Consultant Cardiologist at XYZ Hospital, 5 years as a Neurosurgeon at ABC Medical Center,"
                                    allowClear
                                    value={values.experience}
                                    onChange={(e) => onChangeUserVal("experience", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="me-1">Services:</label>
                                <TextArea
                                    rows={2}
                                    placeholder="General Checkup, Surgery, Specialist Consultation,"
                                    allowClear
                                    value={values.service}
                                    onChange={(e) => onChangeUserVal("service", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="me-1">Registrations:</label>
                                <TextArea
                                    rows={2}
                                    placeholder="Pakistan Medical and Dental Council (PMDC) - Reg No: 12345678, General Medical Council (GMC) UK - Reg No: 987654"
                                    allowClear
                                    value={values.registrations}
                                    onChange={(e) => onChangeUserVal("registrations", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="me-1">Professional Memberships:</label>
                                <TextArea
                                    rows={2}
                                    placeholder="Member of the American Medical Association (AMA), Fellow of the Royal College of Surgeons (FRCS)"
                                    allowClear
                                    value={values.professional_memberships}
                                    onChange={(e) => onChangeUserVal("professional_memberships", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="me-1">Summary pmdc:</label>
                                <TextArea
                                    rows={2}
                                    placeholder="PMDC Reg No: 56789-ABC, PMDC Reg No: 98765-XYZ, PMDC Reg No: 12345-PQR"
                                    allowClear
                                    value={values.summary_pmdc}
                                    onChange={(e) => onChangeUserVal("summary_pmdc", e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal >
            {/** Add User Modal End */}
        </>
    )
}
export default Index