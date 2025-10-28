import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    Button,
    Space,
    Typography,
    Divider,
    Tag,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';

const { Title, Text } = Typography;

// Import components
import GDRGSearchSelect from './GDRGSearchSelect';
import DiagnosisSearchSelect from './DiagnosisSearchSelect';
import PriceDisplayFields from './PriceDisplayFields';

const EditProcedureModal = ({
    visible,
    onCancel,
    onSave,
    currentProcedure,
}) => {
    const [form] = Form.useForm();
    const [selectedProcedure, setSelectedProcedure] = useState(null);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const { codes } = useSelector((state) => state.dgrgCodes);
    const dispatch = useDispatch();

    useEffect(() => {
        if (visible && currentProcedure) {
            const procedureData = codes.find(code => code.code === currentProcedure.gdrg_code);
            
            // Find diagnosis details if available
            let diagnosisDetails = null;
            if (currentProcedure.corresponding_diagnosis) {
                // Assuming you have access to diagnoses in your state
                const { searchResults: diagnoses = [] } = useSelector((state) => state.icd10);
                diagnosisDetails = diagnoses.find(d => d.id === currentProcedure.corresponding_diagnosis);
            }

            form.setFieldsValue({
                description: currentProcedure.description,
                gdrg_code: currentProcedure.gdrg_code,
                unit_price: procedureData?.nhia_price || currentProcedure.unit_price,
                nhia_amount: procedureData?.nhia_price || currentProcedure.nhia_amount,
                quantity: 1, // Force quantity to always be 1
                corresponding_diagnosis: currentProcedure.corresponding_diagnosis,
                procedure_price: procedureData?.market_price || currentProcedure.procedure_price,
            });
            
            setSelectedProcedure(procedureData);
            setSelectedDiagnosis(diagnosisDetails || currentProcedure.diagnosis_name);
        }
    }, [visible, currentProcedure, form, codes]);

    // Reset form when modal closes
    useEffect(() => {
        if (!visible) {
            form.resetFields();
            setSelectedProcedure(null);
            setSelectedDiagnosis(null);
        }
    }, [visible, form]);

    const handleProcedureSelect = (value, option) => {
        const selected = codes.find(code => code.code === value);
        setSelectedProcedure(selected);
        
        form.setFieldsValue({
            description: selected?.description || '',
            unit_price: selected?.nhia_price || 0,
            nhia_amount: selected?.nhia_price || 0,
            procedure_price: selected?.market_price || 0,
            quantity: 1, // Always reset quantity to 1 when procedure changes
        });
    };

    const handleDiagnosisSelect = (value, option) => {
        setSelectedDiagnosis(option?.diagnosis || value);
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            // Force quantity to be 1
            const finalValues = {
                ...values,
                quantity: 1,
                procedure_price: values.procedure_price || values.unit_price,
                total_amount: values.procedure_price || values.unit_price, // Since quantity is always 1
                
            };
            console.log('Final Values to Save:', finalValues)

            onSave(finalValues);
        });
    };

    const calculateTotal = () => {
        const price = form.getFieldValue('procedure_price') || form.getFieldValue('unit_price') || 0;
        return price; // Quantity is always 1, so total equals price
    };

    // Display diagnosis information instead of just ID
    const renderDiagnosisDisplay = () => {
        if (!selectedDiagnosis) return null;

        if (typeof selectedDiagnosis === 'object') {
            return (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                    <Text strong>{selectedDiagnosis.icd_10_code}</Text>
                    <br />
                    <Text type="secondary">{selectedDiagnosis.diagnosis_name}</Text>
                </div>
            );
        }

        return (
            <div className="mt-2 p-2 bg-gray-50 rounded">
                <Text type="secondary">{selectedDiagnosis}</Text>
            </div>
        );
    };

    return (
        <Modal
            title="Edit Procedure"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    Save Changes
                </Button>,
            ]}
            width={800}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                className="mt-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="gdrg_code"
                        label="Procedure Code"
                        rules={[{ required: true, message: 'Procedure code is required' }]}
                    >
                        <GDRGSearchSelect
                            onChange={handleProcedureSelect}
                            placeholder="Search and select procedure..."
                            defaultValue={currentProcedure?.gdrg_code}
                            value={currentProcedure?.gdrg_code}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Procedure Description"
                    >
                        <Input placeholder="Description will auto-fill" readOnly />
                    </Form.Item>

                    <Form.Item
                        name="corresponding_diagnosis_id"
                        label="Corresponding Diagnosis"
                    >
                        <DiagnosisSearchSelect
                            onChange={handleDiagnosisSelect}
                            placeholder="Search and select diagnosis..."
                            defaultValue={currentProcedure?.diagnosis_name}
                            value={selectedDiagnosis?.id}
                        />
                        {renderDiagnosisDisplay()}
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Quantity"
                    >
                        <InputNumber 
                            min={1} 
                            max={1} 
                            defaultValue={1} 
                            value={1}
                            className="w-full" 
                            placeholder="Quantity" 
                            disabled 
                        />
                    </Form.Item>

                    <PriceDisplayFields selectedProcedure={selectedProcedure} form={form} />
                </div>

                <Divider />

                <div className="bg-gray-50 p-4 rounded-lg">
                    <Title level={5}>Pricing Summary</Title>
                    <Space direction="vertical" className="w-full">
                        <div className="flex justify-between">
                            <span>Unit Price:</span>
                            <span>GHC {form.getFieldValue('unit_price')?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>NHIA Amount:</span>
                            <span>GHC {form.getFieldValue('nhia_amount')?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Procedure Price:</span>
                            <span className="font-semibold">
                                GHC {(form.getFieldValue('procedure_price') || form.getFieldValue('unit_price') || 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Quantity:</span>
                            <span>
                                <Tag color="blue">1 (Fixed)</Tag>
                            </span>
                        </div>
                        <Divider className="my-2" />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total Amount:</span>
                            <span className="text-blue-600">
                                GHC {calculateTotal().toFixed(2)}
                            </span>
                        </div>
                    </Space>
                </div>
            </Form>
        </Modal>
    );
};

export default EditProcedureModal;