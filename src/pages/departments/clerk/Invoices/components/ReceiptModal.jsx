import React from 'react';
import { Modal, Button, Space, Divider, Descriptions, Tag } from 'antd';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const ReceiptModal = ({ visible, invoice, onClose }) => {
  const handlePrint = () => {
    const receiptContent = document.getElementById('receipt-content');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = receiptContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleDownload = () => {
    // Implement PDF download using jspdf or similar
    console.log('Download receipt as PDF');
  };

  return (
    <Modal
      title="Payment Receipt"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
          Print
        </Button>,
        <Button key="download" icon={<DownloadOutlined />} onClick={handleDownload}>
          Download PDF
        </Button>,
        <Button key="close" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={700}
      centered
    >
      <div id="receipt-content" className="p-4 bg-white">
        {/* Receipt Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-600">PAYMENT RECEIPT</h1>
          <p className="text-gray-600">{invoice.institution?.name}</p>
          <p className="text-sm text-gray-500">{invoice.institution?.address}</p>
        </div>

        <Divider />

        {/* Receipt Details */}
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Receipt Number">
            RCP-{dayjs().format('YYYYMMDDHHmmss')}
          </Descriptions.Item>
          <Descriptions.Item label="Invoice Number">
            {invoice.invoice_number}
          </Descriptions.Item>
          <Descriptions.Item label="Patient Name">
            {invoice.visit?.patient?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Patient ID">
            {invoice.visit?.patient?.folderNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Date">
            {dayjs().format('MMM DD, YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Amount Paid">
            <span className="text-green-600 font-bold text-lg">
              ${invoice.amount_paid?.toFixed(2)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Remaining Balance">
            <span className={invoice.balance_due > 0 ? 'text-red-600' : 'text-green-600'}>
              ${invoice.balance_due?.toFixed(2)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={invoice.balance_due === 0 ? 'green' : 'orange'}>
              {invoice.balance_due === 0 ? 'FULLY PAID' : 'PARTIALLY PAID'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {/* Thank You Message */}
        <div className="text-center mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-green-600 font-semibold">Thank You for Your Payment!</h3>
          <p className="text-gray-600 text-sm">
            This receipt confirms your payment. Please keep it for your records.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Generated on {dayjs().format('MMM DD, YYYY HH:mm')}</p>
          <p>For questions, contact: {invoice.institution?.contact}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;