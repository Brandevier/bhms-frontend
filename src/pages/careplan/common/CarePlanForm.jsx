import React from 'react';
import { Form, Input, Select, DatePicker } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const CarePlanForm = ({ form, staffs }) => {
  return (
    <Form form={form} layout="vertical" className="mt-6">
      <Form.Item
        name="care_plan_goal"
        label="Care Plan Goal"
        rules={[{ required: true, message: 'Please enter a care plan goal' }]}
      >
        <Input placeholder="e.g., Control blood pressure" size="large" />
      </Form.Item>
      
      <Form.Item
        name="interventions"
        label="Interventions"
        rules={[{ required: true, message: 'Please enter interventions' }]}
      >
        <TextArea 
          rows={3} 
          placeholder="e.g., Administer antihypertensives daily as prescribed" 
        />
      </Form.Item>
      
      <Form.Item
        name="priority"
        label="Priority"
        rules={[{ required: true, message: 'Please select priority' }]}
      >
        <Select placeholder="Select priority" size="large">
          <Option value="High">High</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Low">Low</Option>
        </Select>
      </Form.Item>

      {/* Assign Staff */}
      <Form.Item
        name="assigned_staff"
        label="Assign Staff"
        rules={[{ required: true, message: 'Please select a staff' }]}
      >
        <Select 
          placeholder="Select a staff" 
          size="large"
          optionFilterProp="children" 
          showSearch
        >
          {staffs?.map((staff) => (
            <Option key={staff.id} value={staff.id}>
              {`${staff.firstName} ${staff.middleName || ""} ${staff.lastName}`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          name="start_date"
          label="Start Date"
          rules={[{ required: true, message: 'Please select start date' }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        
        <Form.Item
          name="end_date"
          label="End Date"
          rules={[{ required: true, message: 'Please select end date' }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
      </div>
      
      <Form.Item
        name="frequency_of_reviews"
        label="Frequency of Reviews"
      >
        <Input placeholder="e.g., Weekly, Monthly" />
      </Form.Item>
    </Form>
  );
};

export default CarePlanForm;
