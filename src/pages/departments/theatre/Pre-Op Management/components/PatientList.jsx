import React, { useState, useEffect } from 'react';
import { List, Avatar, Tag, Input, Button, Card, Progress } from 'antd';
import { fetchAllProcedures } from '../../../../../redux/slice/procedureSlice';
import { useDispatch, useSelector } from 'react-redux';
import { 
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';

const PatientList = ({ onSelectPatient, selectedPatient }) => {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const { loading, allProcedures } = useSelector((state) => state.procedure);

  useEffect(() => {
    dispatch(fetchAllProcedures());
  }, [dispatch]);

  const getStatusTag = (status) => {
    switch(status) {
      case 'completed':
        return <Tag icon={<CheckCircleOutlined />} color="green">Complete</Tag>;
      case 'in-progress':
        return <Tag icon={<ClockCircleOutlined />} color="orange">In Progress</Tag>;
      default:
        return <Tag color="blue">Pending</Tag>;
    }
  };

  // Transform procedures data to match your patient list structure
  const transformedProcedures = allProcedures.map(procedure => ({
    id: procedure.id || procedure._id,
    name: procedure.patient?.first_name + ' ' + procedure.patient?.last_name || 'Unknown Patient',
    mrn: procedure.patient?.mrn || 'N/A',
    age: procedure.patient?.age || 'N/A',
    gender: procedure.patient?.gender || 'N/A',
    procedure: procedure.name || 'Unnamed Procedure',
    surgeryDate: procedure.scheduledDate || 'Not scheduled',
    status: procedure.status || 'pending',
    completedItems: procedure.completedChecklistItems || 0,
    totalItems: procedure.totalChecklistItems || 8 // Default or calculate from your data
  }));

  return (
    <Card 
      title="Pre-Op Patients" 
      bordered={false} 
      className="shadow-sm h-full"
      extra={
        <Button 
          type="primary" 
          size="small"
          onClick={() => console.log('Add new patient')}
        >
          Add
        </Button>
      }
    >
      <Input
        placeholder="Search patients..."
        prefix={<SearchOutlined />}
        className="mb-4"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      
      {loading ? (
        <div>Loading procedures...</div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={transformedProcedures.filter(patient => 
            patient.name.toLowerCase().includes(searchText.toLowerCase()) || 
            patient.mrn.toLowerCase().includes(searchText.toLowerCase())
          )}
          renderItem={patient => (
            <List.Item
              onClick={() => onSelectPatient(patient)}
              className={`cursor-pointer p-3 hover:bg-gray-50 ${
                selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={<span className="font-medium">{patient.name}</span>}
                description={
                  <div>
                    <div className="text-gray-600">{patient.procedure}</div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm">
                        {patient.surgeryDate.split(' ')[0]} at {patient.surgeryDate.split(' ')[1]}
                      </span>
                      {getStatusTag(patient.status)}
                    </div>
                    <Progress 
                      percent={Math.round((patient.completedItems / patient.totalItems) * 100)} 
                      size="small" 
                      showInfo={false}
                      strokeColor={
                        patient.status === 'completed' ? '#52c41a' : 
                        patient.status === 'in-progress' ? '#faad14' : '#1890ff'
                      }
                    />
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