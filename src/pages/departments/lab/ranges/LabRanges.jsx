import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Tag, Input, Modal, Form, Space, message, Popconfirm,Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getLabRanges, createLabRange, deleteLabRange, updateLabRange } from '../../../../redux/slice/labSlice';

const LabRanges = () => {
  const dispatch = useDispatch();
  const { ranges, loading } = useSelector((state) => state.lab);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(getLabRanges());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = ranges.filter(item =>
    item.test_name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category.toLowerCase().includes(searchText.toLowerCase())
  );

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

  const columns = [
    {
      title: 'Test Name',
      dataIndex: 'test_name',
      key: 'test_name',
      sorter: (a, b) => a.test_name.localeCompare(b.test_name),
    },
    {
      title: 'Reference Range',
      dataIndex: 'reference_range',
      key: 'reference_range',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
      filters: [
        { text: 'Serum Chemistries', value: 'serumChemistries' },
        { text: 'Hematology', value: 'hematologyCoagulation' },
        { text: 'Serum Lipids', value: 'serumLipids' },
        { text: 'Blood Gases', value: 'bloodGases' },
        { text: 'Urinalysis', value: 'urinalysis' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="Are you sure to delete this lab range?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Lab Reference Ranges"
      bordered={false}
      extra={
        <Space>
          <Input
            placeholder="Search ranges..."
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          >
            New Range
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editingId ? 'Edit Lab Range' : 'Create New Lab Range'}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="test_name"
            label="Test Name"
            rules={[{ required: true, message: 'Please enter test name' }]}
          >
            <Input placeholder="e.g. Hemoglobin" />
          </Form.Item>
          <Form.Item
            name="reference_range"
            label="Reference Range"
            rules={[{ required: true, message: 'Please enter reference range' }]}
          >
            <Input placeholder="e.g. 12-16" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
          >
            <Input placeholder="e.g. g/dL" />
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
            <Input.TextArea rows={3} placeholder="Additional notes (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default LabRanges;