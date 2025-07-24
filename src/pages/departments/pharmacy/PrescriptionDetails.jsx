import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {
    Card,
    Button,
    Tag,
    Divider,
    Typography,
    Space,
    Descriptions,
    Modal,
    Input,
    Alert,
    message,
    Badge,
    Form,
    Select,
    List
} from 'antd';
import {
    MedicineBoxOutlined,
    UserOutlined,
    CalendarOutlined,
    CloseOutlined,
    CheckOutlined,
    FileTextOutlined,
    ExclamationCircleOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { fetchPrescriptionsByVisit, updatePrescriptionStatus } from '../../../redux/slice/prescriptionSlice';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PrescriptionDetails = () => {
    const dispatch = useDispatch();
    const { visit_id } = useParams();
    const [issueModalVisible, setIssueModalVisible] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [pharmacistNotes, setPharmacistNotes] = useState('');
    const [showAIRecommendation, setShowAIRecommendation] = useState(false);
    const [selectedPrescriptionForIntervention, setSelectedPrescriptionForIntervention] = useState(null);
    const [interventionModalVisible, setInterventionModalVisible] = useState(false);
    const [viewInterventionsModalVisible, setViewInterventionsModalVisible] = useState(false);

    const { prescriptions, loading } = useSelector((state) => ({
        prescriptions: state.prescription.prescriptions,
        loading: state.prescription.loading
    }));

    useEffect(() => {
        if (visit_id) {
            dispatch(fetchPrescriptionsByVisit(visit_id));
        }
    }, [visit_id, dispatch]);

    const handleIssueMedication = (prescription) => {
        setSelectedPrescription(prescription);
        setIssueModalVisible(true);
    };

    const handleReject = (id) => {
        Modal.confirm({
            title: 'Confirm Rejection',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to reject this prescription?',
            okText: 'Confirm Reject',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                dispatch(updatePrescriptionStatus({ id: id, status: 'canceled' })).unwrap().then((res) => {
                    message.success('prescription issued successfully');
                    setIssueModalVisible(false);
                    setPharmacistNotes('');
                })

            },
        });
    };

    const handleAIRecommendation = () => {
        setShowAIRecommendation(true);
        // In a real app, this would call an AI service
    };

    const getSeverityColor = (severity) => {
        const colors = {
            'minor': 'blue',
            'moderate': 'orange',
            'major': 'red',
            'life-threatening': '#f5222d'
        };
        return colors[severity] || 'gray';
    };

    return (
        <div style={{ padding: '24px', margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: '24px' }}>
                <MedicineBoxOutlined /> Prescription Details
            </Title>

            {loading && <Text>Loading prescriptions...</Text>}

            {prescriptions?.map((prescription, index) => (
                <React.Fragment key={prescription.id}>
                    <Card
                        title={
                            <Space>
                                <Text strong>Prescription #{index + 1}</Text>
                                {prescription.is_emergency && (
                                    <Tag icon={<ExclamationCircleOutlined />} color="red">
                                        EMERGENCY
                                    </Tag>
                                )}
                            </Space>
                        }
                        style={{ marginBottom: '24px' }}
                        extra={
                            <Space>
                                <Tag color={prescription.status === 'pending' ? 'orange' : 'green'}>
                                    {prescription.status.toUpperCase()}
                                </Tag>
                                <Text type="secondary">
                                    {moment(prescription.createdAt).format('DD MMM YYYY, h:mm a')}
                                </Text>
                            </Space>
                        }
                    >
                        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
                            <Descriptions.Item label="Patient" span={2}>
                                <Space direction="vertical">
                                    <Text strong>
                                        {prescription.visit?.patient?.first_name} {prescription.visit?.patient?.last_name}
                                    </Text>
                                    <Text type="secondary">
                                        <UserOutlined /> Folder: {prescription.visit.patient.folder_number}
                                    </Text>
                                    <Text type="secondary">
                                        <CalendarOutlined /> DOB: {moment(prescription.visit.patient.date_of_birth).format('DD/MM/YYYY')}
                                    </Text>
                                </Space>
                            </Descriptions.Item>

                            <Descriptions.Item label="Department">
                                {prescription.department?.name || 'N/A'}
                            </Descriptions.Item>

                            <Descriptions.Item label="Medication" span={2}>
                                <Space direction="vertical">
                                    <Text strong>{prescription.medicine.generic_name}</Text>
                                    <Text type="secondary">Code: {prescription.medicine.code}</Text>
                                    <Text type="secondary">Price: GHC {prescription.medicine.price_ghc}</Text>
                                </Space>
                            </Descriptions.Item>

                            <Descriptions.Item label="Quantity">
                                <Tag color="blue">{prescription.quantity}</Tag>
                            </Descriptions.Item>

                            <Descriptions.Item label="Dosage Instructions" span={3}>
                                <Space direction="vertical">
                                    <Text>
                                        <Text strong>Dosage:</Text> {prescription.dosage} mg
                                    </Text>
                                    <Text>
                                        <Text strong>Frequency:</Text> {prescription.frequency} times daily
                                    </Text>
                                    <Text>
                                        <Text strong>Duration:</Text> {prescription.duration} days
                                    </Text>
                                    <Text>
                                        <Text strong>Period:</Text> {moment(prescription.start_date).format('DD/MM/YYYY')} - {moment(prescription.end_date).format('DD/MM/YYYY')}
                                    </Text>
                                </Space>
                            </Descriptions.Item>

                            <Descriptions.Item label="Prescribing Doctor">
                                {prescription.doctor ? (
                                    <Space>
                                        <UserOutlined />
                                        <Text>
                                            Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}
                                        </Text>
                                        <Tag>{prescription.doctor.staffID}</Tag>
                                    </Space>
                                ) : (
                                    <Text type="secondary">Not specified</Text>
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item label="Notes">
                                {prescription.notes || <Text type="secondary">No notes</Text>}
                            </Descriptions.Item>
                        </Descriptions>

                        {prescription.status !== 'dispensed' ? (
                            <div style={{ marginTop: '24px', textAlign: 'right' }}>
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        onClick={() => handleIssueMedication(prescription)}
                                    >
                                        Issue Medication
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseOutlined />}
                                        onClick={() => handleReject(prescription.id)}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        type="text"
                                        icon={<WarningOutlined />}
                                        onClick={() => {
                                            setSelectedPrescriptionForIntervention(prescription);
                                            if (prescription.clinicalInterventions?.length > 0) {
                                                setViewInterventionsModalVisible(true);
                                            } else {
                                                setInterventionModalVisible(true);
                                            }
                                        }}
                                        danger={prescription.clinicalInterventions?.length > 0}
                                    >
                                        {prescription.clinicalInterventions?.length > 0 ? (
                                            <Badge count={prescription.clinicalInterventions.length} />
                                        ) : null}
                                    </Button>
                                    <Button
                                        type="dashed"
                                        icon={<FileTextOutlined />}
                                        onClick={handleAIRecommendation}
                                    >
                                        AI Review
                                    </Button>
                                </Space>
                            </div>
                        ) : (
                            <div style={{ marginTop: '24px', textAlign: 'right' }}>
                                <Tag icon={<CheckOutlined />} color="success" style={{ padding: '8px 16px', fontSize: '14px' }}>
                                    Medication Dispensed on {moment(prescription.updatedAt).format('MMM D, YYYY')}
                                </Tag>
                                <Button
                                    type="text"
                                    icon={<FileTextOutlined />}
                                    onClick={() => { }}
                                    style={{ marginLeft: '8px' }}
                                >
                                    View Receipt
                                </Button>
                            </div>
                        )}
                    </Card>

                    {showAIRecommendation && (
                        <Alert
                            message="AI Recommendation"
                            description={
                                <div>
                                    <p>Based on the prescription details, here are potential considerations:</p>
                                    <ul>
                                        <li>Drug interaction check: No known interactions detected</li>
                                        <li>Dosage appears appropriate for adult patient</li>
                                        <li>Patient has no known allergies to this medication</li>
                                    </ul>
                                    <p style={{ fontStyle: 'italic' }}>
                                        Note: This is a simulated AI recommendation. In a real application, this would connect to an AI service.
                                    </p>
                                </div>
                            }
                            type="info"
                            showIcon
                            closable
                            onClose={() => setShowAIRecommendation(false)}
                            style={{ marginBottom: '24px' }}
                        />
                    )}

                    {index < prescriptions.length - 1 && <Divider />}
                </React.Fragment>
            ))}

            {/* Issue Medication Modal */}
            <Modal
                title={`Issue Medication - ${selectedPrescription?.medicine.generic_name}`}
                visible={issueModalVisible}
                onOk={() => {
                    dispatch(updatePrescriptionStatus({ id: selectedPrescription.id, status: 'dispensed' })).unwrap().then((res) => {
                        message.success('prescription issued successfully');
                        setIssueModalVisible(false);
                        setPharmacistNotes('');
                    })

                }}
                onCancel={() => {
                    dispatch(updatePrescriptionStatus({ id: selectedPrescription.id, status: 'dispensed' })).unwrap().then((res) => {
                        message.success('prescription issued successfully');
                        setIssueModalVisible(false);
                        setPharmacistNotes('');
                    })

                }}
                okText="Confirm Issue"
                cancelText="Cancel"
                width={700}

            >
                {selectedPrescription && (
                    <div>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Patient" span={2}>
                                {selectedPrescription.visit.patient.first_name} {selectedPrescription.visit.patient.last_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Medication">
                                {selectedPrescription.medicine.generic_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Quantity">
                                {selectedPrescription.quantity}
                            </Descriptions.Item>
                            <Descriptions.Item label="Dosage">
                                {selectedPrescription.dosage} mg
                            </Descriptions.Item>
                            <Descriptions.Item label="Frequency">
                                {selectedPrescription.frequency} times daily
                            </Descriptions.Item>
                            <Descriptions.Item label="Duration">
                                {selectedPrescription.duration} days
                            </Descriptions.Item>
                            <Descriptions.Item label="Doctor's Notes" span={2}>
                                {selectedPrescription.notes || 'None'}
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: '16px' }}>
                            <Text strong>Pharmacist Notes:</Text>
                            <TextArea
                                rows={4}
                                value={pharmacistNotes}
                                onChange={(e) => setPharmacistNotes(e.target.value)}
                                placeholder="Add any additional notes or instructions....."
                            />
                        </div>
                    </div>
                )}
            </Modal>
            <Modal
                title={`Add Clinical Intervention - ${selectedPrescriptionForIntervention?.medicine.generic_name}`}
                visible={interventionModalVisible}
                onCancel={() => {
                    setInterventionModalVisible(false);
                    setSelectedPrescriptionForIntervention(null);
                }}
                footer={null}
                width={800}
            >
                <Form layout="vertical">
                    <Form.Item label="Issue Type" name="issue_type" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="dosage_error">Dosage Error</Select.Option>
                            <Select.Option value="duplicate_therapy">Duplicate Therapy</Select.Option>
                            <Select.Option value="allergy_alert">Allergy Alert</Select.Option>
                            <Select.Option value="drug_interaction">Drug Interaction</Select.Option>
                            <Select.Option value="contraindication">Contraindication</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Severity" name="severity" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="minor">Minor</Select.Option>
                            <Select.Option value="moderate">Moderate</Select.Option>
                            <Select.Option value="major">Major</Select.Option>
                            <Select.Option value="life-threatening">Life-Threatening</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit Intervention
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={`Clinical Interventions - ${selectedPrescriptionForIntervention?.medicine.generic_name}`}
                visible={viewInterventionsModalVisible}
                onCancel={() => setViewInterventionsModalVisible(false)}
                footer={null}
                width={800}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={selectedPrescriptionForIntervention?.clinicalInterventions || []}
                    renderItem={(intervention) => (
                        <List.Item
                            actions={[
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => console.log('Delete', intervention.id)}
                                />
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<WarningOutlined style={{ color: getSeverityColor(intervention.severity) }} />}
                                title={`${intervention.issue_type.replace('_', ' ').toUpperCase()} (${intervention.severity})`}
                                description={
                                    <>
                                        <p>{intervention.description}</p>
                                        <Text type="secondary">
                                            {moment(intervention.intervention_date).format('DD MMM YYYY h:mm a')}
                                        </Text>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

export default PrescriptionDetails;