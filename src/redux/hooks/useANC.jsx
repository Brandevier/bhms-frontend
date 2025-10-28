// redux/hooks/useANC.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  createANC, 
  updateANC, 
  deleteANC, 
  getPregnancyTimeline,
  fetchANCByVisit,
  clearANCState,
  clearError,
  setCurrentANC
} from '../slice/ancSlice';

export const useANCActions = () => {
  const dispatch = useDispatch();
  const ancState = useSelector((state) => state.anc);

  const createANCRecord = useCallback((ancData) => {
    return dispatch(createANC(ancData));
  }, [dispatch]);

  const fetchANCByVisitId = useCallback((visit_id) => {
    return dispatch(fetchANCByVisit(visit_id));
  }, [dispatch]);

  const updateANCRecord = useCallback((id, ancData) => {
    return dispatch(updateANC({ id, ancData }));
  }, [dispatch]);

  const deleteANCRecord = useCallback((id) => {
    return dispatch(deleteANC(id));
  }, [dispatch]);

  const fetchPregnancyTimeline = useCallback((visit_id) => {
    return dispatch(getPregnancyTimeline(visit_id));
  }, [dispatch]);

  const clearANC = useCallback(() => {
    dispatch(clearANCState());
  }, [dispatch]);

  const clearANCError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setCurrentANCRecord = useCallback((ancRecord) => {
    dispatch(setCurrentANC(ancRecord));
  }, [dispatch]);

  return {
    ...ancState,
    createANCRecord,
    fetchANCByVisitId,
    updateANCRecord,
    deleteANCRecord,
    fetchPregnancyTimeline,
    clearANC,
    clearANCError,
    setCurrentANCRecord
  };
};

// Selector hooks
export const useANC = () => useSelector((state) => state.anc.currentANC);
export const usePregnancyTimeline = () => useSelector((state) => state.anc.pregnancyTimeline);
export const useANCLoading = () => useSelector((state) => state.anc.loading);
export const useANCError = () => useSelector((state) => state.anc.error);
export const useANCSuccess = () => useSelector((state) => state.anc.success);