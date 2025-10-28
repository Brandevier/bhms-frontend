import React, { useState, useRef } from "react";
import { 
  Card, 
  Button, 
  Empty, 
  Divider, 
  Tag, 
  Space, 
  Modal,
  Spin,
  message 
} from "antd";
import { 
  EllipsisOutlined, 
  FilterOutlined, 
  PlusOutlined,
  ExclamationCircleOutlined 
} from "@ant-design/icons";
import LabReportList from "./common/LabReportList";
import LabReportFilters from "./common/LabReportFilters";
import RequestLabDialog from "../../modal/RequestLabDialog";
const HealthReports = ({
  patient_data,
  status,
  onViewAll,
  onDeleteTest,
  onViewResult,
  onUpdateTest,
  onCreateTest, // New prop for creating tests
  templates = [], // Lab test templates
  patientId,
  visitId
}) => {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: null,
    search: ''
  });
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    creating: false,
    updating: false,
    deleting: false
  });

  // Handle create test
  const handleCreateTest = async (testData) => {
    setLoadingStates(prev => ({ ...prev, creating: true }));
    try {
      await onCreateTest({
        ...testData,
        patient_id: patientId,
        visit_id: visitId
      });
      message.success('Lab test requested successfully');
      setCreateModalVisible(false);
    } catch (error) {
      message.error('Failed to request lab test');
      console.error('Create test error:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, creating: false }));
    }
  };

  // Handle update test
  const handleUpdateTest = async (testId, testData) => {
    setLoadingStates(prev => ({ ...prev, updating: true }));
    try {
      await onUpdateTest(testId, testData);
      message.success('Lab test updated successfully');
      setEditingTest(null);
    } catch (error) {
      message.error('Failed to update lab test');
      console.error('Update test error:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, updating: false }));
    }
  };

  // Handle delete test
  const handleDeleteTest = async (testId) => {
    setLoadingStates(prev => ({ ...prev, deleting: true }));
    try {
      await onDeleteTest(testId);
      message.success('Lab test deleted successfully');
      setDeleteConfirmVisible(false);
      setTestToDelete(null);
    } catch (error) {
      message.error('Failed to delete lab test');
      console.error('Delete test error:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: false }));
    }
  };

  // Show delete confirmation
  const showDeleteConfirm = (testId) => {
    setTestToDelete(testId);
    setDeleteConfirmVisible(true);
  };

  // Start editing a test
  const startEditing = (test) => {
    setEditingTest(test);
  };

  if (status === "loading") {
    return (
      <Card title="Laboratory Reports" className="health-reports-card">
        <div style={{ padding: 20, textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading lab reports...</div>
        </div>
      </Card>
    );
  }

  const results = Array.isArray(patient_data) ? patient_data : [];
  const hasMoreResults = results.length > 10;

  const filteredResults = results.filter(result => {
    if (filters.status !== 'all' && result?.status !== filters.status) {
      return false;
    }
    // Add date range and search filtering logic here
    return true;
  });

  return (
    <>
      <Card
        title={
          <div className="health-reports-header">
            <Space>
              <span style={{ fontSize: '18px', fontWeight: '600' }}>Laboratory Reports</span>
              <Tag color="blue">{results.length} tests</Tag>
            </Space>
            
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
                size="small"
              >
                New Test
              </Button>
              
              <LabReportFilters 
                filters={filters} 
                onFiltersChange={setFilters} 
              />
              
              {hasMoreResults && (
                <Button
                  type="default"
                  onClick={onViewAll}
                  icon={<EllipsisOutlined />}
                  size="small"
                >
                  View All
                </Button>
              )}
            </Space>
          </div>
        }
        className="health-reports-card"
        extra={
          <Button 
            icon={<FilterOutlined />} 
            size="small" 
            type="text"
          >
            Filters
          </Button>
        }
      >
        {filteredResults.length === 0 ? (
          <Empty 
            description={
              filters.status !== 'all' ? 
              `No ${filters.status} lab tests found` : 
              "No lab tests available"
            } 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '40px 0' }}
          />
        ) : (
          <LabReportList
            results={filteredResults}
            onDeleteTest={showDeleteConfirm}
            onViewResult={onViewResult}
            onUpdateTest={startEditing}
          />
        )}

        <Divider />
        
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Space>
            <Tag color="blue">{results.filter(r => r?.status === 'pending').length} Pending</Tag>
            <Tag color="green">{results.filter(r => r?.status === 'completed').length} Completed</Tag>
            <Tag color="orange">{results.filter(r => r?.status === 'in_progress').length} In Progress</Tag>
          </Space>
        </div>
      </Card>

      {/* Create/Update Lab Test Modal */}
      <RequestLabDialog
        visible={createModalVisible || !!editingTest}
        onClose={() => {
          setCreateModalVisible(false);
          setEditingTest(null);
        }}
        onSubmit={handleCreateTest}
        onUpdate={handleUpdateTest}
        loading={loadingStates.creating}
        isUpdating={loadingStates.updating}
        templates={templates}
        editingTest={editingTest}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        visible={deleteConfirmVisible}
        onOk={() => handleDeleteTest(testToDelete)}
        onCancel={() => {
          setDeleteConfirmVisible(false);
          setTestToDelete(null);
        }}
        confirmLoading={loadingStates.deleting}
        okText="Delete"
        cancelText="Cancel"
        okType="danger"
      >
        <Space>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
          <span>Are you sure you want to delete this lab test? This action cannot be undone.</span>
        </Space>
      </Modal>
    </>
  );
};

export default HealthReports;