// InvestigationModal.js
import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { useDispatch } from 'react-redux';
import { 
  createLabInvestigation, 
  updateLabInvestigation 
} from '../../../../../redux/slice/labInvestigationSlice';
import { message } from 'antd';

const InvestigationModal = ({ visible, editingId, onCancel, initialData }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (visible && initialData) {
      form.setFieldsValue(initialData);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialData, form]);

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (editingId) {
          dispatch(updateLabInvestigation({ id: editingId, updateData: values }))
            .then(() => {
              message.success('Lab investigation updated successfully');
              onCancel();
            });
        } else {
          dispatch(createLabInvestigation(values))
            .then(() => {
              message.success('Lab investigation created successfully');
              onCancel();
            });
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={editingId ? 'Edit Lab Investigation' : 'Add New Lab Investigation'}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        name="lab_investigation_form"
      >
        <Form.Item
          name="test_description"
          label="Test Description"
          rules={[{ required: true, message: 'Please input the test description!' }]}
        >
          <Input placeholder="e.g. 2 Hour Post Prandial Blood Glucose" />
        </Form.Item>

        <Form.Item
          name="g_drg_code"
          label="G-DRG Code"
          rules={[{ required: true, message: 'Please input the G-DRG code!' }]}
        >
          <Input placeholder="e.g. INVEO1D" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="tariff_ghc"
            label="NHIS Tariff (GHS)"
            rules={[{ required: true, message: 'Please input the tariff amount!' }]}
          >
            <InputNumber 
              min={0} 
              step={0.01} 
              className="w-full"
              formatter={value => `GHS ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/GHS\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="market_price"
            label="Market Price (GHS)"
          >
            <InputNumber 
              min={0} 
              step={0.01} 
              className="w-full"
              formatter={value => `GHS ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/GHS\s?|(,*)/g, '')}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default InvestigationModal;