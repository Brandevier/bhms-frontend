import React from 'react';
import { Table, Tag, Divider, Typography, Row, Col } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;

const PrintTemplate = React.forwardRef(({ details, totals, visitId, invoice }, ref) => {
  const patient = details[0]?.patient;

  return (
    <div ref={ref} style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      {/* Invoice Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
          HEALTHCARE INVOICE
        </Title>
        <Text type="secondary">Medical Services Rendered</Text>
      </div>

      {/* Invoice Details */}
      <Row gutter={[24, 16]} style={{ marginBottom: '30px' }}>
        <Col span={12}>
          <Title level={4}>Bill To:</Title>
          <Text strong>Patient: {patient?.first_name} {patient?.last_name}</Text>
          <br />
          <Text>Visit ID: {visitId}</Text>
          <br />
          <Text>Invoice #: {invoice?.invoice_number}</Text>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Title level={4}>Invoice Details:</Title>
          <Text>Date: {invoice?.invoice_date ? moment(invoice.invoice_date).format('MMM DD, YYYY') : 'N/A'}</Text>
          <br />
          <Text>Due Date: {invoice?.due_date ? moment(invoice.due_date).format('MMM DD, YYYY') : 'N/A'}</Text>
          <br />
          <Text>Status: <Tag color={invoice?.status === 'paid' ? 'green' : 'orange'}>{invoice?.status?.toUpperCase()}</Tag></Text>
        </Col>
      </Row>

      {/* Services Table */}
      <Table
        dataSource={details}
        pagination={false}
        size="small"
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <Text strong>Total Amount Due:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text strong>₵{parseFloat(totals?.total_patient_amount || 0).toFixed(2)}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      >
        <Table.Column
          title="Service Type"
          dataIndex="service_type"
          key="service_type"
          render={(type) => <Tag color="blue">{type}</Tag>}
        />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
          width="40%"
        />
        <Table.Column
          title="Qty"
          dataIndex="quantity"
          key="quantity"
          align="center"
        />
        <Table.Column
          title="Unit Price"
          dataIndex="unit_price"
          key="unit_price"
          render={(price) => `₵${parseFloat(price).toFixed(2)}`}
          align="right"
        />
        <Table.Column
          title="Amount"
          dataIndex="patient_amount"
          key="patient_amount"
          render={(amount) => `₵${parseFloat(amount).toFixed(2)}`}
          align="right"
        />
      </Table>

      {/* Payment Summary */}
      <Divider />
      <Row gutter={[16, 8]} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Text strong>Amount Paid: </Text>
          <Text type="success">₵{parseFloat(invoice?.amount_paid || 0).toFixed(2)}</Text>
        </Col>
        <Col span={12}>
          <Text strong>Balance Due: </Text>
          <Text type="danger">₵{parseFloat(invoice?.balance_due || 0).toFixed(2)}</Text>
        </Col>
      </Row>

      {/* Footer */}
      <Divider />
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Text type="secondary">
          Thank you for choosing our healthcare services. Please make payment by the due date.
        </Text>
        <br />
        <Text strong>For inquiries, please contact: +233 XXX-XXX-XXXX</Text>
      </div>
    </div>
  );
});

export default PrintTemplate;