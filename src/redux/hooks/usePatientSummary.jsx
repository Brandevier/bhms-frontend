// redux/hooks/usePatientSummary.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  fetchInpatientOutpatientSummary, 
  fetchMonthlyInpatientOutpatient, 
  fetchDepartmentInpatientOutpatient,
  clearPatientSummary,
  clearError,
  setDepartmentFilter,
  clearFilters
} from '../slice/patientSummarySlice';

export const usePatientSummaryActions = () => {
  const dispatch = useDispatch();
  const patientSummaryState = useSelector((state) => state.patientSummary);

  const fetchSummary = useCallback(() => {
    return dispatch(fetchInpatientOutpatientSummary());
  }, [dispatch]);

  const fetchMonthlyTrend = useCallback(() => {
    return dispatch(fetchMonthlyInpatientOutpatient());
  }, [dispatch]);

  const fetchDepartmentStats = useCallback((department_id = null) => {
    return dispatch(fetchDepartmentInpatientOutpatient(department_id));
  }, [dispatch]);

  const clearSummary = useCallback(() => {
    dispatch(clearPatientSummary());
  }, [dispatch]);

  const clearSummaryError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateDepartmentFilter = useCallback((department_id) => {
    dispatch(setDepartmentFilter(department_id));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  return {
    ...patientSummaryState,
    fetchSummary,
    fetchMonthlyTrend,
    fetchDepartmentStats,
    clearSummary,
    clearSummaryError,
    updateDepartmentFilter,
    resetFilters
  };
};

// Selector hooks
export const usePatientSummary = () => useSelector((state) => state.patientSummary.summary);
export const useMonthlyTrend = () => useSelector((state) => state.patientSummary.monthlyTrend);
export const useDepartmentStats = () => useSelector((state) => state.patientSummary.departmentStats);
export const usePatientSummaryLoading = () => useSelector((state) => state.patientSummary.loading);
export const usePatientSummaryError = () => useSelector((state) => state.patientSummary.error);
export const usePatientSummaryFilters = () => useSelector((state) => state.patientSummary.filters);