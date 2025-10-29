import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Card, Button, Typography, Badge, message, Space, Alert, Spin, Tag } from 'antd';
import { FileTextOutlined, FilterOutlined, DownloadOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import PatientTable from './common/PatientTable';
import PatientDetails from './common/PatientDetails';
import AdvancedSearchModal from './common/AdvancedSearchModal';
import SearchBar from './common/SearchBar';
import XMLGenerationModal from './common/XMLGenerationModal';
import { getAllClaims } from '../../../redux/slice/claimSlice';
import TonitelButton from '../../../components/common/TonitelButton';


const { Title, Text } = Typography;

const PatientClaimsDesk = () => {
  const dispatch = useDispatch();
  const claimsState = useSelector((state) => state.claims);

  // Correct state access for claims slice
  const claimsData = claimsState?.claims || [];
  const loading = claimsState?.loading ?? false;
  const error = claimsState?.error;
  const pagination = claimsState?.pagination || {};

  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({});
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showXMLModal, setShowXMLModal] = useState(false);
  const [generatingXML, setGeneratingXML] = useState(false);

  useEffect(() => {
    dispatch(getAllClaims())
      .unwrap()
      .catch((error) => {
        console.error('Failed to fetch claims:', error);
        message.error('Failed to load claims data');
      });
  }, [dispatch]);

  // Get status tag color and icon
  const getStatusTag = (status) => {
    const statusConfig = {
      'Pending': { color: 'orange', icon: <ClockCircleOutlined /> },
      'Submitted': { color: 'blue', icon: <FileTextOutlined /> },
      'Approved': { color: 'green', icon: <CheckCircleOutlined /> },
      'Rejected': { color: 'red', icon: <CloseCircleOutlined /> }
    };

    const config = statusConfig[status] || statusConfig.Pending;
    return (
      <Tag icon={config.icon} color={config.color} className="capitalize">
        {status}
      </Tag>
    );
  };

  // Calculate statistics from claims data
  const statistics = useMemo(() => {
    const totalClaims = claimsData.length;
    const pendingClaims = claimsData.filter(claim => claim.claim_status === 'Pending').length;
    const approvedClaims = claimsData.filter(claim => claim.claim_status === 'Approved').length;
    const submittedClaims = claimsData.filter(claim => claim.claim_status === 'Submitted').length;
    const rejectedClaims = claimsData.filter(claim => claim.claim_status === 'Rejected').length;

    const totalAmount = claimsData.reduce((sum, claim) => sum + (claim.total_amount || 0), 0);
    const approvedAmount = claimsData
      .filter(claim => claim.claim_status === 'Approved')
      .reduce((sum, claim) => sum + (claim.total_amount || 0), 0);

    return {
      totalClaims,
      pendingClaims,
      approvedClaims,
      submittedClaims,
      rejectedClaims,
      totalAmount,
      approvedAmount
    };
  }, [claimsData]);

  // Transform claims data for the table - extract patient info properly
  const tableData = useMemo(() => {
    return claimsData.map(claim => ({
      ...claim,
      // Extract patient information from nested structure
      patient: claim.visit?.patient || {},
      visit: claim.visit || {},
      // Flatten commonly used fields for easier access
      patientName: claim.visit?.patient ?
        `${claim.visit.patient.first_name || ''} ${claim.visit.patient.middle_name || ''} ${claim.visit.patient.last_name || ''}`.trim() :
        'Unknown Patient',
      patientFolderNumber: claim.visit?.patient?.folder_number || 'N/A',
      patientGender: claim.visit?.patient?.gender || 'N/A',
      patientAge: claim.visit?.patient?.date_of_birth ?
        `${new Date().getFullYear() - new Date(claim.visit.patient.date_of_birth).getFullYear()}y` :
        'N/A',
      attendanceNumber: claim.visit?.attendance_number || 'N/A',
      department: claim.visit?.department?.name || 'N/A',
      insuranceProvider: claim.visit?.patient?.insurance?.insurance_provider || 'No Insurance',
      hasInsurance: claim.visit?.patient?.has_insurance || false,
      // Items count
      itemsCount: claim.items?.length || 0
    }));
  }, [claimsData]);

  const handleXMLGenerate = (generationFilters) => {
    setGeneratingXML(true);
    console.log('Generating XML with filters:', generationFilters);

    // Simulate API call
    setTimeout(() => {
      setGeneratingXML(false);
      setShowXMLModal(false);
      message.success('XML report generated successfully!');
    }, 2000);
  };

  const handleRefresh = () => {
    dispatch(getAllClaims());
  };

  // Filter claims based on search and filters
  const filteredClaims = useMemo(() => {
    if (!Array.isArray(tableData)) {
      return [];
    }

    let filtered = [...tableData];

    // Text search
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(claim => {
        return (
          claim.patientName.toLowerCase().includes(searchLower) ||
          claim.patientFolderNumber.toLowerCase().includes(searchLower) ||
          claim.attendanceNumber.toLowerCase().includes(searchLower) ||
          claim.claim_reference_number?.toLowerCase().includes(searchLower) ||
          claim.insuranceProvider.toLowerCase().includes(searchLower)
        );
      });
    }

    // Advanced filters
    if (Object.keys(filters).length > 0) {
      filtered = filtered.filter(claim => {
        // Claim filters
        if (filters.claimStatus && claim.claim_status !== filters.claimStatus) return false;
        if (filters.claimReference && !claim.claim_reference_number?.includes(filters.claimReference)) return false;

        // Patient filters
        if (filters.gender && claim.patientGender !== filters.gender) return false;

        // Insurance filters
        if (filters.hasInsurance && !claim.hasInsurance) return false;
        if (filters.insuranceProvider && claim.insuranceProvider !== filters.insuranceProvider) return false;

        // Amount filters
        if (filters.minAmount && claim.total_amount < parseFloat(filters.minAmount)) return false;
        if (filters.maxAmount && claim.total_amount > parseFloat(filters.maxAmount)) return false;

        // Date filters
        if (filters.dateRange) {
          const [startDate, endDate] = filters.dateRange;
          const claimDate = new Date(claim.createdAt || claim.submission_date);
          if (claimDate < startDate || claimDate > endDate) return false;
        }

        // Items filters
        if (filters.minItems && claim.itemsCount < parseInt(filters.minItems)) return false;
        if (filters.maxItems && claim.itemsCount > parseInt(filters.maxItems)) return false;

        return true;
      });
    }

    return filtered;
  }, [tableData, searchText, filters]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleAdvancedSearch = (newFilters) => {
    setFilters(newFilters);
    setShowAdvancedSearch(false);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchText('');
    message.info('All filters cleared');
  };

  const hasActiveFilters = searchText || Object.keys(filters).length > 0;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert
            message="Error Loading Claims Data"
            description={error}
            type="error"
            showIcon
            className="mb-6"
          />
          <Button
            type="primary"
            onClick={handleRefresh}
            loading={loading}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Title level={2} className="text-gray-800 mb-2">Claims Management Desk</Title>
          <Text type="secondary" className="text-lg">
            Manage and process insurance claims
          </Text>
        </div>

        {/* Search and Filter Section */}
        <Card className="border-0 shadow-sm rounded-xl mb-6 bg-white">
          <div className="mb-4">
            <SearchBar
              onSearch={handleSearch}
              onOpenAdvanced={() => setShowAdvancedSearch(true)}
              searchText={searchText}
              placeholder="Search patients, folder numbers, claims, reference numbers..."
            />

            {hasActiveFilters && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 p-3 bg-blue-50 rounded-lg">
                <Space wrap className="mb-2 sm:mb-0">
                  <Text strong className="text-blue-700">Active filters:</Text>
                  {searchText && (
                    <Badge
                      count={`Search: "${searchText}"`}
                      style={{ backgroundColor: '#1890ff' }}
                      className="mr-2"
                    />
                  )}
                  {Object.entries(filters).map(([key, value]) => (
                    <Badge
                      key={key}
                      count={`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                      style={{ backgroundColor: '#52c41a' }}
                      className="mr-2"
                    />
                  ))}
                </Space>
                <Button
                  size="small"
                  onClick={handleClearFilters}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Stats and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <Space wrap>
              <Badge
                count={filteredClaims.length}
                showZero
                style={{ backgroundColor: '#52c41a' }}
                className="custom-badge"
              >
                <Text strong className="text-gray-700">Filtered Claims</Text>
              </Badge>
              <Badge
                count={statistics.pendingClaims}
                showZero
                style={{ backgroundColor: '#faad14' }}
                className="custom-badge"
              >
                <Text strong className="text-gray-700">Pending</Text>
              </Badge>
              <Badge
                count={statistics.approvedClaims}
                showZero
                style={{ backgroundColor: '#52c41a' }}
                className="custom-badge"
              >
                <Text strong className="text-gray-700">Approved</Text>
              </Badge>
              <Badge
                count={`$${statistics.totalAmount.toLocaleString()}`}
                showZero
                style={{ backgroundColor: '#1890ff' }}
                className="custom-badge"
              >
                <Text strong className="text-gray-700">Total Amount</Text>
              </Badge>
            </Space>

            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowAdvancedSearch(true)}
                className="h-10 px-6"
                size="large"
              >
                Advanced Filters
              </Button>
              <TonitelButton
                icon={<DownloadOutlined />}
                onClick={() => setShowXMLModal(true)}
               
                disabled={filteredClaims.length === 0}
                size="lg"
              >
                Generate Report
              </TonitelButton>
            </Space>
          </div>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-sm rounded-xl bg-white">
          <Spin spinning={loading} size="large">
            {filteredClaims.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <FileTextOutlined className="text-4xl text-gray-300" />
                </div>
                <Text type="secondary" className="text-lg">
                  {loading ? 'Loading claims...' :
                    hasActiveFilters ? 'No claims match your search criteria' :
                      'No claims found'}
                </Text>
                {hasActiveFilters && (
                  <Button
                    type="link"
                    onClick={handleClearFilters}
                    className="mt-4"
                  >
                    Clear filters to see all claims
                  </Button>
                )}
              </div>
            ) : (
              <PatientTable
                data={filteredClaims}
                loading={loading}
                getStatusTag={getStatusTag}
                expandedRowRender={(record) => (
                  <PatientDetails record={record} handleGeneralSubmit={handleRefresh} />
                )}
              />
            )}
          </Spin>
        </Card>

        {/* Advanced Search Modal */}
        <AdvancedSearchModal
          visible={showAdvancedSearch}
          onCancel={() => setShowAdvancedSearch(false)}
          onSearch={handleAdvancedSearch}
          loading={loading}
        />

        {/* XML Generation Modal */}
        <XMLGenerationModal
          visible={showXMLModal}
          onCancel={() => setShowXMLModal(false)}
          onGenerate={handleXMLGenerate}
          loading={generatingXML}
        />
      </div>
    </div>
  );
};

export default PatientClaimsDesk;