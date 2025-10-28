// hooks/useANCData.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisitByType } from '../../../../../redux/slice/recordSlice';


export const useANCData = () => {
  const dispatch = useDispatch();
  const { activeVisits, loading } = useSelector((state) => state.records);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    searchText: '',
    attendanceType: 'all',
    status: 'all',
    visitType: 'Maternity',
    attendanceTypeFilter: 'New'
  });

  // Fetch data based on filters
  useEffect(() => {
    dispatch(fetchVisitByType({ 
      visit_type: filters.visitType, 
      attendance_type: filters.attendanceTypeFilter 
    }));
  }, [dispatch, filters.visitType, filters.attendanceTypeFilter]);

  // Apply filters to data
  useEffect(() => {
    let result = activeVisits || [];
    
    // Apply search filter
    if (filters.searchText) {
      result = result.filter(item => 
        item?.attendance_number?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        item?.patient?.first_name?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        item?.patient?.last_name?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        item?.patient?.folder_number?.toLowerCase().includes(filters.searchText.toLowerCase())
      );
    }
    
    // Apply attendance type filter
    if (filters.attendanceType !== 'all') {
      result = result.filter(item => item.attendance_type === filters.attendanceType);
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(item => item.status === filters.status);
    }
    
    setFilteredData(result);
  }, [activeVisits, filters]);

  // Calculate statistics
  const statistics = {
    totalPatients: activeVisits?.length || 0,
    newPatients: activeVisits?.filter(v => v.attendance_type === 'New').length || 0,
    followUpPatients: activeVisits?.filter(v => v.attendance_type === 'Follow-up').length || 0,
    activePatients: activeVisits?.filter(v => v.status === 'Active').length || 0
  };

  return {
    data: filteredData,
    loading,
    statistics,
    filters,
    setFilters
  };
};