import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchInvoices,
  fetchInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  clearError,
  clearCurrentInvoice,
  setPagination 
} from '../slice/invoiceSlice';

export const useInvoices = () => {
  const dispatch = useDispatch();
  const {
    invoices,
    currentInvoice,
    loading,
    error,
    pagination
  } = useSelector((state) => state.invoices);

  const getInvoices = useCallback((params) => {
    return dispatch(fetchInvoices(params));
  }, [dispatch]);

  const getInvoiceById = useCallback((id) => {
    return dispatch(fetchInvoiceById(id));
  }, [dispatch]);

  const addInvoice = useCallback((invoiceData) => {
    return dispatch(createInvoice(invoiceData));
  }, [dispatch]);

  const editInvoice = useCallback((id, data) => {
    return dispatch(updateInvoice({ id, data }));
  }, [dispatch]);

  const removeInvoice = useCallback((id) => {
    return dispatch(deleteInvoice(id));
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetCurrentInvoice = useCallback(() => {
    dispatch(clearCurrentInvoice());
  }, [dispatch]);

  const updatePagination = useCallback((newPagination) => {
    dispatch(setPagination(newPagination));
  }, [dispatch]);

  return {
    invoices,
    currentInvoice,
    loading,
    error,
    pagination,
    getInvoices,
    getInvoiceById,
    addInvoice,
    editInvoice,
    removeInvoice,
    resetError,
    resetCurrentInvoice,
    updatePagination
  };
};