import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, Space, Typography, Row, Col, Input, Button,
  notification
} from 'antd';
import {
  MedicineBoxOutlined, SearchOutlined,
  PlusOutlined, SyncOutlined
} from '@ant-design/icons';

import {
  fetchMedications,
  selectAllMedications,
  selectPagination,
  selectLoading,
  selectError,
  resetCurrentMedication
} from '../../../../redux/slice/nhia_medicationsSlice';

import MedicationsTable from './components/MedicationsTable';
import MedicationModal from './components/MedicationModal';
import StatisticsCards from './components/StatisticsCards';

const { Title } = Typography;

const NHIAMedicationsManager = () => {
  const dispatch = useDispatch();
  const medications = useSelector(selectAllMedications);
  const pagination = useSelector(selectPagination);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter medications based on search
  const filteredMeds = medications.filter(med =>
    med.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.generic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.unit_of_pricing?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit medication handler
  const handleEdit = (medication) => {
    setEditingMed(medication);
    setIsModalVisible(true);
  };

  // Reset modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingMed(null);
    dispatch(resetCurrentMedication());
  };

  // Notification for errors
  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Operation Failed',
        description: error,
        placement: 'bottomRight',
      });
    }
  }, [error]);

  // Initial data load
  useEffect(() => {
    dispatch(fetchMedications({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  return (
    <div className="nhia-medications-manager" style={{ padding: 24 }}>
      <Card
        bordered={false}
        title={
          <Space>
            <MedicineBoxOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>NHIA Medications</Title>
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="Search medications..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              Add Medication
            </Button>
            <Button
              icon={<SyncOutlined />}
              onClick={() => dispatch(fetchMedications({
                page: pagination.currentPage,
                pageSize: pagination.pageSize
              }))}
            />
          </Space>
        }
      >
        {/* Summary Stats */}
        <StatisticsCards medications={medications} />

        {/* Medications Table */}
        <MedicationsTable
          medications={filteredMeds}
          pagination={pagination}
          loading={loading}
          onEdit={handleEdit}
          onFetchMedications={(params) => dispatch(fetchMedications(params))}
        />
      </Card>

      {/* Add/Edit Medication Modal */}
      <MedicationModal
        visible={isModalVisible}
        editingMed={editingMed}
        loading={loading}
        onCancel={handleModalClose}
        onOk={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default NHIAMedicationsManager;