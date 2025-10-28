import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin, Alert, Divider } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDispenseHistory } from '../../../../redux/slice/prescriptionSlice';
import SearchFilters from './components/SearchFilters';
import PatientSummaryCard from './components/PatientSummaryCard';
import StatsOverview from './components/StatsOverview';
import PatientPrescriptionDetails from './components/PatientPrescriptionDetails';
import { groupPrescriptionsByPatient, filterPrescriptions } from './utils/helpers';

const { Title, Text } = Typography;

const PrescriptionDispenseHistory = () => {
  const { loading, error, prescriptions } = useSelector((state) => state.prescription);
  const dispatch = useDispatch();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [filters, setFilters] = useState({
    searchText: '',
    dateRange: [],
    status: 'all',
    department: 'all'
  });

  useEffect(() => {
    dispatch(fetchDispenseHistory());
  }, [dispatch]);

  // Filter and process data
  const filteredPrescriptions = filterPrescriptions(prescriptions || [], filters);
  const patientsData = groupPrescriptionsByPatient(filteredPrescriptions);
  const patientList = Object.values(patientsData);

  const handleExpand = (patientId) => {
    setExpandedRowKeys(prev => 
      prev.includes(patientId) 
        ? prev.filter(key => key !== patientId)
        : [...prev, patientId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Dispense History"
        description={error}
        type="error"
        showIcon
        className="m-4"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Title level={2} className="!mb-0 flex items-center">
              <MedicineBoxOutlined className="text-blue-600 mr-3" />
              Pharmacy Dispense History
            </Title>
            <Text className="text-gray-500 text-lg">
              {patientList.length} patients • {filteredPrescriptions.length} prescriptions
            </Text>
          </div>
          <Text className="text-gray-600">
            Comprehensive tracking of all medication dispensing activities
          </Text>
        </div>

        {/* Statistics Overview */}
        <StatsOverview prescriptions={prescriptions || []} />

        <Divider className="my-6" />

        {/* Search and Filters */}
        <Card className="mb-6 shadow-sm border-0">
          <SearchFilters 
            filters={filters}
            onFiltersChange={setFilters}
            totalPatients={patientList.length}
            totalPrescriptions={filteredPrescriptions.length}
          />
        </Card>

        {/* Patients List */}
        <Card 
          className="shadow-sm border-0"
          bodyStyle={{ padding: 0 }}
        >
          {patientList.length === 0 ? (
            <div className="text-center py-12">
              <MedicineBoxOutlined className="text-4xl text-gray-300 mb-4" />
              <Title level={4} className="text-gray-500">No Dispense Records Found</Title>
              <Text className="text-gray-400">
                No prescription dispense history matches your current filters.
              </Text>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {patientList.map((patientData, index) => (
                <div key={patientData.patient.id} className="hover:bg-gray-50 transition-colors">
                  {/* Patient Summary */}
                  <div className="p-6">
                    <PatientSummaryCard 
                      patientData={patientData}
                      isExpanded={expandedRowKeys.includes(patientData.patient.id)}
                      onToggleExpand={() => handleExpand(patientData.patient.id)}
                    />
                  </div>

                  {/* Expanded Prescription Details */}
                  {expandedRowKeys.includes(patientData.patient.id) && (
                    <div className="bg-blue-50 border-t border-blue-100">
                      <div className="p-6">
                        <PatientPrescriptionDetails 
                          prescriptions={patientData.prescriptions}
                          patient={patientData.patient}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pagination would go here */}
        <div className="mt-6 text-center">
          <Text className="text-gray-500">
            Showing {patientList.length} of {Object.keys(groupPrescriptionsByPatient(prescriptions?.data || [])).length} patients
          </Text>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDispenseHistory;