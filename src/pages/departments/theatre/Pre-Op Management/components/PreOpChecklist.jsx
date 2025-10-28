import React from 'react';
import { Checkbox, Card, List, Tag, Button, Divider, Badge } from 'antd';
import { 
  FileDoneOutlined,
  CheckOutlined,
  CloseOutlined,
  WarningOutlined
} from '@ant-design/icons';

const PreOpChecklist = ({ patient }) => {
  const checklistItems = [
    {
      id: 'check-1',
      category: 'Consents',
      items: [
        { id: 'consent-1', name: 'Surgical Consent', status: 'completed', required: true },
        { id: 'consent-2', name: 'Anesthesia Consent', status: 'pending', required: true },
        { id: 'consent-3', name: 'Blood Consent', status: 'not-required', required: false },
      ]
    },
    {
      id: 'check-2',
      category: 'Labs & Tests',
      items: [
        { id: 'lab-1', name: 'CBC', status: 'completed', required: true },
        { id: 'lab-2', name: 'Basic Metabolic Panel', status: 'completed', required: true },
        { id: 'lab-3', name: 'PT/INR', status: 'pending', required: true },
        { id: 'lab-4', name: 'Pregnancy Test', status: 'not-required', required: false },
      ]
    },
    {
      id: 'check-3',
      category: 'Imaging',
      items: [
        { id: 'img-1', name: 'Chest X-Ray', status: 'completed', required: true },
        { id: 'img-2', name: 'EKG', status: 'completed', required: true },
        { id: 'img-3', name: 'MRI', status: 'not-started', required: false },
      ]
    },
    {
      id: 'check-4',
      category: 'Pre-Op Instructions',
      items: [
        { id: 'instr-1', name: 'NPO Instructions', status: 'pending', required: true },
        { id: 'instr-2', name: 'Medication Instructions', status: 'pending', required: true },
        { id: 'instr-3', name: 'Arrival Time', status: 'completed', required: true },
      ]
    },
  ];

  const getStatusTag = (status) => {
    switch(status) {
      case 'completed':
        return <Tag icon={<CheckOutlined />} color="green">Completed</Tag>;
      case 'pending':
        return <Tag icon={<WarningOutlined />} color="orange">Pending</Tag>;
      case 'not-started':
        return <Tag color="blue">Not Started</Tag>;
      default:
        return <Tag>Not Required</Tag>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          <FileDoneOutlined className="mr-2" />
          Pre-Operative Checklist for {patient.name}
        </h2>
        <Button type="primary">Mark as Complete</Button>
      </div>
      
      <Divider orientation="left" className="text-sm">
        Procedure: {patient.procedure} | Scheduled: {patient.surgeryDate}
      </Divider>
      
      {checklistItems.map(category => (
        <Card 
          key={category.id} 
          title={category.category} 
          className="mb-4 shadow-sm"
          size="small"
        >
          <List
            itemLayout="horizontal"
            dataSource={category.items}
            renderItem={item => (
              <List.Item
                actions={[
                  <Checkbox 
                    checked={item.status === 'completed'} 
                    disabled={item.status === 'not-required'}
                    onChange={() => console.log('Toggle status')}
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={
                    item.required ? (
                      <Badge status="error" />
                    ) : (
                      <Badge status="default" />
                    )
                  }
                  title={
                    <div className="flex items-center">
                      <span className={item.required ? 'font-medium' : 'text-gray-600'}>
                        {item.name}
                      </span>
                      {!item.required && (
                        <Tag className="ml-2">Optional</Tag>
                      )}
                    </div>
                  }
                  description={getStatusTag(item.status)}
                />
              </List.Item>
            )}
          />
        </Card>
      ))}
    </div>
  );
};

export default PreOpChecklist;