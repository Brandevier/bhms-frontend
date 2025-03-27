import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";



// Thunks
export const fetchAllPatientBills = createAsyncThunk(
  "bills/fetchAll",
  async (_, { rejectWithValue,getState }) => {

    const { auth } = getState()

    const user = auth.user || auth.admin


    try {
      const response = await apiClient.get(`/bills`, {
        params: { institution_id:user.institution.id },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch bills");
    }
  }
);

export const updateBillPayment = createAsyncThunk(
  "bills/updatePayment",
  async ({ institution_id, patient_id, service_id, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/bills/payment`, {
        institution_id,
        patient_id,
        service_id,
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update bill payment");
    }
  }
);

const patientBillsSlice = createSlice({
  name: "patientBills",
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
      .addCase(updateBillPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBillPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Update bill in state
        state.bills = state.bills.map((bill) =>
          bill.id === action.payload.data.id ? { ...bill, has_paid: action.payload.data.has_paid } : bill
        );
      })
      .addCase(updateBillPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default patientBillsSlice.reducer;
