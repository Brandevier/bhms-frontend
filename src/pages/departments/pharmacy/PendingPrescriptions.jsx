import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    Table,
    Tag,
    Space,
    Statistic,
    Row,
    Col,
    Button,
    Badge,
    Typography,
    Divider,
    Modal
} from 'antd';
import {
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    EyeOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { fetchPrescriptions } from '../../../redux/slice/prescriptionSlice';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const PendingPrescriptions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { prescriptions, loading, pagination } = useSelector((state) => state.prescription);
    const [stats, setStats] = useState({
        total: 0,
        emergency: 0,
        today: 0
    });

    useEffect(() => {
        dispatch(fetchPrescriptions({ status: 'pending' }));
    }, []);

    useEffect(() => {
        if (prescriptions.length) {
            const emergencyCount = prescriptions.filter(p => p.is_emergency).length;
            const todayCount = prescriptions.filter(p => {
                const today = new Date().toISOString().split('T')[0];
                return new Date(p.createdAt).toISOString().split('T')[0] === today;
            }).length;

            setStats({
                total: prescriptions.length,
                emergency: emergencyCount,
                today: todayCount
            });
        }
    }, [prescriptions]);

    const columns = [
        {
            title: 'Patient',
            dataIndex: ['visit', 'patient'],
            key: 'patient',
            render: (patient) => (
                <div>
                    <Text strong>{`${patient?.first_name} ${patient?.last_name}`}</Text>
                    <br />
                    <Text type="secondary">Folder: {patient?.folder_number}</Text>
                </div>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (department) => department?.name || 'N/A',
        },
        {
            title: 'Medication',
            dataIndex: 'medicine',
            key: 'medicine',
            render: (medicine) => (
                <div>
                    <Text strong>{medicine.generic_name}</Text>
                    <br />
                    <Text type="secondary">{medicine.code}</Text>
                </div>
            ),
        },
        {
            title: 'Dosage',
            dataIndex: 'dosage',
            key: 'dosage',
            render: (dosage, record) => (
                <div>
                    <Text>{dosage} mg</Text>
                    <br />
                    <Text type="secondary">{record.frequency}x daily</Text>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_emergency',
            key: 'status',
            render: (isEmergency) => (
                <Tag color={isEmergency ? 'red' : 'blue'} icon={isEmergency ? <ExclamationCircleOutlined /> : null}>
                    {isEmergency ? 'EMERGENCY' : 'Standard'}
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
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/shared/departments/pharmacy/prescriptions/${record.visit_id}`)}
                    >
                        View
                    </Button>
                    <Button
                        danger
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => handleRejectConfirmation(record)}
                    >
                        Reject
                    </Button>
                </Space>
            ),
        },
    ];

    const handleRejectConfirmation = (prescription) => {
        Modal.confirm({
            title: 'Confirm Prescription Rejection',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Are you sure you want to reject this prescription?</p>
                    <p><strong>Patient:</strong> {prescription.visit.patient.first_name} {prescription.visit.patient.last_name}</p>
                    <p><strong>Medication:</strong> {prescription.medicine.generic_name}</p>
                </div>
            ),
            okText: 'Confirm Reject',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                return new Promise((resolve, reject) => {
                    // Replace with your actual API call
                    console.log('Rejecting prescription:', prescription.id);
                    setTimeout(resolve, 1000); // Simulate async operation
                }).catch(() => console.log('Rejection failed'));
            },
        });
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={3}>Pending Prescriptions</Title>

            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Pending"
                            value={stats.total}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Emergency Cases"
                            value={stats.emergency}
                            prefix={<ExclamationCircleOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Today's Requests"
                            value={stats.today}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Divider />

            {/* Prescriptions Table */}
            <Card
                title={
                    <Space>
                        <Badge count={prescriptions.length} showZero />
                        <Text>Pending Prescriptions</Text>
                    </Space>
                }
                loading={loading}
            >
                <Table
                    columns={columns}
                    dataSource={prescriptions}
                    rowKey="id"
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                    }}
                    scroll={{ x: true }}
                />
            </Card>
        </div>
    );
};

export default PendingPrescriptions;