// redux/hooks/useUltrasound.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  createUltrasound, 
  getAllUltrasounds, 
  getUltrasoundById, 
  updateUltrasound, 
  deleteUltrasound, 
  getUltrasoundStats,
  clearUltrasoundState,
  clearError,
  setCurrentUltrasound
} from '../slice/ultrasoundSlice';

export const useUltrasoundActions = () => {
  const dispatch = useDispatch();
  const ultrasoundState = useSelector((state) => state.ultrasound);

  const createUltrasoundRecord = useCallback((ultrasoundData) => {
    return dispatch(createUltrasound(ultrasoundData));
  }, [dispatch]);

  const fetchAllUltrasounds = useCallback(() => {
    return dispatch(getAllUltrasounds());
  }, [dispatch]);

  const fetchUltrasoundById = useCallback((id) => {
    return dispatch(getUltrasoundById(id));
  }, [dispatch]);

  const updateUltrasoundRecord = useCallback((id, ultrasoundData) => {
    return dispatch(updateUltrasound({ id, ultrasoundData }));
  }, [dispatch]);

  const deleteUltrasoundRecord = useCallback((id) => {
    return dispatch(deleteUltrasound(id));
  }, [dispatch]);

  const fetchUltrasoundStats = useCallback((params) => {
    return dispatch(getUltrasoundStats(params));
  }, [dispatch]);

  const clearUltrasound = useCallback(() => {
    dispatch(clearUltrasoundState());
  }, [dispatch]);

  const clearUltrasoundError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setCurrentUltrasoundRecord = useCallback((record) => {
    dispatch(setCurrentUltrasound(record));
  }, [dispatch]);

  return {
    ...ultrasoundState,
    createUltrasoundRecord,
    fetchAllUltrasounds,
    fetchUltrasoundById,
    updateUltrasoundRecord,
    deleteUltrasoundRecord,
    fetchUltrasoundStats,
    clearUltrasound,
    clearUltrasoundError,
    setCurrentUltrasoundRecord
  };
};

// Selector hooks
export const useUltrasounds = () => useSelector((state) => state.ultrasound.ultrasounds);
export const useCurrentUltrasound = () => useSelector((state) => state.ultrasound.currentUltrasound);
export const useUltrasoundStats = () => useSelector((state) => state.ultrasound.stats);
export const useUltrasoundLoading = () => useSelector((state) => state.ultrasound.loading);
export const useUltrasoundError = () => useSelector((state) => state.ultrasound.error);
export const useUltrasoundSuccess = () => useSelector((state) => state.ultrasound.success);