import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    Table,
    Space,
    Row,
    Col,
    Typography,
    Divider,
    Button
} from 'antd';
import { FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchPrescriptions } from '../../../../redux/slice/prescriptionSlice';
import StatsCards from './components/StatsCards';
import PatientPrescriptionCard from './components/PatientPrescriptionCard';
import PrescriptionDetailsModal from './components/PrescriptionDetailsModal';
import { groupPrescriptionsByPatient, calculateStats } from './utils/helpers';

const { Title, Text } = Typography;

const PendingPrescriptions = () => {
    const dispatch = useDispatch();
    const { prescriptions, loading } = useSelector((state) => state.prescription);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchPrescriptions({ status: 'pending' }));
    }, [dispatch]);

    // Group prescriptions by patient
    const patientsData = groupPrescriptionsByPatient(prescriptions);
    const patientList = Object.values(patientsData);
    const stats = calculateStats(prescriptions);

    const handleViewDetails = (patientData) => {
        setSelectedPatient(patientData);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedPatient(null);
        setIsModalVisible(false);
    };

    const handleRefresh = () => {
        dispatch(fetchPrescriptions({ status: 'pending' }));
    };

    const columns = [
        {
            title: 'Patient Information',
            key: 'patient',
            render: (_, record) => (
                <PatientPrescriptionCard 
                    patientData={record}
                    onViewDetails={() => handleViewDetails(record)}
                />
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (_, record) => (
                <div>
                    <Text strong>{record.prescriptions[0]?.department?.name || 'N/A'}</Text>
                    <br />
                    <Text type="secondary">
                        {new Set(record.prescriptions.map(p => p.department?.name)).size} department(s)
                    </Text>
                </div>
            ),
        },
        {
            title: 'Last Prescribed',
            dataIndex: 'lastPrescribed',
            key: 'lastPrescribed',
            render: (date) => (
                <Text>
                    {date ? new Date(date).toLocaleDateString() : 'N/A'}
                </Text>
            ),
            sorter: (a, b) => new Date(a.lastPrescribed) - new Date(b.lastPrescribed),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => handleViewDetails(record)}
                    size="small"
                >
                    View Details ({record.prescriptions.length})
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{  margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <div className="flex justify-between items-center">
                        <Title level={2} style={{ margin: 0 }}>
                            <FileTextOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                            Pending Prescriptions
                        </Title>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                    </div>
                    <Text type="secondary">
                        Manage and process all pending medication requests
                    </Text>
                </div>

                {/* Statistics Cards */}
                <StatsCards stats={stats} />

                <Divider />

                {/* Patients Table */}
                <Card
                    title={
                        <Space>
                            <Text strong>Pending Medication Requests</Text>
                            <Text type="secondary">
                                {patientList.length} patients • {prescriptions.length} total prescriptions
                            </Text>
                        </Space>
                    }
                    loading={loading}
                    style={{ borderRadius: '8px' }}
                >
                    <Table
                        columns={columns}
                        dataSource={patientList}
                        rowKey={record => record.patient.id}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => 
                                `${range[0]}-${range[1]} of ${total} patients`,
                        }}
                        scroll={{ x: 800 }}
                    />
                </Card>

                {/* Prescription Details Modal */}
                <PrescriptionDetailsModal
                    visible={isModalVisible}
                    patientData={selectedPatient}
                    onClose={handleCloseModal}
                />
            </div>
        </div>
    );
};

export default PendingPrescriptions;