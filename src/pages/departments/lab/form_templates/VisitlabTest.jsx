import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getRecentLabTestsByVisitId } from '../../../../redux/slice/labSlice';
import {
  Card,
  Spin,
  Alert,
  Empty,
  Typography
} from 'antd';
import {
  LabTestsHeader,
  LabTestsStats,
  LabTestsFilters,
  LabTestsTable,
  LabTestEditModal
} from './components';

const { Title } = Typography;

const VisitLabTests = () => {
  const { visit_id } = useParams();
  const { loading, results, error } = useSelector((state) => state.lab);
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTest, setSelectedTest] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [filteredTests, setFilteredTests] = useState([]);

  useEffect(() => {
    if (visit_id) {
      dispatch(getRecentLabTestsByVisitId(visit_id));
    }
  }, [dispatch, visit_id]);

  useEffect(() => {
    if (results?.recentTests) {
      filterTests();
    }
  }, [results, searchText, statusFilter]);

  const filterTests = () => {
    let filtered = results?.recentTests;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(test =>
        test.template?.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        test.template?.lab_tarrif?.test_description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(test => test.status === statusFilter);
    }

    setFilteredTests(filtered);
  };

  const handleEditTest = (test) => {
    setSelectedTest(test);
    setIsEditModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsEditModalVisible(false);
    setSelectedTest(null);
  };

  const handleUpdateSuccess = () => {
    handleCloseModal();
    // Refresh data
    if (visit_id) {
      dispatch(getRecentLabTestsByVisitId(visit_id));
    }
  };

  if (loading && !results) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Lab Tests"
        description={error}
        type="error"
        showIcon
        style={{ margin: '16px' }}
      />
    );
  }

  if (!results?.recentTests?.length) {
    return (
      <Empty
        description="No lab tests found for this visit"
        style={{ margin: '50px 0' }}
      />
    );
  }

  const visitData = results?.recentTests[0]?.visit;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Visit Lab Tests</Title>
      
      {/* Patient Header */}
      <LabTestsHeader visitData={visitData} />
      
      {/* Statistics */}
      <LabTestsStats tests={filteredTests} />
      
      {/* Filters */}
      <LabTestsFilters
        searchText={searchText}
        onSearchChange={setSearchText}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalTests={filteredTests.length}
        originalTotal={results.recentTests.length}
      />
      
      {/* Tests Table */}
      <Card>
        <LabTestsTable
          tests={filteredTests}
          onEditTest={handleEditTest}
          loading={loading}
        />
      </Card>

      {/* Edit Modal */}
      <LabTestEditModal
        visible={isEditModalVisible}
        test={selectedTest}
        onClose={handleCloseModal}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default VisitLabTests;