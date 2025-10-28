import React from 'react';
import { Card, List, Tag, Avatar, Skeleton } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  UserOutlined 
} from '@ant-design/icons';

const RecentTransactions = ({ transactions, loading }) => {
  if (loading) {
    return (
      <Card title="Recent Transactions">
        <Skeleton active />
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid': return 'green';
      case 'pending': return 'orange';
      case 'overdue': return 'red';
      default: return 'blue';
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'payment' 
      ? <ArrowDownOutlined className="text-green-500" /> 
      : <ArrowUpOutlined className="text-red-500" />;
  };

  return (
    <Card title="Recent Transactions">
      <List
        itemLayout="horizontal"
        dataSource={transactions || []}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={<UserOutlined />} 
                  className="bg-blue-100"
                />
              }
              title={
                <div className="flex justify-between">
                  <span>{item.visit?.patient?.first_name} {item.visit?.patient?.last_name}</span>
                  <span className={`font-medium ${item.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                    ₵{item.total_amount?.toFixed(2)}
                  </span>
                </div>
              }
              description={
                <div className="flex justify-between">
                  <div>
                    <span className="text-gray-500">{new Date(item.invoice_date).toLocaleDateString()}</span>
                    <Tag color="blue" className="ml-2">{item.payment_method || 'No method'}</Tag>
                  </div>
                  <Tag color={getStatusColor(item.status)}>{item.status?.toUpperCase()}</Tag>
                </div>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: 'No recent transactions' }}
      />
    </Card>
  );
};

export default RecentTransactions;