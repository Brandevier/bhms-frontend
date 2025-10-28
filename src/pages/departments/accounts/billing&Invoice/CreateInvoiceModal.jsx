import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, DatePicker, InputNumber, Space, Divider, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useInvoices } from '../../../../redux/hooks/useInvoices';


const { Option } = Select;
const { TextArea } = Input;

const CreateInvoiceModal = ({ visible, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [services, setServices] = useState([{ description: '', quantity: 1, price: 0 }]);
  const { addInvoice, loading } = useInvoices();

  const addService = () => {
    setServices([...services, { description: '', quantity: 1, price: 0 }]);
  };

  const removeService = (index) => {
    if (services.length > 1) {
      const newServices = [...services];
      newServices.splice(index, 1);
      setServices(newServices);
    }
  };

  const calculateTotal = () => {
    return services.reduce((total, service) => {
      return total + (service.quantity * service.price);
    }, 0);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const invoiceData = {
        ...values,
        services,
        subtotal: calculateTotal(),
        total_amount: calculateTotal() - (values.discount_amount || 0) + (values.tax_amount || 0),
        invoice_date: values.invoice_date.format('YYYY-MM-DD'),
        due_date: values.due_date.format('YYYY-MM-DD')
      };

      await addInvoice(invoiceData);
      message.success('Invoice created successfully');
      
      form.resetFields();
      setServices([{ description: '', quantity: 1, price: 0 }]);
      onOk(invoiceData);
    } catch (error) {
      message.error('Failed to create invoice: ' + error.message);
    }
  };

  return (
    <Modal
      title="Create New Invoice"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleOk}
          loading={loading}
        >
          Create Invoice
        </Button>,
      ]}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ tax_amount: 0, discount_amount: 0 }}
      >
        {/* Form fields remain the same as before */}
      </Form>
    </Modal>
  );
};

export default CreateInvoiceModal;