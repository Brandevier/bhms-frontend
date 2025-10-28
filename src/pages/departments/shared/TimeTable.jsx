import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, message } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getShifts, getAllUsersFromDepartment } from '../../../redux/slice/shiftSlice';

// Components
import ShiftTable from './components/ShiftTable';
import HeaderActions from './components/HeaderActions';
import QrCodeModal from './components/QrCodeModal';
import AddShiftModal from '../../../modal/ShiftModal';
import ShiftShuffler from '../../../modal/smart_shift/ShiftShuffler';

// Utilities
import { transformShiftsToTableData } from './components/DataTransformer';

const TimeTable = () => {
  const dispatch = useDispatch();
  const { shifts, loading, error, users } = useSelector((state) => state.shifts);
  const user = useSelector((state) => state.auth.user || state.auth.admin);
  
  // State management
  const [addShiftModalVisible, setAddShiftModalVisible] = useState(false);
  const [shufflerVisible, setShufflerVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const institution_id = user.institution.id;
    const department_id = localStorage.getItem('department_id');

    if (institution_id && department_id) {
      dispatch(getShifts({ institution_id, department_id }));
      dispatch(getAllUsersFromDepartment({ department_id }));
    }
  }, [dispatch, user]);

  // Transform shifts data for table
  const staffData = transformShiftsToTableData(shifts);

  // Event handlers
  const handleRefresh = () => {
    const institution_id = user.institution.id;
    const department_id = localStorage.getItem('department_id');
    
    dispatch(getShifts({ institution_id, department_id }))
      .unwrap()
      .then(() => message.success('Schedule updated successfully'))
      .catch(() => message.error('Failed to refresh schedule'));
  };

  const handleShowQr = (staff) => {
    setCurrentStaff(staff);
    setQrModalVisible(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePrintQr = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${currentStaff?.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 40px;
            }
            .qr-container { 
              margin: 20px auto; 
              max-width: 300px;
            }
            .staff-info { 
              margin: 20px 0; 
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2>${currentStaff?.name}</h2>
            <div class="staff-info">
              <p><strong>ID:</strong> ${currentStaff?.employeeId}</p>
              <p><strong>Position:</strong> ${currentStaff?.position}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(currentStaff))}" alt="QR Code" />
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className=" mx-auto">
        <Card
          className="shadow-xl border-0 rounded-2xl bg-white"
          title={
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <ScheduleOutlined className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 m-0">
                  Duty Roster
                </h1>
                <p className="text-gray-500 m-0 text-sm">
                  Manage and view staff schedules
                </p>
              </div>
            </div>
          }
          extra={
            <HeaderActions
              loading={loading}
              onRefresh={handleRefresh}
              onAddShift={() => setAddShiftModalVisible(true)}
              onOpenShuffler={() => setShufflerVisible(true)}
              onPrint={handlePrint}
            />
          }
        >
          {/* Error Alert */}
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-6 rounded-lg"
            />
          )}

          {/* Loading State */}
          <Spin spinning={loading} size="large">
            {/* Main Content */}
            {staffData.length > 0 ? (
              <ShiftTable
                staffData={staffData}
                loading={loading}
                onShowQr={handleShowQr}
              />
            ) : (
              <div className="text-center py-12">
                <ScheduleOutlined className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  No Schedule Found
                </h3>
                <p className="text-gray-400 mb-6">
                  {loading ? 'Loading shifts...' : 'No shifts have been scheduled yet.'}
                </p>
                <div className="space-x-3">
                  <button
                    onClick={() => setAddShiftModalVisible(true)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add First Shift
                  </button>
                  <button
                    onClick={() => setShufflerVisible(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                  >
                    Generate with AI
                  </button>
                </div>
              </div>
            )}
          </Spin>
        </Card>

        {/* Modals */}
        <QrCodeModal
          visible={qrModalVisible}
          onClose={() => setQrModalVisible(false)}
          staff={currentStaff}
          onPrint={handlePrintQr}
        />

        <AddShiftModal
          visible={addShiftModalVisible}
          onCancel={() => setAddShiftModalVisible(false)}
          staffList={users}
        />

        <ShiftShuffler
          visible={shufflerVisible}
          onCancel={() => setShufflerVisible(false)}
          staffList={users}
        />
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .ant-card,
          .ant-card * {
            visibility: visible;
          }
          .ant-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
          }
          .ant-card-extra,
          .ant-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TimeTable;