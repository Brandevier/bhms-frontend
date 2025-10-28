// Alternative version of useBedStatistics.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  fetchBedStatistics, 
  clearBedStatistics, 
  clearError, 
  setFilters, 
  clearFilters 
} from '../slice/bedStatisticsSlice';

// Main hook that returns everything
export const useBedStatisticsActions = () => {
  const dispatch = useDispatch();
  const { statistics, loading, error, filters } = useSelector((state) => state.bedStatistics);

  const fetchStatistics = useCallback((params = {}) => {
    return dispatch(fetchBedStatistics(params));
  }, [dispatch]);

  const clearStatistics = useCallback(() => {
    dispatch(clearBedStatistics());
  }, [dispatch]);

  const clearStatisticsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateFilters = useCallback((filters) => {
    dispatch(setFilters(filters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  return {
    statistics, // Now this will work
    loading,
    error,
    filters,
    fetchStatistics,
    clearStatistics,
    clearStatisticsError,
    updateFilters,
    resetFilters
  };
};

// Individual selector hooks (optional)
export const useBedStatistics = () => useSelector((state) => state.bedStatistics.statistics);
export const useBedStatisticsLoading = () => useSelector((state) => state.bedStatistics.loading);
export const useBedStatisticsError = () => useSelector((state) => state.bedStatistics.error);
export const useBedStatisticsFilters = () => useSelector((state) => state.bedStatistics.filters); 