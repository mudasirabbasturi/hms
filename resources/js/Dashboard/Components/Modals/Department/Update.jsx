import React, { useEffect, useState } from "react";
import { Modal, Button, Select, Input } from 'antd';
import { router } from "@inertiajs/react";

const { TextArea } = Input;

const DepartmentUpdateModal = ({ departments, open, departmentData, onClose }) => {
    const [values, setValues] = useState({
        parent_id: null,
        name: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (departmentData) {
            setValues({
                parent_id: departmentData.parent_id || null,
                name: departmentData.name || "",
                description: departmentData.description || ""
            });
        }
    }, [departmentData]);

    const handleChange = (key, value) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = () => {
        setLoading(true);
        router.put(`/department/${departmentData.id}`, values, {
            preserveScroll: true,
            onSuccess: () => onClose(),
            onError: (errors) => {
                setLoading(false);
            },
            onFinish: () => setLoading(false)
        });
    };

    return (
        <Modal
            title={`Update Department: ${values.name}`}
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
                    disabled={!values.name.trim()}
                >
                    Update Department
                </Button>,
            ]}
        >
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
                        disabled: dep.id === departmentData?.id
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

export default DepartmentUpdateModal;