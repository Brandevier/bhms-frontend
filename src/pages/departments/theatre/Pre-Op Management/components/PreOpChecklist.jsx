import React from 'react';
import { Checkbox, Card, List, Tag, Button, Divider, Badge, Alert, Space } from 'antd';
import { 
  FileDoneOutlined,
  CheckOutlined,
  CloseOutlined,
  WarningOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const PreOpChecklist = ({ patient }) => {
  // Handle case when no patient is selected
  if (!patient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert
          message="No Patient Selected"
          description="Please select a patient from the theatre list to view their pre-operative checklist."
          type="info"
          showIcon
        />
      </div>
    );
  }

  // Safely extract patient data with fallbacks
  const patientName = patient.patient?.name || 'Unknown Patient';
  const primaryProcedure = patient.procedure?.primary || 'No procedure specified';
  const surgeryDate = patient.schedule?.formattedDate || 'Not scheduled';
  const surgeryTime = patient.schedule?.formattedTime || '';
  const diagnosis = patient.diagnosis?.primary || 'No diagnosis specified';

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
        return <Tag icon={<CheckOutlined />} color="green" size="small">Completed</Tag>;
      case 'pending':
        return <Tag icon={<WarningOutlined />} color="orange" size="small">Pending</Tag>;
      case 'not-started':
        return <Tag color="blue" size="small">Not Started</Tag>;
      case 'not-required':
        return <Tag color="default" size="small">Not Required</Tag>;
      default:
        return <Tag size="small">Not Started</Tag>;
    }
  };

  // Calculate completion statistics
  const calculateProgress = () => {
    let totalItems = 0;
    let completedItems = 0;
    let requiredItems = 0;
    let completedRequired = 0;

    checklistItems.forEach(category => {
      category.items.forEach(item => {
        totalItems++;
        if (item.status === 'completed') {
          completedItems++;
        }
        if (item.required) {
          requiredItems++;
          if (item.status === 'completed') {
            completedRequired++;
          }
        }
      });
    });

    return {
      totalItems,
      completedItems,
      requiredItems,
      completedRequired,
      overallProgress: Math.round((completedItems / totalItems) * 100),
      requiredProgress: Math.round((completedRequired / requiredItems) * 100)
    };
  };

  const progress = calculateProgress();

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <FileDoneOutlined className="mr-3 text-blue-600" />
            Pre-Operative Checklist
          </h2>
          <div className="mt-2 space-y-1 text-gray-600">
            <div className="flex items-center">
              <UserOutlined className="mr-2" />
              <span className="font-medium">{patientName}</span>
              <Badge 
                count={patient.patient?.folderNumber} 
                style={{ backgroundColor: '#1890ff', marginLeft: 8 }}
              />
            </div>
            <div className="flex items-center">
              <MedicineBoxOutlined className="mr-2" />
              <span>{primaryProcedure}</span>
              {patient.procedure?.count > 1 && (
                <Tag size="small" className="ml-2">
                  +{patient.procedure.count - 1} more
                </Tag>
              )}
            </div>
            <div className="flex items-center">
              <CalendarOutlined className="mr-2" />
              <span>
                {surgeryDate} 
                {surgeryTime && ` at ${surgeryTime}`}
              </span>
            </div>
          </div>
        </div>
        
        <Space direction="vertical" align="end">
          <Button type="primary" size="large">
            Mark Checklist Complete
          </Button>
          <div className="text-xs text-gray-500 text-right">
            {progress.completedItems} of {progress.totalItems} items complete
          </div>
        </Space>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6 shadow-sm" size="small">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {progress.overallProgress}%
            </div>
            <div className="text-xs text-gray-500">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {progress.completedRequired}/{progress.requiredItems}
            </div>
            <div className="text-xs text-gray-500">Required Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {progress.completedItems}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
        </div>
      </Card>

      <Divider orientation="left" className="text-sm font-medium">
        Diagnosis: {diagnosis}
      </Divider>
      
      {/* Checklist Sections */}
      <div className="space-y-4">
        {checklistItems.map(category => (
          <Card 
            key={category.id} 
            title={
              <div className="flex justify-between items-center">
                <span className="font-medium">{category.category}</span>
                <Badge 
                  count={
                    category.items.filter(item => item.status === 'completed').length
                  } 
                  showZero 
                  style={{ backgroundColor: '#52c41a' }}
                />
              </div>
            } 
            className="shadow-sm border"
            size="small"
          >
            <List
              itemLayout="horizontal"
              dataSource={category.items}
              renderItem={item => (
                <List.Item
                  className="hover:bg-gray-50 transition-colors"
                  actions={[
                    <Checkbox 
                      checked={item.status === 'completed'} 
                      disabled={item.status === 'not-required'}
                      onChange={(e) => console.log('Toggle item:', item.id, e.target.checked)}
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={item.required ? 'font-medium text-gray-900' : 'text-gray-600'}>
                            {item.name}
                          </span>
                          {!item.required && (
                            <Tag size="small" className="ml-2">Optional</Tag>
                          )}
                        </div>
                        {getStatusTag(item.status)}
                      </div>
                    }
                    description={
                      item.required ? (
                        <span className="text-red-500 text-xs">Required</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Optional</span>
                      )
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <Button type="default">
          Print Checklist
        </Button>
        <Space>
          <Button type="default">
            Save Progress
          </Button>
          <Button type="primary" disabled={progress.requiredProgress < 100}>
            Complete All Required
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default PreOpChecklist;