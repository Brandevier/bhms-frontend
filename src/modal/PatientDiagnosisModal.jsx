import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, Tag, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ThunderboltOutlined } from "@ant-design/icons";
const { TextArea } = Input;
import { searchDiagnosis } from "../redux/slice/diagnosisSlice";
import BhmsButton from "../heroComponents/BhmsButton";
import { Typography } from 'antd';
const { Text } = Typography;

const PatientDiagnosisModal = ({ visible, onClose, onSubmit }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { diagnoses, loading, addDiagnosisStatus } = useSelector((state) => state.diagnosis);
    const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Check internet connection status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSearch = (value) => {
        if (value) dispatch(searchDiagnosis(value));
    };

    const handleSelectDiagnosis = (value, option) => {
        if (!selectedDiagnoses.find(d => d.code === option.value)) {
            setSelectedDiagnoses([...selectedDiagnoses, { code: option.value, description: option.label }]);
        }
    };

    const handleRemoveDiagnosis = (code) => {
        setSelectedDiagnoses(selectedDiagnoses.filter(d => d.code !== code));
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            const diagnosisData = {
                ...values,
                diagnosis_name: selectedDiagnoses
            };
            onSubmit(diagnosisData);
            form.resetFields();
            setSelectedDiagnoses([]);
        });
    };

    const handleAiAssist = () => {
        if (!isOnline) {
            message.warning("AI features require an internet connection");
            return;
        }

        // This would be where you call your actual AI service
        message.info("AI diagnosis assistant is analyzing the case...");
        
        // Example mock AI response (replace with real API call)
        setTimeout(() => {
            const mockAiDiagnoses = [
                { code: "J18.9", description: "Pneumonia, unspecified" },
                { code: "R50.9", description: "Fever, unspecified" }
            ];
            
            setSelectedDiagnoses(prev => [
                ...prev,
                ...mockAiDiagnoses.filter(d => !prev.some(p => p.code === d.code))
            ]);
            
            form.setFieldsValue({
                doctors_observation: "AI suggests possible respiratory infection based on symptoms. Recommend further tests to confirm."
            });
            
            message.success("AI has provided diagnostic suggestions");
        }, 2000);
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Add Patient Diagnosis</span>
                    <Button 
                        icon={<ThunderboltOutlined />} 
                        onClick={handleAiAssist}
                        type="text"
                        style={{ color: isOnline ? '#1890ff' : '#ccc' }}
                        title={isOnline ? "Get AI diagnostic suggestions" : "AI requires internet"}
                    >
                        AI Assist
                    </Button>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <BhmsButton key="cancel" block={false} size="medium" outline onClick={onClose}>
                    Cancel
                </BhmsButton>,
                <BhmsButton 
                    key="submit" 
                    block={false} 
                    size="medium" 
                    onClick={handleSubmit} 
                    disabled={addDiagnosisStatus}
                >
                    {addDiagnosisStatus ? <Spin /> : 'Submit'}
                </BhmsButton>
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
                        options={diagnoses.map(d => ({ 
                            value: d.code, 
                            label: `${d.code} - ${d.description}` 
                        }))}
                    />
                </Form.Item>

                {/* Selected Diagnoses Chips */}
                <Form.Item label="Selected Diagnoses">
                    {selectedDiagnoses.length > 0 ? (
                        selectedDiagnoses.map(d => (
                            <Tag 
                                key={d.code} 
                                closable 
                                onClose={() => handleRemoveDiagnosis(d.code)}
                                style={{ marginBottom: 4 }}
                            >
                                {d.code} - {d.description}
                            </Tag>
                        ))
                    ) : (
                        <Text type="secondary">No diagnoses selected yet</Text>
                    )}
                </Form.Item>

                {/* Patient Complaint */}
                <Form.Item 
                    name="patient_complaints" 
                    label="Patient Complaints" 
                    rules={[{ required: true, message: "Please enter patient complaints" }]}
                >
                    <Input placeholder="Enter patient complaints" />
                </Form.Item>

                {/* Summary (Textarea) with AI hint */}
                <Form.Item 
                    name="doctors_observation" 
                    label={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Clinical Summary</span>
                            {isOnline && (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    AI can help generate this
                                </Text>
                            )}
                        </div>
                    }
                    rules={[{ required: true, message: "Please enter summary" }]}
                >
                    <TextArea rows={3} placeholder="Enter clinical findings and assessment" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PatientDiagnosisModal;