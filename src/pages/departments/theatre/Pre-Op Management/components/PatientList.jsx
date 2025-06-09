import React,{useState} from 'react';
import { List, Avatar, Tag, Input, Button,Card,Progress } from 'antd';
import { 
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';

const PatientList = ({ onSelectPatient, selectedPatient }) => {
  const [searchText, setSearchText] = useState('');
  
  const patients = [
    {
      id: 'PAT-1001',
      name: 'John Smith',
      mrn: 'MRN123456',
      age: 58,
      gender: 'Male',
      procedure: 'Total Knee Replacement',
      surgeryDate: '2023-07-15 08:30',
      status: 'pending',
      completedItems: 3,
      totalItems: 8
    },
    {
      id: 'PAT-1002',
      name: 'Sarah Johnson',
      mrn: 'MRN789012',
      age: 42,
      gender: 'Female',
      procedure: 'Laparoscopic Cholecystectomy',
      surgeryDate: '2023-07-15 10:15',
      status: 'in-progress',
      completedItems: 6,
      totalItems: 8
    },
    {
      id: 'PAT-1003',
      name: 'Robert Chen',
      mrn: 'MRN345678',
      age: 65,
      gender: 'Male',
      procedure: 'Cataract Surgery',
      surgeryDate: '2023-07-16 09:00',
      status: 'completed',
      completedItems: 8,
      totalItems: 8
    },
    // ... more patients
  ];

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
      
      <List
        itemLayout="horizontal"
        dataSource={patients.filter(patient => 
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
    </Card>
  );
};

export default PatientList;