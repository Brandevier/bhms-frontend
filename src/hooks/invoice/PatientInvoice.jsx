import React, { useEffect, useState, useRef } from 'react';
import { Divider, Alert, Spin, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { usePatientBills } from '../../redux/hooks/useAccountHooks';
import { useReactToPrint } from 'react-to-print';
import InvoiceHeader from './common/InvoiceHeader';
import InvoiceTable from './common/InvoiceTable';
import PrintTemplate from './common/PrintTemplate';
import InvoiceDetailModal from './common/InvoiceDetailModal';
import PaymentModal from './common/PaymentModal';
import TonitelButton from '../../components/common/TonitelButton';

const PatientInvoice = ({ visitId }) => {
  const { data, loading, refetch } = usePatientBills(visitId);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Patient-Invoice-${visitId}`,
    pageStyle: `
      @media print {
        @page { margin: 20mm; }
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `,
  });

  useEffect(() => {
    if (visitId) {
      refetch();
    }
  }, [visitId]);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '300px auto' }} />;
  }

  if (!data || !data.details || data.details.length === 0) {
    return (
      <Alert
        message="No Data"
        description="No invoice data available for this patient visit"
        type="warning"
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  const { totals, details } = data;
  const invoice = details[0]?.invoice;

  return (
    <div style={{ padding: '24px' }}>
      {/* Print Button */}
      <div style={{ marginBottom: 24, textAlign: 'right' }} className="no-print">
        <TonitelButton
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          size="lg"
        >
          Print Invoice
        </TonitelButton>
      </div>

      <InvoiceHeader 
        totals={totals} 
        invoice={invoice}
        visitId={visitId}
      />
      
      <Divider />

      <InvoiceTable
        details={details}
        onMarkAsPaid={(bill) => {
          setSelectedBill(bill);
          setPaymentModalVisible(true);
        }}
        onViewInvoice={(invoice) => {
          setSelectedInvoice(invoice);
          setInvoiceModalVisible(true);
        }}
      />

      {/* Hidden print template */}
      <div style={{ display: 'none' }}>
        <PrintTemplate 
          ref={printRef}
          details={details} 
          totals={totals} 
          visitId={visitId} 
          invoice={invoice}
        />
      </div>

      <PaymentModal
        visible={paymentModalVisible}
        bill={selectedBill}
        onCancel={() => {
          setPaymentModalVisible(false);
          setSelectedBill(null);
        }}
        onSuccess={() => {
          setPaymentModalVisible(false);
          setSelectedBill(null);
          refetch();
        }}
      />

      <InvoiceDetailModal
        visible={invoiceModalVisible}
        invoice={selectedInvoice}
        onCancel={() => {
          setInvoiceModalVisible(false);
          setSelectedInvoice(null);
        }}
      />
    </div>
  );
};

export default PatientInvoice;