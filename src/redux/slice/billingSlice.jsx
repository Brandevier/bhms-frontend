import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching all patient bills
export const fetchAllPatientBills = createAsyncThunk(
  "bills/fetchAll",
  async (institution_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/bills?institution_id=${institution_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating bill payment status
export const makeBillPayment = createAsyncThunk(
  "bills/makePayment",
  async ({ institution_id, patient_id, service_id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/bills/payment", {
        institution_id,
        patient_id,
        service_id,
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Redux slice
const billSlice = createSlice({
  name: "bills",
  initialState: {
    bills: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPatientBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPatientBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(fetchAllPatientBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(makeBillPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeBillPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Update the bill status in state
        const updatedBill = action.payload.data;
        state.bills = state.bills.map((bill) =>
          bill.id === updatedBill.id ? updatedBill : bill
        );
      })
      .addCase(makeBillPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default billSlice.reducer;