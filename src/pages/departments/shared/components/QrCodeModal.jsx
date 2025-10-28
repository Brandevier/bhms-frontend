import React from 'react';
import { Modal, QRCode, Divider, Button } from 'antd';
import { QrcodeOutlined, PrinterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const QrCodeModal = ({ visible, onClose, staff, onPrint }) => {
  if (!staff) return null;

  const generateQrData = () => {
    return JSON.stringify({
      staffId: staff.id,
      name: staff.name,
      employeeId: staff.employeeId,
      position: staff.position,
      timestamp: dayjs().valueOf(),
      type: 'staff_schedule'
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center text-lg">
          <QrcodeOutlined className="text-blue-500 mr-2" />
          <span>Staff QR Code - {staff.name}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="print"
          icon={<PrinterOutlined />}
          onClick={onPrint}
          type="primary"
        >
          Print QR Code
        </Button>,
      ]}
      width={380}
      centered
    >
      <div className="text-center space-y-4">
        <div className="bg-gray-50 p-6 rounded-lg">
          <QRCode
            value={generateQrData()}
            size={200}
            iconSize={40}
            errorLevel="H"
            className="mx-auto"
          />
        </div>
        
        <Divider className="my-4" />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">{staff.name}</h3>
          <p className="text-gray-600">ID: {staff.employeeId}</p>
          <p className="text-gray-600">{staff.position}</p>
          <p className="text-gray-500 text-sm">
            Generated: {dayjs().format('MMM D, YYYY h:mm A')}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default QrCodeModal;