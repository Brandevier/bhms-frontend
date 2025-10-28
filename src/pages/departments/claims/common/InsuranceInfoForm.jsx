import React, { useState } from 'react';
import { Form, Input, Select, Button, DatePicker, Switch, message } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { patchInsuranceInfo } from '../../../../redux/slice/recordSlice';

const { Option } = Select;

const InsuranceInfoForm = ({ insurance, patientId, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [insured, setInsured] = useState(insurance?.insured || false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.records);

  const insuranceProviders = [
    'NHIS',
    'GhanaCard',
    'Private Insurance',
    'Corporate Insurance',
    'Other'
  ];

  const handleSubmit = async (values) => {
    try {
      // Format the date if it exists
      const formattedValues = {
        ...values,
        insurance_expiry_date: values.insurance_expiry_date ? 
          values.insurance_expiry_date.format('YYYY-MM-DD') : null,
        // Ensure insured status is properly set
        insured: values.insured !== undefined ? values.insured : insured
      };

      // Prepare the payload for the API
      const payload = {
        insuranceId: insurance?.id, // Pass the insurance ID if it exists
        data: formattedValues
      };

      // Dispatch the update action
      const result = await dispatch(patchInsuranceInfo({patient_id:patientId,data:payload})).unwrap();
      
      // Show success message
      message.success('Insurance information updated successfully');
      
      // Call the onSave callback with the result
      if (onSave) {
        onSave(result);
      }
      
    } catch (error) {
      console.error('Failed to update insurance:', error);
      message.error('Failed to update insurance information');
    }
  };

  const handleInsuredChange = (checked) => {
    setInsured(checked);
    form.setFieldsValue({ insured: checked });
    
    // If unchecking insured, clear required fields
    if (!checked) {
      form.setFieldsValue({
        insurance_number: '',
        insurance_provider: 'NHIS',
        insurance_expiry_date: null
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        insurance_number: insurance?.insurance_number || '',
        insurance_provider: insurance?.insurance_provider || 'NHIS',
        insurance_expiry_date: insurance?.insurance_expiry_date ? 
          moment(insurance.insurance_expiry_date) : null,
        insured: insurance?.insured || false,
      }}
      className="mt-4"
      onFinish={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item 
          name="insured" 
          label="Insured" 
          valuePropName="checked"
          rules={[{ required: true, message: 'Please specify insurance status' }]}
        >
          <Switch 
            checked={insured}
            onChange={handleInsuredChange}
            checkedChildren="Yes" 
            unCheckedChildren="No" 
          />
        </Form.Item>
        
        {insured && (
          <>
            <Form.Item 
              name="insurance_number" 
              label="Insurance Number"
              rules={[{ required: true, message: 'Insurance number is required' }]}
            >
              <Input placeholder="Enter insurance number" />
            </Form.Item>
            
            <Form.Item 
              name="insurance_provider" 
              label="Insurance Provider"
              rules={[{ required: true, message: 'Please select insurance provider' }]}
            >
              <Select placeholder="Select insurance provider">
                {insuranceProviders.map(provider => (
                  <Option key={provider} value={provider}>{provider}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item 
              name="insurance_expiry_date" 
              label="Insurance Expiry Date"
              rules={[{ required: true, message: 'Please select expiry date' }]}
            >
              <DatePicker 
                className="w-full"
                format="YYYY-MM-DD"
                disabledDate={(current) => {
                  return current && current < moment().startOf('day');
                }}
                placeholder="Select expiry date"
              />
            </Form.Item>
          </>
        )}
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
          {loading ? 'Updating...' : 'Update Insurance Info'}
        </Button>
      </div>
    </Form>
  );
};

export default InsuranceInfoForm;