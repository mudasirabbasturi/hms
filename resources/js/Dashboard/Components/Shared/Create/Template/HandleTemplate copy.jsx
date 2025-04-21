import React, { useState, useEffect } from "react"
import {
    /** Inertia.js - For page navigation and routing */
    router,
    /** Ant Design Components - UI components from Ant Design */
    Modal, Select, Input, DatePicker, Tooltip, Checkbox,
    /** Ant Design Icons - For using Ant Design's pre-built icons */
    CloseOutlined, PlusCircleOutlined,
    /** Day.js - */
    /**React International Phone -  */

} from "@shared/Ui"

const HandleTemplate = ({ open, onCancel, mode, doctors }) => {
    const [loading, setLoading] = useState(false)
    const defaultValues = {
        user_id: '',
        name: '',
        show: true,
        choices: [],
    };

    const [values, setValues] = useState(defaultValues);
    const [newChoice, setNewChoice] = useState('');

    const onChange = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }));
    }

    const handleAddChoice = () => {
        if (newChoice.trim() !== '') {
            setValues(prev => ({
                ...prev,
                choices: [...prev.choices, newChoice.trim()],
            }));
            setNewChoice('');
        }
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
            choices: values.choices,
        };
    };
    return (
        <Modal
            title={
                <div className="d-flex justify-content-between">
                    <span>{mode === 'update' ? 'Update Token' : 'Add Token'}</span>
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
            onOk={handleSubmit}
            okText={mode === 'update' ? 'Update Template' : 'Add Template'}
            maskClosable={false} closeIcon={false}
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
                            value={values.show}
                            onChange={(data) => onChange("show", data.target.value)}
                            disabled={loading}></Checkbox>
                    </div>
                </div>
                <div className="d-flex align-items-end flex-column mb-2">
                    <div className="d-flex align-items-center mb-1">
                        <label className="me-1">Choice</label>
                        <Input
                            placeholder="Choice"
                            allowClear
                            value={values.name}
                            onChange={(data) => onChange("choice", data.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-info btn-sm">Add More!</button>
                </div>
            </div>
        </Modal>
    );
}
export default HandleTemplate