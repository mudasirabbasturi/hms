import React, { useState } from "react";
import { Modal, Button, Select, Input } from 'antd';
import { router } from "@inertiajs/react";

const { TextArea } = Input;

const DepartmentAddModal = ({ departments, open, onClose }) => {
    const [values, setValues] = useState({
        parent_id: null,
        name: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = () => {
        setLoading(true);
        router.post('/department/store', values, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                setValues({
                    parent_id: null,
                    name: "",
                    description: "",
                });
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    return (
        <Modal
            title="Add New Department"
            open={open}
            onCancel={onClose}
            maskClosable={false}
            footer={[
                <Button key="back" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                >
                    Add Department
                </Button>,
            ]} >
            <div className="mb-2">
                <label>Department Name:</label>
                <Input
                    className="w-100"
                    placeholder="Department Name"
                    allowClear
                    value={values.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="mb-2">
                <label>Select Parent</label>
                <Select
                    className="w-100"
                    placeholder="Select Parent"
                    allowClear
                    value={values.parent_id}
                    onChange={(id) => handleChange("parent_id", id ?? null)}
                    options={departments.map((dep) => ({
                        value: dep.id,
                        label: dep.name,
                    }))}
                    disabled={loading}
                />
            </div>
            <div className="mb-2">
                <label>Description:</label>
                <TextArea
                    rows={4}
                    placeholder="Department Description"
                    allowClear
                    value={values.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    disabled={loading}
                />
            </div>
        </Modal>
    );
};

export default DepartmentAddModal;