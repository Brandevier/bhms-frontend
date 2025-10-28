// hooks/useLeave.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  requestLeave,
  reviewLeave,
  updateLeave,
  fetchMyLeaves,
  fetchLeaveBalance,
  clearError,
  clearSuccess,
  resetLeaveState,
} from '../slice/leaveSlice';

export const useLeave = () => {
  const dispatch = useDispatch();
  const leaveState = useSelector((state) => state.leave);

  const requestNewLeave = useCallback((leaveData) => {
    return dispatch(requestLeave(leaveData));
  }, [dispatch]);

  const reviewLeaveRequest = useCallback(({ leaveId, status }) => {
    return dispatch(reviewLeave({ leaveId, status }));
  }, [dispatch]);

  const updateLeaveRequest = useCallback(({ leaveId, updateData }) => {
    return dispatch(updateLeave({ leaveId, updateData }));
  }, [dispatch]);

  const getMyLeaves = useCallback(() => {
    return dispatch(fetchMyLeaves());
  }, [dispatch]);

  const getLeaveBalance = useCallback(() => {
    return dispatch(fetchLeaveBalance());
  }, [dispatch]);

  const clearLeaveError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearLeaveSuccess = useCallback(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  const resetLeave = useCallback(() => {
    dispatch(resetLeaveState());
  }, [dispatch]);

  return {
    // State
    leaves: leaveState.leaves,
    leaveBalance: leaveState.leaveBalance,
    loading: leaveState.loading,
    error: leaveState.error,
    success: leaveState.success,
    currentAction: leaveState.currentAction,
    
    // Actions
    requestNewLeave,
    reviewLeaveRequest,
    updateLeaveRequest,
    getMyLeaves,
    getLeaveBalance,
    clearLeaveError,
    clearLeaveSuccess,
    resetLeave,
  };
};

// Optional: Custom hook for specific leave operations
export const useLeaveOperations = () => {
  const { reviewLeaveRequest, updateLeaveRequest } = useLeave();

  const approveLeave = useCallback((leaveId) => {
    return reviewLeaveRequest({ leaveId, status: 'approved' });
  }, [reviewLeaveRequest]);

  const rejectLeave = useCallback((leaveId) => {
    return reviewLeaveRequest({ leaveId, status: 'rejected' });
  }, [reviewLeaveRequest]);

  return {
    approveLeave,
    rejectLeave,
    updateLeave: updateLeaveRequest,
  };
};