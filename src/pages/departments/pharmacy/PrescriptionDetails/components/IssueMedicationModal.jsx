import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
    Modal,
    Descriptions,
    Form,
    Input,
    Alert,
    Space,
    Typography,
    Divider
} from 'antd';
import { updatePrescriptionStatus } from '../../../../../redux/slice/prescriptionSlice';

const { Text, Title } = Typography;
const { TextArea } = Input;

const IssueMedicationModal = ({ visible, prescription, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        if (prescription) {
            form.setFieldsValue({
                dispensedQuantity: prescription.quantity,
                notes: ''
            });
        }
    }, [prescription, form]);

    const handleSubmit = async (values) => {
        if (!prescription) return;

        setConfirmLoading(true);
        try {
            await dispatch(updatePrescriptionStatus({
                id: prescription.id,
                status: 'dispensed',
                claim_id: prescription?.visit?.claims?.[0]?.id || null,
                patient_id: prescription?.visit?.patient?.id,
                dispensed_quantity: parseInt(values.dispensedQuantity, 10),
                pharmacist_notes: values.notes
            })).unwrap();

            onSuccess();
        } catch (error) {
            console.error('Failed to issue medication:', error);
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            handleSubmit(values);
        });
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    // Only allow numbers
    const handleQuantityChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        form.setFieldsValue({ dispensedQuantity: value });
    };

    const validateQuantity = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('Please enter quantity to dispense'));
        }

        const numValue = parseInt(value, 10);
        
        if (isNaN(numValue)) {
            return Promise.reject(new Error('Please enter a valid number'));
        }

        if (numValue < 1) {
            return Promise.reject(new Error('Quantity must be at least 1'));
        }

    
        return Promise.resolve();
    };

    if (!prescription) return null;

    return (
        <Modal
            title={
                <Space direction="vertical" size="small">
                    <Title level={4} style={{ margin: 0 }}>
                        Issue Medication
                    </Title>
                    <Text type="secondary">{prescription.medicine?.generic_name}</Text>
                </Space>
            }
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
            okText="Confirm Dispensing"
            cancelText="Cancel"
            width={750}
            maskClosable={!confirmLoading}
        >
            <div style={{ marginBottom: '16px' }}>
                <Alert
                    message="Medication Dispensing"
                    description="Please review the prescription details and enter the quantity to dispense."
                    type="info"
                    showIcon
                />
            </div>

            <Descriptions bordered column={2} size="small" style={{ marginBottom: '16px' }}>
                <Descriptions.Item label="Patient" span={2}>
                    <Text strong>
                        {prescription.visit?.patient?.first_name} {prescription.visit?.patient?.last_name}
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item label="Medication">
                    <Text strong>{prescription.medicine?.generic_name}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Prescribed Quantity">
                    <Text>{prescription.quantity}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Dosage">
                    {prescription.dosage} 
                </Descriptions.Item>

                <Descriptions.Item label="Frequency">
                    {prescription.frequency} times daily
                </Descriptions.Item>

                <Descriptions.Item label="Duration" span={2}>
                    {prescription.duration} days
                </Descriptions.Item>

                <Descriptions.Item label="Doctor's Notes" span={2}>
                    {prescription.notes || <Text type="secondary">No additional notes</Text>}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Form
                form={form}
                layout="vertical"
                requiredMark="optional"
            >
                <Form.Item
                    label="Quantity to Dispense"
                    name="dispensedQuantity"
                    rules={[
                        { required: true, message: 'Please enter quantity to dispense' },
                        { validator: validateQuantity }
                    ]}
                    extra={`Prescribed quantity: ${prescription.quantity}`}
                >
                    <Input
                        style={{ width: '200px' }}
                        placeholder="Enter quantity"
                        onChange={handleQuantityChange}
                        maxLength={5} // Reasonable limit for quantity
                    />
                </Form.Item>

                <Form.Item
                    label="Pharmacist Notes"
                    name="notes"
                    extra="Additional instructions or notes for the patient"
                >
                    <TextArea
                        rows={3}
                        placeholder="Enter any additional notes or instructions for the patient..."
                        maxLength={500}
                        showCount
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default IssueMedicationModal;