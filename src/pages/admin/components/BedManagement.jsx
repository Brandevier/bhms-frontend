import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchBedsByDepartment, 
  addBedsToDepartment, 
  deleteBed, 
  updateBedStatus, 
  fetchAllBedsInInstitution 
} from '../../../redux/slice/bedSlice';
import { getDepartment } from '../../../redux/slice/departmentSlice';
import { 
  Table, 
  Select, 
  Button, 
  Modal, 
  InputNumber, 
  Tag, 
  Popconfirm, 
  message, 
  Space,
  Card,
  Statistic,
  Divider
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Option } = Select;

const BedManagement = () => {
  const { departments, loading: deptLoading } = useSelector((state) => state.departments);
  const { 
    currentDepartmentBeds, 
    currentInstitutionBeds,
    status,
    summary
  } = useSelector((state) => state.beds);
  
  const dispatch = useDispatch();
  const [selectedDept, setSelectedDept] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [bedsToAdd, setBedsToAdd] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getDepartment());
    dispatch(fetchAllBedsInInstitution());
  }, [dispatch]);

  const handleDepartmentChange = (value) => {
    setSelectedDept(value);
    dispatch(fetchBedsByDepartment({ departmentId: value }));
  };

  const handleAddBeds = async () => {
    if (!selectedDept) {
      message.error('Please select a department first');
      return;
    }
    
    setLoading(true);
    try {
      await dispatch(addBedsToDepartment({ 
        departmentId: selectedDept, 
        numberOfBeds: bedsToAdd 
      })).unwrap();
      message.success(`${bedsToAdd} bed(s) added successfully`);
      setAddModalVisible(false);
      setBedsToAdd(1);
    } catch (error) {
      message.error(`Failed to add beds: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBed = async (bedId) => {
    try {
      await dispatch(deleteBed({ bedId })).unwrap();
      message.success('Bed deleted successfully');
    } catch (error) {
      message.error(`Failed to delete bed: ${error.message}`);
    }
  };

  const handleStatusChange = async (bedId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'occupied' : 'available';
    try {
      await dispatch(updateBedStatus({ 
        bed_id: bedId,
        status: newStatus
      })).unwrap();
      message.success(`Bed status updated to ${newStatus}`);
    } catch (error) {
      message.error(`Failed to update bed status: ${error.message}`);
    }
  };

  const columns = [
    {
      title: 'Bed Number',
      dataIndex: 'bed_number',
      key: 'bed_number',
      sorter: (a, b) => a.bed_number - b.bed_number,
    },
    {
      title: 'Department',
      dataIndex: ['department', 'name'],
      key: 'department',
      render: (_, record) => (
        departments.find(dept => dept.id === record.department_id)?.name || 'N/A'
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'available' ? 'green' : status === 'occupied' ? 'red' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Available', value: 'available' },
        { text: 'Occupied', value: 'occupied' },
        { text: 'Faulty', value: 'faulty' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Occupied',
      dataIndex: 'is_occupied',
      key: 'is_occupied',
      render: (isOccupied) => (
        <Tag color={isOccupied ? 'red' : 'green'}>
          {isOccupied ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleStatusChange(record.id, record.status)}
          >
            Toggle Status
          </Button>
          <Popconfirm
            title="Are you sure to delete this bed?"
            onConfirm={() => handleDeleteBed(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const displayBeds = selectedDept ? currentDepartmentBeds : currentInstitutionBeds;

  return (
    <div className="p-4">
      <Card title="Bed Management" bordered={false}>
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Select
              placeholder="Filter by department"
              style={{ width: 250 }}
              loading={deptLoading}
              onChange={handleDepartmentChange}
              allowClear
              onClear={() => setSelectedDept(null)}
            >
              {departments.map((dept) => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
            
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => dispatch(fetchAllBedsInInstitution())}
              loading={status === 'loading'}
            >
              Refresh
            </Button>
          </Space>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
            disabled={!selectedDept}
          >
            Add Beds
          </Button>
        </div>

        <Divider orientation="left">Statistics</Divider>
        <div className="flex mb-6 gap-4">
          <Statistic 
            title="Total Beds" 
            value={summary?.totalBeds || 0} 
          />
          <Statistic 
            title="Available Beds" 
            value={summary?.availableBeds || 0} 
            valueStyle={{ color: '#3f8600' }}
          />
          <Statistic 
            title="Occupied Beds" 
            value={summary?.occupiedBeds || 0} 
            valueStyle={{ color: '#cf1322' }}
          />
          <Statistic 
            title="Occupancy Rate" 
            value={summary?.occupancyRate || 0} 
            suffix="%" 
          />
        </div>

        <Table
          columns={columns}
          dataSource={displayBeds}
          rowKey="id"
          loading={status === 'loading'}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={`Add Beds to ${departments.find(d => d.id === selectedDept)?.name || 'Department'}`}
        visible={addModalVisible}
        onOk={handleAddBeds}
        onCancel={() => setAddModalVisible(false)}
        confirmLoading={loading}
      >
        <div className="mb-4">
          <label>Number of Beds to Add:</label>
          <InputNumber
            min={1}
            max={50}
            defaultValue={1}
            style={{ width: '100%' }}
            onChange={(value) => setBedsToAdd(value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default BedManagement;