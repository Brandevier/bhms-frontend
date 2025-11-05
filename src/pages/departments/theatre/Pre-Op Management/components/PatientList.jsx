import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Tag, 
  Input, 
  Button, 
  Avatar, 
  Space, 
  Spin, 
  Empty,
  Badge,
  Divider
} from 'antd';
import { 
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTheatreBookings } from '../../../../../redux/slice/theatreSlice';
import moment from 'moment';

const PatientList = ({ onSelectPatient, selectedPatient }) => {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.theatre);

  useEffect(() => {
    dispatch(getAllTheatreBookings());
  }, [dispatch]);

  // Status configuration with modern HMS colors
  const getStatusConfig = (status) => {
    const statusMap = {
      'scheduled': { color: 'blue', text: 'Scheduled', icon: <CalendarOutlined /> },
      'in-progress': { color: 'orange', text: 'In Progress', icon: <ClockCircleOutlined /> },
      'completed': { color: 'green', text: 'Completed', icon: <SafetyCertificateOutlined /> },
      'pending': { color: 'default', text: 'Pending', icon: <ClockCircleOutlined /> }
    };
    return statusMap[status] || statusMap.pending;
  };

  // Transform theatre bookings data for display
  const theatreBookings = bookings?.map(booking => {
    const patient = booking.visit?.patient || {};
    const procedures = booking.procedures || [];
    const diagnoses = booking.diagnoses || [];
    const primaryProcedure = procedures[0] || {};
    const primaryDiagnosis = diagnoses[0] || {};

    return {
      id: booking.id,
      patient: {
        id: patient.id,
        name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
        folderNumber: patient.folder_number,
        gender: patient.gender,
        dateOfBirth: patient.date_of_birth,
        age: patient.date_of_birth ? 
          moment().diff(moment(patient.date_of_birth), 'years') : 'N/A'
      },
      visit: {
        id: booking.visit_id,
        attendanceNumber: booking.visit?.attendance_number,
        type: booking.visit?.visit_type,
        status: booking.visit?.admission_status
      },
      procedure: {
        primary: primaryProcedure.description,
        all: procedures,
        count: procedures.length,
        category: primaryProcedure.category
      },
      diagnosis: {
        primary: primaryDiagnosis.diagnosis_name,
        all: diagnoses,
        count: diagnoses.length,
        icdCode: primaryDiagnosis.icd_10_code
      },
      schedule: {
        date: booking.scheduled_date,
        time: booking.scheduled_time,
        formattedDate: booking.scheduled_date ? 
          moment(booking.scheduled_date).format('MMM DD, YYYY') : 'Not scheduled',
        formattedTime: booking.scheduled_time ? 
          moment(booking.scheduled_time, 'HH:mm:ss').format('hh:mm A') : ''
      },
      status: booking.status || 'scheduled',
      notes: booking.notes,
      isEmergency: booking.is_emergency,
      createdAt: booking.createdAt
    };
  }) || [];

  // Filter patients based on search
  const filteredBookings = theatreBookings.filter(booking => 
    booking.patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
    booking.patient.folderNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
    booking.procedure.primary?.toLowerCase().includes(searchText.toLowerCase()) ||
    booking.diagnosis.primary?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Sort by scheduled date (soonest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!a.schedule.date) return 1;
    if (!b.schedule.date) return -1;
    return new Date(a.schedule.date) - new Date(b.schedule.date);
  });

  if (loading) {
    return (
      <Card 
        title={
          <Space>
            <TeamOutlined />
            Theatre List
          </Space>
        } 
        className="h-full shadow-sm border-0"
      >
        <div className="flex justify-center items-center py-16">
          <Space direction="vertical" align="center" size="middle">
            <Spin size="large" />
            <div className="text-gray-500 text-sm">Loading theatre schedule...</div>
          </Space>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        title={
          <Space>
            <TeamOutlined />
            Theatre List
          </Space>
        } 
        className="h-full shadow-sm border-0"
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-gray-600">
              Failed to load theatre schedule
            </div>
          }
        >
          <Button 
            type="primary" 
            onClick={() => dispatch(getAllTheatreBookings())}
          >
            Try Again
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card 
      title={
        <Space>
          <TeamOutlined />
          Theatre List
          <Badge count={sortedBookings.length} showZero color="#1890ff" />
        </Space>
      } 
      className="h-full shadow-sm border-0"
      bodyStyle={{ padding: '16px' }}
    >
      {/* Search Section */}
      <div className="mb-4">
        <Input
          placeholder="Search patient, procedure, or diagnosis..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          size="large"
          className="rounded-lg"
        />
      </div>

      {/* Patient List */}
      {sortedBookings.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            searchText ? 
              "No matching theatre cases found" :
              "No theatre cases scheduled"
          }
          className="py-12"
        >
          {!searchText && (
            <Button type="primary">
              Schedule First Case
            </Button>
          )}
        </Empty>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {sortedBookings.map(booking => (
            <Card
              key={booking.id}
              size="small"
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                selectedPatient?.id === booking.id ? 
                'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => onSelectPatient(booking)}
              bodyStyle={{ padding: '16px' }}
            >
              {/* Header Section */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    size="large" 
                    icon={<UserOutlined />}
                    className={selectedPatient?.id === booking.id ? 
                      'bg-blue-500' : 'bg-gray-300'
                    }
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900 m-0">
                        {booking.patient.name}
                      </h4>
                      {booking.isEmergency && (
                        <Tag color="red" size="small">Emergency</Tag>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>
                        <IdcardOutlined /> {booking.patient.folderNumber}
                      </span>
                      <span>{booking.patient.gender}</span>
                      <span>{booking.patient.age}y</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Tag 
                    color={getStatusConfig(booking.status).color} 
                    icon={getStatusConfig(booking.status).icon}
                    className="m-0"
                  >
                    {getStatusConfig(booking.status).text}
                  </Tag>
                  <div className="text-xs text-gray-500 mt-1">
                    {moment(booking.createdAt).format('MMM DD')}
                  </div>
                </div>
              </div>

              <Divider className="my-3" />

              {/* Procedure & Diagnosis Section */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                {/* Procedure Info */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MedicineBoxOutlined className="text-blue-500" />
                    <span className="font-medium text-gray-700 text-sm">Procedure</span>
                    {booking.procedure.count > 1 && (
                      <Badge count={booking.procedure.count} size="small" color='magenta' />
                    )}
                  </div>
                  <div className="text-sm text-gray-900 font-medium">
                    {booking.procedure.primary}
                  </div>
                  {booking.procedure.category && (
                    <div className="text-xs text-gray-500 mt-1">
                      {booking.procedure.category}
                    </div>
                  )}
                </div>

                {/* Diagnosis Info */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FileTextOutlined className="text-green-500" />
                    <span className="font-medium text-gray-700 text-sm">Diagnosis</span>
                    {booking.diagnosis.count > 1 && (
                      <Badge count={booking.diagnosis.count} size="small" />
                    )}
                  </div>
                  <div className="text-sm text-gray-900 font-medium">
                    {booking.diagnosis.primary}
                  </div>
                  {booking.diagnosis.icdCode && (
                    <div className="text-xs text-gray-500 mt-1">
                      ICD-10: {booking.diagnosis.icdCode}
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule & Notes Section */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {booking.schedule.date ? (
                    <div className="flex items-center space-x-1">
                      <CalendarOutlined />
                      <span>{booking.schedule.formattedDate}</span>
                      {booking.schedule.formattedTime && (
                        <>
                          <ClockCircleOutlined className="ml-2" />
                          <span>{booking.schedule.formattedTime}</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">Not scheduled</span>
                  )}
                </div>

                {booking.notes && (
                  <div className="text-xs text-gray-500 max-w-[200px] truncate">
                    📝 {booking.notes}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats Footer */}
      {sortedBookings.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Total Cases: {sortedBookings.length}</span>
            <span>
              Today: {sortedBookings.filter(b => 
                moment(b.schedule.date).isSame(moment(), 'day')
              ).length}
            </span>
            <span>
              Emergency: {sortedBookings.filter(b => b.isEmergency).length}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PatientList;