import React from 'react';
import { Table, Tag, Button, Space, Typography, Badge, Collapse, Row, Col } from 'antd';
import { CheckCircleOutlined, PrinterOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;
const { Panel } = Collapse;

const InvoiceTable = ({ details, onMarkAsPaid, onViewInvoice }) => {
  const expandedRowRender = (record) => (
    <div style={{ padding: '16px 24px', background: '#fafafa', borderRadius: 6 }}>
      <Row gutter={[16, 8]}>
        <Col span={8}>
          <Text strong>Service ID: </Text>
          <br />
          <Text code>{record.service_id}</Text>
        </Col>
        <Col span={8}>
          <Text strong>Department: </Text>
          <br />
          <Text>{record.department?.name}</Text>
        </Col>
        <Col span={8}>
          <Text strong>NHIA Coverage: </Text>
          <br />
          <Tag color={record.is_nhia_covered ? 'green' : 'red'}>
            {record.is_nhia_covered ? 'COVERED' : 'NOT COVERED'}
          </Tag>
        </Col>
        
        <Col span={8}>
          <Text strong>Unit Price: </Text>
          <br />
          <Text>₵{parseFloat(record.unit_price || 0).toFixed(2)}</Text>
        </Col>
        <Col span={8}>
          <Text strong>NHIA Amount: </Text>
          <br />
          <Text>₵{parseFloat(record.nhia_amount || 0).toFixed(2)}</Text>
        </Col>
        <Col span={8}>
          <Text strong>Patient Amount: </Text>
          <br />
          <Text strong>₵{parseFloat(record.patient_amount || 0).toFixed(2)}</Text>
        </Col>
        
        <Col span={8}>
          <Text strong>Created: </Text>
          <br />
          <Text>{record.created_at ? moment(record.created_at).format('MMM DD, YYYY HH:mm') : 'N/A'}</Text>
        </Col>
      </Row>
    </div>
  );

  const columns = [
    {
      title: 'Service',
      dataIndex: 'service_type',
      key: 'service_type',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 60,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price) => `₵${parseFloat(price).toFixed(2)}`,
      align: 'right',
      width: 100,
    },
    {
      title: 'Total',
      dataIndex: 'patient_amount',
      key: 'patient_amount',
      render: (amount, record) => (
        <Text 
          strong 
          type={record.payment_status === 'Paid' ? 'success' : 'danger'}
          delete={record.payment_status === 'Paid'}
        >
          ₵{parseFloat(amount).toFixed(2)}
        </Text>
      ),
      align: 'right',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status) => (
        <Badge
          status={status === 'Paid' ? 'success' : 'warning'}
          text={status}
        />
      ),
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => onMarkAsPaid(record)}
            disabled={record.payment_status === 'Paid'}
          >
            Pay
          </Button>
          <Button
            size="small"
            icon={<PrinterOutlined />}
            onClick={() => onViewInvoice(record.invoice)}
          >
            View
          </Button>
        </Space>
      ),
      width: 150,
    },
  ];

  // Calculate totals
  const totalPatientAmount = details.reduce((sum, item) => sum + parseFloat(item.patient_amount || 0), 0);
  const paidAmount = details
    .filter(item => item.payment_status === 'Paid')
    .reduce((sum, item) => sum + parseFloat(item.patient_amount || 0), 0);
  const unpaidAmount = details
    .filter(item => item.payment_status !== 'Paid')
    .reduce((sum, item) => sum + parseFloat(item.patient_amount || 0), 0);

  return (
    <Table
      columns={columns}
      dataSource={details}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
      expandable={{
        expandedRowRender,
        expandIcon: ({ expanded, onExpand, record }) => (
          <Button
            type="text"
            icon={<DownOutlined />}
            onClick={(e) => onExpand(record, e)}
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
          />
        ),
      }}
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <Text strong>Total Billed</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Text>₵{totalPatientAmount.toFixed(2)}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
          
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <Text strong type="success">Amount Paid</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Text type="success">- ₵{paidAmount.toFixed(2)}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
          
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <Text strong>Balance Due</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Text 
                strong 
                type={unpaidAmount > 0 ? 'danger' : 'success'}
                style={{ fontSize: '16px' }}
              >
                ₵{unpaidAmount.toFixed(2)}
              </Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );
};

export default InvoiceTable;