import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Select, Input, message } from 'antd';
// import { createIntervention } from '../../../redux/slice/clinicalInterventionSlice';
import { createIntervention } from '../../../../../redux/slice/clinicalInterventionSlice';


const { TextArea } = Input; 

const ClinicalInterventionModal = ({ visible, prescription, user, visitId, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { loading: clinical_interventions } = useSelector((state) => state.clinicalIntervention);

    const handleSubmit = (values) => {
        if (!prescription) return;

        dispatch(createIntervention({
            prescription_id: prescription.id,
            issue_type: values.issue_type,
            severity: values.severity,
            description: values.description,
            intervened_by: user.id,
            visit_id: visitId
        }))
            .unwrap()
            .then(() => {
                onSuccess();
            })
            .catch((error) => {
                message.error('Failed to create clinical intervention');
                console.error('Intervention creation error:', error);
            });
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

    return (
        <Modal
            title={`Add Clinical Intervention - ${prescription?.medicine?.generic_name}`}
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={700}
            okText="Submit Intervention"
            okButtonProps={{ loading: clinical_interventions }}
            cancelButtonProps={{ disabled: clinical_interventions }}
            closable={!clinical_interventions}
            maskClosable={!clinical_interventions}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    issue_type: 'dosage_error',
                    severity: 'minor'
                }}
            >
                <Form.Item 
                    label="Issue Type" 
                    name="issue_type" 
                    rules={[{ required: true, message: 'Please select an issue type' }]}
                >
                    <Select>
                        <Select.Option value="dosage_error">Dosage Error</Select.Option>
                        <Select.Option value="duplicate_therapy">Duplicate Therapy</Select.Option>
                        <Select.Option value="allergy_alert">Allergy Alert</Select.Option>
                        <Select.Option value="drug_interaction">Drug Interaction</Select.Option>
                        <Select.Option value="contraindication">Contraindication</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item 
                    label="Severity" 
                    name="severity" 
                    rules={[{ required: true, message: 'Please select severity' }]}
                >
                    <Select>
                        <Select.Option value="minor">Minor</Select.Option>
                        <Select.Option value="moderate">Moderate</Select.Option>
                        <Select.Option value="major">Major</Select.Option>
                        <Select.Option value="life-threatening">Life-Threatening</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter a description' }]}
                >
                    <TextArea 
                        rows={4} 
                        placeholder="Describe the clinical issue and recommended action..."
                        maxLength={1000}
                        showCount
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ClinicalInterventionModal;