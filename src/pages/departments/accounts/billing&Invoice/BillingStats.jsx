import React from 'react';
import { Card, Row, Col, Statistic, Progress, Skeleton } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const BillingStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <Card title="Billing Overview" className="h-full">
        <Skeleton active />
      </Card>
    );
  }

  return (
    <Card title="Billing Overview" className="h-full">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Total Revenue"
            value={stats?.total_revenue || 0}
            precision={2}
            prefix="₵"
            valueStyle={{ color: '#3f8600' }}
            suffix={<ArrowUpOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Pending Invoices"
            value={stats?.pending_invoices || 0}
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Paid Invoices"
            value={stats?.paid_invoices || 0}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Overdue Amount"
            value={stats?.overdue_amount || 0}
            precision={2}
            prefix="₵"
            valueStyle={{ color: '#cf1322' }}
            suffix={<ArrowDownOutlined />}
          />
        </Col>
      </Row>
      
      <div className="mt-6">
        <h4 className="text-gray-600 mb-2">Payment Distribution</h4>
        {stats?.payment_methods?.length > 0 ? (
          stats.payment_methods.map((method, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between mb-1">
                <span>{method.payment_method}</span>
                <span>₵{method.total_amount}</span>
              </div>
              <Progress 
                percent={Math.round((method.total_amount / stats.total_revenue) * 100)} 
                size="small" 
                status="active" 
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No payment data available</p>
        )}
      </div>
    </Card>
  );
};

export default BillingStats;