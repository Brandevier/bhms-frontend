import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  DatePicker, 
  Space, 
  Alert,
  Divider,
  Statistic,
  Button
} from 'antd';
import { DollarOutlined, CreditCardOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const PaymentModal = ({ visible, invoice, loading, onCancel, onPay }) => {
  const [form] = Form.useForm();
  const [paymentAmount, setPaymentAmount] = useState(invoice.balance_due);

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { value: 'mobile_money', label: 'Mobile Money', icon: '📱' },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
    { value: 'insurance', label: 'Insurance', icon: '🛡️' },
  ];

  const handlePayment = (values) => {
    onPay({
      amount: paymentAmount,
      method: values.payment_method,
      reference: values.reference,
      notes: values.notes,
      payment_date: values.payment_date.format('YYYY-MM-DD'),
    });
  };

  const handleAmountChange = (value) => {
    setPaymentAmount(value);
  };

  return (
    <Modal
      title={
        <Space>
          <DollarOutlined className="text-green-500" />
          Process Payment
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
    >
      <Space direction="vertical" className="w-full" size="large">
        {/* Payment Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <Space direction="vertical" className="w-full">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Invoice Total:</span>
              <span className="font-semibold">${invoice.total_amount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Already Paid:</span>
              <span className="text-green-600">${invoice.amount_paid?.toFixed(2)}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">Balance Due:</span>
              <span className="text-red-600 font-bold text-lg">
                ${invoice.balance_due?.toFixed(2)}
              </span>
            </div>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handlePayment}
          initialValues={{
            payment_method: 'cash',
            amount: invoice.balance_due,
            // payment_date: new Date(),
          }}
        >
          <Form.Item
            name="amount"
            label="Payment Amount"
            rules={[{ required: true, message: 'Please enter payment amount' }]}
          >
            <InputNumber
              min={0.01}
              max={invoice.balance_due}
              precision={2}
              placeholder="Enter payment amount"
              prefix={<DollarOutlined />}
              style={{ width: '100%' }}
              onChange={handleAmountChange}
            />
          </Form.Item>

          <Form.Item
            name="payment_method"
            label="Payment Method"
            rules={[{ required: true, message: 'Please select payment method' }]}
          >
            <Select placeholder="Select payment method">
              {paymentMethods.map(method => (
                <Option key={method.value} value={method.value}>
                  <Space>
                    <span>{method.icon}</span>
                    <span>{method.label}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="reference"
            label="Payment Reference"
            rules={[{ required: true, message: 'Please enter payment reference' }]}
          >
            <Input placeholder="Enter reference number" />
          </Form.Item>

          <Form.Item
            name="payment_date"
            label="Payment Date"
            rules={[{ required: true, message: 'Please select payment date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} placeholder="Additional notes about this payment..." />
          </Form.Item>

          {/* Payment Summary */}
          <div className="p-3 bg-blue-50 rounded-lg mb-4">
            <Space direction="vertical" className="w-full">
              <div className="flex justify-between">
                <span>Amount to Pay:</span>
                <span className="font-bold text-green-600">
                  ${paymentAmount?.toFixed(2)}
                </span>
              </div>
              {paymentAmount < invoice.balance_due && (
                <Alert
                  message="Partial Payment"
                  description={`This will leave a balance of $${(invoice.balance_due - paymentAmount).toFixed(2)}`}
                  type="info"
                  showIcon
                  size="small"
                />
              )}
            </Space>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<CreditCardOutlined />}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Process Payment
            </Button>
          </div>
        </Form>
      </Space>
    </Modal>
  );
};

export default PaymentModal;