import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Card, Typography, Tag, Badge, Spin, Alert, Empty } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { fetchActiveVisits } from '../../../redux/slice/recordSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title, Text } = Typography;

const ConsultationDepartment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeVisits, loading, error } = useSelector((state) => state.records);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(fetchActiveVisits());
  }, [dispatch]);

  useEffect(() => {
    if (activeVisits) {
      const filtered = activeVisits.filter(visit => {
        const patient = visit.patient || {};
        const searchLower = searchTerm.toLowerCase();
        
        return (
          (patient.first_name?.toLowerCase().includes(searchLower)) ||
          (patient.last_name?.toLowerCase().includes(searchLower)) ||
          (patient.folder_number?.toLowerCase().includes(searchLower)) ||
          (visit.attendance_number?.toLowerCase().includes(searchLower))
        );
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, activeVisits]);

  const handleViewPatient = (record) => {
    navigate(`/shared/patient/details/${record.id}`,{id: record.id})
  };

  const columns = [
    {
      title: 'Attendance No.',
      dataIndex: 'attendance_number',
      key: 'attendance_number',
      width: 180,
    },
    {
      title: 'Patient Name',
      key: 'name',
      render: (_, record) => (
        <Text strong>{`${record.patient?.first_name || 'N/A'} ${record.patient?.last_name || ''}`}</Text>
      ),
    },
    {
      title: 'Folder No.',
      dataIndex: ['patient', 'folder_number'],
      key: 'folder_number',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Age',
      key: 'age',
      render: (_, record) => {
        const dob = record.patient?.date_of_birth;
        return dob ? <span>{moment().diff(moment(dob), 'years')} years</span> : 'N/A';
      },
    },
    {
      title: 'Visit Date',
      dataIndex: 'visit_date',
      key: 'visit_date',
      render: (date) => date ? moment(date).format('DD-MM-YYYY hh:mm A') : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'orange'}>
          {status || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />}
          onClick={() => handleViewPatient(record)}
          size="small"
        >
          View
        </Button>
      ),
    },
  ];

  if (loading.activeVisits) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error.activeVisits) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert message="Error Loading Data" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ marginBottom: '16px' }}>
            <Title level={4} style={{ marginBottom: '0' }}>Consultation Queue</Title>
            <Text type="secondary">Patients waiting for doctor consultation</Text>
          </div>
          <Input
            placeholder="Search patients..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        {filteredData.length === 0 ? (
          <Empty 
            description={
              searchTerm ? 
              "No patients match your search" : 
              "No patients in consultation queue"
            }
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            scroll={{ x: true }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} patients`,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default ConsultationDepartment;