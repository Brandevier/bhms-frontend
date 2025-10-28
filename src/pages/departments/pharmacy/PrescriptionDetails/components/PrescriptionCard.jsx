import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
    Card,
    Button,
    Tag,
    Typography,
    Space,
    Descriptions,
    Modal,
    Badge,
    Alert
} from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    CloseOutlined,
    CheckOutlined,
    FileTextOutlined,
    ExclamationCircleOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { updatePrescriptionStatus } from '../../../../../redux/slice/prescriptionSlice';
import PrescriptionActions from './PrescriptionActions';

const { Text } = Typography;

const PrescriptionCard = ({ prescription, index, onIssueMedication, onInterventionClick }) => {
    const dispatch = useDispatch();
    const [showAIRecommendation, setShowAIRecommendation] = useState(false);

    const handleReject = (id) => {
        Modal.confirm({
            title: 'Confirm Rejection',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to reject this prescription?',
            okText: 'Confirm Reject',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                dispatch(updatePrescriptionStatus({ id, status: 'canceled' }))
                    .unwrap()
                    .then(() => {
                        // Success handled by parent
                    });
            },
        });
    };

    const handleAIRecommendation = () => {
        setShowAIRecommendation(true);
    };

    return (
        <>
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
                                {prescription.visit?.patient?.first_name} {prescription.visit?.patient?.last_name || 'N/A'}
                            </Text>
                            <Text type="secondary">
                                <UserOutlined /> Folder: {prescription.visit?.patient?.folder_number || 'N/A'}
                            </Text>
                            <Text type="secondary">
                                <CalendarOutlined /> DOB: {moment(prescription.visit?.patient?.date_of_birth).format('DD/MM/YYYY')}
                            </Text>
                        </Space>
                    </Descriptions.Item>

                    <Descriptions.Item label="Department">
                        {prescription.department?.name || 'N/A'}
                    </Descriptions.Item>

                    <Descriptions.Item label="Medication" span={2}>
                        <Space direction="vertical">
                            <Text strong>{prescription.medicine?.generic_name || 'N/A'}</Text>
                            <Text type="secondary">Code: {prescription?.medicine?.code || 'N/A'}</Text>
                            <Tag color="blue" style={{ marginTop: '8px' }}>
                                Price: GHC {prescription?.medicine?.market_price || 'N/A'}
                            </Tag>
                            <Tag color="green" style={{ marginTop: '8px' }}>
                                NHIA Price: GHC {prescription?.medicine?.nhia_price || 'N/A'}
                            </Tag>
                            <Tag color={prescription?.medicine?.is_nhia_covered ? 'green' : 'red'} style={{ marginTop: '8px' }}>
                                {prescription?.medicine?.is_nhia_covered ? 'NHIA Covered' : 'Not NHIA Covered'}
                            </Tag>
                        </Space>
                    </Descriptions.Item>

                    <Descriptions.Item label="Quantity">
                        <Tag color="blue">{prescription?.quantity || 'N/A'}</Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Dosage Instructions" span={3}>
                        <Space direction="vertical">
                            <Text>
                                <Text strong>Dosage:</Text> {prescription?.dosage || 'N/A'} mg
                            </Text>
                            <Text>
                                <Text strong>Frequency:</Text> {prescription?.frequency || 'N/A'} times daily
                            </Text>
                            <Text>
                                <Text strong>Duration:</Text> {prescription?.duration || 'N/A'} days
                            </Text>
                            <Text>
                                <Text strong>Period:</Text> {moment(prescription?.start_date).format('LLL')} - {moment(prescription.end_date).format('LLL')}
                            </Text>
                        </Space>
                    </Descriptions.Item>

                    <Descriptions.Item label="Prescribing Doctor">
                        {prescription.doctor ? (
                            <Space>
                                <UserOutlined />
                                <Text>
                                    Dr. {prescription?.doctor?.firstName || 'N/A'} {prescription?.doctor?.lastName || 'N/A'}
                                </Text>
                                <Tag>{prescription?.doctor?.staffID}</Tag>
                            </Space>
                        ) : (
                            <Text type="secondary">Not specified</Text>
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Notes">
                        {prescription.notes || <Text type="secondary">No notes</Text>}
                    </Descriptions.Item>
                </Descriptions>

                <PrescriptionActions
                    prescription={prescription}
                    onIssueMedication={onIssueMedication}
                    onReject={handleReject}
                    onInterventionClick={onInterventionClick}
                    onAIRecommendation={handleAIRecommendation}
                />
            </Card>

            {showAIRecommendation && (
                <AIRecommendationAlert onClose={() => setShowAIRecommendation(false)} />
            )}
        </>
    );
};

const AIRecommendationAlert = ({ onClose }) => (
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
        onClose={onClose}
        style={{ marginBottom: '24px' }}
    />
);

export default PrescriptionCard;