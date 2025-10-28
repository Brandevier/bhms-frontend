// hooks/useClaimItem.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  createClaimItem,
  updateClaimItem,
  patchClaimItem,
  deleteClaimItem,
  fetchClaimItemsByClaim,
  fetchClaimItem,
  clearError,
  clearSuccess,
  clearCurrentItem,
  clearClaimItemsCache,
  resetClaimItemState
} from '../slice/claimItemSlice';

export const useClaimItem = () => {
  const dispatch = useDispatch();
  const claimItemState = useSelector((state) => state.claimItem);

  const createNewClaimItem = useCallback((claimItemData) => {
    return dispatch(createClaimItem(claimItemData));
  }, [dispatch]);

  const updateExistingClaimItem = useCallback(({ id, data }) => {
    return dispatch(updateClaimItem({ id, data }));
  }, [dispatch]);

  const patchExistingClaimItem = useCallback(({ id, data }) => {
    return dispatch(patchClaimItem({ id, data }));
  }, [dispatch]);

  const deleteExistingClaimItem = useCallback((id) => {
    return dispatch(deleteClaimItem(id));
  }, [dispatch]);

  const getClaimItemsByClaim = useCallback((claimId) => {
    return dispatch(fetchClaimItemsByClaim(claimId));
  }, [dispatch]);

  const getClaimItem = useCallback((id) => {
    return dispatch(fetchClaimItem(id));
  }, [dispatch]);

  const clearClaimItemError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearClaimItemSuccess = useCallback(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  const clearCurrentClaimItem = useCallback(() => {
    dispatch(clearCurrentItem());
  }, [dispatch]);

  const clearClaimItemsCacheData = useCallback(() => {
    dispatch(clearClaimItemsCache());
  }, [dispatch]);

  const resetClaimItem = useCallback(() => {
    dispatch(resetClaimItemState());
  }, [dispatch]);

  // Helper to get cached claim items by claim ID
  const getCachedClaimItems = useCallback((claimId) => {
    return claimItemState.claimItemsByClaim[claimId] || [];
  }, [claimItemState.claimItemsByClaim]);

  return {
    // State
    claimItems: claimItemState.items,
    currentClaimItem: claimItemState.currentItem,
    loading: claimItemState.loading,
    error: claimItemState.error,
    success: claimItemState.success,
    operation: claimItemState.operation,
    claimItemsByClaim: claimItemState.claimItemsByClaim,
    
    // Actions
    createNewClaimItem,
    updateExistingClaimItem,
    patchExistingClaimItem,
    deleteExistingClaimItem,
    getClaimItemsByClaim,
    getClaimItem,
    clearClaimItemError,
    clearClaimItemSuccess,
    clearCurrentClaimItem,
    clearClaimItemsCacheData,
    resetClaimItem,
    
    // Helpers
    getCachedClaimItems
  };
};

// Custom hook for claim item operations by type
export const useClaimItemOperations = () => {
  const {
    createNewClaimItem,
    updateExistingClaimItem,
    deleteExistingClaimItem
  } = useClaimItem();

  const createMedicationItem = useCallback((data) => {
    return createNewClaimItem({ ...data, item_type: 'Medication' });
  }, [createNewClaimItem]);

  const createLabTestItem = useCallback((data) => {
    return createNewClaimItem({ ...data, item_type: 'LabTest' });
  }, [createNewClaimItem]);

  const createDiagnosisItem = useCallback((data) => {
    return createNewClaimItem({ ...data, item_type: 'Diagnosis' });
  }, [createNewClaimItem]);

  const createProcedureItem = useCallback((data) => {
    return createNewClaimItem({ ...data, item_type: 'Procedure' });
  }, [createNewClaimItem]);

  return {
    createMedicationItem,
    createLabTestItem,
    createDiagnosisItem,
    createProcedureItem,
    updateClaimItem: updateExistingClaimItem,
    deleteClaimItem: deleteExistingClaimItem
  };
};