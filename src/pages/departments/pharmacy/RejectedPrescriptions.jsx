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
  Modal,
  Descriptions
} from 'antd';
import {
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  EyeOutlined,
  CloseOutlined,
  UndoOutlined
} from '@ant-design/icons';
import { fetchPrescriptions } from '../../../redux/slice/prescriptionSlice';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const RejectedPrescriptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { prescriptions, loading, pagination } = useSelector((state) => state.prescription);
  const [stats, setStats] = useState({
    total: 0,
    emergency: 0,
    today: 0
  });

  useEffect(() => {
    dispatch(fetchPrescriptions({ status: 'canceled' }));
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

  const handleRestoreConfirmation = (prescription) => {
    Modal.confirm({
      title: 'Restore Rejected Prescription',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Patient">
            {prescription.visit.patient.first_name} {prescription.visit.patient.last_name}
          </Descriptions.Item>
          <Descriptions.Item label="Medication">
            {prescription.medicine.generic_name}
          </Descriptions.Item>
          <Descriptions.Item label="Rejection Date">
            {new Date(prescription.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      ),
      okText: 'Restore to Pending',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        return new Promise((resolve, reject) => {
          // Replace with your actual API call
          console.log('Restoring prescription:', prescription.id);
          setTimeout(resolve, 1000); // Simulate async operation
        }).catch(() => console.log('Restoration failed'));
      },
    });
  };

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
      title: 'Rejected On',
      dataIndex: 'updatedAt',
      key: 'rejectedDate',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color="red" icon={<CloseOutlined />}>
          REJECTED
        </Tag>
      ),
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
            View Details
          </Button>
          <Button
            type="primary"
            icon={<UndoOutlined />}
            onClick={() => handleRestoreConfirmation(record)}
          >
            Restore
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Rejected Prescriptions</Title>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Rejected"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
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
              title="Today's Rejections"
              value={stats.today}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Rejected Prescriptions Table */}
      <Card
        title={
          <Space>
            <Badge count={prescriptions.length} showZero style={{ backgroundColor: '#ff4d4f' }} />
            <Text>Rejected Prescriptions</Text>
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

export default RejectedPrescriptions;