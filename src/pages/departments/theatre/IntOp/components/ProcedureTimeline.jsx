import React, { useState } from 'react';
import { Timeline, Card, Button, Tag, Divider, Badge, Input, Form } from 'antd';
import { 
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

const ProcedureTimeline = ({ caseStatus, timeoutCompleted, onTimeoutComplete }) => {
  const [timelineItems, setTimelineItems] = useState([
    {
      key: '1',
      time: '08:45',
      title: 'Case Started',
      description: 'Patient in room, prepped and draped',
      status: 'completed',
      color: 'green'
    },
    {
      key: '2',
      time: '08:50',
      title: 'Time Out Completed',
      description: timeoutCompleted ? 'All checks confirmed' : 'Pending',
      status: timeoutCompleted ? 'completed' : 'pending',
      color: timeoutCompleted ? 'green' : 'orange'
    },
    {
      key: '3',
      time: '09:05',
      title: 'Incision',
      description: 'Standard midline incision',
      status: 'completed',
      color: 'green'
    }
  ]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [form] = Form.useForm();

  const onAddNote = (values) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setTimelineItems([
      ...timelineItems,
      {
        key: `new-${Date.now()}`,
        time: timeString,
        title: values.title,
        description: values.description,
        status: 'completed',
        color: 'green'
      }
    ]);
    form.resetFields();
    setIsAddingNote(false);
  };

  return (
    <Card 
      title="Procedure Timeline" 
      bordered={false} 
      className="shadow-sm"
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsAddingNote(true)}
        >
          Add Note
        </Button>
      }
    >
      {isAddingNote && (
        <Card className="mb-4">
          <Form form={form} onFinish={onAddNote}>
            <Form.Item
              name="title"
              label="Event Title"
              rules={[{ required: true, message: 'Please input a title' }]}
            >
              <Input placeholder="Enter event title" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please input a description' }]}
            >
              <TextArea rows={3} placeholder="Enter detailed description" />
            </Form.Item>
            <div className="flex justify-end">
              <Button className="mr-2" onClick={() => setIsAddingNote(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Add to Timeline
              </Button>
            </div>
          </Form>
        </Card>
      )}

      <Timeline
        mode="left"
        pending={caseStatus === 'completed' ? false : 'Recording in progress...'}
      >
        {timelineItems.map(item => (
          <Timeline.Item
            key={item.key}
            color={item.color}
            dot={
              item.status === 'completed' ? <CheckCircleOutlined /> :
              item.status === 'in-progress' ? <PlayCircleOutlined /> : <ClockCircleOutlined />
            }
          >
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{item.time} - {item.title}</div>
                <div className="text-gray-600">{item.description}</div>
              </div>
              {item.key === '2' && !timeoutCompleted && (
                <Button 
                  type="primary" 
                  size="small"
                  onClick={onTimeoutComplete}
                >
                  Perform Time Out
                </Button>
              )}
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
};

export default ProcedureTimeline;