// redux/hooks/useStaffDepartment.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  assignDepartmentsToStaff, 
  getDepartmentsForStaff, 
  updateDepartmentsForStaff, 
  removeDepartmentFromStaff,
  clearStaffDepartmentState,
  clearError,
  clearSuccess,
  setCurrentStaffDepartments
} from '../slice/staffDepartmentSlice';

export const useStaffDepartmentActions = () => {
  const dispatch = useDispatch();
  const staffDepartmentState = useSelector((state) => state.staffDepartment);

  const assignStaffDepartments = useCallback(({ staff_id, department_ids }) => {
    return dispatch(assignDepartmentsToStaff({ staff_id, department_ids }));
  }, [dispatch]);

  const fetchStaffDepartments = useCallback((staff_id) => {
    return dispatch(getDepartmentsForStaff(staff_id));
  }, [dispatch]);

  const updateStaffDepartments = useCallback(({ staff_id, department_ids }) => {
    return dispatch(updateDepartmentsForStaff({ staff_id, department_ids }));
  }, [dispatch]);

  const removeStaffDepartment = useCallback(({ staff_id, department_id }) => {
    return dispatch(removeDepartmentFromStaff({ staff_id, department_id }));
  }, [dispatch]);

  const clearStaffDepartment = useCallback(() => {
    dispatch(clearStaffDepartmentState());
  }, [dispatch]);

  const clearStaffDepartmentError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearStaffDepartmentSuccess = useCallback(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  const setStaffDepartments = useCallback((departments) => {
    dispatch(setCurrentStaffDepartments(departments));
  }, [dispatch]);

  return {
    ...staffDepartmentState,
    assignStaffDepartments,
    fetchStaffDepartments,
    updateStaffDepartments,
    removeStaffDepartment,
    clearStaffDepartment,
    clearStaffDepartmentError,
    clearStaffDepartmentSuccess,
    setStaffDepartments
  };
};

// Selector hooks
export const useStaffDepartments = () => useSelector((state) => state.staffDepartment.currentStaffDepartments);
export const useStaffDepartmentLoading = () => useSelector((state) => state.staffDepartment.loading);
export const useStaffDepartmentError = () => useSelector((state) => state.staffDepartment.error);
export const useStaffDepartmentSuccess = () => useSelector((state) => state.staffDepartment.success);
export const useStaffDepartmentOperation = () => useSelector((state) => state.staffDepartment.operation);