import React from 'react';
import { Card, Space, Button, Dropdown, Menu, Badge, Tooltip } from 'antd';
import { 
  DollarOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  DownloadOutlined,
  MoreOutlined,
  EyeOutlined,
  CopyOutlined,
  HistoryOutlined,
  MailOutlined
} from '@ant-design/icons';

const ActionButtons = ({ invoice, onPaymentClick, onReceiptClick }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Implement PDF download logic
    console.log('Download PDF for invoice:', invoice.id);
  };

  // Improved condition checks
  const hasBalanceDue = invoice.balance_due > 0;
  const hasPayments = invoice.amount_paid > 0;
  const isFullyPaid = invoice.balance_due === 0 && invoice.amount_paid > 0;
  const isPartiallyPaid = invoice.amount_paid > 0 && invoice.balance_due > 0;

  const moreMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Send Email',
          icon: <MailOutlined />,
        },
        {
          key: '2',
          label: 'Duplicate Invoice',
          icon: <CopyOutlined />,
        },
        {
          key: '3',
          label: 'Payment History',
          icon: <HistoryOutlined />,
        },
        {
          key: '4',
          label: 'View Audit Trail',
          icon: <EyeOutlined />,
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
          <Tooltip title="Print invoice">
            <Button
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              block
            >
              Print
            </Button>
          </Tooltip>
          <Tooltip title="Download as PDF">
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadPDF}
              block
            >
              PDF
            </Button>
          </Tooltip>
        </Space.Compact>

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

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-2 bg-yellow-50 rounded text-xs text-gray-600">
            <div>Debug Info:</div>
            <div>balance_due: {invoice.balance_due}</div>
            <div>amount_paid: {invoice.amount_paid}</div>
            <div>hasBalanceDue: {hasBalanceDue.toString()}</div>
            <div>hasPayments: {hasPayments.toString()}</div>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default ActionButtons;