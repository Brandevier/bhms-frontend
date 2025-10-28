import React, { useState } from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AppointmentModal from '../../../modal/AppointmentModal';


const AppointmentTable = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleCreate = () => {
    setSelectedAppointment(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedAppointment(record);
    setModalVisible(true);
  };

  const handleModalSubmit = (values) => {
    console.log('Received values:', values);
    // Here you would handle the form submission (create/update)
    setModalVisible(false);
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName'
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => (
        `${dayjs(record.date).format('MMM D, YYYY')} at ${record.time}`
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={
          type === 'emergency' ? 'red' : 
          type === 'follow-up' ? 'purple' : 
          type === 'checkup' ? 'blue' : 'cyan'
        }>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'completed' ? 'green' : 
          status === 'scheduled' ? 'blue' : 'gray'
        }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
        </Space>
      )
    }
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
        >
          New Appointment
        </Button>
      </div>
      
      <Table 
        dataSource={data} 
        columns={columns} 
        rowKey="id" 
        bordered
      />
      
      <AppointmentModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onFinish={handleModalSubmit}
        initialValues={selectedAppointment}
      />
    </>
  );
};

export default AppointmentTable;