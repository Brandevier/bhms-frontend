// hooks/useAccounts.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOutstandingPayments,
  fetchNHIAClaims,
  fetchPatientCollections,
  fetchDepartmentRevenue,
  fetchServiceTypeRevenue,
  fetchStaffBilling,
  fetchAgingReport,
  fetchPatientBillsAndInvoices,
  fetchDashboard,
  clearAccountsError,
  clearPatientBills,
  selectOutstandingPayments,
  selectNHIAClaims,
  selectPatientCollections,
  selectDepartmentRevenue,
  selectServiceTypeRevenue,
  selectStaffBilling,
  selectAgingReport,
  selectPatientBills,
  selectDashboard,
  selectAccountsLoading,
  markBillAsPaid
} from '../slice/accountsSlice';

export const useAccounts = () => {
  const dispatch = useDispatch();


  // Selectors
  const outstandingPayments = useSelector(selectOutstandingPayments);
  const nhiaClaims = useSelector(selectNHIAClaims);
  const patientCollections = useSelector(selectPatientCollections);
  const departmentRevenue = useSelector(selectDepartmentRevenue);
  const serviceTypeRevenue = useSelector(selectServiceTypeRevenue);
  const staffBilling = useSelector(selectStaffBilling);
  const agingReport = useSelector(selectAgingReport);
  const dashboard = useSelector(selectDashboard);
  const isLoading = useSelector(selectAccountsLoading);

  // Helper function to get patient bills by visit ID
  const getPatientBills = (visitId) => useSelector(state => selectPatientBills(state, visitId));

  // Action creators
  const getOutstandingPayments = useCallback(() => {
    return dispatch(fetchOutstandingPayments());
  }, [dispatch]);

  // inside useAccounts
  const payBill = useCallback((bill_id, data) => {
    return dispatch(markBillAsPaid({ bill_id, data }));
  }, [dispatch]);



  const getNHIAClaims = useCallback(() => {
    return dispatch(fetchNHIAClaims());
  }, [dispatch]);

  const getPatientCollections = useCallback(() => {
    return dispatch(fetchPatientCollections());
  }, [dispatch]);

  const getDepartmentRevenue = useCallback(() => {
    return dispatch(fetchDepartmentRevenue());
  }, [dispatch]);

  const getServiceTypeRevenue = useCallback(() => {
    return dispatch(fetchServiceTypeRevenue());
  }, [dispatch]);

  const getStaffBilling = useCallback(() => {
    return dispatch(fetchStaffBilling());
  }, [dispatch]);

  const getAgingReport = useCallback(() => {
    return dispatch(fetchAgingReport());
  }, [dispatch]);

  const getPatientBillsAndInvoices = useCallback((visitId) => {
    return dispatch(fetchPatientBillsAndInvoices(visitId));
  }, [dispatch]);

  const getDashboard = useCallback(() => {
    return dispatch(fetchDashboard());
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch(clearAccountsError());
  }, [dispatch]);

  const clearPatientBillsData = useCallback((visitId) => {
    dispatch(clearPatientBills(visitId));
  }, [dispatch]);



  // Check if any specific section is loading
  const isSectionLoading = useCallback((section) => {
    switch (section) {
      case 'outstanding':
        return outstandingPayments.loading;
      case 'nhia':
        return nhiaClaims.loading;
      case 'collections':
        return patientCollections.loading;
      case 'department':
        return departmentRevenue.loading;
      case 'service':
        return serviceTypeRevenue.loading;
      case 'staff':
        return staffBilling.loading;
      case 'aging':
        return agingReport.loading;
      case 'dashboard':
        return dashboard.loading;
      default:
        return isLoading;
    }
  }, [
    outstandingPayments.loading,
    nhiaClaims.loading,
    patientCollections.loading,
    departmentRevenue.loading,
    serviceTypeRevenue.loading,
    staffBilling.loading,
    agingReport.loading,
    dashboard.loading,
    isLoading
  ]);

  // Check if any specific section has error
  const hasSectionError = useCallback((section) => {
    switch (section) {
      case 'outstanding':
        return !!outstandingPayments.error;
      case 'nhia':
        return !!nhiaClaims.error;
      case 'collections':
        return !!patientCollections.error;
      case 'department':
        return !!departmentRevenue.error;
      case 'service':
        return !!serviceTypeRevenue.error;
      case 'staff':
        return !!staffBilling.error;
      case 'aging':
        return !!agingReport.error;
      case 'dashboard':
        return !!dashboard.error;
      default:
        return false;
    }
  }, [
    outstandingPayments.error,
    nhiaClaims.error,
    patientCollections.error,
    departmentRevenue.error,
    serviceTypeRevenue.error,
    staffBilling.error,
    agingReport.error,
    dashboard.error
  ]);

  // Get error message for specific section
  const getSectionError = useCallback((section) => {
    switch (section) {
      case 'outstanding':
        return outstandingPayments.error;
      case 'nhia':
        return nhiaClaims.error;
      case 'collections':
        return patientCollections.error;
      case 'department':
        return departmentRevenue.error;
      case 'service':
        return serviceTypeRevenue.error;
      case 'staff':
        return staffBilling.error;
      case 'aging':
        return agingReport.error;
      case 'dashboard':
        return dashboard.error;
      default:
        return null;
    }
  }, [
    outstandingPayments.error,
    nhiaClaims.error,
    patientCollections.error,
    departmentRevenue.error,
    serviceTypeRevenue.error,
    staffBilling.error,
    agingReport.error,
    dashboard.error
  ]);

  return {
    // State
    outstandingPayments,
    nhiaClaims,
    patientCollections,
    departmentRevenue,
    serviceTypeRevenue,
    staffBilling,
    agingReport,
    dashboard,
    isLoading,

    // Actions
    getOutstandingPayments,
    getNHIAClaims,
    getPatientCollections,
    getDepartmentRevenue,
    getServiceTypeRevenue,
    getStaffBilling,
    getAgingReport,
    getPatientBillsAndInvoices,
    getDashboard,
    clearErrors,
    clearPatientBillsData,
    payBill, // ✅ exposed

    // Helpers
    getPatientBills,
    isSectionLoading,
    hasSectionError,
    getSectionError
  };
};

// Individual specialized hooks for better tree-shaking
export const useOutstandingPayments = () => {
  const { outstandingPayments, getOutstandingPayments, isSectionLoading, hasSectionError, getSectionError, payBill } = useAccounts();

  return {
    data: outstandingPayments.data,
    loading: isSectionLoading('outstanding'),
    error: hasSectionError('outstanding') ? getSectionError('outstanding') : null,
    refetch: getOutstandingPayments,
    payBill
  };
};

export const useNHIAClaims = () => {
  const { nhiaClaims, getNHIAClaims, isSectionLoading, hasSectionError, getSectionError } = useAccounts();
  return {
    data: nhiaClaims.data,
    loading: isSectionLoading('nhia'),
    error: hasSectionError('nhia') ? getSectionError('nhia') : null,
    refetch: getNHIAClaims
  };
};

export const usePatientCollections = () => {
  const { patientCollections, getPatientCollections, isSectionLoading, hasSectionError, getSectionError } = useAccounts();
  return {
    data: patientCollections.data,
    loading: isSectionLoading('collections'),
    error: hasSectionError('collections') ? getSectionError('collections') : null,
    refetch: getPatientCollections
  };
};

export const useDepartmentRevenue = () => {
  const { departmentRevenue, getDepartmentRevenue, isSectionLoading, hasSectionError, getSectionError } = useAccounts();
  return {
    data: departmentRevenue.data,
    loading: isSectionLoading('department'),
    error: hasSectionError('department') ? getSectionError('department') : null,
    refetch: getDepartmentRevenue
  };
};

export const useServiceTypeRevenue = () => {
  const { serviceTypeRevenue, getServiceTypeRevenue, isSectionLoading, hasSectionError, getSectionError } = useAccounts();
  return {
    data: serviceTypeRevenue.data,
    loading: isSectionLoading('service'),
    error: hasSectionError('service') ? getSectionError('service') : null,
    refetch: getServiceTypeRevenue
  };
};

export const useStaffBilling = () => {
  const { staffBilling, getStaffBilling, isSectionLoading, hasSectionError, getSectionError } = useAccounts();
  return {
    data: staffBilling.data,
    loading: isSectionLoading('staff'),
    error: hasSectionError('staff') ? getSectionError('staff') : null,
    refetch: getStaffBilling
  };
};

export const useAgingReport = () => {
  const { agingReport, getAgingReport, isSectionLoading, hasSectionError, getSectionError } = useAccounts();
  return {
    data: agingReport.data,
    loading: isSectionLoading('aging'),
    error: hasSectionError('aging') ? getSectionError('aging') : null,
    refetch: getAgingReport
  };
};

export const usePatientBills = (visitId) => {
  const { getPatientBills, getPatientBillsAndInvoices, clearPatientBillsData, isSectionLoading } = useAccounts();
  const billsData = getPatientBills(visitId);

  return {
    data: billsData,
    loading: isSectionLoading('patient'),
    refetch: () => getPatientBillsAndInvoices(visitId),
    clear: () => clearPatientBillsData(visitId)
  };
};

export const useDashboard = () => {
  const { dashboard, getDashboard, isSectionLoading, hasSectionError, getSectionError } = useAccounts();
  return {
    data: dashboard.data,
    loading: isSectionLoading('dashboard'),
    error: hasSectionError('dashboard') ? getSectionError('dashboard') : null,
    refetch: getDashboard
  };
};

