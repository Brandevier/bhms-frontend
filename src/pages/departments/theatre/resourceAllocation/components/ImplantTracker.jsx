import React, { useState } from 'react';
import { Table, Tag, Input, Button, Modal, Form, Select, DatePicker, Badge,Row,Col,Space } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined,
  BarcodeOutlined,
  StockOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ImplantTracker = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  const implantData = [
    {
      key: '1',
      implantId: 'IMP-10023',
      type: 'Hip Prosthesis',
      manufacturer: 'Medtronic',
      lotNumber: 'LOT-2023-0456',
      expiration: '2025-12-31',
      quantity: 5,
      status: 'in-stock',
      location: 'OR Storage A'
    },
    {
      key: '2',
      implantId: 'IMP-10045',
      type: 'Knee Implant',
      manufacturer: 'Johnson & Johnson',
      lotNumber: 'LOT-2023-0789',
      expiration: '2024-10-15',
      quantity: 3,
      status: 'low-stock',
      location: 'OR Storage B'
    },
    {
      key: '3',
      implantId: 'IMP-10067',
      type: 'Spinal Cage',
      manufacturer: 'Stryker',
      lotNumber: 'LOT-2023-0123',
      expiration: '2026-05-20',
      quantity: 8,
      status: 'in-stock',
      location: 'OR Storage A'
    },
    // ... more implants
  ];

  const columns = [
    {
      title: 'Implant ID',
      dataIndex: 'implantId',
      key: 'implantId',
      render: (text) => (
        <div className="flex items-center">
          <BarcodeOutlined className="mr-2" />
          {text}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: 'Lot Number',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const statusMap = {
          'in-stock': { color: 'green', text: 'In Stock' },
          'low-stock': { color: 'orange', text: 'Low Stock' },
          'out-of-stock': { color: 'red', text: 'Out of Stock' },
          'recalled': { color: 'volcano', text: 'Recalled' },
        };
        
        return (
          <div className="flex items-center">
            <Badge 
              status={status === 'in-stock' ? 'success' : 
                     status === 'low-stock' ? 'warning' : 'error'} 
              className="mr-2" 
            />
            <Tag color={statusMap[status].color}>
              {statusMap[status].text} {status !== 'out-of-stock' && `(${record.quantity})`}
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button size="small">Allocate</Button>
          <Button size="small" type="link">Details</Button>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        console.log('Received values:', values);
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search implants..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div>
          <RangePicker className="mr-2" />
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add Implant
          </Button>
        </div>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={implantData.filter(item => 
          item.implantId.toLowerCase().includes(searchText.toLowerCase()) || 
          item.type.toLowerCase().includes(searchText.toLowerCase())
        )} 
        size="middle"
        pagination={{ pageSize: 8 }}
      />
      
      <Modal 
        title="Add New Implant" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Implant Type"
                rules={[{ required: true, message: 'Please select implant type' }]}
              >
                <Select placeholder="Select implant type">
                  <Option value="hip">Hip Prosthesis</Option>
                  <Option value="knee">Knee Implant</Option>
                  <Option value="spinal">Spinal Cage</Option>
                  <Option value="plate">Bone Plate</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="manufacturer"
                label="Manufacturer"
                rules={[{ required: true, message: 'Please select manufacturer' }]}
              >
                <Select placeholder="Select manufacturer">
                  <Option value="medtronic">Medtronic</Option>
                  <Option value="johnson">Johnson & Johnson</Option>
                  <Option value="stryker">Stryker</Option>
                  <Option value="zimmer">Zimmer Biomet</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="lotNumber"
                label="Lot Number"
                rules={[{ required: true, message: 'Please input lot number' }]}
              >
                <Input placeholder="Enter lot number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expiration"
                label="Expiration Date"
                rules={[{ required: true, message: 'Please select expiration date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: 'Please input quantity' }]}
              >
                <Input type="number" placeholder="Enter quantity" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Storage Location"
                rules={[{ required: true, message: 'Please select location' }]}
              >
                <Select placeholder="Select storage location">
                  <Option value="storage-a">OR Storage A</Option>
                  <Option value="storage-b">OR Storage B</Option>
                  <Option value="main-storage">Main Storage</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ImplantTracker;