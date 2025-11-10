import React from 'react';
import { Card, Form, Checkbox, Input, Button, Row, Col, Tag } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;

const PreOpChecklistCard = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Pre-op checklist:', values);
    // Handle checklist submission
  };

  return (
    <Card 
      title={
        <span>
          <SafetyOutlined className="mr-2" />
          Pre-Operative Checklist
          <Tag color="orange" className="ml-2">Required</Tag>
        </span>
      } 
      className="shadow-sm border"
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item 
          name="checklist" 
          label="Complete the following checks:"
          rules={[{ required: true, message: 'Please complete all required checks' }]}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row gutter={[0, 8]}>
              <Col span={24}>
                <Checkbox value="history">History & Physical completed and reviewed</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="labs">Pre-operative labs and diagnostics reviewed</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="meds">Pre-operative medications administered as ordered</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="site">Surgical site marked and verified with patient</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="void">Patient voided before transfer to OR</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="belongings">Patient belongings secured and documented</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="timeout">Pre-procedure timeout completed</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="handover">OR handover report prepared</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        
        <Form.Item name="comments" label="Additional Comments/Notes">
          <TextArea 
            rows={2} 
            placeholder="Document any issues, concerns, or special instructions..." 
          />
        </Form.Item>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Last updated: {moment().format('MMM DD, YYYY HH:mm')}
          </div>
          <Button type="primary" size="large" htmlType="submit">
            Complete Pre-Op Checklist
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default PreOpChecklistCard;