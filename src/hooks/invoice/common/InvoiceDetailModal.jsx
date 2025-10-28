import React from 'react';
import { Modal, Descriptions, Tag, Button, Typography } from 'antd';
import { PrinterOutlined, FileTextOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';

const { Text } = Typography;

const InvoiceDetailModal = ({ visible, invoice, onCancel }) => {
  const invoiceRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    pageStyle: `
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
        .print-only { display: block !important; }
      }
    `,
  });

  return (
    <>
      <Modal
        title={
          <span>
            <FileTextOutlined style={{ marginRight: 8 }} />
            Invoice Details
          </span>
        }
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
            Print Invoice
          </Button>,
          <Button key="close" onClick={onCancel}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {invoice && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Invoice Number" span={2}>
              <Text strong>{invoice.invoice_number}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Invoice Date">
              {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              <Text strong>₵{parseFloat(invoice.total_amount || 0).toFixed(2)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Amount Paid">
              <Text type="success">₵{parseFloat(invoice.amount_paid || 0).toFixed(2)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Balance Due">
              <Text type="danger">₵{parseFloat(invoice.balance_due || 0).toFixed(2)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={2}>
              <Tag color={invoice.status === 'paid' ? 'green' : invoice.status === 'partial' ? 'orange' : 'red'}>
                {invoice.status ? invoice.status.toUpperCase() : 'UNKNOWN'}
              </Tag>
            </Descriptions.Item>
            {invoice.notes && (
              <Descriptions.Item label="Notes" span={2}>
                <Text type="secondary">{invoice.notes}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Hidden print template */}
      <div style={{ display: 'none' }}>
        <div ref={invoiceRef} style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#1890ff', margin: 0 }}>INVOICE DETAILS</h2>
            <p style={{ color: '#666' }}>Invoice Summary</p>
          </div>

          {invoice && (
            <div>
              <p><strong>Invoice Number:</strong> {invoice.invoice_number}</p>
              <p><strong>Date:</strong> {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Due Date:</strong> {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Total Amount:</strong> ₵{parseFloat(invoice.total_amount || 0).toFixed(2)}</p>
              <p><strong>Amount Paid:</strong> ₵{parseFloat(invoice.amount_paid || 0).toFixed(2)}</p>
              <p><strong>Balance Due:</strong> ₵{parseFloat(invoice.balance_due || 0).toFixed(2)}</p>
              <p><strong>Status:</strong> {invoice.status ? invoice.status.toUpperCase() : 'UNKNOWN'}</p>
              {invoice.notes && <p><strong>Notes:</strong> {invoice.notes}</p>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoiceDetailModal;