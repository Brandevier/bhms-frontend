import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, Tag, Spin, message, Typography } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { searchDiagnosis } from "../redux/slice/diagnosisSlice";
import BhmsButton from "../heroComponents/BhmsButton";

const { TextArea } = Input;
const { Text } = Typography;

const PatientDiagnosisModal = ({ visible, onClose, onSubmit }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { searchResults, searchLoading, addDiagnosisStatus } = useSelector((state) => state.diagnosis);
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
        const newDiagnosis = { 
            code: option.value, 
            description: option.label.split(' - ')[1] || option.label 
        };
        
        if (!selectedDiagnoses.find(d => d.code === newDiagnosis.code)) {
            setSelectedDiagnoses([...selectedDiagnoses, newDiagnosis]);
        }
    };

    const handleRemoveDiagnosis = (code) => {
        setSelectedDiagnoses(selectedDiagnoses.filter(d => d.code !== code));
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            const diagnosisData = {
                ...values,
                diagnoses: selectedDiagnoses // Changed from diagnosis_name to diagnoses
            };
            onSubmit(diagnosisData);
            form.resetFields();
            setSelectedDiagnoses([]);
        }).catch(err => {
            console.error("Form validation failed:", err);
        });
    };

    const handleAiAssist = () => {
        if (!isOnline) {
            message.warning("AI features require an internet connection");
            return;
        }

        message.loading("AI diagnosis assistant is analyzing the case...", 2.5)
            .then(() => {
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
            });
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
                        disabled={!isOnline}
                    >
                        AI Assist
                    </Button>
                </div>
            }
            open={visible}
            onCancel={() => {
                onClose();
                form.resetFields();
                setSelectedDiagnoses([]);
            }}
            footer={[
                <BhmsButton key="cancel" block={false} size="medium" outline onClick={() => {
                    onClose();
                    form.resetFields();
                    setSelectedDiagnoses([]);
                }}>
                    Cancel
                </BhmsButton>,
                <BhmsButton 
                    key="submit" 
                    block={false} 
                    size="medium" 
                    onClick={handleSubmit} 
                    disabled={addDiagnosisStatus}
                    loading={addDiagnosisStatus}
                >
                    Submit
                </BhmsButton>
            ]}
            destroyOnClose
            width={800}
        >
            <Form form={form} layout="vertical">
                {/* Diagnosis Search & Select */}
                <Form.Item label="Search Diagnosis">
                    <Select
                        showSearch
                        placeholder="Type to search ICD-10 codes..."
                        onSearch={handleSearch}
                        onSelect={handleSelectDiagnosis}
                        loading={searchLoading}
                        filterOption={false}
                        notFoundContent={searchLoading ? <Spin size="small" /> : null}
                        options={searchResults.map(d => ({ 
                            value: d.code, 
                            label: `${d.code} - ${d.description}` 
                        }))}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                {/* Selected Diagnoses Chips */}
                <Form.Item label="Selected Diagnoses">
                    <div style={{ minHeight: '32px' }}>
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
                    </div>
                </Form.Item>

                {/* Patient Complaint */}
                <Form.Item 
                    name="patient_complaints" 
                    label="Patient Complaints" 
                    rules={[{ required: true, message: "Please enter patient complaints" }]}
                >
                    <TextArea rows={2} placeholder="Enter patient complaints" />
                </Form.Item>

                {/* Clinical Summary */}
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
                    <TextArea rows={4} placeholder="Enter clinical findings and assessment" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PatientDiagnosisModal;