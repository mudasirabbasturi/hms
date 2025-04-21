import React, { useMemo, useState, useEffect } from "react"
import {
    /** Inertia.js */
    Link, usePage, router,
    /** Ant Design Components */
    notification, Breadcrumb, Select, Tooltip, Popconfirm,
    Input, Modal, Checkbox,
    /** Ant Design Icons */
    PlusCircleOutlined, EditOutlined, DeleteOutlined,
    CloseOutlined, PlusOutlined, MinusCircleOutlined,
    EyeOutlined
    /** Day js */

} from "@shared/Ui"
const { TextArea } = Input
import useDynamicHeight from "@shared/DynamicHeight"
import { AgGridReact, gridTheme, defaultColDef } from "@shared/AgGridConfig"

const Index = ({ templates, doctors }) => {
    const [loading, setLoading] = useState(false);
    const dynamicHeight = useDynamicHeight()
    // AgGrid Template Data 
    const [filteredData, setFilteredData] = useState(templates)

    useEffect(() => {
        if (templates) {
            setFilteredData(templates);
        }
    }, [templates])

    const colDefs = useMemo(() => [
        {
            headerName: "Doctor",
            field: "doctor_name",
        },
        {
            headerName: "Template",
            field: "name",
        },
        {
            headerName: "Show/Hide",
            field: "show",
            editable: false,
            cellRenderer: (params) => {
                return Number(params.data.show) === 1 ? "Show" : "Hide";
            }
        },
        {
            field: "action",
            headerName: "Action",
            editable: false,
            filter: false,
            sortable: false,
            pinned: 'right',
            cellRenderer: (params) => (
                <>
                    <Tooltip title={`View | Edit Template`} color="volcano" placement="leftTop">
                        <button
                            style={{ border: "1px dashed #FA541C" }}
                            className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2"
                            onClick={() => {
                                TempModalOpen({
                                    id: params.data.id,
                                    user_id: params.data.user_id,
                                    name: params.data.name,
                                    show: params.data.show,
                                    choices: params.data.choices,
                                });
                            }}>
                            <EditOutlined /> | <EyeOutlined />
                        </button>
                    </Tooltip>
                    <Tooltip title={`Delete Template`} color="red" placement="leftTop">
                        <Popconfirm title={`Are you sure you want to delete Template`}
                            onConfirm={() => confirmDelTemplate(params.data.id)}
                            okText="Yes"
                            cancelText="No">
                            <DeleteOutlined
                                style={{ border: "1px dashed red" }}
                                className="btn btn-sm me-1 pt-1 pb-1 ps-2 pe-2" />
                        </Popconfirm>
                    </Tooltip>
                </>
            ),
        },
    ], []);

    // Template Crud
    const defaultValues = {
        user_id: '', name: '', show: 0, choices: [""],
    }

    const [isTempModalShow, setIsTempModalShow] = useState(false)
    const [values, setValues] = useState(defaultValues)

    const TempModalOpen = (data = null) => {
        if (data) {
            let parsedChoices = [];
            if (Array.isArray(data.choices)) {
                parsedChoices = data.choices;
            } else if (typeof data.choices === 'string') {
                try {
                    const json = JSON.parse(data.choices);
                    if (Array.isArray(json)) {
                        parsedChoices = json;
                    } else {
                        parsedChoices = data.choices.split(',').map(c => c.trim()).filter(Boolean);
                    }
                } catch {
                    parsedChoices = data.choices.split(',').map(c => c.trim()).filter(Boolean);
                }
            }

            setValues({
                id: data.id,
                user_id: data.user_id,
                name: data.name,
                show: data.show,
                choices: parsedChoices.length > 0 ? parsedChoices : [""],
            });
        } else {
            setValues(defaultValues);
        }
        setIsTempModalShow(true);
    };

    const TempModalCancel = () => {
        setValues(defaultValues)
        setIsTempModalShow(false)
    }

    const handleChange = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleChoiceChange = (index, newValue) => {
        const newChoices = [...values.choices];
        newChoices[index] = newValue;
        setValues(prev => ({ ...prev, choices: newChoices }));
    };

    const addChoice = () => {
        setValues(prev => ({ ...prev, choices: [...prev.choices, ""] }));
    };
    const removeChoice = (index) => {
        const newChoices = values.choices.filter((_, i) => i !== index);
        setValues(prev => ({ ...prev, choices: newChoices }));
    };


    const handleSubmit = () => {
        setLoading(true);

        const submitValues = {
            ...values,
            choices: Array.isArray(values.choices)
                ? values.choices.filter(choice => choice.trim() !== "")
                : [],
        };

        const isUpdate = !!values.id;
        const url = isUpdate
            ? `/template/update/${values.id}`
            : '/template/store';

        const method = isUpdate ? 'put' : 'post';

        router[method](url, submitValues, {
            preserveScroll: true,
            onSuccess: () => {
                setValues(defaultValues);
                setIsTempModalShow(false);
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };


    // Popconfirm Template Delete
    const confirmDelTemplate = (id) =>
        new Promise((resolve) => {
            router.delete(`/template/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    message.error("Failed to delete department");
                },
            });
        });

    // Flash Messages
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
                                    { title: "Templates" },
                                ]}
                            />
                        </div>
                        <div>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                style={{ borderStyle: "dashed" }}
                                onClick={TempModalOpen}>
                                <PlusCircleOutlined className="me-1" />
                                Template
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{ height: dynamicHeight, overflow: "hidden" }}>
                        <AgGridReact
                            rowData={filteredData} columnDefs={colDefs}
                            defaultColDef={defaultColDef}
                            theme={gridTheme} pagination={true}
                            paginationAutoPageSize={true}
                        />
                    </div>
                </div>
            </div>
            {/* Add Modal */}
            <Modal
                title={
                    <>
                        <div className="d-flex justify-content-between">
                            <span>{values.id ? 'Update Template' : 'Add Template'}</span>
                            <span><CloseOutlined onClick={TempModalCancel} /></span>
                        </div>
                    </>
                }

                open={isTempModalShow}
                onCancel={TempModalCancel}
                onOk={handleSubmit}
                okText={values.id ? 'Update Template' : 'Add Template'}
                maskClosable={false} closeIcon={false}
                styles={{ content: { borderRadius: 0, maxHeight: "80vh", overflowY: "auto", padding: "0 20px" }, }}
                width={600} centered
                confirmLoading={loading} okButtonProps={{ loading: loading }} cancelButtonProps={{ disabled: loading }}>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-3">
                            <label className="w-25 me-1">Select Doctor:</label>
                            <Select
                                className="w-100"
                                placeholder="Select Doctors"
                                allowClear showSearch
                                value={values.user_id || null}
                                onChange={(data) => handleChange("user_id", data)}
                                options={doctors.map((doc) => ({
                                    value: doc.id,
                                    label: doc.name,
                                }))}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <label className="w-25 me-1">Template Name:</label>
                            <Input className="w-100" placeholder="Template Name" allowClear
                                value={values.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <label className="me-1">Show/hide:</label>
                            <Checkbox
                                checked={values.show}
                                onChange={(e) => handleChange("show", e.target.checked)}
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            {values.choices.map((choice, index) => (
                                <div key={index} className="d-flex align-items-center">
                                    <label className="me-1 w-25">{`Choice ${index + 1}`}:</label>
                                    <Input
                                        className="me-1"
                                        value={choice}
                                        onChange={(e) => handleChoiceChange(index, e.target.value)}
                                        placeholder={`Choice ${index + 1}`}
                                        disabled={loading}
                                    />
                                    {values.choices.length > 1 && (
                                        <MinusCircleOutlined
                                            className="btn btn-sm btn-outline-danger mt-2 mb-2"
                                            onClick={() => removeChoice(index)}
                                            style={{ color: 'red' }}
                                        />
                                    )}
                                </div>
                            ))}

                            <button
                                className="btn btn-sm btn-outline-info mt-2 mb-2"
                                onClick={addChoice}
                                block
                                icon={<PlusOutlined />}
                                disabled={loading}>
                                <PlusOutlined />Add Choice
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default Index