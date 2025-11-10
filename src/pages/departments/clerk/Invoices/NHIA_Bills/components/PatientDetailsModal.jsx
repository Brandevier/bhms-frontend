import React from 'react';
import { Modal, Descriptions, Tag, Space, Divider, Statistic, Row, Col,Card } from 'antd';
import { 
    UserOutlined, 
    IdcardOutlined,
    InsuranceOutlined,
    CalendarOutlined,
    DollarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ServiceDetailsTable from './ServiceDetailsTable';

const PatientDetailsModal = ({ visible, patient, onClose }) => {
    if (!patient) return null;

    const formatPatientName = () => {
        if (patient.patientName) return patient.patientName;
        if (patient.patient) {
            const { first_name, middle_name, last_name } = patient.patient;
            return [first_name, middle_name, last_name].filter(Boolean).join(' ');
        }
        return 'Unknown Patient';
    };

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatGender = (gender) => {
        return gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other';
    };

    return (
        <Modal
            title={
                <Space>
                    <UserOutlined />
                    Patient Claims Details - {formatPatientName()}
                </Space>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
            centered
        >
            <Space direction="vertical" className="w-full" size="large">
                {/* Patient Information */}
                <Card title="Patient Information" size="small">
                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Full Name" span={2}>
                            {formatPatientName()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Patient ID">
                            {patient.patient?.folder_number || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Gender">
                            {formatGender(patient.patient?.gender)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date of Birth">
                            {patient.patient?.date_ofbirth ? 
                                dayjs(patient.patient.date_of_birth).format('MMM DD, YYYY') : 'N/A'
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Age">
                            {calculateAge(patient.patient?.date_of_birth)} years
                        </Descriptions.Item>
                        <Descriptions.Item label="Insurance Status">
                            <Tag 
                                color={patient.patient?.has_insurance ? 'green' : 'orange'}
                                icon={patient.patient?.has_insurance ? <InsuranceOutlined /> : null}
                            >
                                {patient.patient?.has_insurance ? 'Active NHIA Coverage' : 'No Insurance Coverage'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Account Status">
                            <Tag color={patient.patient?.status === 'active' ? 'green' : 'red'}>
                                {patient.patient?.status?.toUpperCase() || 'UNKNOWN'}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Claims Summary */}
                <Card title="Claims Summary" size="small">
                    <Row gutter={16}>
                        <Col xs={12} sm={6}>
                            <Statistic
                                title="Total NHIA Amount"
                                value={patient.total_nhia_amount || 0}
                                prefix="₵"
                                valueStyle={{ color: '#52c41a' }}
                                precision={2}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <Statistic
                                title="Service Claims"
                                value={patient.services?.length || 0}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <Statistic
                                title="Average per Service"
                                value={patient.services?.length ? (patient.total_nhia_amount / patient.services.length) : 0}
                                prefix="₵"
                                valueStyle={{ color: '#fa8c16' }}
                                precision={2}
                            />
                        </Col>
                        <Col xs={12} sm={6}>
                            <Statistic
                                title="Coverage Status"
                                value={patient.patient?.has_insurance ? 'Eligible' : 'Not Eligible'}
                                valueStyle={{ 
                                    color: patient.patient?.has_insurance ? '#52c41a' : '#ff4d4f' 
                                }}
                            />
                        </Col>
                    </Row>
                </Card>

                {/* Service Details */}
                <Card title="Service Claims Details" size="small">
                    <ServiceDetailsTable services={patient.services} />
                </Card>

                {/* Footer Information */}
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-sm text-gray-600">
                        <strong>Note:</strong> These amounts represent NHIA coverage. 
                        Actual reimbursement may vary based on claim verification and NHIA guidelines.
                    </div>
                </div>
            </Space>
        </Modal>
    );
};

export default PatientDetailsModal;