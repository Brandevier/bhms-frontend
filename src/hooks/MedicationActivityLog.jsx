import React, { useState } from 'react';
import { Card, Button, Modal, List, Tag, Divider } from 'antd';
import { PlusOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import SpeechTextArea from '../components/common/SpeechTextArea';



const MedicationActivityLog = () => {
  const [visible, setVisible] = useState(false);
  const [activityNote, setActivityNote] = useState('');
  const [activities, setActivities] = useState([
    {
      id: '1',
      note: 'Administered 500mg Paracetamol for fever',
      timestamp: '2023-06-15T10:30:00Z',
      type: 'medication'
    },
    {
      id: '2',
      note: 'Patient refused morning dose of antibiotics',
      timestamp: '2023-06-15T08:15:00Z',
      type: 'note'
    },
    {
      id: '3',
      note: 'Applied topical ointment to affected area',
      timestamp: '2023-06-14T16:45:00Z',
      type: 'treatment'
    }
  ]);

  const handleAddActivity = () => {
    if (!activityNote.trim()) {
      return;
    }

    const newActivity = {
      id: Date.now().toString(),
      note: activityNote,
      timestamp: new Date().toISOString(),
      type: 'medication'
    };

    setActivities([newActivity, ...activities]);
    setActivityNote('');
    setVisible(false);
  };

  const getActivityColor = (type) => {
    switch(type) {
      case 'medication': return 'blue';
      case 'treatment': return 'green';
      case 'note': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <Card
      title={<><MedicineBoxOutlined /> Medication Activities</>}
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
        >
          Add Activity
        </Button>
      }
      className="shadow-sm"
    >
      <List
        itemLayout="horizontal"
        dataSource={activities}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <div className="flex justify-between">
                  <span>{item.note}</span>
                  <Tag color={getActivityColor(item.type)}>
                    {item.type.toUpperCase()}
                  </Tag>
                </div>
              }
              description={new Date(item.timestamp).toLocaleString()}
            />
          </List.Item>
        )}
      />

      <Modal
        title="Record Medication Activity"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleAddActivity}
        okText="Save Activity"
        width={700}
        centered
      >
        <Divider orientation="left">Activity Details</Divider>
        <SpeechTextArea
          value={activityNote}
          onChange={setActivityNote}
          placeholder="Describe the medication activity..."
          showMentions={false}
          recordingControlsPosition="below"
        />
        <div className="mt-4 text-sm text-gray-500">
          Note: This will be recorded with the current timestamp
        </div>
      </Modal>
    </Card>
  );
};

export default MedicationActivityLog;