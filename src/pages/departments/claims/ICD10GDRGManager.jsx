import React, { useEffect, useState } from 'react';
import { 
  Table, Button, Card, Tag, Space, Modal, Form, Input, Select, 
  Divider, notification, Popconfirm, Badge, Typography, Row, Col 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, SyncOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAllMappings,updateMapping, deleteMapping,addMapping } from '../../../redux/slice/gdrg_mapping';



const { Title, Text } = Typography;
const { Option } = Select;

const ICD10GDRGManager = () => {
  const dispatch = useDispatch();
  const { mappings, loading, error, lastAction } = useSelector(state => state.icd10GDRG);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Columns for AntD Table
  const columns = [
    {
      title: 'GDRG Code',
      dataIndex: 'gdrg_code',
      key: 'gdrg_code',
      sorter: (a, b) => a.gdrg_code.localeCompare(b.gdrg_code),
      render: (code) => <Tag color="geekblue">{code}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'gdrg_description',
      key: 'gdrg_description',
    },
    {
      title: 'ICD-10 Codes',
      dataIndex: 'icd10_codes',
      key: 'icd10_codes',
      render: (codes) => (
        <Space wrap>
          {codes?.map(code => (
            <Tag key={code} color="green">{code}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Delete this mapping?"
            onConfirm={() => dispatch(deleteMapping(record.id))}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small" 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Filter mappings based on search
  const filteredMappings = mappings.filter(mapping => 
    mapping.gdrg_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.gdrg_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.icd10_codes.some(code => 
      code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle form submission
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingMapping) {
        dispatch(updateMapping({ 
          gdrg_code: editingMapping.gdrg_code, 
          ...values 
        }));
      } else {
        dispatch(addMapping(values));
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // Edit mapping handler
  const handleEdit = (mapping) => {
    setEditingMapping(mapping);
    form.setFieldsValue(mapping);
    setIsModalVisible(true);
  };

  // Reset modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingMapping(null);
    form.resetFields();
  };

  // Notification for actions
  useEffect(() => {
    if (lastAction) {
      notification.success({
        message: `Mapping ${lastAction} successfully`,
        placement: 'bottomRight',
      });
    }
    if (error) {
      notification.error({
        message: error,
        placement: 'bottomRight',
      });
    }
  }, [lastAction, error]);

  // Initial data load
  useEffect(() => {
    dispatch(fetchAllMappings());
  }, [dispatch]);

  return (
    <div style={{ padding: 24 }}>
      {/* Header Card */}
      <Card 
        title={
          <Title level={4} style={{ margin: 0 }}>
            ICD-10 to GDRG Mappings
          </Title>
        }
        extra={
          <Space>
            <Input 
              placeholder="Search..." 
              prefix={<SearchOutlined />} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 200 }}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsModalVisible(true)}
            >
              New Mapping
            </Button>
            <Button 
              icon={<SyncOutlined />} 
              onClick={() => dispatch(fetchAllMappings())}
            />
          </Space>
        }
        bordered={false}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Text type="secondary">
              Showing {filteredMappings.length} mappings
              {searchTerm && ` matching "${searchTerm}"`}
            </Text>
          </Col>
        </Row>

        {/* Mappings Table */}
        <Table 
          columns={columns} 
          dataSource={filteredMappings} 
          rowKey="gdrg_code"
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingMapping ? 'Edit Mapping' : 'Create New Mapping'}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleModalClose}
        confirmLoading={loading}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gdrg_code"
                label="GDRG Code"
                rules={[{ required: true }]}
              >
                <Input 
                  placeholder="e.g. G001" 
                  disabled={!!editingMapping}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gdrg_description"
                label="Description"
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. Malaria Treatment" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="icd10_codes"
            label="ICD-10 Codes"
            rules={[{ required: true }]}
          >
            <Select
              mode="tags"
              placeholder="Add ICD-10 codes (e.g. B54)"
              tokenSeparators={[',', ' ']}
            >
              {/* Suggested ICD-10 codes */}
              {['B54', 'E11.9', 'I10', 'J18.9'].map(code => (
                <Option key={code} value={code}>{code}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="icd10_diagnoses"
            label="Diagnosis Descriptions"
          >
            <Select
              mode="tags"
              placeholder="Add descriptions (e.g. Malaria, unspecified)"
              tokenSeparators={[',']}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ICD10GDRGManager;