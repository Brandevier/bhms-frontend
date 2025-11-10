import React from 'react';
import { Card, Statistic, Progress, Space, Tag, Alert } from 'antd';
import { 
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const PaymentSummary = ({ invoice }) => {
  const paidPercentage = invoice.total_amount > 0 
    ? (invoice.amount_paid / invoice.total_amount) * 100 
    : 0;

  const isOverdue = dayjs(invoice.due_date).isBefore(dayjs());
  const daysUntilDue = dayjs(invoice.due_date).diff(dayjs(), 'days');

  return (
    <Card 
      title={
        <Space>
          <DollarOutlined />
          Payment Summary
        </Space>
      }
      className="shadow-sm"
    >
      <Space direction="vertical" size="large" className="w-full">
        {/* Total Amount */}
        <Statistic
          title="Total Amount"
          value={invoice.total_amount}
          prefix="$"
          valueStyle={{ color: '#3f8600' }}
          precision={2}
        />

        {/* Amount Paid */}
        <Statistic
          title="Amount Paid"
          value={invoice.amount_paid}
          prefix="$"
          valueStyle={{ color: '#52c41a' }}
          precision={2}
        />

        {/* Balance Due */}
        <Statistic
          title="Balance Due"
          value={invoice.balance_due}
          prefix="$"
          valueStyle={{ 
            color: invoice.balance_due > 0 ? '#cf1322' : '#3f8600',
            fontWeight: 'bold'
          }}
          precision={2}
        />

        {/* Payment Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Payment Progress</span>
            <span>{Math.round(paidPercentage)}%</span>
          </div>
          <Progress 
            percent={Math.round(paidPercentage)} 
            status={paidPercentage === 100 ? 'success' : 'active'}
            strokeColor={paidPercentage === 100 ? '#52c41a' : '#1890ff'}
          />
        </div>

        {/* Due Date Status */}
        <div className="p-3 rounded-lg border">
          <Space direction="vertical" size="small" className="w-full">
            <div className="flex justify-between items-center">
              <span className="text-sm">Due Date</span>
              <Tag color={isOverdue ? 'red' : daysUntilDue <= 3 ? 'orange' : 'blue'}>
                {dayjs(invoice.due_date).format('MMM DD, YYYY')}
              </Tag>
            </div>
            
            {isOverdue ? (
              <Alert
                message="OVERDUE"
                description={`Payment is ${Math.abs(daysUntilDue)} days overdue`}
                type="error"
                showIcon
                icon={<ExclamationCircleOutlined />}
                size="small"
              />
            ) : daysUntilDue <= 3 ? (
              <Alert
                message="DUE SOON"
                description={`Due in ${daysUntilDue} days`}
                type="warning"
                showIcon
                icon={<ClockCircleOutlined />}
                size="small"
              />
            ) : (
              <Alert
                message="ON TRACK"
                description={`Due in ${daysUntilDue} days`}
                type="info"
                showIcon
                icon={<CheckCircleOutlined />}
                size="small"
              />
            )}
          </Space>
        </div>

        {/* Payment Status */}
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">Current Status</div>
          <div className={`text-lg font-bold ${
            invoice.status === 'paid' ? 'text-green-600' : 
            invoice.status === 'overdue' ? 'text-red-600' : 'text-orange-600'
          }`}>
            {invoice.status?.toUpperCase()}
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default PaymentSummary;