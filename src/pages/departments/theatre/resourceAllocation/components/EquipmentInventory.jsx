import React, { useEffect, useState } from 'react';
import { Table, Tag, Input, Button, Space, Tooltip, Badge, message, Modal, Form, Select, DatePicker, Row, Col } from 'antd';
import { 
  SearchOutlined, 
  SyncOutlined, 
  WarningOutlined,
  CheckCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllEquipment, 
  createEquipment,
  getEquipmentStatistics,
  getAllOperatingRooms
} from '../../../../../redux/slice/theatreSlice';

const { Option } = Select;
const { RangePicker } = DatePicker;

const EquipmentInventory = () => {
  const dispatch = useDispatch();
  const { equipment, equipmentStatistics, operatingRooms, loading, error, success } = useSelector(state => state.theatre);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getAllEquipment());
    dispatch(getEquipmentStatistics());
    dispatch(getAllOperatingRooms());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      message.success('Equipment created successfully');
      setIsModalVisible(false);
      form.resetFields();
      dispatch(getAllEquipment());
      dispatch(getEquipmentStatistics());
    }
  }, [success, form, dispatch]);

  const filteredEquipment = equipment.filter(item => 
    item.name?.toLowerCase().includes(searchText.toLowerCase()) || 
    item.serial_number?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status) => {
    const statusMap = {
      'available': { color: 'green', text: 'Available' },
      'in-use': { color: 'red', text: 'In Use' },
      'maintenance': { color: 'orange', text: 'Maintenance' },
      'retired': { color: 'default', text: 'Retired' },
      'out-of-service': { color: 'volcano', text: 'Out of Service' },
    };
    return statusMap[status] || { color: 'default', text: status };
  };

  const getMaintenanceStatus = (item) => {
    if (!item.next_maintenance_date) return { status: 'current', isOverdue: false };
    const nextDate = new Date(item.next_maintenance_date);
    const today = new Date();
    const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return { status: 'overdue', isOverdue: true, days: Math.abs(daysUntil) };
    if (daysUntil <= 30) return { status: 'soon', isOverdue: false, days: daysUntil };
    return { status: 'current', isOverdue: false, days: daysUntil };
  };

  const columns = [
    {
      title: 'Equipment',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">{record.serial_number}</div>
        </div>
      ),
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue">{category?.replace('-', ' ').toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Imaging', value: 'imaging' },
        { text: 'Monitoring', value: 'monitoring' },
        { text: 'Surgical', value: 'surgical' },
        { text: 'Sterilization', value: 'sterilization' },
        { text: 'Anesthesia', value: 'anesthesia' },
        { text: 'Support', value: 'support' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const { color, text } = getStatusColor(status);
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Available', value: 'available' },
        { text: 'In Use', value: 'in-use' },
        { text: 'Maintenance', value: 'maintenance' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Location',
      dataIndex: 'room',
      key: 'location',
      render: (room) => room?.room_name || room?.room_number || 'Unassigned',
    },
    {
      title: 'Maintenance',
      key: 'maintenance',
      render: (_, record) => {
        const maintenance = getMaintenanceStatus(record);
        return (
          <Tooltip title={maintenance.isOverdue ? `Overdue by ${maintenance.days} days` : `Next in ${maintenance.days} days`}>
            <div className="flex items-center">
              {maintenance.isOverdue ? (
                <Badge status="error" className="mr-2" />
              ) : maintenance.status === 'soon' ? (
                <Badge status="warning" className="mr-2" />
              ) : (
                <Badge status="success" className="mr-2" />
              )}
              <span className={maintenance.isOverdue ? 'text-red-500' : ''}>
                {record.next_maintenance_date 
                  ? new Date(record.next_maintenance_date).toLocaleDateString()
                  : 'Not scheduled'}
              </span>
            </div>
          </Tooltip>
        );
      },
      sorter: (a, b) => {
        if (!a.next_maintenance_date) return 1;
        if (!b.next_maintenance_date) return -1;
        return new Date(a.next_maintenance_date) - new Date(b.next_maintenance_date);
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button size="small">Details</Button>
          <Button size="small" type="link">Transfer</Button>
        </Space>
      ),
    },
  ];

  const handleRefresh = () => {
    dispatch(getAllEquipment());
    dispatch(getEquipmentStatistics());
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const equipmentData = {
          ...values,
          purchase_date: values.purchase_date ? values.purchase_date.toISOString() : null,
          next_maintenance_date: values.next_maintenance_date ? values.next_maintenance_date.toISOString() : null,
          warranty_expiry: values.warranty_expiry ? values.warranty_expiry.toISOString() : null,
        };
        dispatch(createEquipment(equipmentData));
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const categoryOptions = [
    { value: 'imaging', label: 'Imaging' },
    { value: 'monitoring', label: 'Monitoring' },
    { value: 'surgical', label: 'Surgical' },
    { value: 'sterilization', label: 'Sterilization' },
    { value: 'anesthesia', label: 'Anesthesia' },
    { value: 'support', label: 'Support Equipment' },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search equipment..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div>
          <Button icon={<SyncOutlined />} onClick={handleRefresh} loading={loading} className="mr-2">
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Add Equipment
          </Button>
        </div>
      </div>
      
      {/* Statistics Cards */}
      {equipmentStatistics && (
        <div className="flex gap-4 mb-4">
          <div className="bg-green-50 p-2 rounded">
            <span className="text-green-600 font-medium">{equipmentStatistics.available || 0}</span>
            <span className="text-gray-500 text-sm ml-1">Available</span>
          </div>
          <div className="bg-red-50 p-2 rounded">
            <span className="text-red-600 font-medium">{equipmentStatistics.in_use || 0}</span>
            <span className="text-gray-500 text-sm ml-1">In Use</span>
          </div>
          <div className="bg-orange-50 p-2 rounded">
            <span className="text-orange-600 font-medium">{equipmentStatistics.maintenance || 0}</span>
            <span className="text-gray-500 text-sm ml-1">Maintenance</span>
          </div>
        </div>
      )}
      
      <Table 
        columns={columns} 
        dataSource={filteredEquipment} 
        rowKey="id"
        loading={loading}
        size="middle"
        pagination={{ pageSize: 8 }}
      />

      <Modal 
        title="Add New Equipment" 
        open={isModalVisible} 
        onOk={handleOk} 
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={700}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Equipment Name"
                rules={[{ required: true, message: 'Please input equipment name' }]}
              >
                <Input placeholder="Enter equipment name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="serial_number"
                label="Serial Number"
                rules={[{ required: true, message: 'Please input serial number' }]}
              >
                <Input placeholder="Enter serial number" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {categoryOptions.map(cat => (
                    <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="available">Available</Option>
                  <Option value="in-use">In Use</Option>
                  <Option value="maintenance">Maintenance</Option>
                  <Option value="out-of-service">Out of Service</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="room_id"
                label="Assigned Room"
              >
                <Select placeholder="Select room" allowClear>
                  {operatingRooms?.map(room => (
                    <Option key={room.id} value={room.id}>
                      {room.room_name || room.room_number}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="purchase_date"
                label="Purchase Date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="next_maintenance_date"
                label="Next Maintenance Date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="warranty_expiry"
                label="Warranty Expiry"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EquipmentInventory;

