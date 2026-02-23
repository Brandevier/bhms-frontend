import React, { useState, useEffect } from 'react';
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
  Button,
  message,
  Tag,
  List,
  Typography
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DollarOutlined, CreditCardOutlined } from '@ant-design/icons';
import { 
  createPayment, 
  fetchInvoicePayments,
  resetPaymentSuccess 
} from '../../../../redux/slice/paymentSlice';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const PaymentModal = ({ visible, invoice, loading, onCancel, onPay }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [paymentAmount, setPaymentAmount] = useState(invoice?.balance_due || 0);
  
  // Get from new payment slice
  const { paymentSuccess, invoicePayments, loading: paymentLoading } = useSelector((state) => state.payments);

  // Reset payment amount when invoice changes
  useEffect(() => {
    if (invoice?.balance_due) {
      setPaymentAmount(invoice.balance_due);
    }
  }, [invoice?.balance_due]);

  // Fetch existing payments when modal opens
  useEffect(() => {
    if (visible && invoice?.id) {
      dispatch(fetchInvoicePayments(invoice.id));
    }
  }, [visible, invoice?.id, dispatch]);

  // Handle successful payment
  useEffect(() => {
    if (paymentSuccess) {
      message.success('Payment processed successfully!');
      form.resetFields();
      setPaymentAmount(invoice?.balance_due || 0);
      dispatch(resetPaymentSuccess());
      if (onPay) {
        onPay({ success: true });
      }
    }
  }, [paymentSuccess, dispatch, form, invoice, onPay]);

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { value: 'mobile_money', label: 'Mobile Money', icon: '📱' },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
    { value: 'insurance', label: 'NHIS/Insurance', icon: '🛡️' },
  ];

  const handlePayment = async (values) => {
    if (!invoice?.id) {
      message.error('No invoice selected');
      return;
    }

    try {
      const paymentData = {
        invoice_id: invoice.id,
        patient_id: invoice.patient_id,
        visit_id: invoice.visit_id,
        amount: paymentAmount,
        payment_method: values.payment_method,
        payment_type: values.payment_method === 'insurance' ? 'insurance' : 'patient',
        transaction_reference: values.reference,
        notes: values.notes,
        paid_at: (values.payment_date || new Date()).toISOString(),
      };

      await dispatch(createPayment(paymentData)).unwrap();
      
    } catch (error) {
      message.error('Failed to process payment: ' + (error.message || 'Unknown error'));
    }
  };

  const handleAmountChange = (value) => {
    setPaymentAmount(value || 0);
  };

  // Calculate totals
  const totalPaid = invoicePayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
  const invoiceTotal = invoice?.total_amount || 0;
  const remainingBalance = invoiceTotal - totalPaid;

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
      width={650}
      centered
      destroyOnClose
    >
      <Space direction="vertical" className="w-full" size="large">
        {/* Payment Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <Space direction="vertical" className="w-full">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Invoice Total:</span>
              <span className="font-semibold">${invoiceTotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Already Paid:</span>
              <span className="text-green-600">${totalPaid?.toFixed(2)}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">Balance Due:</span>
              <span className="text-red-600 font-bold text-lg">
                ${remainingBalance?.toFixed(2)}
              </span>
            </div>
          </Space>
        </div>

        {/* Previous Payments */}
        {invoicePayments && invoicePayments.length > 0 && (
          <div className="mb-4">
            <Text strong>Recent Payments:</Text>
            <List
              size="small"
              dataSource={invoicePayments.slice(0, 3)}
              renderItem={(payment) => (
                <List.Item>
                  <Space>
                    <Tag color={payment.status === 'completed' ? 'green' : 'orange'}>
                      {payment.status}
                    </Tag>
                    <Text>${parseFloat(payment.amount || 0).toFixed(2)}</Text>
                    <Text type="secondary">{payment.payment_method}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handlePayment}
          initialValues={{
            payment_method: 'cash',
            payment_date: new Date(),
          }}
        >
          <Form.Item
            name="amount"
            label="Payment Amount"
            rules={[{ required: true, message: 'Please enter payment amount' }]}
          >
            <InputNumber
              min={0.01}
              max={remainingBalance}
              precision={2}
              placeholder="Enter payment amount"
              prefix={<DollarOutlined />}
              style={{ width: '100%' }}
              onChange={handleAmountChange}
            />
          </Form.Item>

          {/* Quick Amount Buttons */}
          <Space style={{ marginBottom: 16 }} wrap>
            <Button onClick={() => setPaymentAmount(remainingBalance)}>
              Pay Full Balance
            </Button>
            {remainingBalance > 0 && (
              <Button onClick={() => setPaymentAmount(remainingBalance / 2)}>
                Pay 50%
              </Button>
            )}
          </Space>

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
            name="payment_date"
            label="Payment Date"
            rules={[{ required: true, message: 'Please select payment date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="reference" label="Transaction Reference (Optional)">
            <Input placeholder="Enter transaction/receipt number" />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <TextArea rows={2} placeholder="Additional notes about this payment..." />
          </Form.Item>

          {/* Payment Summary */}
          {paymentAmount < remainingBalance && (
            <Alert
              message="Partial Payment"
              description={`This will leave a balance of $${(remainingBalance - paymentAmount).toFixed(2)}`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} disabled={loading || paymentLoading}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading || paymentLoading}
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
