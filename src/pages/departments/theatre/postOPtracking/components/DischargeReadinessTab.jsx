import React from 'react';
import { Card, List, Checkbox, Progress, Button, Divider, Input, Select, DatePicker, TimePicker,Row,Col } from 'antd';

const { Option } = Select;

const DischargeReadinessTab = ({ dischargeChecklist, onChecklistItemChange }) => {
  return (
    <Row gutter={16}>
      <Col xs={24} lg={12}>
        <Card title="Discharge Checklist" className="mb-4 shadow-sm">
          <List
            dataSource={dischargeChecklist}
            renderItem={item => (
              <List.Item>
                <Checkbox
                  checked={item.completed}
                  onChange={() => onChecklistItemChange(item.id)}
                >
                  <span className={item.completed ? 'line-through text-gray-500' : ''}>
                    {item.item}
                  </span>
                </Checkbox>
              </List.Item>
            )}
          />
          <Divider />
          <div className="flex justify-between items-center">
            <Progress 
              percent={Math.round(
                (dischargeChecklist.filter(i => i.completed).length / 
                dischargeChecklist.length * 100
              ))} 
              size="small" 
              status={
                dischargeChecklist.filter(i => i.completed).length === 
                dischargeChecklist.length ? 'success' : 'active'
              } 
            />
            <Button 
              type="primary" 
              disabled={
                dischargeChecklist.filter(i => i.completed).length !== 
                dischargeChecklist.length
              }
            >
              Initiate Discharge
            </Button>
          </div>
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Discharge Instructions" className="mb-4 shadow-sm">
          <div className="mb-4">
            <div className="font-medium mb-2">Follow-up Appointment</div>
            <Input.Group compact>
              <DatePicker style={{ width: '60%' }} />
              <TimePicker style={{ width: '40%' }} />
            </Input.Group>
          </div>
          <div className="mb-4">
            <div className="font-medium mb-2">Prescriptions</div>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select medications"
            >
              <Option value="acetaminophen">Acetaminophen 500mg Q6H PRN</Option>
              <Option value="ibuprofen">Ibuprofen 600mg Q8H PRN</Option>
              <Option value="ondansetron">Ondansetron 4mg Q8H PRN</Option>
            </Select>
          </div>
          <div>
            <div className="font-medium mb-2">Special Instructions</div>
            <Input.TextArea rows={4} placeholder="Enter discharge instructions..." />
          </div>
          <Divider />
          <Button type="primary">Print Discharge Papers</Button>
        </Card>
      </Col>
    </Row>
  );
};

export default DischargeReadinessTab;