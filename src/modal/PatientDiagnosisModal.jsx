import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
const { TextArea } = Input;
import { searchDiagnosis } from "../redux/slice/diagnosisSlice";
import BhmsButton from "../heroComponents/BhmsButton";



const PatientDiagnosisModal = ({ visible, onClose, onSubmit }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { diagnoses, loading } = useSelector((state) => state.diagnosis);

    const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);

    // Handle Search Diagnosis
    const handleSearch = (value) => {
        if (value) dispatch(searchDiagnosis(value));
    };

    // Handle Diagnosis Selection
    const handleSelectDiagnosis = (value, option) => {
        if (!selectedDiagnoses.find(d => d.code === option.value)) {
            setSelectedDiagnoses([...selectedDiagnoses, { code: option.value, description: option.label }]);
        }
    };

    // Remove Selected Diagnosis (Chip)
    const handleRemoveDiagnosis = (code) => {
        setSelectedDiagnoses(selectedDiagnoses.filter(d => d.code !== code));
    };

    // Submit Form
    const handleSubmit = () => {
        form.validateFields().then(values => {
            const diagnosisData = {
                ...values,
                diagnoses: selectedDiagnoses
            };
            onSubmit(diagnosisData);
            form.resetFields();
            setSelectedDiagnoses([]); // Clear selected diagnoses
        });
    };

    return (
        <Modal
            title="Add Patient Diagnosis" 
            open={visible}
            onCancel={onClose}
            footer={[
                <BhmsButton key="cancel" block={false} size="medium" outline onClick={onClose}>Cancel</BhmsButton>,
                <BhmsButton key="submit" block={false} size="medium" onClick={handleSubmit}>Submit</BhmsButton>
            ]}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                {/* Diagnosis Search & Select */}
                <Form.Item label="Search Diagnosis">
                    <Select
                        showSearch
                        placeholder="Type to search ICD-10 codes..."
                        onSearch={handleSearch}
                        onSelect={handleSelectDiagnosis}
                        loading={loading}
                        filterOption={false}
                        options={diagnoses.map(d => ({ value: d.code, label: `${d.code} - ${d.description}` }))}
                    />
                </Form.Item>

                {/* Display Selected Diagnoses as Chips */}
                <Form.Item label="Selected Diagnoses">
                    {selectedDiagnoses.map(d => (
                        <Tag key={d.code} closable onClose={() => handleRemoveDiagnosis(d.code)}>
                            {d.code} - {d.description}
                        </Tag>
                    ))}
                </Form.Item>

                {/* Patient Complaint */}
                <Form.Item name="complain" label="Patient Complain" rules={[{ required: true, message: "Please enter patient complain" }]}>
                    <Input placeholder="Enter patient complain" />
                </Form.Item>

              

                {/* Summary (Textarea) */}
                <Form.Item name="summary" label="Summary" rules={[{ required: true, message: "Please enter summary" }]}>
                    <TextArea rows={3} placeholder="Enter diagnosis summary" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PatientDiagnosisModal;
