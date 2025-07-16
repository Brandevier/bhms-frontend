import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form, Input, Select, Tag, Spin, message, Typography, AutoComplete } from "antd";
import { ThunderboltOutlined, CloseOutlined } from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";

const { TextArea } = Input;
const { Text } = Typography;

const PatientDiagnosisModal = ({ visible, onClose, onSubmit, data }) => {
    const [form] = Form.useForm();
    const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Memoized filtered diagnoses based on search query
    const filteredDiagnoses = useMemo(() => {
        if (!searchQuery || !data) return [];
        const query = searchQuery.toLowerCase();
        return data.filter(d => 
            d.icd_10_code.toLowerCase().includes(query) || 
            d.diagnosis_name.toLowerCase().includes(query)
        ).slice(0, 100); // Limit to 100 results for performance
    }, [searchQuery]);

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
        setSearchQuery(value);
    };

    const handleSelectDiagnosis = (value, option) => {
        const newDiagnosis = { 
            code: option.key, 
            description: option.label.split(' - ')[1] || option.label 
        };
        
        if (!selectedDiagnoses.some(d => d.code === newDiagnosis.code)) {
            setSelectedDiagnoses(prev => [...prev, newDiagnosis]);
        }
        setSearchQuery(''); // Clear search after selection
    };

    const handleRemoveDiagnosis = (code) => {
        setSelectedDiagnoses(prev => prev.filter(d => d.code !== code));
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            const diagnosisData = {
                ...values,
                diagnoses: selectedDiagnoses.map(d => ({
                    icd_10_code: d.code,
                    diagnosis_name: d.description
                }))
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
                // Get random diagnoses from the props data as mock AI suggestions
                const getRandomDiagnoses = () => {
                    if (!data || data.length === 0) return [];
                    const randomIndices = [];
                    while (randomIndices.length < 3 && randomIndices.length < data.length) {
                        const r = Math.floor(Math.random() * data.length);
                        if (randomIndices.indexOf(r) === -1) randomIndices.push(r);
                    }
                    return randomIndices.map(i => ({
                        code: data[i].icd_10_code,
                        description: data[i].diagnosis_name
                    }));
                };
                
                const mockAiDiagnoses = getRandomDiagnoses();
                
                setSelectedDiagnoses(prev => [
                    ...prev,
                    ...mockAiDiagnoses.filter(d => 
                        !prev.some(p => p.code === d.code)
                    )
                ]);
                
                form.setFieldsValue({
                    doctors_observation: "AI suggests possible conditions based on symptoms. Recommend further tests to confirm."
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
                        disabled={!isOnline || !data || data.length === 0}
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
                    disabled={selectedDiagnoses.length === 0}
                >
                    Submit
                </BhmsButton>
            ]}
            destroyOnClose
            width={800}
        >
            <Form form={form} layout="vertical">
                {/* Diagnosis Search */}
                <Form.Item label="Search Diagnosis (ICD-10)">
                    <AutoComplete
                        options={filteredDiagnoses.map(d => ({
                            key: d.icd_10_code,
                            value: `${d.icd_10_code} - ${d.diagnosis_name}`,
                            label: `${d.icd_10_code} - ${d.diagnosis_name}`
                        }))}
                        onSelect={handleSelectDiagnosis}
                        onSearch={handleSearch}
                        placeholder="Start typing ICD-10 code or diagnosis name..."
                        style={{ width: '100%' }}
                        filterOption={false}
                        notFoundContent={
                            searchQuery ? (
                                <div style={{ padding: 8, textAlign: 'center' }}>
                                    {filteredDiagnoses.length === 0 ? 'No diagnoses found' : 'Keep typing...'}
                                </div>
                            ) : null
                        }
                        value={searchQuery}
                        onChange={setSearchQuery}
                        disabled={!data || data.length === 0}
                    />
                    <Text type="secondary" style={{ fontSize: 12, marginTop: 4 }}>
                        {data ? `${data.length.toLocaleString()} diagnoses available` : 'Loading diagnoses...'}
                    </Text>
                </Form.Item>

                {/* Selected Diagnoses */}
                <Form.Item label="Selected Diagnoses">
                    <div style={{ 
                        minHeight: 60, 
                        border: '1px dashed #d9d9d9', 
                        borderRadius: 4, 
                        padding: 8,
                        backgroundColor: selectedDiagnoses.length > 0 ? '#fafafa' : 'transparent'
                    }}>
                        {selectedDiagnoses.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {selectedDiagnoses.map(d => (
                                    <Tag 
                                        key={d.code}
                                        closable
                                        closeIcon={<CloseOutlined style={{ fontSize: 12 }} />}
                                        onClose={() => handleRemoveDiagnosis(d.code)}
                                        style={{ 
                                            margin: 0,
                                            padding: '4px 8px',
                                            borderRadius: 4,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text strong style={{ marginRight: 4 }}>{d.code}</Text>
                                        <Text ellipsis style={{ maxWidth: 300 }}>{d.description}</Text>
                                    </Tag>
                                ))}
                            </div>
                        ) : (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: 40 
                            }}>
                                <Text type="secondary">No diagnoses selected yet</Text>
                            </div>
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