import React from 'react';
import { Modal, Form, InputNumber, DatePicker, Select, Input, Row, Col, Button } from 'antd';
import { useFluidMonitoring } from '../../../redux/hooks/useFluidMonitoring';

const { Option } = Select;
const { TextArea } = Input;

const AddFluidEntryModal = ({ 
  visible, 
  onClose, 
  onSuccess, 
  defaultType = 'intake', 
  visitId, 
  institutionId 
}) => {
  const [form] = Form.useForm();
  const { createFluidEntry, loading } = useFluidMonitoring();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('visit id,', visitId)
      await createFluidEntry({
        ...values,
        visit_id:visitId,
        institution_id: institutionId,
        type: defaultType, // Use the default type from props
        recorded_at: values.recorded_at || new Date(),
        
      });
      form.resetFields();
      console.log('visit_id',this.visit_id)
      onSuccess(); // Call the success callback
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose(); // Call the close callback
  };

  return (
    <Modal
      title={`Add ${defaultType === 'intake' ? 'Intake' : 'Output'} Entry`}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading.action}
      width={600}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="amount"
              label="Amount (ml)"
              rules={[{ required: true, message: 'Please enter amount' }]}
            >
              <InputNumber
                min={1}
                max={5000}
                placeholder="Enter amount"
                className="w-full"
                addonAfter="ml"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="recorded_at"
              label="Time"
              rules={[{ required: true, message: 'Please select time' }]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select placeholder="Select category">
            {defaultType === 'intake' ? (
              <>
                <Option value="oral">Oral</Option>
                <Option value="iv">IV</Option>
                <Option value="ng_tube">NG Tube</Option>
                <Option value="other_intake">Other</Option>
              </>
            ) : (
              <>
                <Option value="urine">Urine</Option>
                <Option value="stool">Stool</Option>
                <Option value="vomit">Vomit</Option>
                <Option value="drain">Drain</Option>
                <Option value="other_output">Other</Option>
              </>
            )}
          </Select>
        </Form.Item>

        {defaultType === 'intake' ? (
          <Form.Item
            name="fluid_type"
            label="Fluid Type"
          >
            <Select placeholder="Select fluid type">
              <Option value="water">Water</Option>
              <Option value="juice">Juice</Option>
              <Option value="soup">Soup</Option>
              <Option value="normal_saline">Normal Saline</Option>
              <Option value="dextrose">Dextrose</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        ) : (
          <Form.Item
            name="color"
            label="Color"
          >
            <Select placeholder="Select color">
              <Option value="clear">Clear</Option>
              <Option value="pale_yellow">Pale Yellow</Option>
              <Option value="yellow">Yellow</Option>
              <Option value="dark_yellow">Dark Yellow</Option>
              <Option value="amber">Amber</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="description"
          label="Description"
        >
          <Input placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Additional Notes"
        >
          <TextArea rows={3} placeholder="Enter any additional notes or observations" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFluidEntryModal;