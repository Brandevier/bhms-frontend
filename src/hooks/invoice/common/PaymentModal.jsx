import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Typography, Space, message, Tag } from 'antd';
import { useOutstandingPayments } from '../../../redux/hooks/useAccountHooks';

const { Option } = Select;
const { Text } = Typography;

const PaymentModal = ({ visible, bill, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { payBill } = useOutstandingPayments();

  const handleSubmit = async (values) => {
    if (!bill?.id) return;

    setLoading(true);
    try {
      const paymentData = {
        payment_method: values.payment_method,
        paid_amount: parseFloat(values.amount),
       
      };

      await payBill(bill.id, paymentData).unwrap();
      
      message.success('Payment processed successfully!');
      onSuccess();
      form.resetFields();
      
    } catch (error) {
      message.error('Failed to process payment: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleFullPayment = () => {
    form.setFieldsValue({
      amount: bill?.patient_amount?.toString()
    });
  };

  return (
    <Modal
      title={`Process Payment - ${bill?.service_type}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          payment_method: 'cash',
          amount: ''
        }}
      >
        <Form.Item label="Bill Details">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>Service: {bill?.service_type}</Text>
            <Tag color='purple'>Amount Due: ₵{parseFloat(bill?.patient_amount || 0).toFixed(2)}</Tag>
          </Space>
        </Form.Item>

        <Form.Item
          name="payment_method"
          label="Payment Method"
          rules={[{ required: true, message: 'Please select payment method' }]}
        >
          <Select placeholder="Select payment method">
            <Option value="cash">Cash</Option>
            <Option value="mobile_money">Mobile Money</Option>
            <Option value="bank_transfer">Bank Transfer</Option>
            <Option value="credit_card">Credit Card</Option>
            <Option value="insurance">Insurance</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount Paid"
          rules={[
            { required: true, message: 'Please enter amount' },
            { 
              validator: (_, value) => {
                const amount = parseFloat(value);
                const billAmount = parseFloat(bill?.total_amount || 0);
                if (amount > billAmount) {
                  return Promise.reject('Amount cannot exceed bill total');
                }
                if (amount <= 0) {
                  return Promise.reject('Amount must be greater than 0');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input 
            type="number" 
            placeholder="Enter amount" 
            step="0.01" 
            min="0" 
            max={bill?.total_amount}
            addonBefore="₵"
          />
        </Form.Item>

        <Button type="link" onClick={handleFullPayment} style={{ marginBottom: 16 }}>
          Pay Full Amount (₵{parseFloat(bill?.patient_amount || 0).toFixed(2)})
        </Button>

        <Form.Item
          name="transaction_id"
          label="Transaction ID (Optional)"
        >
          <Input placeholder="Enter transaction reference" />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes (Optional)"
        >
          <Input.TextArea placeholder="Additional payment notes" rows={3} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Process Payment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentModal;