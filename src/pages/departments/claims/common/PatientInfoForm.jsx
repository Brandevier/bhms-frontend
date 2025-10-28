import React from 'react';
import { Form, Input, Select, Button, Space, DatePicker, message } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { patchPatientInfo } from '../../../../redux/slice/recordSlice';

const { Option } = Select;

const PatientInfoForm = ({ patient, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.records);

  const handleSubmit = async (values) => {
    try {
      // Format the date if it exists
      const formattedValues = {
        ...values,
        date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
      };

      // Prepare the payload for the API
      const payload = {
        
        data: formattedValues
      };

      // Dispatch the update action
      const result = await dispatch(patchPatientInfo({patient_id: patient.id,data:payload})).unwrap();
      message.success('Patient information updated successfully');
      
      // Call the onSave callback with the result
      if (onSave) {
        onSave(result);
      }
      
    } catch (error) {
      console.error('Failed to update patient:', error);
      // You might want to show an error message here
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        first_name: patient.first_name,
        middle_name: patient.middle_name || '',
        last_name: patient.last_name,
        gender: patient.gender,
        date_of_birth: patient.date_of_birth ? moment(patient.date_of_birth) : null,
      }}
      className="mt-4"
      onFinish={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item 
          name="first_name" 
          label="First Name" 
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item name="middle_name" label="Middle Name">
          <Input />
        </Form.Item>
        
        <Form.Item 
          name="last_name" 
          label="Last Name" 
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item 
          name="gender" 
          label="Gender" 
          rules={[{ required: true, message: 'Please select gender' }]}
        >
          <Select>
            <Option value="M">Male</Option>
            <Option value="F">Female</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="date_of_birth" label="Date of Birth">
          <DatePicker 
            className="w-full" 
            format="YYYY-MM-DD"
            disabledDate={(current) => {
              return current && current > moment().endOf('day');
            }}
          />
        </Form.Item>
      </div>
      
      <div className="flex justify-end mt-6 space-x-3">
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        
        <Button 
          type="primary" 
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Patient Info'}
        </Button>
      </div>
    </Form>
  );
};

export default PatientInfoForm;