import React, { useState } from 'react';
import { Card, Space, Button, Dropdown, Menu, Badge, Tooltip, message, Modal } from 'antd';
import { 
  DollarOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  DownloadOutlined,
  MoreOutlined,
  EyeOutlined,
  CopyOutlined,
  HistoryOutlined,
  MailOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// Import PDF generation functions
import { generateInvoicePDF, generateReceiptPDF, printPDF } from '../utils/pdfGenerator';

const ActionButtons = ({ invoice, onPaymentClick, onReceiptClick }) => {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);

  // Improved condition checks
  const hasBalanceDue = invoice.balance_due > 0;
  const hasPayments = invoice.amount_paid > 0;
  const isFullyPaid = invoice.balance_due === 0 && invoice.amount_paid > 0;
  const isPartiallyPaid = invoice.amount_paid > 0 && invoice.balance_due > 0;

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const success = await generateInvoicePDF(invoice);
      if (success) {
        message.success('PDF downloaded successfully!');
      } else {
        message.error('Failed to download PDF. Please try again.');
      }
    } catch (error) {
      message.error('Error generating PDF. Please try again.');
      console.error('PDF download error:', error);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    setPdfLoading(true);
    try {
      const success = await generateReceiptPDF(invoice);
      if (success) {
        message.success('Receipt downloaded successfully!');
      } else {
        message.error('Failed to download receipt. Please try again.');
      }
    } catch (error) {
      message.error('Error generating receipt. Please try again.');
      console.error('Receipt download error:', error);
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrint = async (type = 'invoice') => {
    setPrintLoading(true);
    try {
      const success = await printPDF(invoice, type);
      if (!success) {
        message.error('Failed to open print dialog. Please try again.');
      }
    } catch (error) {
      message.error('Error preparing document for printing.');
      console.error('Print error:', error);
    } finally {
      setPrintLoading(false);
    }
  };

  const handlePrintInvoice = () => handlePrint('invoice');
  const handlePrintReceipt = () => handlePrint('receipt');

  const moreMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Send Email',
          icon: <MailOutlined />,
          onClick: () => message.info('Email feature coming soon!'),
        },
        {
          key: '2',
          label: 'Duplicate Invoice',
          icon: <CopyOutlined />,
          onClick: () => message.info('Duplicate invoice feature coming soon!'),
        },
        {
          key: '3',
          label: 'Payment History',
          icon: <HistoryOutlined />,
          onClick: () => message.info('Payment history feature coming soon!'),
        },
        {
          key: '4',
          label: 'View Audit Trail',
          icon: <EyeOutlined />,
          onClick: () => message.info('Audit trail feature coming soon!'),
        },
      ]}
    />
  );

  return (
    <Card 
      title={
        <Space>
          Quick Actions
          {hasBalanceDue && (
            <Badge count="Payment Due" style={{ backgroundColor: '#ff4d4f' }} />
          )}
          {isFullyPaid && (
            <Badge count="Paid" style={{ backgroundColor: '#52c41a' }} />
          )}
        </Space>
      } 
      className="mt-4 shadow-sm"
    >
      <Space direction="vertical" className="w-full">
        {/* Payment Button - Show if there's any balance due */}
        {hasBalanceDue && (
          <Tooltip title={`Balance due: $${invoice.balance_due?.toFixed(2)}`}>
            <Button
              type="primary"
              icon={<DollarOutlined />}
              size="large"
              onClick={onPaymentClick}
              block
              style={{ 
                backgroundColor: '#52c41a', 
                borderColor: '#52c41a',
                fontWeight: 'bold'
              }}
            >
              Process Payment
              {isPartiallyPaid && ` ($${invoice.balance_due?.toFixed(2)})`}
            </Button>
          </Tooltip>
        )}

        {/* Receipt Button - Show if there are any payments (even partial) */}
        {hasPayments && (
          <Button
            type="default"
            icon={<FilePdfOutlined />}
            size="large"
            onClick={onReceiptClick}
            block
            style={{
              borderColor: '#1890ff',
              color: '#1890ff'
            }}
          >
            {isFullyPaid ? 'View Receipt' : 'View Payment Summary'}
          </Button>
        )}

        {/* Print & Download - Always available */}
        <Space.Compact block>
          <Tooltip title="Print invoice document">
            <Button
              icon={printLoading ? <LoadingOutlined /> : <PrinterOutlined />}
              onClick={handlePrintInvoice}
              block
              loading={printLoading}
              disabled={printLoading}
            >
              Print
            </Button>
          </Tooltip>
          <Tooltip title="Download as PDF">
            <Button
              icon={pdfLoading ? <LoadingOutlined /> : <DownloadOutlined />}
              onClick={handleDownloadPDF}
              block
              loading={pdfLoading}
              disabled={pdfLoading}
            >
              PDF
            </Button>
          </Tooltip>
        </Space.Compact>

        {/* Additional Actions for Paid Invoices */}
        {hasPayments && (
          <Space.Compact block>
            <Tooltip title="Print receipt">
              <Button
                icon={printLoading ? <LoadingOutlined /> : <PrinterOutlined />}
                onClick={handlePrintReceipt}
                block
                loading={printLoading}
                disabled={printLoading}
              >
                Print Receipt
              </Button>
            </Tooltip>
            <Tooltip title="Download receipt PDF">
              <Button
                icon={pdfLoading ? <LoadingOutlined /> : <FilePdfOutlined />}
                onClick={handleDownloadReceipt}
                block
                loading={pdfLoading}
                disabled={pdfLoading}
              >
                Receipt PDF
              </Button>
            </Tooltip>
          </Space.Compact>
        )}

        {/* More Actions */}
        <Dropdown overlay={moreMenu} placement="topCenter" trigger={['click']}>
          <Button icon={<MoreOutlined />} block>
            More Actions
          </Button>
        </Dropdown>

        {/* Status Info */}
        <div className="p-3 bg-gray-50 rounded-lg border">
          <Space direction="vertical" size="small" className="w-full text-center">
            <div className="text-sm font-medium text-gray-700">
              Invoice #{invoice.invoice_number}
            </div>
            <div className="text-xs text-gray-500">
              Status: <span className="font-medium">{invoice.status?.toUpperCase()}</span>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date(invoice.updatedAt).toLocaleDateString()}
            </div>
            
            {/* Payment Summary */}
            <div className="flex justify-between text-xs mt-2">
              <span>Total:</span>
              <span className="font-medium">${invoice.total_amount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Paid:</span>
              <span className="text-green-600">${invoice.amount_paid?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Balance:</span>
              <span className={hasBalanceDue ? 'text-red-600 font-bold' : 'text-green-600'}>
                ${invoice.balance_due?.toFixed(2)}
              </span>
            </div>
          </Space>
        </div>

        {/* PDF Generation Info */}
        <div className="p-2 bg-blue-50 rounded text-xs text-gray-600 text-center">
          <div>📄 Professional PDF documents with institutional branding</div>
          <div className="text-xxs mt-1">Includes all invoice details and payment information</div>
        </div>
      </Space>
    </Card>
  );
};

export default ActionButtons;