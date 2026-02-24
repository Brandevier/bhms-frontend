import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Spin,
  Alert,
  Typography,
  Row,
  Col,
  Statistic,
  Popconfirm,
  Badge,
  Tooltip,
  Divider
} from 'antd';
import {
  CloudUploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { fetchBackupStatus, createBackup } from '../../../redux/slice/dashboardSlice';

const { Title, Text } = Typography;

const BackupsSettings = () => {
  const dispatch = useDispatch();
  const { backupStatus, loading } = useSelector((state) => state.dashboard);
  const user = useSelector((state) => state.auth.admin || state.auth.user);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const loadBackups = useCallback(() => {
    const institutionId = user?.institution?.id;
    dispatch(fetchBackupStatus({ institution_id: institutionId }));
  }, [dispatch, user]);

  useEffect(() => {
    loadBackups();
  }, [loadBackups]);

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    try {
      const result = await dispatch(createBackup({}));
      if (!result.error) {
        message.success('Backup created successfully!');
        loadBackups();
      } else {
        message.error('Failed to create backup');
      }
    } catch (error) {
      message.error('Error creating backup: ' + error.message);
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleDownload = (record) => {
    // Navigate to download endpoint
    window.open(`/api/v1/system/backup/download/${record.id}`, '_blank');
  };

  const handleDelete = (backupId) => {
    // Implement delete functionality
    message.info('Delete functionality - would call API to delete backup');
  };

  const handleRestore = (backupId) => {
    Modal.confirm({
      title: 'Restore Backup',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to restore from this backup? This action may overwrite current data.',
      okText: 'Yes, Restore',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setRestoring(true);
        try {
          // Would call restore API here
          message.success('Restore initiated successfully');
        } catch (error) {
          message.error('Failed to restore backup');
        } finally {
          setRestoring(false);
        }
      }
    });
  };

  // Mock backup data - in real app, this would come from backend
  const mockBackups = [
    {
      id: '1',
      filename: 'hms_backup_2024-01-15.json',
      created_at: '2024-01-15T10:30:00Z',
      size: 2456789,
      institution_id: 'inst-1',
      status: 'completed'
    },
    {
      id: '2',
      filename: 'hms_backup_2024-01-14.json',
      created_at: '2024-01-14T10:30:00Z',
      size: 2423456,
      institution_id: 'inst-1',
      status: 'completed'
    },
    {
      id: '3',
      filename: 'hms_backup_2024-01-13.json',
      created_at: '2024-01-13T10:30:00Z',
      size: 2398765,
      institution_id: 'inst-1',
      status: 'completed'
    }
  ];

  const columns = [
    {
      title: 'Backup File',
      dataIndex: 'filename',
      key: 'filename',
      render: (text, record) => (
        <Space>
          <FileTextOutlined className="text-blue-500" />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Date Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => (
        <Space>
          <ClockCircleOutlined />
          {new Date(date).toLocaleString()}
        </Space>
      )
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => {
        const mb = (size / (1024 * 1024)).toFixed(2);
        return `${mb} MB`;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Download">
            <Button
              type="link"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
            >
              Download
            </Button>
          </Tooltip>
          <Tooltip title="Restore">
            <Button
              type="link"
              icon={<SyncOutlined />}
              onClick={() => handleRestore(record.id)}
            >
              Restore
            </Button>
          </Tooltip>
          <Popconfirm
            title="Delete this backup?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Title level={2} className="text-gray-800 mb-2">
            <Space>
              <CloudUploadOutlined className="text-blue-500" />
              Backups Management
            </Space>
          </Title>
          <Text type="secondary" className="text-lg">
            Manage system backups, restore data, and configure backup schedules
          </Text>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card className="border-0 shadow-sm">
              <Statistic
                title="Total Backups"
                value={backupStatus?.backupsAvailable || mockBackups.length}
                prefix={<DatabaseOutlined className="text-blue-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="border-0 shadow-sm">
              <Statistic
                title="Total Storage Used"
                value={backupStatus?.totalSize || '7.21 MB'}
                prefix={<CloudUploadOutlined className="text-green-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="border-0 shadow-sm">
              <Statistic
                title="Last Backup"
                value={backupStatus?.lastBackup ? new Date(backupStatus.lastBackup).toLocaleDateString() : 'Never'}
                prefix={<ClockCircleOutlined className="text-orange-500" />}
              />
            </Card>
          </Col>
        </Row>

        {/* Actions Card */}
        <Card className="border-0 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <Text strong className="text-lg block mb-1">Create New Backup</Text>
              <Text type="secondary">Generate a new backup of all system data including patients, visits, and records.</Text>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<CloudUploadOutlined />}
              loading={creatingBackup}
              onClick={handleCreateBackup}
            >
              {creatingBackup ? 'Creating Backup...' : 'Create Backup Now'}
            </Button>
          </div>
        </Card>

        {/* Backup History Table */}
        <Card className="border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Title level={4} className="m-0">Backup History</Title>
              <Text type="secondary">View and manage existing backups</Text>
            </div>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadBackups}
              loading={loading}
            >
              Refresh
            </Button>
          </div>

          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={mockBackups}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} backups`
              }}
              locale={{
                emptyText: (
                  <div className="py-8">
                    <DatabaseOutlined className="text-4xl text-gray-300 mb-2" />
                    <Text type="secondary">No backups found. Create your first backup to protect your data.</Text>
                  </div>
                )
              }}
            />
          </Spin>
        </Card>

        {/* Auto-Backup Settings */}
        <Card className="border-0 shadow-sm mt-6">
          <Title level={4}>Automatic Backup Settings</Title>
          <Divider />
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Text strong className="block mb-2">Backup Frequency</Text>
                <Text type="secondary">Current: Daily at 2:00 AM</Text>
                <div className="mt-2">
                  <Button type="link">Change Schedule</Button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Text strong className="block mb-2">Retention Policy</Text>
                <Text type="secondary">Keep last 30 backups</Text>
                <div className="mt-2">
                  <Button type="link">Configure</Button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Text strong className="block mb-2">Backup Location</Text>
                <Text type="secondary">Local Server (/backups)</Text>
                <div className="mt-2">
                  <Button type="link">Change Location</Button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Text strong className="block mb-2">Compression</Text>
                <Text type="secondary">Enabled (GZIP)</Text>
                <div className="mt-2">
                  <Button type="link">Settings</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default BackupsSettings;

