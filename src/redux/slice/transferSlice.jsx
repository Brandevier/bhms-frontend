import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";
// Initiate Transfer
export const initiateTransfer = createAsyncThunk(
    "transfer/initiate",
    async (transferData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post("/transfers", transferData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to initiate transfer");
        }
    }
);

// Approve Transfer
export const approveTransfer = createAsyncThunk(
    "transfer/approve",
    async ({ transferId, target_institution_id }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/transfers/${transferId}/approve`, {
                target_institution_id,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to approve transfer");
        }
    }
);

// Reject Transfer
export const rejectTransfer = createAsyncThunk(
    "transfer/reject",
    async (transferId, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/transfers/${transferId}/reject`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to reject transfer");
        }
    }
);

// Transfer Patient to Another Department
export const transferPatientDepartment = createAsyncThunk(
    "transfer/departmentTransfer",
    async ({ patient_id, new_department_id }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post("/patients/transfer-department", {
                patient_id,
                new_department_id,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to transfer patient");
        }
    }
);

export const getAllInstitutions = createAsyncThunk(
    "transfer/getAllInstitutions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get("/institutions");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to get institutions");
        }
    }
)

const transferSlice = createSlice({
    name: "transfer",
    initialState: {
        transfers: [],
        loading: false,
        error: null,
        institutions: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initiateTransfer.pending, (state) => {
                state.loading = true;
            })
            .addCase(initiateTransfer.fulfilled, (state, action) => {
                state.loading = false;
                state.transfers.push(action.payload.transferRequest);
            })
            .addCase(initiateTransfer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(approveTransfer.fulfilled, (state, action) => {
                state.transfers = state.transfers.map((t) =>
                    t.id === action.payload.transferRequest.id
                        ? action.payload.transferRequest
                        : t
                );
            })

            .addCase(rejectTransfer.fulfilled, (state, action) => {
                state.transfers = state.transfers.map((t) =>
                    t.id === action.payload.transferRequest.id
                        ? action.payload.transferRequest
                        : t
                );
            })

            .addCase(transferPatientDepartment.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(transferPatientDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllInstitutions.fulfilled, (state, action) => {
                state.institutions = action.payload;
            }).addCase(getAllInstitutions.pending, (state, action) => {
                state.loading = true;


            }).addCase(getAllInstitutions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default transferSlice.reducer;
