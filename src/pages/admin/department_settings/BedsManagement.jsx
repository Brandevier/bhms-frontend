// BedsManagement.jsx
import React, { useState, useMemo } from 'react';
import { 
  Card, 
  List, 
  Tag, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Spin, 
  InputNumber,
  Row,
  Col,
  Pagination,
  Empty
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FilterOutlined 
} from '@ant-design/icons';

const { Option } = Select;

const BedsManagement = ({ department, beds }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBed, setEditingBed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // Show 20 beds per page

  const handleAddBed = () => {
    setEditingBed(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditBed = (bed) => {
    setEditingBed(bed);
    form.setFieldsValue({
      bed_number: bed.bed_number,
      status: bed.status
    });
    setModalVisible(true);
  };

  const handleDeleteBed = (bed) => {
    Modal.confirm({
      title: 'Delete Bed',
      content: `Are you sure you want to delete bed ${bed.bed_number}?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setLoading(true);
        // API call to delete bed would go here
        setTimeout(() => {
          message.success(`Bed ${bed.bed_number} deleted successfully`);
          setLoading(false);
        }, 1000);
      },
    });
  };

  const handleSubmit = (values) => {
    setLoading(true);
    // API call to add/edit bed would go here
    setTimeout(() => {
      message.success(
        editingBed 
          ? `Bed ${values.bed_number} updated successfully` 
          : `Bed ${values.bed_number} added successfully`
      );
      setLoading(false);
      setModalVisible(false);
    }, 1000);
  };

  const getBedStatusColor = (status) => {
    switch (status) {
      case 'available': return 'green';
      case 'occupied': return 'orange';
      case 'maintenance': return 'red';
      case 'cleaning': return 'blue';
      default: return 'default';
    }
  };

  const getBedStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'occupied': return 'Occupied';
      case 'maintenance': return 'Maintenance';
      case 'cleaning': return 'Cleaning';
      default: return status;
    }
  };

  // Filter and search beds
  const filteredBeds = useMemo(() => {
    return beds.filter(bed => {
      const matchesSearch = bed.bed_number.toString().includes(searchText);
      const matchesStatus = statusFilter === 'all' || bed.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [beds, searchText, statusFilter]);

  // Paginate beds
  const paginatedBeds = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBeds.slice(startIndex, startIndex + pageSize);
  }, [filteredBeds, currentPage]);

  const totalPages = Math.ceil(filteredBeds.length / pageSize);

  if (beds.length === 0) {
    return (
      <Card 
        title="Bed Management" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddBed}
            size="small"
          >
            Add Bed
          </Button>
        }
      >
        <Empty
          description="No beds in this department"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={handleAddBed}>
            Add First Bed
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card 
      title={`Bed Management (${beds.length} beds)`} 
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddBed}
          size="small"
        >
          Add Bed
        </Button>
      }
    >
      {/* Search and Filter Controls */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Search by bed number..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: '100%' }}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">All Statuses</Option>
            <Option value="available">Available</Option>
            <Option value="occupied">Occupied</Option>
            <Option value="maintenance">Maintenance</Option>
            <Option value="cleaning">Cleaning</Option>
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <div className="text-sm text-gray-500">
            Showing {paginatedBeds.length} of {filteredBeds.length} beds
            {searchText && ` matching "${searchText}"`}
            {statusFilter !== 'all' && ` with status "${statusFilter}"`}
          </div>
        </Col>
      </Row>

      <Spin spinning={loading}>
        {/* Bed Grid View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-4">
          {paginatedBeds.map((bed) => (
            <Card 
              key={bed.id} 
              size="small"
              className="hover:shadow-md transition-shadow"
              actions={[
                <EditOutlined 
                  key="edit" 
                  onClick={() => handleEditBed(bed)}
                  className="text-blue-500"
                />,
                <DeleteOutlined 
                  key="delete" 
                  onClick={() => handleDeleteBed(bed)}
                  className="text-red-500"
                />
              ]}
            >
              <div className="text-center">
                <div className="text-lg font-bold mb-2">Bed {bed.bed_number}</div>
                <Tag 
                  color={getBedStatusColor(bed.status)} 
                  className="mb-2"
                >
                  {getBedStatusText(bed.status)}
                </Tag>
                {bed.is_occupied && (
                  <Tag color="orange" className="mb-2">Occupied</Tag>
                )}
                {bed.patient_id && (
                  <Tag color="blue" className="mb-2">Patient Assigned</Tag>
                )}
                <div className="text-xs text-gray-500">
                  Created: {new Date(bed.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              total={filteredBeds.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} of ${total} beds`
              }
            />
          </div>
        )}
      </Spin>

      <Modal
        title={editingBed ? 'Edit Bed' : 'Add New Bed'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Bed Number"
            name="bed_number"
            rules={[{ required: true, message: 'Please enter bed number' }]}
          >
            <InputNumber 
              min={1} 
              placeholder="Enter bed number" 
              style={{ width: '100%' }} 
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select bed status' }]}
          >
            <Select placeholder="Select bed status">
              <Option value="available">Available</Option>
              <Option value="occupied">Occupied</Option>
              <Option value="maintenance">Maintenance</Option>
              <Option value="cleaning">Cleaning</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {editingBed ? 'Update Bed' : 'Add Bed'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BedsManagement;