import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  fetchFluidEntries,
  addFluidEntry,
  updateFluidEntry,
  deleteFluidEntry,
  fetchFluidBalanceSummary,
  fetchFluidSettings,
  updateFluidSettings,
  clearErrors,
  clearSuccess,
  setFilters,
  clearFilters
 } from '../slice/fluidMonitoringSlice';

export const useFluidMonitoring = () => {
  const dispatch = useDispatch();
  const fluidState = useSelector(state => state.fluidMonitoring);

  const getFluidEntries = useCallback((params) => {
    return dispatch(fetchFluidEntries(params));
  }, [dispatch]);

  const createFluidEntry = useCallback((entryData) => {
    return dispatch(addFluidEntry(entryData));
  }, [dispatch]);

  const modifyFluidEntry = useCallback((id, entryData) => {
    return dispatch(updateFluidEntry({ id, entryData }));
  }, [dispatch]);

  const removeFluidEntry = useCallback((id, voidReason) => {
    return dispatch(deleteFluidEntry({ id, voidReason }));
  }, [dispatch]);

  const getFluidBalanceSummary = useCallback((params) => {
    return dispatch(fetchFluidBalanceSummary(params));
  }, [dispatch]);

  const getFluidSettings = useCallback((params) => {
    return dispatch(fetchFluidSettings(params));
  }, [dispatch]);

  const updateSettings = useCallback((settingsData) => {
    return dispatch(updateFluidSettings(settingsData));
  }, [dispatch]);

  const resetErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const resetSuccess = useCallback(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  const applyFilters = useCallback((filters) => {
    dispatch(setFilters(filters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Helper functions
  const calculateCurrentBalance = useCallback(() => {
    if (!fluidState.currentSummary) return 0;
    return fluidState.currentSummary.net_balance || 0;
  }, [fluidState.currentSummary]);

  const getIntakeTotal = useCallback(() => {
    if (fluidState.currentSummary) {
      return fluidState.currentSummary.total_intake || 0;
    }
    return fluidState.entries.intake.reduce((total, entry) => total + (entry.amount || 0), 0);
  }, [fluidState.currentSummary, fluidState.entries.intake]);

  const getOutputTotal = useCallback(() => {
    if (fluidState.currentSummary) {
      return fluidState.currentSummary.total_output || 0;
    }
    return fluidState.entries.output.reduce((total, entry) => total + (entry.amount || 0), 0);
  }, [fluidState.currentSummary, fluidState.entries.output]);

  const getEntriesByType = useCallback((type) => {
    return type === 'intake' ? fluidState.entries.intake : fluidState.entries.output;
  }, [fluidState.entries]);

  return {
    // State
    ...fluidState,
    
    // Actions
    getFluidEntries,
    createFluidEntry,
    modifyFluidEntry,
    removeFluidEntry,
    getFluidBalanceSummary,
    getFluidSettings,
    updateSettings,
    resetErrors,
    resetSuccess,
    applyFilters,
    resetFilters,
    
    // Helpers
    calculateCurrentBalance,
    getIntakeTotal,
    getOutputTotal,
    getEntriesByType,
    
    // Derived state
    isLoading: fluidState.loading.entries || fluidState.loading.summary || fluidState.loading.action,
    hasError: Object.values(fluidState.error).some(error => error !== null),
    currentBalance: calculateCurrentBalance(),
    intakeTotal: getIntakeTotal(),
    outputTotal: getOutputTotal()
  };
};