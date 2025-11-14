import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchInvoiceById } from '../../../../redux/slice/invoiceSlice';
import { useOutstandingPayments } from '../../../../redux/hooks/useAccountHooks';

import {
  Card,
  Row,
  Col,
  Spin,
  Alert,
  Divider,
  Space,
  notification
} from 'antd';
import { FileTextOutlined, DollarOutlined } from '@ant-design/icons';

// Import Components
import BillHeader from './components/BillHeader';
import PatientInfoCard from './components/PatientInfoCard';
import ServicesTable from './components/ServicesTable';
import PaymentSummary from './components/PaymentSummary';
import ActionButtons from './components/ActionButtons';
import PaymentModal from './components/PaymentModal';
import ReceiptModal from './components/ReceiptModal';

const PatientBillDetails = () => {
  const dispatch = useDispatch();
  const { visit_id } = useParams();
  const { currentInvoice, loading, error } = useSelector((state) => state.invoices);
  const { payBill } = useOutstandingPayments();

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (visit_id) {
      dispatch(fetchInvoiceById(visit_id));
    }
  }, [dispatch, visit_id]);

  const handlePayment = async (paymentData) => {
    console.log(paymentData);

    if (!currentInvoice?.id) return;

    const data = {
      bill_id: currentInvoice.id,
      payment_method: paymentData.method,
      paid_amount: parseFloat(paymentData.amount)
    };

    setPaymentLoading(true);
    try {
      payBill(currentInvoice.id, {
        payment_method: paymentData.method,
        paid_amount: parseFloat(paymentData.amount)
      }).unwrap();

      // notification.success({
      //   message: 'Payment Successful',
      //   description: 'The payment has been processed successfully.'
      // });

      dispatch(fetchInvoiceById(visit_id));
      setPaymentModalVisible(false);

    } catch (error) {
      notification.error({
        message: 'Payment Failed',
        description: 'Failed to process payment: ' + (error.message || 'Unknown error')
      });
    } finally {
      setPaymentLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading Bill Details..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Bill"
        description={error}
        type="error"
        showIcon
        className="m-4"
      />
    );
  }

  if (!currentInvoice) {
    return (
      <Alert
        message="No Bill Found"
        description="The requested bill could not be found."
        type="warning"
        showIcon
        className="m-4"
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <BillHeader invoice={currentInvoice} />

      <Divider />

      <Row gutter={[16, 16]}>
        {/* Left Column - Patient Info & Services */}
        <Col xs={24} lg={16}>
          <PatientInfoCard invoice={currentInvoice} />

          <Card
            title={
              <Space>
                <FileTextOutlined />
                Services & Charges
              </Space>
            }
            className="mt-4 shadow-sm"
          >
            <ServicesTable services={currentInvoice.service_bills} />
          </Card>
        </Col>

        {/* Right Column - Payment Summary & Actions */}
        <Col xs={24} lg={8}>
          <PaymentSummary invoice={currentInvoice} />

          <ActionButtons
            invoice={currentInvoice}
            onPaymentClick={() => setPaymentModalVisible(true)}
            onReceiptClick={() => setReceiptModalVisible(true)}
          />
        </Col>
      </Row>

      {/* Payment Modal */}
      <PaymentModal
        visible={paymentModalVisible}
        invoice={currentInvoice}
        loading={paymentLoading}
        onCancel={() => setPaymentModalVisible(false)}
        onPay={handlePayment}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        visible={receiptModalVisible}
        invoice={currentInvoice}
        onClose={() => setReceiptModalVisible(false)}
      />
    </div>
  );
};

export default PatientBillDetails;