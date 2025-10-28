import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveVisits } from '../../../redux/slice/recordSlice';

// Components
import ConsultationTable from './components/ConsultationTable';
import ConsultationHeader from './components/ConsultationHeader';

const ConsultationDepartment = () => {
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
        // Filter out patients who are on admission
        if (visit.on_admission) return false;
        
        if (!visit || !visit.patient) return false;
        
        const patient = visit.patient;
        const searchLower = searchTerm.toLowerCase();
        
        return (
          (patient.first_name?.toLowerCase().includes(searchLower)) ||
          (patient.last_name?.toLowerCase().includes(searchLower)) ||
          (patient.middle_name?.toLowerCase().includes(searchLower)) ||
          (patient.folder_number?.toLowerCase().includes(searchLower)) ||
          (visit.attendance_number?.toLowerCase().includes(searchLower))
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4">
      <div className="mx-auto flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Alert 
            message="Error Loading Consultation Data" 
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4">
      <div className=" mx-auto">
        <ConsultationHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalCount={activeVisitsData.filter(visit => !visit.on_admission).length}
          filteredCount={filteredData.length}
          data={filteredData}
        />

        <Card className="border-0 shadow-sm rounded-xl bg-white">
          {filteredData.length === 0 ? (
            <Empty
              description={
                searchTerm ? 
                  "No outpatients match your search criteria" :
                  "No outpatients in consultation queue"
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
            <ConsultationTable
              data={filteredData}
              loading={loading}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default ConsultationDepartment;