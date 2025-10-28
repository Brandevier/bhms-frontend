// hooks/useFaceRecognition.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  registerFace,
  verifyStaffFace,
  identifyStaffByFace,
  getAttendanceByDepartment,
  getAttendanceByDateRange,
  clearFaceRecognitionError,
  clearFaceRecognitionData,
  resetFaceRecognition,
  selectFaceRegistration,
  selectFaceVerification,
  selectFaceIdentification,
  selectDepartmentAttendance,
  selectFaceRecognitionLoading,
} from '../slice/faceRecognitionSlice';

export const useFaceRecognition = () => {
  const dispatch = useDispatch();

  // Selectors
  const registration = useSelector(selectFaceRegistration);
  const verification = useSelector(selectFaceVerification);
  const identification = useSelector(selectFaceIdentification);
  const attendance = useSelector(selectDepartmentAttendance);
  const isLoading = useSelector(selectFaceRecognitionLoading);

  // Actions
  const registerStaffFace = useCallback(({ staffId, faceImages }) => {
    return dispatch(registerFace({ staffId, faceImages }));
  }, [dispatch]);

  const verifyFace = useCallback(({ staffId, faceImage }) => {
    return dispatch(verifyStaffFace({ staffId, faceImage }));
  }, [dispatch]);

  const identifyFace = useCallback((faceImage) => {
    return dispatch(identifyStaffByFace(faceImage));
  }, [dispatch]);

  const fetchDepartmentAttendance = useCallback(({ department_id, start_date, end_date, status, limit, offset }) => {
    return dispatch(getAttendanceByDepartment({ 
      department_id, 
      start_date, 
      end_date, 
      status, 
      limit, 
      offset 
    }));
  }, [dispatch]);

  const fetchAttendanceByDateRange = useCallback(({ department_id, start_date, end_date }) => {
    return dispatch(getAttendanceByDateRange({ department_id, start_date, end_date }));
  }, [dispatch]);

  const clearErrors = useCallback((type) => {
    dispatch(clearFaceRecognitionError(type ? { type } : undefined));
  }, [dispatch]);

  const clearData = useCallback((type) => {
    dispatch(clearFaceRecognitionData(type ? { type } : undefined));
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(resetFaceRecognition());
  }, [dispatch]);

  // Helper functions
  const isRegistrationSuccessful = useCallback(() => {
    return registration.data?.success === true;
  }, [registration.data]);

  const isVerificationSuccessful = useCallback(() => {
    return verification.data?.success === true;
  }, [verification.data]);

  const isIdentificationSuccessful = useCallback(() => {
    return identification.data?.success === true;
  }, [identification.data]);

  const getMatchedStaffId = useCallback(() => {
    return identification.data?.matchedStaffId || verification.data?.staffId;
  }, [identification.data, verification.data]);

  const getConfidenceScore = useCallback(() => {
    const data = identification.data || verification.data;
    if (!data?.bestDistance) return null;
    
    // Convert distance to confidence percentage (0-100%)
    const normalized = Math.max(0, 1 - (data.bestDistance / (data.threshold || 0.6)));
    return Math.round(normalized * 100);
  }, [identification.data, verification.data]);

  // Attendance helpers
  const getAttendanceStatistics = useCallback(() => {
    return attendance.data?.statistics || {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      attendance_rate: 0
    };
  }, [attendance.data]);

  const getAttendanceData = useCallback(() => {
    return attendance.data?.data || [];
  }, [attendance.data]);

  const getAttendanceFilters = useCallback(() => {
    return attendance.data?.filters || {};
  }, [attendance.data]);

  const getAttendancePagination = useCallback(() => {
    return attendance.data?.pagination || {
      total: 0,
      limit: 100,
      offset: 0,
      hasMore: false
    };
  }, [attendance.data]);

  const hasMoreAttendanceData = useCallback(() => {
    return getAttendancePagination().hasMore;
  }, [getAttendancePagination]);

  const loadMoreAttendance = useCallback(() => {
    const pagination = getAttendancePagination();
    const filters = getAttendanceFilters();
    
    if (hasMoreAttendanceData()) {
      return fetchDepartmentAttendance({
        ...filters,
        offset: pagination.offset + pagination.limit
      });
    }
  }, [getAttendancePagination, getAttendanceFilters, hasMoreAttendanceData, fetchDepartmentAttendance]);

  return {
    // State
    registration,
    verification,
    identification,
    attendance,
    isLoading,
    
    // Actions
    registerStaffFace,
    verifyFace,
    identifyFace,
    fetchDepartmentAttendance,
    fetchAttendanceByDateRange,
    clearErrors,
    clearData,
    reset,
    
    // Helpers
    isRegistrationSuccessful,
    isVerificationSuccessful,
    isIdentificationSuccessful,
    getMatchedStaffId,
    getConfidenceScore,
    
    // Attendance helpers
    getAttendanceStatistics,
    getAttendanceData,
    getAttendanceFilters,
    getAttendancePagination,
    hasMoreAttendanceData,
    loadMoreAttendance,
  };
};

// Specialized hooks for individual operations
export const useFaceRegistration = () => {
  const { registration, registerStaffFace, clearErrors, clearData, isRegistrationSuccessful } = useFaceRecognition();
  
  return {
    data: registration.data,
    loading: registration.loading,
    error: registration.error,
    register: registerStaffFace,
    clearError: () => clearErrors('register'),
    clearData: () => clearData('register'),
    isSuccessful: isRegistrationSuccessful,
  };
};

export const useFaceVerification = () => {
  const { verification, verifyFace, clearErrors, clearData, isVerificationSuccessful, getConfidenceScore } = useFaceRecognition();
  
  return {
    data: verification.data,
    loading: verification.loading,
    error: verification.error,
    verify: verifyFace,
    clearError: () => clearErrors('verify'),
    clearData: () => clearData('verify'),
    isSuccessful: isVerificationSuccessful,
    confidence: getConfidenceScore(),
  };
};

export const useFaceIdentification = () => {
  const { identification, identifyFace, clearErrors, clearData, isIdentificationSuccessful, getMatchedStaffId, getConfidenceScore } = useFaceRecognition();
  
  return {
    data: identification.data,
    loading: identification.loading,
    error: identification.error,
    identify: identifyFace,
    clearError: () => clearErrors('identify'),
    clearData: () => clearData('identify'),
    isSuccessful: isIdentificationSuccessful,
    matchedStaffId: getMatchedStaffId(),
    confidence: getConfidenceScore(),
  };
};

export const useDepartmentAttendance = () => {
  const { 
    attendance, 
    fetchDepartmentAttendance, 
    fetchAttendanceByDateRange, 
    clearErrors, 
    clearData,
    getAttendanceStatistics,
    getAttendanceData,
    getAttendanceFilters,
    getAttendancePagination,
    hasMoreAttendanceData,
    loadMoreAttendance
  } = useFaceRecognition();
  
  return {
    data: attendance.data,
    loading: attendance.loading,
    error: attendance.error,
    fetchAttendance: fetchDepartmentAttendance,
    fetchByDateRange: fetchAttendanceByDateRange,
    clearError: () => clearErrors('attendance'),
    clearData: () => clearData('attendance'),
    
    // Helpers
    statistics: getAttendanceStatistics(),
    attendanceData: getAttendanceData(),
    filters: getAttendanceFilters(),
    pagination: getAttendancePagination(),
    hasMore: hasMoreAttendanceData(),
    loadMore: loadMoreAttendance,
  };
};