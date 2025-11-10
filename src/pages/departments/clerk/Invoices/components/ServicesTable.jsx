import React from 'react';
import { Table, Tag, Badge, Space } from 'antd';
import { 
  MedicineBoxOutlined,
  ExperimentOutlined,
  ToolOutlined
} from '@ant-design/icons';

const ServicesTable = ({ services }) => {
  const getServiceTypeIcon = (type) => {
    const icons = {
      Medication: <MedicineBoxOutlined className="text-blue-500" />,
      Laboratory: <ExperimentOutlined className="text-green-500" />,
      Procedure: <ToolOutlined className="text-purple-500" />,
    };
    return icons[type] || <MedicineBoxOutlined />;
  };

  const getPaymentStatusTag = (status) => {
    const config = {
      Paid: { color: 'green', text: 'Paid' },
      Pending: { color: 'orange', text: 'Pending' },
      Partial: { color: 'blue', text: 'Partial' },
    };
    const cfg = config[status] || { color: 'default', text: status };
    return <Tag color={cfg.color}>{cfg.text}</Tag>;
  };

  const columns = [
    {
      title: 'Service',
      key: 'service',
      render: (record) => (
        <Space direction="vertical" size={2}>
          <Space>
            {getServiceTypeIcon(record.service_type)}
            <span className="font-medium">{record.description}</span>
          </Space>
          <div className="text-xs text-gray-500">
            {record.service_type} • Qty: {record.quantity}
          </div>
        </Space>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
      align: 'right',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Total',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => (
        <span className="font-semibold text-green-600">
          ${parseFloat(amount).toFixed(2)}
        </span>
      ),
      align: 'right',
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status) => getPaymentStatusTag(status),
      align: 'center',
    },
    {
      title: 'NHIA Coverage',
      key: 'nhia',
      render: (record) => (
        <Tag color={record.is_nhia_covered ? 'green' : 'default'}>
          {record.is_nhia_covered ? 'Covered' : 'Self-pay'}
        </Tag>
      ),
      align: 'center',
    },
  ];

  const totalAmount = services?.reduce((sum, service) => 
    sum + parseFloat(service.total_amount || 0), 0
  ) || 0;

  return (
    <div>
      <Table
        columns={columns}
        dataSource={services || []}
        rowKey="id"
        pagination={false}
        size="middle"
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <strong>Total Services Amount</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <strong className="text-lg text-green-600">
                  ${totalAmount.toFixed(2)}
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} colSpan={2} />
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <Space>
          <Badge count={services?.length || 0} showZero style={{ backgroundColor: '#1890ff' }} />
          <span className="text-sm text-gray-600">
            {services?.length || 0} service items in this invoice
          </span>
        </Space>
      </div>
    </div>
  );
};

export default ServicesTable;