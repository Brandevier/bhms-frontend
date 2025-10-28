// redux/hooks/usePartograph.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  addPartographRecord, 
  updatePartographRecord, 
  deletePartographRecord, 
  getPartographByVisit,
  clearPartographState,
  clearError,
  setCurrentRecord
} from '../slice/partographSlice';

export const usePartographActions = () => {
  const dispatch = useDispatch();
  const partographState = useSelector((state) => state.partograph);

  const addRecord = useCallback((recordData) => {
    return dispatch(addPartographRecord(recordData));
  }, [dispatch]);

  const updateRecord = useCallback((id, recordData) => {
    return dispatch(updatePartographRecord({ id, recordData }));
  }, [dispatch]);

  const deleteRecord = useCallback((id) => {
    return dispatch(deletePartographRecord(id));
  }, [dispatch]);

  const fetchRecordsByVisit = useCallback((visit_id) => {
    return dispatch(getPartographByVisit(visit_id));
  }, [dispatch]);

  const clearPartograph = useCallback(() => {
    dispatch(clearPartographState());
  }, [dispatch]);

  const clearPartographError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setCurrentPartographRecord = useCallback((record) => {
    dispatch(setCurrentRecord(record));
  }, [dispatch]);

  return {
    ...partographState,
    addRecord,
    updateRecord,
    deleteRecord,
    fetchRecordsByVisit,
    clearPartograph,
    clearPartographError,
    setCurrentPartographRecord
  };
};

// Selector hooks
export const usePartographRecords = () => useSelector((state) => state.partograph.records);
export const useCurrentPartographRecord = () => useSelector((state) => state.partograph.currentRecord);
export const usePartographLoading = () => useSelector((state) => state.partograph.loading);
export const usePartographError = () => useSelector((state) => state.partograph.error);
export const usePartographSuccess = () => useSelector((state) => state.partograph.success);