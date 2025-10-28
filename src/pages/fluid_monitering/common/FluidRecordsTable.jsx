import React, { useState } from 'react';
import { Card, Table, Button, Tag, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useFluidMonitoring } from '../../../redux/hooks/useFluidMonitoring';
import AddFluidEntryModal from './AddFluidEntryModal'; // Import the modal component 

const FluidRecordsTable = ({ type, data, title, visitId, institutionId }) => {
  const { removeFluidEntry } = useFluidMonitoring();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalVisible(false);
  };

  const handleAddSuccess = () => {
    setIsAddModalVisible(false);
    // You might want to refresh the data here
    // For example: getFluidEntries(); if you pass the function as prop
  };

  const columns = [
    {
      title: 'Time',
      dataIndex: 'recorded_at',
      key: 'time',
      width: 100,
      render: (time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      title: 'Type',
      dataIndex: 'category',
      key: 'type',
      width: 100,
      render: (category) => (
        <Tag color={type === 'intake' ? 'blue' : 'red'}>
          {category?.replace('_', ' ').toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Amount (ml)',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount) => <span className="font-semibold">{amount} ml</span>
    },
    {
      title: 'Details',
      key: 'details',
      render: (record) => (
        <div>
          {record.fluid_type && <div>{record.fluid_type}</div>}
          {record.color && <div>Color: {record.color}</div>}
          {record.consistency && <div>Consistency: {record.consistency}</div>}
          {record.description && <div>{record.description}</div>}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (record) => (
        <div className="flex space-x-2">
          <Button type="link" icon={<EditOutlined />} size="small" />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => removeFluidEntry(record.id, 'User deleted')}
          />
        </div>
      )
    }
  ];

  return (
    <>
      <Card
        title={title}
        className="shadow-md h-full"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={showAddModal}
          >
            Add {type === 'intake' ? 'Intake' : 'Output'}
          </Button>
        }
      >
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          size="small"
          scroll={{ x: 400 }}
          rowKey="id"
        />
      </Card>

      <AddFluidEntryModal
        visible={isAddModalVisible}
        onClose={handleAddModalClose}
        onSuccess={handleAddSuccess}
        defaultType={type}
        visitId={visitId}
        institutionId={institutionId}
      />
    </>
  );
};

export default FluidRecordsTable;