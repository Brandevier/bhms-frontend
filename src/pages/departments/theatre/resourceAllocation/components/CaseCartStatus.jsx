import React from 'react';
import { Card, List, Progress, Tag, Button } from 'antd';
import { 
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ShoppingCartOutlined 
} from '@ant-design/icons';

const CaseCartStatus = () => {
  const caseCarts = [
    {
      id: 'CC-2023-0456',
      procedure: 'Total Knee Replacement',
      surgeon: 'Dr. Johnson',
      status: 'ready',
      completion: 100,
      items: [
        { name: 'Knee Implant', status: 'ready' },
        { name: 'Bone Cement', status: 'ready' },
        { name: 'Surgical Kit', status: 'ready' },
      ]
    },
    {
      id: 'CC-2023-0457',
      procedure: 'Laparoscopic Cholecystectomy',
      surgeon: 'Dr. Lee',
      status: 'in-progress',
      completion: 65,
      items: [
        { name: 'Laparoscope', status: 'ready' },
        { name: 'Clip Applier', status: 'pending' },
        { name: 'Specimen Bag', status: 'ready' },
      ]
    },
    {
      id: 'CC-2023-0458',
      procedure: 'Cataract Surgery',
      surgeon: 'Dr. Smith',
      status: 'not-started',
      completion: 0,
      items: [
        { name: 'IOL Lens', status: 'pending' },
        { name: 'Phaco Machine', status: 'pending' },
        { name: 'Viscoelastic', status: 'pending' },
      ]
    },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ready':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'in-progress':
        return <ClockCircleOutlined className="text-orange-500" />;
      case 'not-started':
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card 
      title={
        <div className="flex items-center">
          <ShoppingCartOutlined className="mr-2" />
          <span>Case Cart Status</span>
        </div>
      } 
      bordered={false} 
      className="shadow-sm h-full"
    >
      <List
        itemLayout="vertical"
        dataSource={caseCarts}
        renderItem={cart => (
          <List.Item>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">{cart.procedure}</div>
                <div className="text-gray-500 text-sm">Cart #{cart.id}</div>
              </div>
              <Tag icon={getStatusIcon(cart.status)} className="capitalize">
                {cart.status.replace('-', ' ')}
              </Tag>
            </div>
            
            <Progress 
              percent={cart.completion} 
              status={
                cart.completion === 100 ? 'success' : 
                cart.completion > 50 ? 'active' : 'exception'
              } 
              size="small" 
            />
            
            <div className="mt-2">
              <div className="text-gray-600 text-sm mb-1">Items:</div>
              <div className="flex flex-wrap gap-1">
                {cart.items.map((item, index) => (
                  <Tag 
                    key={index} 
                    color={item.status === 'ready' ? 'green' : 'orange'}
                    className="text-xs"
                  >
                    {item.name}
                  </Tag>
                ))}
              </div>
            </div>
            
            <div className="mt-3 flex justify-end">
              <Button size="small" className="mr-2">Details</Button>
              <Button size="small" type="primary" disabled={cart.status !== 'ready'}>
                Confirm
              </Button>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CaseCartStatus;