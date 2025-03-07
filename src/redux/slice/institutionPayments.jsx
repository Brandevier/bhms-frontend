import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";


// SETUP PAYMENT DETAILS AND OTHER THINGS IN THIS SECTION OF THE APPLICATION
export const setupInstitutionAccount = createAsyncThunk(
    "payments/setupInstitutionAccount",
    async (institutionData, { rejectWithValue, getState }) => {
        const { auth } = getState();
        const user = auth.admin;

        try {
            const response = await apiClient.post(`/institution/accounts/create`, {
                ...institutionData,
                institution_id: user.institution.id, // Automatically attach institution ID
                metadata: {
                    referred_by: user.id,  // Example: Who registered the institution
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error setting up institution account");
        }
    }
);



export const initiatePaymentToInstitution = createAsyncThunk(
    "payments/initiatePaymentToInstitution",
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/initiate`, paymentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error initiating payment");
        }
    }
);


export const verifyPayment = createAsyncThunk(
    "payments/verifyPayment",
    async (reference, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/verify`, { reference });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error verifying payment");
        }
    }
);


// Slice
const paymentSlice = createSlice({
    name: "payments",
    initialState: {
        institutionAccount: null,
        payment: null,
        verification: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetPaymentState: (state) => {
            state.payment = null;
            state.verification = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Setup Institution Account
            .addCase(setupInstitutionAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setupInstitutionAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.institutionAccount = action.payload;
            })
            .addCase(setupInstitutionAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Initiate Payment
            .addCase(initiatePaymentToInstitution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initiatePaymentToInstitution.fulfilled, (state, action) => {
                state.loading = false;
                state.payment = action.payload;
            })
            .addCase(initiatePaymentToInstitution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Verify Payment
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.verification = action.payload;
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
