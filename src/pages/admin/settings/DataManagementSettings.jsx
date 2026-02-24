import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
  Tooltip
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
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DataManagementSettings = () => {
  const user = useSelector((state) => state.auth.admin || state.auth.user);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tables');
  const [selectedTables, setSelectedTables] = useState([]);
  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);

  // Database tables data
  const [tables, setTables] = useState([
    { key: 'patients', name: 'patients', description: 'Patient records', recordCount: 1245, size: '45 MB', lastSync: '2024-01-15 10:30' },
    { key: 'visits', name: 'visits', description: 'Patient visits', recordCount: 8934, size: '120 MB', lastSync: '2024-01-15 10:30' },
    { key: 'invoices', name: 'invoices', description: 'Billing invoices', recordCount: 4521, size: '35 MB', lastSync: '2024-01-15 10:30' },
    { key: 'prescriptions', name: 'prescriptions', description: 'Prescription records', recordCount: 7823, size: '65 MB', lastSync: '2024-01-15 10:30' },
    { key: 'lab_results', name: 'lab_results', description: 'Laboratory results', recordCount: 15672, size: '180 MB', lastSync: '2024-01-15 10:30' },
    { key: 'claims', name: 'claims', description: 'Insurance claims', recordCount: 3245, size: '28 MB', lastSync: '2024-01-15 10:30' },
    { key: 'staff', name: 'staff', description: 'Staff records', count: 156, size: '2 MB', lastSync: '2024-01-15 10:30' },
    { key: 'departments', name: 'departments', description: 'Department data', count: 24, size: '0.5 MB', lastSync: '2024-01-15 10:30' }
  ]);

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
      render: (count) => count?.toLocaleString() || 'N/A'
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: 'Last Sync',
      dataIndex: 'lastSync',
      key: 'lastSync'
    },
    {
      title: 'Status',
      key: 'status',
      render: () => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Synced
        </Tag>
      )
    }
  ];

  const handleSyncTable = (tableName) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success(`${tableName} synced successfully!`);
    }, 1500);
  };

  const handleExportTable = (tableName) => {
    message.info(`Exporting ${tableName}...`);
    // Export functionality would go here
  };

  const handleClearTable = (tableName) => {
    Modal.confirm({
      title: `Clear ${tableName}?`,
      icon: <WarningOutlined />,
      content: 'This will permanently delete all records in this table. This action cannot be undone.',
      okText: 'Clear Data',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        message.success(`${tableName} data cleared successfully!`);
      }
    });
  };

  const handleSyncAll = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('All tables synced successfully!');
    }, 2000);
  };

  const handleExportAll = () => {
    message.info('Exporting all data...');
  };

  const handleImport = () => {
    setImportModalVisible(true);
  };

  const handleBulkClear = () => {
    setClearModalVisible(true);
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
            </div>
            <Space>
              <Button icon={<SyncOutlined />} onClick={handleSyncAll} loading={loading}>
                Sync All
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExportAll}>
                Export All
              </Button>
              <Button icon={<ImportOutlined />} onClick={handleImport}>
                Import Data
              </Button>
            </Space>
          </div>

          <Table
            columns={tableColumns}
            dataSource={tables}
            rowKey="key"
            pagination={false}
            expandable={{
              expandedRowRender: (record) => (
                <div className="p-4 bg-gray-50">
                  <Space>
                    <Button
                      type="link"
                      icon={<SyncOutlined />}
                      onClick={() => handleSyncTable(record.name)}
                    >
                      Sync Now
                    </Button>
                    <Button
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={() => handleExportTable(record.name)}
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

          <List
            itemLayout="horizontal"
            dataSource={[
              {
                title: 'Duplicate Records',
                description: 'Find and remove duplicate patient or visit records',
                icon: <CheckCircleOutlined className="text-green-500" />,
                button: 'Scan for Duplicates'
              },
              {
                title: 'Old Visits',
                description: 'Archive visits older than 2 years',
                icon: <FileTextOutlined className="text-blue-500" />,
                button: 'Archive Old Data'
              },
              {
                title: 'Temp Files',
                description: 'Clear temporary files and cache',
                icon: <DeleteOutlined className="text-red-500" />,
                button: 'Clear Temp Files'
              },
              {
                title: 'Log Files',
                description: 'Clean up old system log files',
                icon: <WarningOutlined className="text-orange-500" />,
                button: 'Clean Logs'
              },
              {
                title: 'Orphan Records',
                description: 'Find and remove orphaned records',
                icon: <WarningOutlined className="text-red-500" />,
                button: 'Scan Orphans'
              }
            ]}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="primary" ghost key={item.title}>
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

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card title="Storage Usage" size="small">
                <Statistic
                  title="Used Space"
                  value={476.5}
                  suffix="MB"
                  prefix={<DatabaseOutlined />}
                />
                <Progress
                  percent={68}
                  status="active"
                  strokeColor={{ from: '#108ee9', to: '#87d068' }}
                />
                <div className="mt-2">
                  <Text type="secondary">Total: 700 MB | Free: 223.5 MB</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Storage by Table" size="small">
                <List
                  size="small"
                  dataSource={[
                    { name: 'lab_results', size: '180 MB', percent: 38 },
                    { name: 'visits', size: '120 MB', percent: 25 },
                    { name: 'prescriptions', size: '65 MB', percent: 14 },
                    { name: 'patients', size: '45 MB', percent: 9 },
                    { name: 'invoices', size: '35 MB', percent: 7 },
                    { name: 'Other', size: '31 MB', percent: 7 }
                  ]}
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
              </Card>
            </Col>
          </Row>

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

          <List
            itemLayout="horizontal"
            dataSource={[
              { category: 'Patient Records', retention: '7 years', action: 'Archive' },
              { category: 'Visit Records', retention: '5 years', action: 'Archive' },
              { category: 'Billing Data', retention: '10 years', action: 'Archive' },
              { category: 'Lab Results', retention: '3 years', action: 'Delete' },
              { category: 'Audit Logs', retention: '90 days', action: 'Delete' },
              { category: 'Session Data', retention: '30 days', action: 'Delete' },
              { category: 'Temporary Files', retention: '7 days', action: 'Delete' }
            ]}
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
            <Input type="file" className="mb-4" />
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

            <Checkbox.Group className="w-full">
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
              <Button type="primary" danger icon={<DeleteOutlined />}>
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

