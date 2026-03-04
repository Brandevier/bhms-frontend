import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Row,
  Col,
  Statistic,
  Progress,
  Alert,
  Divider,
  List,
  Checkbox,
  message,
  Popconfirm,
  Badge,
  Tabs,
  Tooltip,
  Spin
} from 'antd';
import {
  DatabaseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  SyncOutlined,
  SettingOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  TableOutlined,
  ExportOutlined,
  ImportOutlined,
  ClearOutlined,
  ReloadOutlined,
  SafetyOutlined,
  InfoCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';

import {
  fetchDatabaseTables,
  syncTable,
  syncAllTables,
  exportTable,
  clearTableData,
  fetchStorageInfo,
  performCleanup,
  fetchRetentionPolicies,
  updateRetentionPolicies,
  clearError,
  clearSuccess
} from '../../../redux/slice/dataManagementSlice';


const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DataManagementSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.admin || state.auth.user);
  
  // Redux state
  const {
    tables,
    tablesLoading,
    storage,
    storageLoading,
    retentionPolicies,
    retentionLoading,
    syncing,
    syncingTable,
    exporting,
    clearing,
    cleaning,
    lastSync,
    error,
    successMessage,
    tablesError
  } = useSelector((state) => state.dataManagement);
  
  const [activeTab, setActiveTab] = useState('tables');
  const [selectedTables, setSelectedTables] = useState([]);
  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [clearOptions, setClearOptions] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchDatabaseTables());
    dispatch(fetchStorageInfo());
    dispatch(fetchRetentionPolicies());
  }, [dispatch]);

  // Show success messages
  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
    }
  }, [successMessage]);

  // Show error messages
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Format size
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  // Table columns
  const tableColumns = [
    {
      title: 'Table Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Space>
          <TableOutlined className="text-blue-500" />
          <Text strong>{name}</Text>
        </Space>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Records',
      dataIndex: 'recordCount',
      key: 'recordCount',
      render: (count) => count?.toLocaleString() || '0'
    },
    {
      title: 'Columns',
      dataIndex: 'columnCount',
      key: 'columnCount'
    },
    {
      title: 'Last Sync',
      dataIndex: 'lastSync',
      key: 'lastSync',
      render: (date) => formatDate(date)
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag 
          icon={syncingTable === record.name ? <LoadingOutlined /> : <CheckCircleOutlined />} 
          color={syncingTable === record.name ? 'processing' : 'success'}
        >
          {syncingTable === record.name ? 'Syncing' : 'Synced'}
        </Tag>
      )
    }
  ];

  // Handle sync single table
  const handleSyncTable = (tableName) => {
    dispatch(syncTable(tableName));
  };

  // Handle export table
  const handleExportTable = (tableName) => {
    dispatch(exportTable({ tableName, format: 'json' }))
      .then((action) => {
        if (action.payload && action.payload.records) {
          // Create download
          const blob = new Blob([JSON.stringify(action.payload.records, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${tableName}_export.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
  };

  // Handle clear table
  const handleClearTable = (tableName) => {
    Modal.confirm({
      title: `Clear ${tableName}?`,
      icon: <WarningOutlined />,
      content: 'This will permanently delete all records in this table. This action cannot be undone.',
      okText: 'Clear Data',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch(clearTableData({ tableName, confirm: true }))
          .then(() => {
            dispatch(fetchDatabaseTables());
          });
      }
    });
  };

  // Handle sync all
  const handleSyncAll = () => {
    dispatch(syncAllTables())
      .then(() => {
        dispatch(fetchDatabaseTables());
      });
  };

  // Handle export all
  const handleExportAll = () => {
    message.info('Exporting all tables... This may take a while.');
    // Export each table one by one
    tables.forEach((table) => {
      dispatch(exportTable({ tableName: table.name, format: 'json' }));
    });
  };

  // Handle import
  const handleImport = () => {
    setImportModalVisible(true);
  };

  // Handle bulk clear
  const handleBulkClear = () => {
    setClearModalVisible(true);
  };

  // Handle cleanup operations
  const handleCleanup = (operation) => {
    dispatch(performCleanup(operation));
  };

  // Get storage data for display
  const getStorageData = () => {
    if (!storage) return null;
    
    const summary = storage.summary || {};
    const tableSizes = storage.tables || [];
    
    return {
      usedSpace: summary.usedSpace || '0 B',
      usedPercent: summary.usedPercent || 0,
      totalSpace: summary.totalSpace || '0 B',
      freeSpace: summary.freeSpace || '0 B',
      tableSizes: tableSizes.slice(0, 6).map(t => ({
        name: t.name,
        size: t.size,
        percent: t.percent
      }))
    };
  };

  const storageData = getStorageData();

  // Get retention data for display
  const getRetentionData = () => {
    if (!retentionPolicies || retentionPolicies.length === 0) {
      return [
        { category: 'Patient Records', retention: '7 years', action: 'Archive' },
        { category: 'Visit Records', retention: '5 years', action: 'Archive' },
        { category: 'Billing Data', retention: '10 years', action: 'Archive' },
        { category: 'Lab Results', retention: '3 years', action: 'Delete' },
        { category: 'Audit Logs', retention: '90 days', action: 'Delete' },
        { category: 'Session Data', retention: '30 days', action: 'Delete' },
        { category: 'Temporary Files', retention: '7 days', action: 'Delete' }
      ];
    }
    return retentionPolicies;
  };

  const tabItems = [
    {
      key: 'tables',
      label: (
        <span>
          <TableOutlined />
          Database Tables
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Title level={4} className="m-0">Database Tables</Title>
              <Text type="secondary">Manage and sync database tables</Text>
              {lastSync && (
                <div>
                  <Text type="secondary" className="text-xs">
                    Last synced: {formatDate(lastSync)}
                  </Text>
                </div>
              )}
            </div>
            <Space>
              <Button 
                icon={<SyncOutlined />} 
                onClick={handleSyncAll} 
                loading={syncing && syncingTable === 'all'}
              >
                Sync All
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExportAll} disabled={tablesLoading}>
                Export All
              </Button>
              <Button icon={<ImportOutlined />} onClick={handleImport}>
                Import Data
              </Button>
            </Space>
          </div>

          {tablesError && (
            <Alert
              message="Error loading tables"
              description={tablesError}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <Table
            columns={tableColumns}
            dataSource={tables}
            rowKey="key"
            loading={tablesLoading}
            pagination={false}
            expandable={{
              expandedRowRender: (record) => (
                <div className="p-4 bg-gray-50">
                  <Space>
                    <Button
                      type="link"
                      icon={<SyncOutlined />}
                      onClick={() => handleSyncTable(record.name)}
                      loading={syncingTable === record.name}
                    >
                      Sync Now
                    </Button>
                    <Button
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={() => handleExportTable(record.name)}
                      loading={exporting}
                    >
                      Export
                    </Button>
                    <Popconfirm
                      title={`Clear all data in ${record.name}?`}
                      description="This cannot be undone!"
                      onConfirm={() => handleClearTable(record.name)}
                    >
                      <Button type="link" danger icon={<DeleteOutlined />}>
                        Clear Data
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>
              )
            }}
          />
        </Card>
      )
    },
    {
      key: 'cleanup',
      label: (
        <span>
          <ClearOutlined />
          Data Cleanup
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm">
          <Title level={4}>Data Cleanup</Title>
          <Paragraph type="secondary">
            Clean up old, duplicate, or unnecessary data to free up storage space.
          </Paragraph>
          <Divider />

          <Spin spinning={cleaning}>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  key: 'scan-duplicates',
                  title: 'Duplicate Records',
                  description: 'Find and remove duplicate patient or visit records',
                  icon: <CheckCircleOutlined className="text-green-500" />,
                  button: 'Scan for Duplicates'
                },
                {
                  key: 'archive-old-data',
                  title: 'Old Visits',
                  description: 'Archive visits older than 2 years',
                  icon: <FileTextOutlined className="text-blue-500" />,
                  button: 'Archive Old Data'
                },
                {
                  key: 'clear-temp',
                  title: 'Temp Files',
                  description: 'Clear temporary files and cache',
                  icon: <DeleteOutlined className="text-red-500" />,
                  button: 'Clear Temp Files'
                },
                {
                  key: 'clean-logs',
                  title: 'Log Files',
                  description: 'Clean up old system log files',
                  icon: <WarningOutlined className="text-orange-500" />,
                  button: 'Clean Logs'
                },
                {
                  key: 'scan-orphans',
                  title: 'Orphan Records',
                  description: 'Find and remove orphaned records',
                  icon: <WarningOutlined className="text-red-500" />,
                  button: 'Scan Orphans'
                }
              ]}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button 
                      type="primary" 
                      ghost 
                      key={item.key}
                      onClick={() => handleCleanup(item.key)}
                      loading={cleaning}
                    >
                      {item.button}
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Spin>

          <Divider />

          <Alert
            message="Scheduled Cleanup"
            description="Automatic data cleanup runs every Sunday at 2:00 AM. You can configure this schedule in System Settings."
            type="info"
            showIcon
          />
        </Card>
      )
    },
    {
      key: 'storage',
      label: (
        <span>
          <DatabaseOutlined />
          Storage
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm">
          <Title level={4}>Storage Management</Title>
          <Paragraph type="secondary">
            Monitor and manage database storage usage.
          </Paragraph>
          <Divider />

          <Spin spinning={storageLoading}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card title="Storage Usage" size="small">
                  {storageData ? (
                    <>
                      <Statistic
                        title="Used Space"
                        value={storageData.usedSpace}
                        prefix={<DatabaseOutlined />}
                      />
                      <Progress
                        percent={storageData.usedPercent}
                        status="active"
                        strokeColor={{ from: '#108ee9', to: '#87d068' }}
                      />
                      <div className="mt-2">
                        <Text type="secondary">
                          Total: {storageData.totalSpace} | Free: {storageData.freeSpace}
                        </Text>
                      </div>
                    </>
                  ) : (
                    <Text type="secondary">Loading storage data...</Text>
                  )}
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Storage by Table" size="small">
                  {storageData && storageData.tableSizes.length > 0 ? (
                    <List
                      size="small"
                      dataSource={storageData.tableSizes}
                      renderItem={(item) => (
                        <List.Item>
                          <div className="w-full">
                            <div className="flex justify-between mb-1">
                              <Text>{item.name}</Text>
                              <Text>{item.size}</Text>
                            </div>
                            <Progress percent={item.percent} size="small" showInfo={false} />
                          </div>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Text type="secondary">Loading table sizes...</Text>
                  )}
                </Card>
              </Col>
            </Row>
          </Spin>

          <Divider />

          <Space direction="vertical" className="w-full">
            <Button icon={<DownloadOutlined />} block>
              Download Full Database Backup
            </Button>
            <Button icon={<UploadOutlined />} block>
              Restore from Backup File
            </Button>
          </Space>
        </Card>
      )
    },
    {
      key: 'retention',
      label: (
        <span>
          <SafetyOutlined />
          Retention
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm">
          <Title level={4}>Data Retention Policies</Title>
          <Paragraph type="secondary">
            Configure how long different types of data are retained.
          </Paragraph>
          <Divider />

          <Spin spinning={retentionLoading}>
            <List
              itemLayout="horizontal"
              dataSource={getRetentionData()}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" key={item.category}>Configure</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.category}
                    description={
                      <Space>
                        <Tag>{item.retention}</Tag>
                        <Text type="secondary">then {item.action}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Spin>

          <Divider />

          <Alert
            message="Compliance Note"
            description="Data retention policies should comply with local healthcare regulations and laws. Consult with your legal team."
            type="warning"
            showIcon
          />
        </Card>
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
              <DatabaseOutlined className="text-blue-500" />
              Data Management
            </Space>
          </Title>
          <Text type="secondary" className="text-lg">
            Manage database tables, cleanup, storage, and data retention policies
          </Text>
        </div>

        {/* Quick Stats */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Tables"
                value={tables.length}
                prefix={<TableOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Records"
                value={tables.reduce((sum, t) => sum + (t.recordCount || 0), 0)}
                prefix={<DatabaseOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Database Size"
                value={storageData?.usedSpace || '0 B'}
                prefix={<DatabaseOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />

        {/* Import Modal */}
        <Modal
          title="Import Data"
          open={importModalVisible}
          onCancel={() => setImportModalVisible(false)}
          footer={null}
        >
          <div className="text-center py-8">
            <UploadOutlined className="text-4xl text-blue-500 mb-4" />
            <Paragraph>
              Upload a JSON or CSV file to import data into the database.
            </Paragraph>
            <Input type="file" className="mb-4" accept=".json,.csv" />
            <Space>
              <Button onClick={() => setImportModalVisible(false)}>Cancel</Button>
              <Button type="primary" icon={<ImportOutlined />}>
                Import
              </Button>
            </Space>
          </div>
        </Modal>

        {/* Clear Modal */}
        <Modal
          title="Clear Data"
          open={clearModalVisible}
          onCancel={() => setClearModalVisible(false)}
          footer={null}
        >
          <div className="py-4">
            <Alert
              message="Warning"
              description="This action cannot be undone. Please select which data to clear carefully."
              type="warning"
              showIcon
              className="mb-4"
            />

            <Checkbox.Group 
              className="w-full" 
              value={clearOptions}
              onChange={setClearOptions}
            >
              <Space direction="vertical" className="w-full">
                <Checkbox value="temp">Temporary Files</Checkbox>
                <Checkbox value="cache">Cache Data</Checkbox>
                <Checkbox value="logs">Old Log Files</Checkbox>
                <Checkbox value="sessions">Expired Sessions</Checkbox>
                <Checkbox value="duplicates">Duplicate Records</Checkbox>
              </Space>
            </Checkbox.Group>

            <div className="mt-4 text-right">
              <Button onClick={() => setClearModalVisible(false)} className="mr-2">
                Cancel
              </Button>
              <Button 
                type="primary" 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => {
                  setClearModalVisible(false);
                  message.success('Selected data cleared successfully');
                }}
              >
                Clear Selected Data
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DataManagementSettings;

