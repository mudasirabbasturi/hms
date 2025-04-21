import React, { useState, useEffect } from "react";
import {
    router,
    Modal, Select, Input, Tooltip, Checkbox,
    CloseOutlined, PlusCircleOutlined,
} from "@shared/Ui";

const HandleTemplate = ({ open, onCancel, mode, doctors, data = {} }) => {
    const [loading, setLoading] = useState(false);

    const defaultValues = {
        user_id: '',
        name: '',
        show: true,
        choices: [''],
    };

    const [values, setValues] = useState(defaultValues);

    useEffect(() => {
        if (open && mode === 'update' && data) {
            setValues({
                user_id: data.user_id || '',
                name: data.name || '',
                show: data.show ?? true,
                choices: Array.isArray(data.choices) ? data.choices : [''],
            });
        }
    }, [open, mode, data]);

    const onChange = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleChoiceChange = (index, value) => {
        const updatedChoices = [...values.choices];
        updatedChoices[index] = value;
        setValues(prev => ({
            ...prev,
            choices: updatedChoices,
        }));
    };

    const handleAddChoice = () => {
        setValues(prev => ({
            ...prev,
            choices: [...prev.choices, ''],
        }));
    };

    const handleRemoveChoice = (index) => {
        const updated = [...values.choices];
        updated.splice(index, 1);
        setValues(prev => ({
            ...prev,
            choices: updated,
        }));
    };

    const handleSubmit = () => {
        const payload = {
            ...values,
            choices: values.choices.filter(choice => choice.trim() !== ""),
        };
    };

    return (
        <Modal
            title={
                <div className="d-flex justify-content-between">
                    <span>{mode === 'update' ? 'Update Template' : 'Add Template'}</span>
                    <span>
                        <CloseOutlined onClick={() => {
                            setValues(defaultValues);
                            onCancel();
                        }} />
                    </span>
                </div>
            }
            open={open}
            onCancel={() => {
                setValues(defaultValues);
                onCancel();
            }}
            onOk={handleSubmit}
            okText={mode === 'update' ? 'Update Template' : 'Add Template'}
            maskClosable={false}
            closeIcon={false}
            width={900}
            styles={{
                body: { padding: "20px 0px" },
                content: {
                    borderRadius: 0,
                    // height: "120vh",
                    // overflowY: "auto",
                    padding: "0 20px",
                }
            }}
            centered
            confirmLoading={loading}
            okButtonProps={{ loading }}
            cancelButtonProps={{ disabled: loading }}>
            <div className="row">
                <div className="d-flex align-items-center mb-3">
                    <div className="me-1">
                        <label>Doctor:</label>
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
                    <div className="me-1">
                        <label>Name:</label>
                        <Input
                            placeholder="Template Name"
                            allowClear
                            value={values.name}
                            onChange={(data) => onChange("name", data.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="d-flex align-items-center flex-column">
                        <label htmlFor="">Show/hide</label>
                        <Checkbox
                            checked={values.show}
                            onChange={(e) => onChange("show", e.target.checked)}
                            disabled={loading}>Visible</Checkbox>
                    </div>
                </div>
                {/* Dynamic Choice Inputs */}

                <div className="mb-3">
                    <label>Choices:</label><hr className="m-0 mb-1"></hr>
                    {values.choices.map((choice, index) => (
                        <div key={index} className="d-flex align-items-end flex-column">
                            <div className="d-flex align-items-center mb-1">
                                <label className="me-1">Choice:{`${index + 1}`}</label>
                                <Input
                                    className="me-2"
                                    placeholder={`Choice ${index + 1}`}
                                    value={choice}
                                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                                    disabled={loading}
                                />
                                {values.choices.length > 1 && (
                                    <Tooltip title="Remove">
                                        <CloseOutlined
                                            onClick={() => handleRemoveChoice(index)}
                                            className="text-danger cursor-pointer"
                                        />
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAddChoice}
                        disabled={loading}>
                        <PlusCircleOutlined className="me-1" />
                        Add More!
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default HandleTemplate;
