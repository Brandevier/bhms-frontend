import React from 'react';
import { Card, Tag, Space, Badge, Row, Col, Divider } from 'antd';
import { 
  FileTextOutlined, 
  CalendarOutlined,
  DollarOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const BillHeader = ({ invoice }) => {
  const getStatusConfig = (status) => {
    const config = {
      draft: { color: 'default', text: 'Draft' },
      pending: { color: 'orange', text: 'Pending Payment' },
      paid: { color: 'green', text: 'Paid' },
      overdue: { color: 'red', text: 'Overdue' },
    };
    return config[status] || { color: 'default', text: status };
  };

  const statusConfig = getStatusConfig(invoice.status);

  return (
    <Card className="shadow-sm mb-4">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={16}>
          <Space direction="vertical" size="small" className="w-full">
            <div className="flex items-center flex-wrap gap-2">
              <FileTextOutlined className="text-blue-500 text-xl" />
              <h1 className="text-xl font-bold m-0">Invoice Details</h1>
              <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
            </div>
            
            <p className="text-gray-600 m-0">Invoice #{invoice.invoice_number}</p>
            
            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mt-2">
              <Space>
                <CalendarOutlined />
                <span>Issued: {dayjs(invoice.invoice_date).format('MMM DD, YYYY')}</span>
              </Space>
              <Space>
                <CalendarOutlined />
                <span>Due: {dayjs(invoice.due_date).format('MMM DD, YYYY')}</span>
              </Space>
              <Space>
                <DollarOutlined />
                <span>Balance Due: <strong>${invoice.balance_due?.toFixed(2)}</strong></span>
              </Space>
            </div>
            
            {invoice.balance_due > 0 && dayjs(invoice.due_date).isBefore(dayjs()) && (
              <Badge 
                count="OVERDUE" 
                style={{ backgroundColor: '#ff4d4f' }}
                className="self-start mt-2"
              />
            )}
          </Space>
        </Col>
        
        <Col xs={24} md={8}>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Total Amount</div>
            <div className="text-2xl font-bold text-green-600">
              ${invoice.total_amount?.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Updated: {dayjs(invoice.updatedAt).format('MMM DD, YYYY')}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default BillHeader;