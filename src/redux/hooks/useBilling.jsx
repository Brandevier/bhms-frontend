import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchBillingStats,
  fetchRecentTransactions,
  createServiceBill,
  fetchServiceBillsByVisit, 
  clearError,
  clearServiceBills
} from '../slice/billingSlice';

// import { fetchBillingStats } from '../slice/billingSlice';



export const useBilling = () => {
  const dispatch = useDispatch();
  const { 
    stats,
    recentTransactions,
    serviceBills,
    loading,
    error
  } = useSelector((state) => state.billing);

  const getBillingStats = useCallback((params) => {
    return dispatch(fetchBillingStats(params));
  }, [dispatch]);

  const getRecentTransactions = useCallback((params) => {
    return dispatch(fetchRecentTransactions(params));
  }, [dispatch]);

  const addServiceBill = useCallback((serviceBillData) => {
    return dispatch(createServiceBill(serviceBillData));
  }, [dispatch]);

  const getServiceBillsByVisit = useCallback((visitId) => {
    return dispatch(fetchServiceBillsByVisit(visitId));
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetServiceBills = useCallback(() => {
    dispatch(clearServiceBills());
  }, [dispatch]);

  return {
    stats,
    recentTransactions,
    serviceBills,
    loading,
    error,
    getBillingStats,
    getRecentTransactions,
    addServiceBill,
    getServiceBillsByVisit,
    resetError,
    resetServiceBills
  };
};