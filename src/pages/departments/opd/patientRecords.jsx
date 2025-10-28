import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveVisits } from '../../../redux/slice/recordSlice';

// Components
import PatientRecordsTable from './components/PatientRecordsTable';
import SearchHeader from './components/SearchHeader';

const PatientRecords = () => {
  const dispatch = useDispatch();
  
  // Safe state access with proper fallbacks
  const recordsState = useSelector((state) => state.records);
  const activeVisitsData = recordsState?.activeVisits?.data || [];
  const loading = recordsState?.loading ?? false;
  const error = recordsState?.error;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(fetchActiveVisits());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(activeVisitsData)) {
      const filtered = activeVisitsData.filter(visit => {
        if (!visit || !visit.patient) return false;
        
        const patient = visit.patient;
        const searchLower = searchTerm.toLowerCase();

        return (
          (patient.first_name?.toLowerCase().includes(searchLower)) ||
          (patient.last_name?.toLowerCase().includes(searchLower)) ||
          (patient.folder_number?.toLowerCase().includes(searchLower)) ||
          (patient.ghana_card_number?.toLowerCase().includes(searchLower)) ||
          (visit.attendance_number?.toLowerCase().includes(searchLower)) ||
          (visit.visit_type?.toLowerCase().includes(searchLower)) ||
          (visit.department?.name?.toLowerCase().includes(searchLower))
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [searchTerm, activeVisitsData]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className=" mx-auto flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className=" mx-auto">
          <Alert 
            message="Error Loading Patient Visits" 
            description={error} 
            type="error" 
            showIcon 
            className="mb-4"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className=" mx-auto">
        <SearchHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalCount={activeVisitsData.length}
          filteredCount={filteredData.length}
        />

        <Card className="border-0 shadow-sm rounded-xl bg-white">
          {filteredData.length === 0 ? (
            <Empty
              description={
                searchTerm ? 
                  "No patient visits match your search criteria" :
                  "No active patient visits found"
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="py-12"
            >
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </Empty>
          ) : (
            <PatientRecordsTable
              data={filteredData}
              loading={loading}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default PatientRecords;