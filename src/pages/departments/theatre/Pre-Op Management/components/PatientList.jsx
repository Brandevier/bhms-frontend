import React, { useState, useEffect } from 'react';
import { 
  List, 
  Avatar, 
  Tag, 
  Input, 
  Button, 
  Card, 
  Progress, 
  Spin, 
  Empty,
  Space 
} from 'antd';
import { getAllTheatreBookings } from '../../../../../redux/slice/theatreSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import { 
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  CalendarOutlined,
  IdcardOutlined
} from '@ant-design/icons';

const PatientList = ({ onSelectPatient, selectedPatient }) => {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.theatre);

  useEffect(() => {
    dispatch(getAllTheatreBookings());
  }, [dispatch]);

  const getStatusTag = (status) => {
    const statusConfig = {
      'completed': { icon: <CheckCircleOutlined />, color: 'green', text: 'Complete' },
      'in-progress': { icon: <ClockCircleOutlined />, color: 'orange', text: 'In Progress' },
      'in_theatre': { icon: <ClockCircleOutlined />, color: 'blue', text: 'In Theatre' },
      'scheduled': { icon: <CalendarOutlined />, color: 'blue', text: 'Scheduled' },
      'pending': { icon: <ClockCircleOutlined />, color: 'default', text: 'Pending' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Tag icon={config.icon} color={config.color}>{config.text}</Tag>;
  };

  const getProgressColor = (status) => {
    switch(status) {
      case 'completed': return '#52c41a';
      case 'in-progress': return '#faad14';
      case 'in_theatre': return '#1890ff';
      default: return '#d9d9d9';
    }
  };

  // Transform theatre bookings data to match patient list structure
  const transformedProcedures = bookings?.map(booking => {
    // Extract patient info from visit relation
    const patient = booking.visit?.patient || {};
    const procedures = booking.procedure || [];
    const primaryProcedure = procedures[0] || {};
    
    return {
      id: booking.id,
      bookingId: booking.id,
      visitId: booking.visit_id,
      name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown Patient',
      mrn: patient.mrn || patient.folder_number || 'N/A',
      age: patient.age || patient.date_of_birth ? 
        `${new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()}y` : 'N/A',
      gender: patient.gender || 'N/A',
      procedure: primaryProcedure.name || primaryProcedure.description || 'Procedure',
      procedures: procedures,
      surgeryDate: booking.scheduled_date ? 
        new Date(booking.scheduled_date).toLocaleDateString() : 'Not scheduled',
      surgeryTime: booking.scheduled_time || '',
      status: booking.status || 'scheduled',
      surgeon: booking.surgeon ? 
        `${booking.surgeon.firstname} ${booking.surgeon.lastname}` : 'Not assigned',
      diagnosis: booking.diagnosis?.name || 'No diagnosis',
      notes: booking.notes,
      // Calculate checklist progress (you might want to add this to your model)
      completedItems: 0, // Replace with actual data from your model
      totalItems: 8 // Replace with actual data from your model
    };
  }) || [];

  const filteredPatients = transformedProcedures.filter(patient => 
    patient.name.toLowerCase().includes(searchText.toLowerCase()) || 
    patient.mrn.toLowerCase().includes(searchText.toLowerCase()) ||
    patient.procedure.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <Card title="Pre-Op Patients" bordered={false} className="shadow-sm h-full">
        <div className="flex justify-center items-center py-12">
          <Space direction="vertical" align="center" size="middle">
            <Spin size="large" />
            <div className="text-gray-500">Loading theatre patients...</div>
          </Space>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Pre-Op Patients" bordered={false} className="shadow-sm h-full">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-red-500">
              Failed to load patients: {error}
            </span>
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
      title="Theatre Patients" 
      bordered={false} 
      className="shadow-sm h-full"
      extra={
        <Space>
          <Tag>{filteredPatients.length} Patients</Tag>
          <Button 
            type="primary" 
            size="small"
            icon={<PlusOutlined />}
            onClick={() => console.log('Add new theatre booking')}
          >
            New Booking
          </Button>
        </Space>
      }
    >
      <Input
        placeholder="Search by name, MRN, or procedure..."
        prefix={<SearchOutlined />}
        className="mb-4"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
      />
      
      {filteredPatients.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            searchText ? 
              "No patients match your search criteria" :
              "No theatre patients scheduled"
          }
        >
          {!searchText && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => console.log('Create new theatre booking')}
            >
              Schedule First Patient
            </Button>
          )}
          {searchText && (
            <Button 
              onClick={() => setSearchText('')}
            >
              Clear Search
            </Button>
          )}
        </Empty>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={filteredPatients}
          renderItem={patient => (
            <List.Item
              onClick={() => onSelectPatient(patient)}
              className={`cursor-pointer p-3 hover:bg-gray-50 transition-colors ${
                selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              actions={[
                <small key="mrn" className="text-gray-500">
                  <IdcardOutlined /> {patient.mrn}
                </small>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ 
                      backgroundColor: selectedPatient?.id === patient.id ? '#1890ff' : '#f0f0f0',
                      color: selectedPatient?.id === patient.id ? 'white' : '#666'
                    }} 
                  />
                }
                title={
                  <Space>
                    <span className="font-medium">{patient.name}</span>
                    {getStatusTag(patient.status)}
                  </Space>
                }
                description={
                  <div className="space-y-2">
                    <div className="text-gray-600 font-medium">
                      {patient.procedure}
                      {patient.procedures?.length > 1 && (
                        <Tag size="small" className="ml-2">
                          +{patient.procedures.length - 1} more
                        </Tag>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <Space>
                        <CalendarOutlined />
                        <span>
                          {patient.surgeryDate} 
                          {patient.surgeryTime && ` at ${patient.surgeryTime}`}
                        </span>
                      </Space>
                    </div>

                    {patient.surgeon !== 'Not assigned' && (
                      <div className="text-xs text-gray-500">
                        Surgeon: {patient.surgeon}
                      </div>
                    )}

                    {/* Progress bar for checklist completion */}
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Pre-op Checklist</span>
                        <span>{patient.completedItems}/{patient.totalItems}</span>
                      </div>
                      <Progress 
                        percent={Math.round((patient.completedItems / patient.totalItems) * 100)} 
                        size="small" 
                        showInfo={false}
                        strokeColor={getProgressColor(patient.status)}
                      />
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default PatientList;