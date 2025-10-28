import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Select, message, Spin } from 'antd';
import DiagnosisDrawer from '../../../../drawers/DiagnosisDrawer';
import PrescriptionModal from '../../../../modal/PrescriptionModal';
import CreateProcedureModal from '../../../../modal/CreateProcedureModal';
import CreateClaimLabTestModal from './CreateClaimLabTestModal'
import { createPrescription, updatePrescriptionStatus } from '../../../../redux/slice/prescriptionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createTestResult, updateTestResult } from '../../../../redux/slice/labSlice';

const { Option } = Select;

const AddItemModal = ({
    visible,
    onCancel,
    onSave,
    itemType,
    visit_id,
    claim_id,
    gender,
    patient_id,
    institution_id,
    department_id,
    currentRecord
}) => {
    const [form] = Form.useForm();
    const [showDiagnosisDrawer, setShowDiagnosisDrawer] = useState(false);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showProcedureModal, setShowProcedureModal] = useState(false);
    const [showLabTestModal, setShowLabTestModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const { loading: prescriptionLoading } = useSelector((state) => state.prescription);
    const dispatch = useDispatch();


    const handleOpen = () => {
        setModalVisible(true)
    }

    const handleClose = () => {
        setModalVisible(false)
    }

    const handleSave = (values) => {
        onSave(values);
        form.resetFields();
    };

    const handleAddDiagnosis = () => {
        setShowDiagnosisDrawer(true);
    };

    const handleAddMedication = () => {
        setShowPrescriptionModal(true);
    };

    const handleAddProcedure = () => {
        setShowProcedureModal(true);
    };

    const handleAddLabTest = () => {
        setShowLabTestModal(true);
    };

    const handleDiagnosisFinished = (diagnosisData) => {
        console.log('Diagnosis added:', diagnosisData);
        setShowDiagnosisDrawer(false);
        onCancel();
        message.success('Diagnosis added successfully');
    };

    const handlePrescriptionSave = (prescriptionData) => {
        const submitData = {
            ...prescriptionData,
            visit_id: visit_id,

        }
        dispatch(createPrescription(submitData))
            .unwrap()
            .then((res) => {
                // res contains the created prescription, including its ID
                const prescriptionId = res.id;

                dispatch(updatePrescriptionStatus({
                    id: prescriptionId,         // <-- pass id from response
                    status: 'dispensed',
                    claim_id
                })).unwrap().then(() => {


                onSave()
                message.success('Prescription created and dispensed successfully');
                setShowPrescriptionModal(false);
                onCancel();
                })
            })
            .catch(() => message.error('Failed to create prescription'));

    };

    const handleProcedureSave = (procedureData) => {
        console.log('Procedure added:', procedureData);
        setShowProcedureModal(false);
        onCancel();
        message.success('Procedure added successfully');
    };

    const handleLabTestSave = (labTestData) => {
        const submitData = {
            ...labTestData,
            visit_id,
            claim_id,
            patient_id,
        };

        dispatch(createTestResult(submitData))
            .unwrap()
            .then((res) => {
                const testResultId = res.data?.result; // backend wraps it in `data.result`
                console.log('Created Lab Test Result:', testResultId);
                console.log('submited data',submitData)
                const data = {
                    lab_investigation_id:submitData?.lab_tarrif_id,
                    status: 'completed',
                    claim_id,
                }
                dispatch(updateTestResult({
                    id: testResultId.id,
                    resultData:data
                }));

                onSave();
                message.success('Lab Test added and completed successfully');
                setModalVisible(false);
                onCancel();
            })
            .catch(() => message.error('Failed to add Lab Test'));
    };


    const getItemTypeAction = () => {
        switch (itemType) {
            case 'Diagnosis':
                return (
                    <Button type="primary" onClick={handleAddDiagnosis}>
                        Select Diagnosis
                    </Button>
                );
            case 'Medication':
                return (
                    <Button type="primary" onClick={handleAddMedication}>
                        Select Medication
                    </Button>
                );
            case 'Procedure':
                return (
                    <Button type="primary" onClick={handleAddProcedure}>
                        Select Procedure
                    </Button>
                );
            case 'LabTest':
                return (
                    <Button type="primary" onClick={handleOpen}>
                        Select Lab Test
                    </Button>
                );
            default:
                return (
                    <Button type="primary" onClick={() => form.validateFields().then(handleSave)}>
                        Add {itemType}
                    </Button>
                );
        }
    };

    // For items that use external modals
    const isUsingExternalModal = ['Diagnosis', 'Medication', 'Procedure', 'LabTest'].includes(itemType);

    return (
        <>
            {/* Main Add Item Modal - for simple items */}
            <Modal
                title={`Add ${itemType}`}
                open={visible && !isUsingExternalModal}
                onCancel={onCancel}
                footer={[
                    <Button key="cancel" onClick={onCancel}>
                        Cancel
                    </Button>,
                    getItemTypeAction(),
                ]}
                width={500}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                    onFinish={handleSave}
                >
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Description is required' }]}
                    >
                        <Input placeholder={`Enter ${itemType.toLowerCase()} description`} />
                    </Form.Item>

                    <Form.Item
                        name="unit_price"
                        label="Unit Price (GHC)"
                        rules={[{ required: true, message: 'Unit price is required' }]}
                    >
                        <InputNumber
                            min={0}
                            step={0.01}
                            placeholder="0.00"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Info modal for items that use external modals */}
            <Modal
                title={`Add ${itemType}`}
                open={visible && isUsingExternalModal}
                onCancel={onCancel}
                footer={[
                    <Button key="cancel" onClick={onCancel}>
                        Cancel
                    </Button>,
                    getItemTypeAction(),
                ]}
                width={400}
                centered
            >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p>Click the button below to open the {itemType} selection interface.</p>
                </div>
            </Modal>

            {/* External Modals */}
            <DiagnosisDrawer
                visible={showDiagnosisDrawer}
                onClose={() => setShowDiagnosisDrawer(false)}
                gender={gender}
                visit_id={visit_id}
                claim_id={claim_id}
                patient_id={patient_id}
                institution_id={institution_id}
                department_id={department_id}
                onFinished={handleDiagnosisFinished}
            />

            <PrescriptionModal
                visible={showPrescriptionModal}
                onClose={() => setShowPrescriptionModal(false)}
                onSave={handlePrescriptionSave}
                visit_id={visit_id}
                claim_id={claim_id}
                patient_id={patient_id}
                currentRecord={currentRecord}
            />

            <CreateProcedureModal
                visible={showProcedureModal}
                onClose={() => setShowProcedureModal(false)}
                onSubmit={handleProcedureSave}
                visit_id={visit_id}
                claim_id={claim_id}
                patient_id={patient_id}
                institution_id={institution_id}
                department_id={department_id}
                currentRecord={currentRecord}
            />

            <CreateClaimLabTestModal
                visible={modalVisible}
                onSubmit={handleLabTestSave}
                onCancel={handleClose}
                visit_id={visit_id}
            />
        </>
    );
};

export default AddItemModal;