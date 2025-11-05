import React, { useState } from 'react';
import { 
  Card, 
  Collapse, 
  Button, 
  List, 
  Tag, 
  Divider, 
  Progress, 
  Checkbox, 
  Alert,
  Space,
  Badge
} from 'antd';
import { 
  FileTextOutlined, 
  CheckOutlined, 
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;

const PatientEducation = ({ patient }) => {
  const [educationMaterials, setEducationMaterials] = useState([
    {
      key: '1',
      title: 'Pre-Surgery Instructions',
      category: 'Preoperative',
      viewed: false,
      items: [
        'What to expect on surgery day',
        'How to prepare your home for recovery',
        'NPO guidelines (nothing by mouth)',
        'Medication adjustments before surgery',
        'Hygiene and fasting preparation',
        'Preoperative testing and screenings',
        'Psychological preparation for surgery',
        'Informed consent process'
      ]
    },
    {
      key: '2',
      title: 'Anesthesia Information',
      category: 'Anesthesia',
      viewed: false,
      items: [
        'Types of anesthesia available',
        'Anesthesia risks and benefits',
        'What to expect during anesthesia',
        'Post-anesthesia recovery process',
        'Anesthesia consent form review'
      ]
    },
    {
      key: '3',
      title: 'Pain Management Guide',
      category: 'Postoperative',
      viewed: false,
      items: [
        'Medication schedule and timing',
        'Non-pharmacological pain relief methods',
        'When to contact your healthcare provider',
        'Pain scale explanation and usage',
        'Postoperative pain expectations'
      ]
    },
    {
      key: '4',
      title: 'Surgical Procedure Details',
      category: 'Procedure',
      viewed: false,
      items: [
        'Step-by-step procedure explanation',
        'Expected duration of surgery',
        'Potential risks and complications',
        'Surgical team introduction',
        'What will be done during the procedure'
      ]
    },
    {
      key: '5',
      title: 'Operating Room Experience',
      category: 'Intraoperative',
      viewed: false,
      items: [
        'Operating room environment overview',
        'Anesthesia process and monitoring',
        'Patient positioning and preparation',
        'Communication methods during surgery',
        'Family updates and waiting area information'
      ]
    },
    {
      key: '6',
      title: 'Post-Surgery Recovery Instructions',
      category: 'Recovery',
      viewed: false,
      items: [
        'Wound care and dressing changes',
        'Activity restrictions and limitations',
        'Dietary guidelines and restrictions',
        'Signs of infection or complications',
        'Follow-up appointment scheduling',
        'Discharge planning and home setup'
      ]
    }
  ]);

  // Handle case when no patient is selected
  if (!patient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert
          message="No Patient Selected"
          description="Please select a patient from the theatre list to view education materials."
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
  const patientAge = patient.patient?.age || 'N/A';
  const folderNumber = patient.patient?.folderNumber || 'N/A';

  const handleMarkViewed = (key, viewed) => {
    setEducationMaterials(prev => 
      prev.map(material => 
        material.key === key ? { ...material, viewed } : material
      )
    );
    // API call would go here in a real implementation
    console.log(`Marked ${key} as ${viewed ? 'viewed' : 'not viewed'}`);
  };

  const handleMarkAllViewed = () => {
    setEducationMaterials(prev => 
      prev.map(material => ({ ...material, viewed: true }))
    );
  };

  const completionPercentage = Math.round(
    (educationMaterials.filter(m => m.viewed).length / educationMaterials.length) * 100
  );

  const completedCount = educationMaterials.filter(m => m.viewed).length;
  const totalCount = educationMaterials.length;

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <FileTextOutlined className="mr-3 text-blue-600" />
            Patient Education
          </h2>
          <div className="mt-2 space-y-1 text-gray-600">
            <div className="flex items-center">
              <UserOutlined className="mr-2" />
              <span className="font-medium">{patientName}</span>
              <Badge 
                count={folderNumber} 
                style={{ backgroundColor: '#1890ff', marginLeft: 8 }}
              />
            </div>
            <div className="flex items-center">
              <MedicineBoxOutlined className="mr-2" />
              <span>{primaryProcedure}</span>
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
          <Button 
            type="primary" 
            icon={<CheckOutlined />}
            onClick={handleMarkAllViewed}
            disabled={completionPercentage === 100}
            size="large"
          >
            Mark All Complete
          </Button>
          <div className="text-sm text-gray-500">
            {completedCount} of {totalCount} sections complete
          </div>
        </Space>
      </div>

      <Divider className="my-4" />

      {/* Progress Overview */}
      <Card className="mb-6 shadow-sm border" size="small">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-600 mr-4 font-medium">Education Completion:</span>
            <span className={`text-lg font-bold ${
              completionPercentage === 100 ? 'text-green-600' : 'text-blue-600'
            }`}>
              {completionPercentage}%
            </span>
          </div>
          <Progress
            percent={completionPercentage}
            strokeColor={completionPercentage === 100 ? '#52c41a' : '#1890ff'}
            style={{ width: '300px' }}
            showInfo={false}
          />
        </div>
      </Card>

      {/* Education Materials */}
      <Card 
        title={
          <Space>
            <FileTextOutlined />
            Educational Materials
            <Badge count={totalCount} showZero style={{ backgroundColor: '#1890ff' }} />
          </Space>
        } 
        className="mb-6 shadow-sm border"
        extra={
          <Tag color={completionPercentage === 100 ? 'green' : 'blue'}>
            {completionPercentage === 100 ? 'All Complete' : 'In Progress'}
          </Tag>
        }
      >
        <List
          dataSource={educationMaterials}
          renderItem={material => (
            <List.Item
              className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
              actions={[
                <Checkbox
                  checked={material.viewed}
                  onChange={(e) => handleMarkViewed(material.key, e.target.checked)}
                  className={material.viewed ? 'text-green-600' : ''}
                >
                  {material.viewed ? 'Completed' : 'Mark Complete'}
                </Checkbox>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div className={`p-3 rounded-full ${
                    material.viewed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <FileTextOutlined className="text-lg" />
                  </div>
                }
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`text-lg ${
                        material.viewed ? 'text-gray-600 line-through' : 'font-semibold text-gray-900'
                      }`}>
                        {material.title}
                      </span>
                      <Tag color="blue" className="ml-2 text-xs">
                        {material.category}
                      </Tag>
                    </div>
                    {material.viewed && (
                      <Tag icon={<CheckOutlined />} color="green" className="ml-2">
                        Reviewed
                      </Tag>
                    )}
                  </div>
                }
                description={
                  <Collapse 
                    ghost 
                    className="mt-2"
                    expandIconPosition="end"
                  >
                    <Panel 
                      header={
                        <span className="text-blue-600 font-medium">
                          View Details ({material.items.length} topics)
                        </span>
                      } 
                      key="1"
                    >
                      <List
                        size="small"
                        dataSource={material.items}
                        renderItem={(item, index) => (
                          <List.Item className="border-0 py-2">
                            <div className="flex items-center w-full">
                              <div className={`w-2 h-2 rounded-full mr-3 ${
                                material.viewed ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                              <span className={material.viewed ? 'text-gray-600' : 'text-gray-800'}>
                                {item}
                              </span>
                            </div>
                          </List.Item>
                        )}
                        className="bg-gray-50 rounded-lg p-2"
                      />
                    </Panel>
                  </Collapse>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Education Verification */}
      <Card 
        title={
          <Space>
            <SafetyCertificateOutlined />
            Education Verification & Signature
          </Space>
        } 
        className="shadow-sm border"
        extra={<Tag color="orange">Requires Signature</Tag>}
      >
        <div className="space-y-4">
          <Alert
            message="Education Verification Required"
            description="Please confirm that the patient and/or caregiver has reviewed and understood all educational materials."
            type="info"
            showIcon
          />
          
          <List
            size="small"
            dataSource={[
              'Patient verbalized understanding of NPO instructions',
              'Patient demonstrated proper use of incentive spirometer',
              'Patient reviewed pain management plan and expectations',
              'Caregiver education completed (if applicable)',
              'All questions answered satisfactorily',
              'Emergency contact information verified'
            ]}
            renderItem={(item) => (
              <List.Item className="border-0 py-2">
                <Checkbox className="mr-3" />
                <span className="text-gray-700">{item}</span>
              </List.Item>
            )}
            className="mb-4"
          />
          
          <Divider />
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <Space>
              <Button type="default" size="large">
                Print Education Materials
              </Button>
              <Button 
                type="primary" 
                icon={<SafetyCertificateOutlined />}
                size="large"
                disabled={completionPercentage < 100}
              >
                Sign Education Completion
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* Completion Status */}
      {completionPercentage === 100 && (
        <Alert
          message="Education Complete"
          description="All patient education materials have been reviewed and completed."
          type="success"
          showIcon
          className="mt-6"
        />
      )}
    </div>
  );
};

export default PatientEducation;