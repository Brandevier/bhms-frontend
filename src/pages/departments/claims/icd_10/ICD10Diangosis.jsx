// ICD10Diagnosis.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Space, notification } from 'antd';
import { 
  fetchAllDiagnoses,
  deleteDiagnosis,
  selectAllDiagnoses,
  selectDiagnosesLoading,
  selectDiagnosesError,
  clearCurrentDiagnosis
} from '../../../../redux/slice/icd10DdiangosisSlice';
import DiagnosisHeader from './DiagnosisHeader';
import DiagnosisStats from './DiagnosisStats';
import DiagnosisTable from './DiagnosisTable';
import DiagnosisModal from './DiagnosisModal';
import SelectionOverlay from './SelectionOverlay';

const ICD10Diagnosis = () => {
  const dispatch = useDispatch();
  const allDiagnoses = useSelector(selectAllDiagnoses);
  const loading = useSelector(selectDiagnosesLoading);
  const error = useSelector(selectDiagnosesError);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDiagnosis, setEditingDiagnosis] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Handle edit
  const handleEdit = (diagnosis) => {
    setEditingDiagnosis(diagnosis);
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    dispatch(deleteDiagnosis(id));
  };

  // Handle row selection
  const handleRowSelection = (selectedKeys, selectedRows) => {
    setSelectedRowKeys(selectedKeys);
    setSelectedRows(selectedRows);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingDiagnosis(null);
    dispatch(clearCurrentDiagnosis());
  };

  // Show modal for adding new diagnosis
  const showAddModal = () => {
    setEditingDiagnosis(null);
    setIsModalVisible(true);
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
    dispatch(fetchAllDiagnoses());
  }, [dispatch]);

  // Filter diagnoses based on search text
  const filteredDiagnoses = allDiagnoses.filter(diagnosis => 
    diagnosis.diagnosis_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    diagnosis.icd_10_code?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="icd10-diagnosis-page" style={{ padding: 24 }}>
      <Card bordered={false}>
        <DiagnosisHeader 
          onSearch={handleSearch}
          onAddNew={showAddModal}
          onRefresh={() => dispatch(fetchAllDiagnoses())}
          loading={loading}
        />

        <DiagnosisStats diagnoses={allDiagnoses} />

        <DiagnosisTable
          data={filteredDiagnoses}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedRowKeys={selectedRowKeys}
          onRowSelection={handleRowSelection}
        />

        <SelectionOverlay 
          selectedCount={selectedRowKeys.length}
          selectedRows={selectedRows}
          onClearSelection={clearSelection}
        />

        <DiagnosisModal
          visible={isModalVisible}
          editingDiagnosis={editingDiagnosis}
          onCancel={handleModalClose}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default ICD10Diagnosis;