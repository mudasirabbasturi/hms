import React, { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    Breadcrumb, Button, Select,
    InputNumber, Tooltip, Popconfirm, notification
} from "antd";
import { PlusCircleOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
const Share = ({ user, shares, procedures }) => {
    {/** Handle Change Data */ }
    const [values, setValues] = useState({});
    const handleChange = (index, key, value) => {
        setValues((prevValues) => {
            let updatedValues = {
                ...prevValues,
                [index]: {
                    ...prevValues[index],
                    [key]: value,
                }
            };
            if (key === "procedure_name") {
                const selectedProcedure = procedures.find(proc => proc.name === value);
                updatedValues[index].procedure_id = selectedProcedure ? selectedProcedure.id : "";
            }
            return updatedValues;
        });
    };
    {/** Handle Change Data End */ }

    {/** Handle Update Data */ }
    const handleUpdate = (id) => {
        router.put(`/user/share/${id}`, values[id], {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Update successful!");
            },
            onError: (error) => {
                console.error("Failed to update:", error);
                message.error("Failed To Update Doctor Share");
            },
        });
    };
    {/** Handle Update Data End */ }

    {/** Add And Remove More Doctor Share */ }
    const [rows, setRows] = useState([{ id: Date.now(), procedure: null, type: null, value: null }]);
    const addRow = () => {
        setRows([...rows, { id: Date.now(), procedure: null, type: null, value: null }]);
    };
    const removeRow = (id) => {
        setRows(rows.filter((row) => row.id !== id));
    };
    const handleOnChange = (id, field, value) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };
    const handleAddDoctorShare = (rowId) => {
        const selectedRow = rows.find(row => row.id === rowId);
        if (selectedRow) {
            const formData = {
                user_id: user.id,
                procedure_id: selectedRow.procedure?.id || null,
                name: selectedRow.procedure?.name || null,
                type: selectedRow.type || null,
                value: selectedRow.value || null,
            };
            router.post(`/user/share/${user.id}`, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Update successful!");
                },
                onError: (error) => {
                    // console.error("Failed to update:", error);
                    // message.error("Failed To Update Doctor Share");
                },
            });
        }
    };
    {/** Add And Remove More Doctor Share End */ }

    {/** Popconfirm Doctor Share Delete */ }
    const confirmDelDoctorShare = (id) =>
        new Promise((resolve) => {
            router.delete(`/user/share/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed to delete doctor share");
                },
            });
        });
    {/** Popconfirm Doctor Share Delete End */ }
    {/** Flash Messages */ }
    const { flash, errors } = usePage().props;
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        if (flash.message) {
            api.success({
                message: "Success",
                description: flash.message,
                placement: "topRight",
            });
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
                });
            });
        }
    }, [errors]);
    {/** Flash Messages End */ }
    return (
        <>
            {contextHolder}
            <div className="container-fluid" style={{ height: "100%" }}>
                <div className="row">
                    <div className="col-12 bg-white pt-2 pb-2 d-flex justify-content-between flex-wrap align-items-center">
                        <div>
                            <Breadcrumb
                                items={[
                                    { title: <Link href="/">Dashboard</Link> },
                                    { title: "Users" },
                                    { title: "Doctor" },
                                    { title: user?.name },
                                    { title: "Shares" },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col-12">
                        {shares.map((share, index) => (
                            <div key={index} className="d-md-flex flex-md-row align-items-center">
                                <Select
                                    style={{ width: "100%" }}
                                    className="mb-2 me-1"
                                    placeholder="Select Procedure"
                                    showSearch
                                    allowClear={values[share.id]?.name !== undefined}
                                    value={values[share.id]?.name || share.name}
                                    onChange={(value) => handleChange(share.id, "name", value)}
                                    options={procedures.map((procedure) => ({
                                        value: procedure.name,
                                        label: procedure.name,
                                    }))}
                                />
                                <Select
                                    style={{ width: "100%" }}
                                    className='mb-2 me-1'
                                    placeholder="Select Type"
                                    allowClear={values[share.id]?.type !== undefined}
                                    value={values[share.id]?.type || share.type || null}
                                    onChange={(value) => handleChange(share.id, "type", value)}
                                    options={[
                                        { value: share.type, label: share.type.charAt(0).toUpperCase() + share.type.slice(1) },
                                        ...(share.type === 'percent'
                                            ? [{ value: 'value', label: 'Value' }]
                                            : share.type === 'value'
                                                ? [{ value: 'percent', label: 'Percent' }]
                                                : [
                                                    { value: 'percent', label: 'Percent' },
                                                    { value: 'value', label: 'Value' }
                                                ]
                                        )
                                    ]}
                                />
                                <InputNumber
                                    style={{ width: "100%" }}
                                    className="mb-2 me-1"
                                    placeholder="Value"
                                    value={values[share.id]?.value ?? share.value ?? 30}
                                    onChange={(value) => handleChange(share.id, "value", value)}
                                    min={1}
                                />
                                <Tooltip
                                    title={`Update Data`}
                                    color="cyan"
                                    placement="leftTop">
                                    <Button
                                        className="mb-2 me-1"
                                        onClick={() => handleUpdate(share.id)}
                                        color="cyan"
                                        variant="outlined">
                                        <EditOutlined />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Delete Data" color="red" placement="leftTop">
                                    <Popconfirm
                                        title={`Are you sure you want to delete ${share.id}`}
                                        onConfirm={() => confirmDelDoctorShare(share.id)}
                                        okText="Yes"
                                        cancelText="No">
                                        <Button className="mb-2" type="dashed" danger>
                                            <DeleteOutlined />
                                        </Button>
                                    </Popconfirm>
                                </Tooltip>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div className="col-12">
                        {rows.map((row) => (
                            <div key={row.id} className="d-md-flex flex-md-row align-items-center">
                                <Select
                                    style={{ width: "100%" }}
                                    className="mb-2 me-1"
                                    placeholder="Select Procedure"
                                    showSearch
                                    allowClear
                                    onChange={(value, option) => handleOnChange(row.id, "procedure", { id: value, name: option.label })}
                                    options={procedures.map((procedure) => ({
                                        value: procedure.id,
                                        label: procedure.name,
                                    }))}
                                />
                                <Select
                                    style={{ width: "100%" }}
                                    className="mb-2 me-1"
                                    placeholder="Select Type"
                                    allowClear
                                    onChange={(value) => handleOnChange(row.id, "type", value)}
                                    options={[
                                        { value: "percent", label: "Percent" },
                                        { value: "value", label: "Value" },
                                    ]}
                                />
                                <InputNumber
                                    style={{ width: "100%" }}
                                    className="mb-2 me-1"
                                    placeholder="Value"
                                    min={1}
                                    onChange={(value) => handleOnChange(row.id, "value", value)}
                                />
                                <Tooltip title="Add Data" color="blue" placement="leftTop">
                                    <Button
                                        className="mb-2 me-1" type="primary"
                                        onClick={() => handleAddDoctorShare(row.id)}>
                                        <PlusCircleOutlined />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Delete Row" color="red" placement="leftTop">
                                    <Button
                                        className="mb-2"
                                        type="dashed"
                                        danger
                                        onClick={() => removeRow(row.id)} disabled={rows.length === 1}>
                                        <DeleteOutlined />
                                    </Button>
                                </Tooltip>
                            </div>
                        ))}
                        <Button onClick={addRow} type="dashed">
                            Add More Doctor Share
                        </Button>
                    </div>
                </div>
            </div >
        </>
    );
};
export default Share;
