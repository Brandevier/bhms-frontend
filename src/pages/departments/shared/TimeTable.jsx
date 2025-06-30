import React, { useState } from 'react';
import { Table, Button, Card, Space, Tag, Modal, QRCode, Divider } from 'antd';
import {
  PrinterOutlined,
  QrcodeOutlined,
  ReloadOutlined,
  TeamOutlined,
  ScheduleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const TimeTable = () => {
  // State for QR code modal
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [printMode, setPrintMode] = useState(false);

  // Dummy data for staff timetable
  const staffData = [
    {
      id: 1,
      name: 'John Doe',
      employeeId: 'EMP001',
      position: 'Senior Nurse',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
      schedule: {
        Monday: 'Morning',
        Tuesday: 'Off',
        Wednesday: 'Night',
        Thursday: 'Afternoon',
        Friday: 'Morning',
        Saturday: 'Off',
        Sunday: 'Night'
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      employeeId: 'EMP002',
      position: 'Junior Nurse',
      photo: 'https://randomuser.me/api/portraits/women/2.jpg',
      schedule: {
        Monday: 'Afternoon',
        Tuesday: 'Morning',
        Wednesday: 'Off',
        Thursday: 'Night',
        Friday: 'Afternoon',
        Saturday: 'Morning',
        Sunday: 'Off'
      }
    },
    {
      id: 3,
      name: 'Robert Johnson',
      employeeId: 'EMP003',
      position: 'Head Nurse',
      photo: 'https://randomuser.me/api/portraits/men/3.jpg',
      schedule: {
        Monday: 'Night',
        Tuesday: 'Afternoon',
        Wednesday: 'Morning',
        Thursday: 'Off',
        Friday: 'Night',
        Saturday: 'Afternoon',
        Sunday: 'Morning'
      }
    },
    {
      id: 4,
      name: 'Emily Davis',
      employeeId: 'EMP004',
      position: 'Nurse Practitioner',
      photo: 'https://randomuser.me/api/portraits/women/4.jpg',
      schedule: {
        Monday: 'Off',
        Tuesday: 'Night',
        Wednesday: 'Afternoon',
        Thursday: 'Morning',
        Friday: 'Off',
        Saturday: 'Night',
        Sunday: 'Afternoon'
      }
    },
  ];

  // Columns configuration for the table
  const columns = [
    {
      title: 'Staff',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 180,
      render: (text, record) => (
        <div className="staff-info">
          <img 
            src={record.photo} 
            alt={text} 
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%',
              marginRight: 10,
              objectFit: 'cover'
            }} 
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.position}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Monday',
      dataIndex: 'schedule',
      key: 'Monday',
      render: (schedule) => renderShiftTag(schedule.Monday),
    },
    {
      title: 'Tuesday',
      dataIndex: 'schedule',
      key: 'Tuesday',
      render: (schedule) => renderShiftTag(schedule.Tuesday),
    },
    {
      title: 'Wednesday',
      dataIndex: 'schedule',
      key: 'Wednesday',
      render: (schedule) => renderShiftTag(schedule.Wednesday),
    },
    {
      title: 'Thursday',
      dataIndex: 'schedule',
      key: 'Thursday',
      render: (schedule) => renderShiftTag(schedule.Thursday),
    },
    {
      title: 'Friday',
      dataIndex: 'schedule',
      key: 'Friday',
      render: (schedule) => renderShiftTag(schedule.Friday),
    },
    {
      title: 'Saturday',
      dataIndex: 'schedule',
      key: 'Saturday',
      render: (schedule) => renderShiftTag(schedule.Saturday),
    },
    {
      title: 'Sunday',
      dataIndex: 'schedule',
      key: 'Sunday',
      render: (schedule) => renderShiftTag(schedule.Sunday),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<QrcodeOutlined />} 
            onClick={() => showQrModal(record)}
            size="small"
          >
            QR Code
          </Button>
        </Space>
      ),
    },
  ];

  // Function to render shift tags with appropriate colors
  const renderShiftTag = (shift) => {
    let color = '';
    switch (shift) {
      case 'Morning':
        color = 'geekblue';
        break;
      case 'Afternoon':
        color = 'orange';
        break;
      case 'Night':
        color = 'purple';
        break;
      case 'Off':
        color = 'green';
        break;
      default:
        color = 'default';
    }
    return (
      <Tag color={color} style={{ margin: 0 }}>
        {shift}
      </Tag>
    );
  };

  // Show QR code modal
  const showQrModal = (staff) => {
    setCurrentStaff(staff);
    setQrModalVisible(true);
  };

  // Generate QR code data
  const generateQrData = (staff) => {
    return JSON.stringify({
      staffId: staff.id,
      name: staff.name,
      employeeId: staff.employeeId,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      department: 'Nursing'
    });
  };

  // Print QR code
  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 500);
  };

  return (
    <div className="time-table-container">
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleOutlined style={{ marginRight: 10, fontSize: 20 }} />
            <span>Department Duty Roster</span>
          </div>
        }
        extra={
          <Space>
            <Button icon={<SearchOutlined />}>Search</Button>
            <Button icon={<TeamOutlined />}>Staff List</Button>
            <Button icon={<ReloadOutlined />}>Refresh</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              Print Roster
            </Button>
          </Space>
        }
        bordered={false}
      >
        <Table
          columns={columns}
          dataSource={staffData}
          scroll={{ x: 1300 }}
          rowKey="id"
          pagination={false}
          bordered
        />
      </Card>

      {/* QR Code Modal */}
      <Modal
        title={`QR Code for ${currentStaff?.name || ''}`}
        visible={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setQrModalVisible(false)}>
            Close
          </Button>,
          <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
            Print
          </Button>,
        ]}
        width={400}
      >
        {currentStaff && (
          <div className={printMode ? 'print-mode' : ''}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <QRCode 
                value={generateQrData(currentStaff)} 
                size={200} 
                iconSize={40}
                icon="https://cdn-icons-png.flaticon.com/512/2789/2789733.png"
              />
            </div>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <h3>{currentStaff.name}</h3>
              <p>Employee ID: {currentStaff.employeeId}</p>
              <p>Position: {currentStaff.position}</p>
              <p>Department: Nursing</p>
              <p>Generated: {dayjs().format('MMMM D, YYYY h:mm A')}</p>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .time-table-container {
          padding: 20px;
          background-color: #f5f7fa;
        }
        .ant-card {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
        }
        .staff-info {
          display: flex;
          align-items: center;
        }
        .ant-table-thead > tr > th {
          background-color: #f0f2f5 !important;
          text-align: center !important;
        }
        .ant-table-tbody > tr > td {
          text-align: center !important;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .print-mode, .print-mode * {
            visibility: visible;
          }
          .print-mode {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .ant-modal-footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TimeTable;