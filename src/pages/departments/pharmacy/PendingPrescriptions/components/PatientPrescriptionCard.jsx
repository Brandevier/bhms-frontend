import React from 'react';
import { Card, Tag, Typography, Space, Badge, Row, Col } from 'antd';
import {
    UserOutlined,
    MedicineBoxOutlined,
    ExclamationCircleOutlined,
    CalendarOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;

const PatientPrescriptionCard = ({ patientData, onViewDetails }) => {
    const { patient, prescriptions } = patientData;
    
    const hasEmergency = prescriptions.some(p => p.is_emergency);
    const departments = [...new Set(prescriptions.map(p => p.department?.name))].filter(Boolean);
    const lastPrescribed = prescriptions.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    )[0]?.createdAt;

    return (
        <Card 
            size="small" 
            className="hover:shadow-md transition-shadow cursor-pointer border-0"
            onClick={onViewDetails}
            bodyStyle={{ padding: '16px' }}
        >
            <Row gutter={[16, 8]} align="middle">
                {/* Patient Avatar and Basic Info */}
                <Col xs={24} md={8}>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserOutlined className="text-blue-600 text-lg" />
                            </div>
                            <Badge 
                                count={prescriptions.length} 
                                size="small"
                                className="absolute -top-1 -right-1"
                                style={{ backgroundColor: '#ff4d4f' }}
                            />
                        </div>
                        <div className="flex-1">
                            <Title level={5} className="!mb-1 !text-base">
                                {patient.first_name} {patient.last_name}
                            </Title>
                            <Text type="secondary" className="text-xs flex items-center">
                                <UserOutlined className="mr-1" />
                                ID: {patient.folder_number}
                            </Text>
                        </div>
                    </div>
                </Col>

                {/* Patient Details */}
                <Col xs={24} md={6}>
                    <Space direction="vertical" size={0}>
                        <Text className="text-sm flex items-center">
                            <PhoneOutlined className="mr-2 text-gray-400" />
                            {patient.phone_number || 'No phone'}
                        </Text>
                        <Text type="secondary" className="text-xs">
                            {patient.gender} • {patient.age ? `${patient.age} years` : 'Age N/A'}
                        </Text>
                    </Space>
                </Col>

                {/* Prescription Summary */}
                <Col xs={24} md={6}>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <Text type="secondary" className="text-xs">Medications:</Text>
                            <Text strong className="text-sm">{prescriptions.length}</Text>
                        </div>
                        <div className="flex items-center justify-between">
                            <Text type="secondary" className="text-xs">Departments:</Text>
                            <Text strong className="text-sm">{departments.length}</Text>
                        </div>
                    </div>
                </Col>

                {/* Status and Actions */}
                <Col xs={24} md={4}>
                    <div className="flex flex-col items-end space-y-2">
                        {hasEmergency && (
                            <Tag color="red" icon={<ExclamationCircleOutlined />}>
                                EMERGENCY
                            </Tag>
                        )}
                        <Text type="secondary" className="text-xs flex items-center">
                            <CalendarOutlined className="mr-1" />
                            {lastPrescribed ? moment(lastPrescribed).format('DD MMM') : 'N/A'}
                        </Text>
                    </div>
                </Col>
            </Row>

            {/* Quick Medication Preview */}
            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <Text type="secondary" className="text-xs">
                        Medications: {prescriptions.slice(0, 3).map(p => p.medicine?.generic_name).join(', ')}
                        {prescriptions.length > 3 && ` +${prescriptions.length - 3} more`}
                    </Text>
                    <Tag color="blue">
                        <MedicineBoxOutlined className="mr-1" />
                        {prescriptions.length} pending
                    </Tag>
                </div>
            </div>
        </Card>
    );
};

export default PatientPrescriptionCard;