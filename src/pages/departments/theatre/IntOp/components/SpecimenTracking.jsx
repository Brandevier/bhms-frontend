import React, { useState } from 'react';
import { Card, Table, Button, Input, Form, Tag, Space } from 'antd';
import { 
  ExperimentOutlined,
  BarcodeOutlined,
  PlusOutlined
} from '@ant-design/icons';

const SpecimenTracking = () => {
  const [form] = Form.useForm();
  const [specimens, setSpecimens] = useState([
    {
      key: '1',
      id: 'SP-2023-001',
      description: 'Gallbladder',
      type: 'Organ',
      collectionTime: '09:30 AM',
      status: 'labeled'
    }
  ]);

  const onFinish = (values) => {
    const newSpecimen = {
      key: `spec-${Date.now()}`,
      id: `SP-2023-${specimens.length + 1}`,
      description: values.description,
      type: values.type,
      collectionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };
    setSpecimens([...specimens, newSpecimen]);
    form.resetFields();
  };

  return (
    <Card
      title={
        <span>
          <ExperimentOutlined className="mr-2" />
          Specimen Tracking
        </span>
      }
      bordered={false}
      className="shadow-sm h-full"
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="flex mb-4">
          <Form.Item
            name="description"
            rules={[{ required: true }]}
            className="flex-grow mr-2"
          >
            <Input placeholder="Specimen description" />
          </Form.Item>
          <Form.Item
            name="type"
            rules={[{ required: true }]}
            className="w-32"
          >
            <Input placeholder="Type" />
          </Form.Item>
          <Button 
            htmlType="submit" 
            type="primary" 
            icon={<PlusOutlined />}
          >
            Add
          </Button>
        </div>
      </Form>

      <Table
        columns={[
          {
            title: 'Specimen ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
              <Space>
                <BarcodeOutlined />
                {id}
              </Space>
            )
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
          },
          {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: 'Collection Time',
            dataIndex: 'collectionTime',
            key: 'collectionTime',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
              <Tag color={status === 'labeled' ? 'green' : 'orange'}>
                {status === 'labeled' ? 'Labeled' : 'Pending'}
              </Tag>
            ),
          }
        ]}
        dataSource={specimens}
        size="small"
        pagination={false}
      />
    </Card>
  );
};

export default SpecimenTracking;