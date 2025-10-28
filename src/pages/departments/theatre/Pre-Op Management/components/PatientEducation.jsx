import React, { useState } from 'react';
import { Card, Collapse, Button, List, Tag, Divider, Progress, Checkbox } from 'antd';
import { FileTextOutlined, CheckOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const PatientEducation = ({ patient }) => {
  const [educationMaterials, setEducationMaterials] = useState([
    {
      key: '1',
      title: 'Pre-Surgery Instructions',
      viewed: false,
      items: [
        'What to expect on surgery day',
        'How to prepare your home for recovery',
        'NPO guidelines',
        'Medication adjustments before surgery',
        'Hygiene and fasting preparation',
        'Preoperative testing and screenings',
        'Psychological preparation for surgery',
        'Informed consent process'
      ]
    },
    {
      key: '3',
      title: 'Pain Management Guide',
      viewed: false,
      items: [
        'Medication schedule',
        'Non-pharmacological methods',
        'When to call your doctor',
        'Pain scale explanation',
        'Postoperative pain expectations'
      ]
    },
    {
      key: '5',
      title: 'What Happens in the Operating Room',
      viewed: false,
      items: [
        'Operating room environment',
        'Anesthesia process and types',
        'Monitoring devices used during surgery',
        'Communication support if awake',
        'OR transfer procedure',
        'How your family will be updated'
      ]
    },
    {
      key: '6',
      title: 'Post-Surgery Recovery Instructions',
      viewed: false,
      items: [
        'Wound care basics',
        'Activity restrictions',
        'Dietary guidelines',
        'Signs of infection or complications',
        'Follow-up appointment scheduling',
        'Discharge planning and home setup'
      ]
    }
  ]);

  const handleMarkViewed = (key, viewed) => {
    setEducationMaterials(prev => 
      prev.map(material => 
        material.key === key ? { ...material, viewed } : material
      )
    );
    // API call would go here in a real implementation
  };

  const handleMarkAllViewed = () => {
    setEducationMaterials(prev => 
      prev.map(material => ({ ...material, viewed: true }))
    );
  };

  if (!patient) {
    return <div className="text-center text-gray-500">No patient data available</div>;
  }

  if (!patient.name || !patient.procedure || !patient.surgeryDate) {
    return <div className="text-center text-gray-500">Incomplete patient information</div>;
  }

  const completionPercentage = Math.round(
    (educationMaterials.filter(m => m.viewed).length / educationMaterials.length) * 100
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          <FileTextOutlined className="mr-2" />
          Patient Education for {patient.name}
        </h2>
        <Button 
          type="primary" 
          onClick={handleMarkAllViewed}
          disabled={educationMaterials.every(m => m.viewed)}
        >
          Mark All as Viewed
        </Button>
      </div>

      <Divider orientation="left" className="text-sm">
        Procedure: {patient.procedure} | Scheduled: {patient.surgeryDate}
      </Divider>

      <Card className="mb-4 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <span className="text-gray-600">Completion: </span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress
            percent={completionPercentage}
            strokeColor={completionPercentage === 100 ? '#52c41a' : '#1890ff'}
            style={{ width: '300px' }}
            showInfo={false}
          />
        </div>

        <List
          dataSource={educationMaterials}
          renderItem={material => (
            <List.Item
              actions={[
                <Checkbox
                  checked={material.viewed}
                  onChange={(e) => handleMarkViewed(material.key, e.target.checked)}
                >
                  {material.viewed ? 'Completed' : 'Mark Complete'}
                </Checkbox>
              ]}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined className="text-lg" />}
                title={
                  <div className="flex items-center">
                    <span className={material.viewed ? 'text-gray-600' : 'font-medium'}>
                      {material.title}
                    </span>
                    {material.viewed && (
                      <Tag icon={<CheckOutlined />} color="green" className="ml-2">
                        Viewed
                      </Tag>
                    )}
                  </div>
                }
                description={
                  <Collapse ghost>
                    <Panel 
                      header={`Show details (${material.items.length} items)`} 
                      key="1"
                      className="p-0"
                    >
                      <List
                        size="small"
                        dataSource={material.items}
                        renderItem={item => (
                          <List.Item>
                            <div className="flex items-center">
                              <CheckOutlined className="mr-2 text-gray-400" />
                              {item}
                            </div>
                          </List.Item>
                        )}
                      />
                    </Panel>
                  </Collapse>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Education Verification" className="shadow-sm">
        <List
          size="small"
          dataSource={[
            'Patient verbalized understanding of NPO instructions',
            'Patient demonstrated proper use of incentive spirometer',
            'Patient reviewed pain management plan',
            'Caregiver education completed'
          ]}
          renderItem={(item) => (
            <List.Item>
              <Checkbox className="mr-2" />
              {item}
            </List.Item>
          )}
        />
        <div className="mt-4">
          <Button type="primary">Sign Education Completion</Button>
        </div>
      </Card>
    </div>
  );
};

export default PatientEducation;