import React from 'react';
import { Table, Tag, Space, Button, Input, DatePicker, Select, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const InvoiceTable = ({ data, loading, pagination, onChange, onRefresh }) => {
  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      sorter: true,
    },
    {
      title: 'Patient',
      dataIndex: ['visit', 'patient'],
      key: 'patient',
      render: (patient) => patient ? `${patient.first_name} ${patient.last_name}` : 'N/A',
      sorter: true,
    },
    {
      title: 'Date',
      dataIndex: 'invoice_date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: 'Amount (₵)',
      dataIndex: 'total_amount',
      key: 'amount',
      render: (amount) => `₵${amount?.toFixed(2)}`,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Draft', value: 'draft' },
        { text: 'Unpaid', value: 'unpaid' },
        { text: 'Partially Paid', value: 'partially_paid' },
        { text: 'Paid', value: 'paid' },
        { text: 'Cancelled', value: 'cancelled' },
        { text: 'Refunded', value: 'refunded' },
      ],
      render: (status) => {
        let color = 'default';
        switch(status) {
          case 'paid': color = 'green'; break;
          case 'unpaid': color = 'orange'; break;
          case 'partially_paid': color = 'blue'; break;
          case 'draft': color = 'default'; break;
          case 'cancelled': case 'refunded': color = 'red'; break;
        }
        return (
          <Tag color={color} key={status}>
            {status.replace('_', ' ').toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Invoice">
            <Button icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Edit Invoice">
            <Button icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Print Invoice">
            <Button icon={<PrinterOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Select 
            placeholder="Filter by status" 
            allowClear 
            style={{ width: 150 }}
            onChange={(value) => {
              if (onChange) {
                onChange(
                  { current: 1, pageSize: pagination?.limit || 10 },
                  { status: value ? [value] : [] },
                  {}
                );
              }
            }}
          >
            <Option value="draft">Draft</Option>
            <Option value="unpaid">Unpaid</Option>
            <Option value="partially_paid">Partially Paid</Option>
            <Option value="paid">Paid</Option>
          </Select>
          <RangePicker />
        </div>
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Refresh
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination?.page,
          pageSize: pagination?.limit,
          total: pagination?.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={onChange}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default InvoiceTable;