// ListView.jsx
import React from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const ListView = ({ appointments }) => {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return moment(timeString, 'HH:mm:ss').format('h:mm A');
  };

  const getPatientName = (record) => {
    if (record.patient?.patient?.first_name && record.patient?.patient?.last_name) {
      return `${record.patient.patient.first_name} ${record.patient.patient.last_name}`;
    }
    return 'Unknown Patient';
  };

  const getDoctorName = (doctor) => {
    if (doctor?.firstName && doctor?.lastName) {
      return `${doctor.firstName} ${doctor.lastName}`;
    }
    return 'Unknown Doctor';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
      render: (_, record) => (
        <div>
          {getPatientName(record)}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'appointment_date',
      key: 'date',
      render: (date) => moment(date).format('MMM DD, YYYY'),
      sorter: (a, b) => moment(a.appointment_date) - moment(b.appointment_date),
    },
    {
      title: 'Time',
      dataIndex: 'appointment_time',
      key: 'time',
      render: (time) => formatTime(time),
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
      render: (doctor) => (
        <div>
          {getDoctorName(doctor)}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'appointment_type',
      key: 'type',
      render: (type) => type || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status ? status.toUpperCase() : 'UNKNOWN'}
        </Tag>
      ),
      filters: [
        { text: 'Scheduled', value: 'scheduled' },
        { text: 'Completed', value: 'completed' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} size="small">View</Button>
          <Button icon={<EditOutlined />} size="small">Edit</Button>
          <Button icon={<DeleteOutlined />} size="small" danger>Cancel</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Table 
        columns={columns} 
        dataSource={appointments} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default ListView;