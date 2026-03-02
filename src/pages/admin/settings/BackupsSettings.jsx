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
  Typography,
  Row,
  Col,
  Statistic,
  Popconfirm,
  Tooltip,
  Divider,
  Switch,
  Select,
  InputNumber,
  Alert,
  Input
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
  SyncOutlined,
  SettingOutlined,
  SaveOutlined
} from '@ant-design/icons';
import {
  fetchBackups,
  createBackup,
  deleteBackup,
  restoreBackup,
  fetchBackupSettings,
  updateBackupSettings,
  clearBackupError,
  clearBackupSuccess
} from '../../../redux/slice/backupSlice';

const { Title, Text } = Typography;
const { Option } = Select;

const BackupsSettings = () => {
  const dispatch = useDispatch();
  const {
    backups,
    totalBackups,
    totalSize,
    settings,
    lastBackup,
    loading,
    creating,
    restoring,
    deleting,
    settingsLoading,
    error,
    successMessage,
    restoreStatus
  } = useSelector((state) => state.backup);
  
  const user = useSelector((state) => state.auth.admin || state.auth.user);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const loadBackups = useCallback(() => {
    const institutionId = user?.institution?.id;
    dispatch(fetchBackups({ institution_id: institutionId }));
  }, [dispatch, user]);

  const loadSettings = useCallback(() => {
    dispatch(fetchBackupSettings());
  }, [dispatch]);

  useEffect(() => {
    loadBackups();
    loadSettings();
  }, [loadBackups, loadSettings]);

  // Update local settings when settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Show success/error messages
  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      dispatch(clearBackupSuccess());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearBackupError());
    }
  }, [error, dispatch]);

  const handleCreateBackup = async () => {
    const institutionId = user?.institution?.id;
    try {
      const result = await dispatch(createBackup({ institution_id: institutionId }));
      if (!result.error) {
        message.success('Backup created successfully!');
        loadBackups();
      }
    } catch (error) {
      message.error('Error creating backup: ' + error.message);
    }
  };

  const handleDownload = (record) => {
    // Navigate to download endpoint
    window.open(`/api/v1/system/backup/download/${record.id}`, '_blank');
  };

  const handleDelete = (backupId) => {
    dispatch(deleteBackup(backupId)).then((result) => {
      if (!result.error) {
        message.success('Backup deleted successfully');
      }
    });
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
        try {
          const result = await dispatch(restoreBackup(backupId));
          if (!result.error) {
            message.success('Restore initiated successfully');
          }
        } catch (error) {
          message.error('Failed to restore backup');
        }
      }
    });
  };

  const handleSaveSettings = () => {
    dispatch(updateBackupSettings(localSettings)).then((result) => {
      if (!result.error) {
        message.success('Backup settings saved successfully');
        setSettingsModalVisible(false);
      }
    });
  };

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
          {date ? new Date(date).toLocaleString() : 'N/A'}
        </Space>
      )
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => {
        if (!size) return 'N/A';
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
          {status ? status.toUpperCase() : 'COMPLETED'}
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
              loading={restoring && restoreStatus?.status === 'in_progress'}
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

  // Restore status alert
  if (restoreStatus) {
    const statusColor = restoreStatus.status === 'completed' ? 'success' : 
                        restoreStatus.status === 'failed' ? 'error' : 'processing';
    const statusIcon = restoreStatus.status === 'completed' ? <CheckCircleOutlined /> :
                       restoreStatus.status === 'failed' ? <ExclamationCircleOutlined /> :
                       <SyncOutlined spin />;
    
    return (
      <Alert
        message="Restore Status"
        description={restoreStatus.message}
        type={statusColor}
        icon={statusIcon}
        showIcon
        closable
        style={{ marginBottom: 16 }}
        action={
          <Button size="small" onClick={() => dispatch(clearRestoreStatus())}>
            Dismiss
          </Button>
        }
      />
    );
  }

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
                value={totalBackups || backups.length || 0}
                prefix={<DatabaseOutlined className="text-blue-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="border-0 shadow-sm">
              <Statistic
                title="Total Storage Used"
                value={totalSize || '0 MB'}
                prefix={<CloudUploadOutlined className="text-green-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="border-0 shadow-sm">
              <Statistic
                title="Last Backup"
                value={lastBackup ? new Date(lastBackup).toLocaleDateString() : 'Never'}
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
            <Space>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setSettingsModalVisible(true)}
              >
                Settings
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<CloudUploadOutlined />}
                loading={creating}
                onClick={handleCreateBackup}
              >
                {creating ? 'Creating Backup...' : 'Create Backup Now'}
              </Button>
            </Space>
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
              dataSource={backups}
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
                <Text type="secondary">
                  Current: {settings.frequency === 'daily' ? 'Daily' : 
                           settings.frequency === 'weekly' ? 'Weekly' : 
                           settings.frequency === 'monthly' ? 'Monthly' : 'Custom'}
                  {settings.time ? ` at ${settings.time}` : ''}
                </Text>
                <div className="mt-2">
                  <Button type="link" onClick={() => setSettingsModalVisible(true)}>Change Schedule</Button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Text strong className="block mb-2">Retention Policy</Text>
                <Text type="secondary">Keep last {settings.retentionDays || 30} backups</Text>
                <div className="mt-2">
                  <Button type="link" onClick={() => setSettingsModalVisible(true)}>Configure</Button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Text strong className="block mb-2">Backup Location</Text>
                <Text type="secondary">{settings.location || '/backups'}</Text>
                <div className="mt-2">
                  <Button type="link" onClick={() => setSettingsModalVisible(true)}>Change Location</Button>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Text strong className="block mb-2">Compression</Text>
                <Text type="secondary">{settings.compression ? 'Enabled (GZIP)' : 'Disabled'}</Text>
                <div className="mt-2">
                  <Button type="link" onClick={() => setSettingsModalVisible(true)}>Settings</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Settings Modal */}
        <Modal
          title={
            <Space>
              <SettingOutlined />
              Backup Settings
            </Space>
          }
          open={settingsModalVisible}
          onCancel={() => setSettingsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setSettingsModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              icon={<SaveOutlined />}
              loading={settingsLoading}
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          ]}
          width={600}
        >
          <Spin spinning={settingsLoading}>
            <div className="space-y-4">
              {/* Auto Backup Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Text strong>Automatic Backup</Text>
                  <Text type="secondary" className="block">Enable automatic scheduled backups</Text>
                </div>
                <Switch
                  checked={localSettings.autoBackup}
                  onChange={(checked) => setLocalSettings({ ...localSettings, autoBackup: checked })}
                />
              </div>

              {/* Frequency */}
              <div>
                <Text strong className="block mb-2">Backup Frequency</Text>
                <Select
                  style={{ width: '100%' }}
                  value={localSettings.frequency}
                  onChange={(value) => setLocalSettings({ ...localSettings, frequency: value })}
                >
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                </Select>
              </div>

              {/* Time */}
              <div>
                <Text strong className="block mb-2">Backup Time</Text>
                <Input
                  type="time"
                  style={{ width: '100%' }}
                  value={localSettings.time}
                  onChange={(e) => setLocalSettings({ ...localSettings, time: e.target.value })}
                />
              </div>

              {/* Retention Days */}
              <div>
                <Text strong className="block mb-2">Retention Period (days)</Text>
                <InputNumber
                  min={1}
                  max={365}
                  style={{ width: '100%' }}
                  value={localSettings.retentionDays}
                  onChange={(value) => setLocalSettings({ ...localSettings, retentionDays: value })}
                />
                <Text type="secondary">Number of backups to keep before automatic deletion</Text>
              </div>

              {/* Compression */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Text strong>Compression</Text>
                  <Text type="secondary" className="block">Compress backups using GZIP</Text>
                </div>
                <Switch
                  checked={localSettings.compression}
                  onChange={(checked) => setLocalSettings({ ...localSettings, compression: checked })}
                />
              </div>
            </div>
          </Spin>
        </Modal>
      </div>
    </div>
  );
};

export default BackupsSettings;
