import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import {
  PlusOutlined,
  FileSearchOutlined,
  PrinterOutlined,
  DownloadOutlined,
  NotificationOutlined
} from '@ant-design/icons';

const QuickActions = () => {
  const actions = [
    {
      title: 'Create Invoice',
      description: 'Generate a new patient invoice',
      icon: <PlusOutlined />,
      color: 'bg-blue-500'
    },
    {
      title: 'View Statements',
      description: 'Check patient account statements',
      icon: <FileSearchOutlined />,
      color: 'bg-green-500'
    },
    {
      title: 'Print Reports',
      description: 'Generate billing reports',
      icon: <PrinterOutlined />,
      color: 'bg-purple-500'
    },
    {
      title: 'Export Data',
      description: 'Export billing records',
      icon: <DownloadOutlined />,
      color: 'bg-orange-500'
    },
    {
      title: 'Send Reminders',
      description: 'Notify patients of pending payments',
      icon: <NotificationOutlined />,
      color: 'bg-red-500'
    }
  ];

  return (
    <Card title="Quick Actions">
      <Row gutter={[16, 16]}>
        {actions.map((action, index) => (
          <Col xs={12} sm={8} key={index}>
            <Button 
              type="default" 
              className="h-full w-full text-left p-4 flex flex-col items-start"
            >
              <div className={`rounded-full p-2 mb-2 ${action.color} text-white`}>
                {action.icon}
              </div>
              <h4 className="font-medium mb-1">{action.title}</h4>
              <p className="text-xs text-gray-500">{action.description}</p>
            </Button>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default QuickActions;