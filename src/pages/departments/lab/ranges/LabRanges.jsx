import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Tag, 
  Input, 
  Modal, 
  Form, 
  Space, 
  message, 
  Popconfirm, 
  Select,
  Row,
  Col,
  Badge
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  FilterOutlined,
  ClearOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getLabRanges, createLabRange, deleteLabRange, updateLabRange } from '../../../../redux/slice/labSlice';

const LabRanges = () => {
  const dispatch = useDispatch();
  const { ranges, loading } = useSelector((state) => state.lab);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchParams, setSearchParams] = useState({
    searchText: '',
    category: '',
    unit: '',
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  useEffect(() => {
    dispatch(getLabRanges());
  }, [dispatch]);

  // Get unique categories and units for filters
  const categories = [...new Set(ranges.map(item => item.category))].filter(Boolean);
  const units = [...new Set(ranges.map(item => item.unit))].filter(Boolean);

  const handleSearch = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setSearchParams({
      searchText: '',
      category: '',
      unit: '',
    });
    setShowAdvancedSearch(false);
  };

  const filteredData = ranges.filter(item => {
    const matchesSearch = !searchParams.searchText || 
      item.test_name.toLowerCase().includes(searchParams.searchText.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchParams.searchText.toLowerCase())) ||
      (item.reference_range && item.reference_range.toLowerCase().includes(searchParams.searchText.toLowerCase()));

    const matchesCategory = !searchParams.category || item.category === searchParams.category;
    const matchesUnit = !searchParams.unit || item.unit === searchParams.unit;

    return matchesSearch && matchesCategory && matchesUnit;
  });

  const showCreateModal = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        await dispatch(updateLabRange({ id: editingId, ...values }));
        message.success('Lab range updated successfully');
      } else {
        await dispatch(createLabRange(values));
        message.success('Lab range created successfully');
      }
      
      setIsModalVisible(false);
      dispatch(getLabRanges());
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteLabRange(id));
      message.success('Lab range deleted successfully');
      dispatch(getLabRanges());
    } catch (error) {
      console.error('Error deleting lab range:', error);
      message.error('Failed to delete lab range');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      serumChemistries: 'blue',
      hematologyCoagulation: 'red',
      serumLipids: 'green',
      bloodGases: 'orange',
      urinalysis: 'purple',
    };
    return colors[category] || 'default';
  };

  const columns = [
    {
      title: 'Test Name',
      dataIndex: 'test_name',
      key: 'test_name',
      sorter: (a, b) => a.test_name.localeCompare(b.test_name),
      width: 250,
      render: (text) => <span className="font-medium text-gray-900">{text}</span>,
    },
    {
      title: 'Reference Range',
      dataIndex: 'reference_range',
      key: 'reference_range',
      width: 150,
      render: (range) => <span className="text-blue-600 font-semibold">{range}</span>,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
      render: (unit) => unit ? <Tag color="cyan">{unit}</Tag> : <span className="text-gray-400">-</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 180,
      render: (category) => (
        <Tag color={getCategoryColor(category)} className="capitalize">
          {category?.replace(/([A-Z])/g, ' $1').trim()}
        </Tag>
      ),
      filters: categories.map(cat => ({
        text: cat.replace(/([A-Z])/g, ' $1').trim(),
        value: cat,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: (notes) => notes ? <span className="text-gray-600">{notes}</span> : <span className="text-gray-400">-</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            size="small"
            title="Edit"
          />
          <Popconfirm
            title="Delete Lab Range"
            description="Are you sure you want to delete this reference range?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const hasActiveFilters = searchParams.searchText || searchParams.category || searchParams.unit;

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold">Lab Reference Ranges</span>
            <Badge 
              count={filteredData.length} 
              showZero 
              className="ml-2" 
              style={{ backgroundColor: '#1890ff' }}
            />
          </div>
          {hasActiveFilters && (
            <Tag color="blue" closable onClose={handleReset}>
              {filteredData.length} of {ranges.length} results
            </Tag>
          )}
        </div>
      }
      bordered={false}
      className="shadow-sm"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
          size="middle"
        >
          New Range
        </Button>
      }
    >
      {/* Search Section */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Search test names, ranges, notes..."
              prefix={<SearchOutlined />}
              value={searchParams.searchText}
              onChange={(e) => handleSearch('searchText', e.target.value)}
              allowClear
            />
          </Col>
          
          {showAdvancedSearch && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Filter by category"
                  value={searchParams.category}
                  onChange={(value) => handleSearch('category', value)}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {categories.map(category => (
                    <Select.Option key={category} value={category}>
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Filter by unit"
                  value={searchParams.unit}
                  onChange={(value) => handleSearch('unit', value)}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {units.map(unit => (
                    <Select.Option key={unit} value={unit}>
                      {unit}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </>
          )}
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                type={showAdvancedSearch ? "primary" : "default"}
              >
                {showAdvancedSearch ? 'Hide Filters' : 'More Filters'}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleReset}
                >
                  Clear
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchParams.searchText && (
              <Tag closable onClose={() => handleSearch('searchText', '')}>
                Search: {searchParams.searchText}
              </Tag>
            )}
            {searchParams.category && (
              <Tag closable onClose={() => handleSearch('category', '')}>
                Category: {searchParams.category.replace(/([A-Z])/g, ' $1').trim()}
              </Tag>
            )}
            {searchParams.unit && (
              <Tag closable onClose={() => handleSearch('unit', '')}>
                Unit: {searchParams.unit}
              </Tag>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {ranges.length} reference ranges
        </div>
        <div className="flex gap-2">
          <Tag color="blue">{ranges.filter(r => r.category === 'serumChemistries').length} Serum Chemistries</Tag>
          <Tag color="red">{ranges.filter(r => r.category === 'hematologyCoagulation').length} Hematology</Tag>
          <Tag color="green">{ranges.filter(r => r.category === 'serumLipids').length} Serum Lipids</Tag>
          <Tag color="orange">{ranges.filter(r => r.category === 'bloodGases').length} Blood Gases</Tag>
          <Tag color="purple">{ranges.filter(r => r.category === 'urinalysis').length} Urinalysis</Tag>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} ranges`,
        }}
        scroll={{ x: 1200 }}
        size="middle"
        className="lab-ranges-table"
      />

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center">
            {editingId ? (
              <>
                <EditOutlined className="text-blue-500 mr-2" />
                Edit Lab Range
              </>
            ) : (
              <>
                <PlusOutlined className="text-green-500 mr-2" />
                Create New Lab Range
              </>
            )}
          </div>
        }
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={600}
        okText={editingId ? 'Update' : 'Create'}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" className="space-y-4">
          <Form.Item
            name="test_name"
            label="Test Name"
            rules={[{ required: true, message: 'Please enter test name' }]}
          >
            <Input placeholder="e.g., Hemoglobin, Glucose, Creatinine..." />
          </Form.Item>
          
          <Form.Item
            name="reference_range"
            label="Reference Range"
            rules={[{ required: true, message: 'Please enter reference range' }]}
          >
            <Input placeholder="e.g., 12-16, 70-100, 0.6-1.2..." />
          </Form.Item>
          
          <Form.Item
            name="unit"
            label="Unit"
          >
            <Input placeholder="e.g., g/dL, mg/dL, mEq/L..." />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category">
              <Select.Option value="serumChemistries">Serum Chemistries</Select.Option>
              <Select.Option value="hematologyCoagulation">Hematology/Coagulation</Select.Option>
              <Select.Option value="serumLipids">Serum Lipids</Select.Option>
              <Select.Option value="bloodGases">Blood Gases</Select.Option>
              <Select.Option value="urinalysis">Urinalysis</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Additional notes, special considerations, or clinical significance..." 
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default LabRanges;