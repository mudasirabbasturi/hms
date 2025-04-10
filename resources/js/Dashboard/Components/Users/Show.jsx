import React, { useState, useEffect } from "react";

import { Link, router, usePage } from "@inertiajs/react";

import { notification, Breadcrumb, Tooltip, Button, Select, Input, DatePicker, Card, Avatar, Upload, Image } from "antd";
const { Meta } = Card;
const { TextArea } = Input;
import { PlusCircleOutlined, UserOutlined, UploadOutlined } from "@ant-design/icons";

import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

import dayjs from "dayjs";

import useDynamicHeight from "../Shared/DynamicHeight";
import { AgGridReact, gridTheme, defaultColDef } from "../Shared/AgGridConfig";
import axios from "axios";
const Show = ({ user, departments, profile }) => {

    // update profile 
    const [imageError, setImageError] = useState(false);
    // update single columns on enter
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState({});
    const inputValueChange = (key, value) => {
        setValue((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    const handleKeyDown = (e, key) => {
        if (e.key === "Enter") {
            setLoading(true);
            router.put(`/user/${user.id}`, { [key]: value[key] }, {
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        }
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
                                                <Link
                                                    style={{ textTransform: "capitalize" }}
                                                    href={`/users/${user.type}`}>
                                                    {user.type}
                                                </Link>

                                            </>
                                    },
                                    {
                                        title:
                                            <>
                                                <span style={{ textTransform: "capitalize" }}>
                                                    {user.name}
                                                </span>
                                            </>
                                    },
                                ]}
                            />
                        </div>
                        <div>
                            <Button
                                className="btn btn-outline-primary btn-sm"
                                style={{ borderStyle: "dashed" }}>
                                <PlusCircleOutlined className="me-1" />
                                User
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-12 mb-2">
                                <Card>
                                    <Meta
                                        description={
                                            <>
                                                <div style={{
                                                    display: 'flex', justifyContent: 'center',
                                                    alignItems: 'center', flexDirection: 'column'
                                                }}>
                                                    <div
                                                        style={{ maxWidth: '150px', backgroundColor: "white" }}>
                                                        {!imageError ? (
                                                            <Image
                                                                alt={user.name}
                                                                src={profile}
                                                                style={{ width: '100%', borderRadius: "50%" }}
                                                                onError={() => setImageError(true)}
                                                            />
                                                        ) : (
                                                            <Avatar size={100} icon={<UserOutlined />} />
                                                        )}
                                                    </div>
                                                </div>
                                                <hr></hr>
                                                <p className="text-center mb-0"><b>User ID: </b>{user.user_id}</p>
                                                <p className="text-center mb-0"><b>Employee-Type: </b>{user.type}</p>
                                                <div className="d-flex align-items-center mb-2">
                                                    <Input
                                                        style={{ textAlign: "center" }}
                                                        value={value.name || user.name}
                                                        onChange={(e) => inputValueChange("name", e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(e, "name")}
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <hr></hr>
                                                <div className="d-flex justify-content-center flex-column">
                                                    <div className="d-flex justify-content-center align-items-center mb-2">
                                                        <label className="me-1">Gender: </label>
                                                        <Select
                                                            className="w-100"
                                                            placeholder="Select Gender"
                                                            value={value.gender || user.gender || null}
                                                            onChange={(gender) => inputValueChange("gender", gender ?? null)}
                                                            options={[
                                                                { value: 'male', label: 'Male' },
                                                                { value: 'female', label: 'Female' },
                                                                { value: 'other', label: 'Other' },
                                                            ]}
                                                            onKeyDown={(e) => handleKeyDown(e, "gender")}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <label className="me-1">Phone: </label>
                                                        <PhoneInput
                                                            value={value.phone || user.phone}
                                                            onChange={(value) => inputValueChange("phone", value)}
                                                            onKeyDown={(e) => handleKeyDown(e, "phone")}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <label className="me-1">Email: </label>
                                                        <Input
                                                            type="email"
                                                            value={value.email || user.email}
                                                            onChange={(e) => inputValueChange("email", e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, "email")}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-center align-items-center mb-2">
                                                        <label className="me-1">Department: </label>
                                                        <Select
                                                            className="w-100"
                                                            placeholder="Select Department"
                                                            options={departments.map((dept) => ({
                                                                value: dept.name,
                                                                label: dept.name,
                                                            }))}
                                                            value={value.departments || user.departments || null}
                                                            onChange={(data) => inputValueChange("departments", data)}
                                                            onKeyDown={(e) => handleKeyDown(e, "departments")}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <label className="me-1">Designation: </label>
                                                        <Input
                                                            value={value.designation || user.designation}
                                                            onChange={(e) => inputValueChange("designation", e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, "designation")}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />

                                </Card>
                            </div>
                            <div className="col-12 mb-2">
                                <Card
                                    title="Languages & Dedgree Completion:"
                                    variant="borderless"
                                    styles={{ body: { paddingTop: 10 } }}>
                                    <div className="d-flex flex-column">
                                        <div className="d-flex align-items-center mb-2">
                                            <label className="me-1">Languages: </label>
                                            <Input
                                                value={value.languages || user.languages}
                                                onChange={(e) => inputValueChange("languages", e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, "languages")}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Completion Date: </label>
                                            <TextArea
                                                autoSize={{ minRows: 2 }}
                                                value={value.degree_completion_date || user.degree_completion_date}
                                                onChange={(e) => inputValueChange("degree_completion_date", e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, "degree_completion_date")}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-12 mb-2">
                                <Card
                                    title="Qualification, Services & Registrations:"
                                    variant="borderless"
                                    styles={{ body: { paddingTop: 10 } }}>
                                    <div className="d-flex flex-column">
                                        <div className="mb-2">
                                            <label>Qualification: </label>
                                            <TextArea
                                                autoSize={{ minRows: 2 }}
                                                value={value.qualification || user.qualification}
                                                onChange={(e) => inputValueChange("qualification", e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, "qualification")}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Services: </label>
                                            <TextArea
                                                autoSize={{ minRows: 2 }}
                                                value={value.service || user.service}
                                                onChange={(e) => inputValueChange("service", e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, "service")}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Registrations: </label>
                                            <TextArea
                                                autoSize={{ minRows: 2 }}
                                                value={value.registrations || user.registrations}
                                                onChange={(e) => inputValueChange("registrations", e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, "registrations")}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            <div className="col-12 mb-2">
                                <Card
                                    title="Awards, Expertise & Experience"
                                    variant="borderless"
                                    styles={{ body: { paddingTop: 10 } }}>
                                    <div className="d-flex flex-column">
                                        <div className="mb-2">
                                            <label>Awards: </label>
                                            <TextArea
                                                autoSize={{ minRows: 2 }}
                                                value={value.awards || user.awards}
                                                onChange={(e) => inputValueChange("awards", e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, "awards")}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Expertise: </label>
                                            <TextArea
                                                autoSize={{ minRows: 2 }}
                                                value={value.expertise || user.expertise}
                                                onChange={(e) => inputValueChange("expertise", e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, "expertise")}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Experience: </label>
                                            <TextArea
                                                autoSize={{ minRows: 2 }}
                                                value={value.experience || user.experience}
                                                onChange={(e) => inputValueChange("experience", e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, "experience")}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-12">
                                <div className="col-12 mb-2">
                                    <Card
                                        title="Professional MemberShips"
                                        variant="borderless"
                                        styles={{ body: { paddingTop: 10 } }}>
                                        <div className="d-flex flex-column">
                                            <div className="mb-2">
                                                <label>Professional MemberShips:: </label>
                                                <TextArea
                                                    autoSize={{ minRows: 2 }}
                                                    value={value.professional_memberships || user.professional_memberships}
                                                    onChange={(e) => inputValueChange("professional_memberships", e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(e, "professional_memberships")}
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                                <div className="col-12">
                                    <Card
                                        title="Invoice"
                                        variant="borderless"
                                        extra={
                                            <>
                                                <Tooltip
                                                    title={`Add Invoice`}
                                                    color="cyan"
                                                    placement="topLeft">
                                                    <PlusCircleOutlined key="add" />
                                                </Tooltip>
                                            </>
                                        }>
                                        No invoice has been added yet.
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Show

/*

*/