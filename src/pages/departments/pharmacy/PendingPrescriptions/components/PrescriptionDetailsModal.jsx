import React from 'react';
import { Modal, Table, Tag, Button, Space, Typography, Divider, Card, Row, Col } from 'antd';
import {
    UserOutlined,
    MedicineBoxOutlined,
    CloseOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const PrescriptionDetailsModal = ({ visible, patientData, onClose }) => {
    const navigate = useNavigate();

    if (!patientData) return null;

    const { patient, prescriptions } = patientData;

    const columns = [
        {
            title: 'Medication',
            dataIndex: 'medicine',
            key: 'medicine',
            render: (medicine) => (
                <div>
                    <Text strong>{medicine?.generic_name}</Text>
                    <br />
                    <Text type="secondary">Code: {medicine?.code}</Text>
                </div>
            ),
        },
        {
            title: 'Dosage & Frequency',
            key: 'dosage',
            render: (record) => (
                <div>
                    <Text strong>{record.dosage}</Text>
                    <br />
                    <Text type="secondary">{record.frequency} • {record.duration} days</Text>
                </div>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (department) => (
                <Tag color="blue">{department?.name}</Tag>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (record) => (
                <Tag 
                    color={record.is_emergency ? 'red' : 'orange'} 
                    icon={record.is_emergency ? <ExclamationCircleOutlined /> : null}
                >
                    {record.is_emergency ? 'EMERGENCY' : 'STANDARD'}
                </Tag>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/shared/departments/pharmacy/prescriptions/${record.visit_id}`)}
                    >
                        View
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => handleWithhold(record)}
                    >
                        Withhold
                    </Button>
                </Space>
            ),
        },
    ];

    const handleWithhold = (prescription) => {
        // Implement withhold logic here
        console.log('Withhold prescription:', prescription.id);
    };

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <UserOutlined className="text-blue-500" />
                    <div>
                        <Title level={4} className="!mb-0">
                            {patient.first_name} {patient.last_name}
                        </Title>
                        <Text type="secondary">
                            {prescriptions.length} pending prescriptions
                        </Text>
                    </div>
                </div>
            }
            visible={visible}
            onCancel={onClose}
            width={1200}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
        >
            {/* Patient Summary */}
            <Card size="small" className="mb-4 bg-gray-50">
                <Row gutter={[16, 8]}>
                    <Col xs={24} md={6}>
                        <div className="space-y-1">
                            <Text type="secondary" className="text-xs">Patient ID</Text>
                            <div className="font-semibold">{patient.folder_number}</div>
                        </div>
                    </Col>
                    <Col xs={24} md={6}>
                        <div className="space-y-1">
                            <Text type="secondary" className="text-xs">Gender & Age</Text>
                            <div className="font-semibold">
                                {patient.gender} • {patient.age || 'N/A'} years
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} md={6}>
                        <div className="space-y-1">
                            <Text type="secondary" className="text-xs">Contact</Text>
                            <div className="font-semibold">{patient.phone_number || 'N/A'}</div>
                        </div>
                    </Col>
                    <Col xs={24} md={6}>
                        <div className="space-y-1">
                            <Text type="secondary" className="text-xs">Emergency Cases</Text>
                            <div className="font-semibold text-red-500">
                                {prescriptions.filter(p => p.is_emergency).length} urgent
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Divider />

            {/* Prescriptions Table */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Title level={5} className="!mb-0 flex items-center">
                        <MedicineBoxOutlined className="mr-2 text-green-500" />
                        Pending Prescriptions
                    </Title>
                    <Tag color="orange">
                        Total: {prescriptions.length} medications
                    </Tag>
                </div>

                <Table
                    columns={columns}
                    dataSource={prescriptions}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                    scroll={{ x: 800 }}
                />
            </div>
        </Modal>
    );
};

export default PrescriptionDetailsModal;