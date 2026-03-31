import React from 'react';
import { Table, Tag, Button, Space, Typography, Badge, Collapse, Row, Col } from 'antd';
import { CheckCircleOutlined, PrinterOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;
const { Panel } = Collapse;

const InvoiceTable = ({ details, onMarkAsPaid, onViewInvoice }) => {
  const expandedRowRender = (record) => (
    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-sm">
      <Row gutter={[24, 12]}>
        <Col span={6}>
          <Text strong className="text-gray-800 block mb-1">Service ID</Text>
          <Text className="bg-gray-100 px-3 py-1 rounded-full text-sm font-mono">{record.service_id}</Text>
        </Col>
        <Col span={6}>
          <Text strong className="text-gray-800 block mb-1">Department</Text>
          <Tag className="px-3 py-1 rounded-full bg-blue-100 border-blue-200 text-blue-800 font-medium">
            {record.department?.name}
          </Tag>
        </Col>
        <Col span={6}>
          <Text strong className="text-gray-800 block mb-1">NHIA Status</Text>
          <Tag color={record.is_nhia_covered ? 'success' : 'error'} className="px-4 py-2 font-semibold shadow-sm">
            {record.is_nhia_covered ? 'FULLY COVERED' : 'PATIENT PAYS'}
          </Tag>
        </Col>
        <Col span={6}>
          <Text strong className="text-gray-800 block mb-1">Performed</Text>
          <Text className="text-gray-600 text-sm">{record.created_at ? moment(record.created_at).format('DD MMM YYYY, HH:mm') : 'N/A'}</Text>
        </Col>
        <Col span={8}>
          <Text strong className="text-gray-800 block mb-1">Unit Price</Text>
          <Text className="text-2xl font-bold text-gray-900">₵{parseFloat(record.unit_price || 0).toFixed(2)}</Text>
        </Col>
        <Col span={8}>
          <Text strong className="text-green-600 block mb-1 font-semibold">NHIA Amount</Text>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <Text className="text-lg font-bold text-green-800">₵{parseFloat(record.nhia_amount || 0).toFixed(2)}</Text>
          </div>
        </Col>
        <Col span={8}>
          <Text strong className="text-orange-600 block mb-1 font-semibold">Patient Share</Text>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <Text className={parseFloat(record.patient_amount || 0) === 0 ? 'text-lg font-bold text-green-600' : 'text-lg font-bold text-orange-800'}>
              ₵{parseFloat(record.patient_amount || 0).toFixed(2)}
            </Text>
          </div>
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
      title: 'NHIA',
      dataIndex: 'nhia_amount',
      key: 'nhia_amount',
      render: (amount) => `₵${parseFloat(amount || 0).toFixed(2)}`,
      align: 'right',
      width: 90,
    },
    {
      title: 'Patient',
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
      render: (status, record) => {
        if (record.is_nhia_covered && parseFloat(record.patient_amount || 0) === 0) {
          return <Badge status="success" text="NHIA Full Coverage" />;
        }
        return (
          <Badge
            status={status === 'Paid' ? 'success' : 'warning'}
            text={status}
          />
        );
      },
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
            disabled={record.payment_status === 'Paid' || (record.is_nhia_covered && parseFloat(record.patient_amount || 0) === 0)}
          >
            {record.is_nhia_covered && parseFloat(record.patient_amount || 0) === 0 ? 'NHIA Covered' : 'Pay'}
          </Button>
          <Button
            size="small"
            icon={<PrinterOutlined />}
            onClick={() => onViewInvoice(record.invoice)}
            disabled={record.is_nhia_covered && parseFloat(record.patient_amount || 0) === 0}
          >
            {record.is_nhia_covered && parseFloat(record.patient_amount || 0) === 0 ? 'NHIA Full' : 'View'}
          </Button>
        </Space>
      ),
      width: 150,
    },
  ];

  // Calculate totals
  const totalNhiaAmount = details.reduce((sum, item) => sum + parseFloat(item.nhia_amount || 0), 0);
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
            <Table.Summary.Cell index={0} colSpan={4}>
              <Text strong>Total NHIA</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Text type="success">₵{totalNhiaAmount.toFixed(2)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} colSpan={4} />
            <Table.Summary.Cell index={3} />
          </Table.Summary.Row>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>
              <Text strong>Total Patient</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Text>₵{totalPatientAmount.toFixed(2)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} colSpan={4} />
            <Table.Summary.Cell index={3} />
          </Table.Summary.Row>
          
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>
              <Text strong type="success">Amount Paid</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Text type="success">- ₵{paidAmount.toFixed(2)}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
          
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>
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