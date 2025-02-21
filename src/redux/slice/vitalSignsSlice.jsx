import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import apiClient from '../middleware/apiClient';
// Define async thunks for API calls

// Fetch all vital signs records
export const fetchVitalSignsRecords = createAsyncThunk(
    'vitalSigns/fetchVitalSignsRecords',
    async ({patient_id}, { rejectWithValue,getState }) => {
        const { admin } = getState().auth
        const institution_id = admin.institution.id
        try {
            const response = await apiClient.get('/institution/patient/vitals',{
                params: {
                    patient_id,
                    institution_id
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Fetch a single vital signs record by ID
export const fetchVitalSignsRecordByPatientId = createAsyncThunk(
    'vitalSigns/fetchVitalSignsRecordById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/vital-signs/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Create a new vital signs record
export const createVitalSignsRecord = createAsyncThunk(
    'vitalSigns/createVitalSignsRecord',
    async (recordData, { rejectWithValue,getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        try {
            const response = await apiClient.post('/patient/create-vitals', {
                ...recordData,
                institution_id
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update a vital signs record
export const updateVitalSignsRecord = createAsyncThunk(
    'vitalSigns/updateVitalSignsRecord',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/institutionId/patient/update-vitals/${id}`, updatedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete a vital signs record
export const deleteVitalSignsRecord = createAsyncThunk(
    'vitalSigns/deleteVitalSignsRecord',
    async (id, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/institutions/patient/delete-vitals/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Define the initial state
const initialState = {
    records: [], // Array to store all vital signs records
    currentRecord: null, // Object to store the currently selected record
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // Store any error messages
};

// Create the slice
const vitalSignsSlice = createSlice({
    name: 'vitalSigns',
    initialState,
    reducers: {
        // Synchronous reducers (if needed)
        clearCurrentRecord(state) {
            state.currentRecord = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all records
            .addCase(fetchVitalSignsRecords.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVitalSignsRecords.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records = action.payload;
            })
            .addCase(fetchVitalSignsRecords.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Fetch a single record
            .addCase(fetchVitalSignsRecordByPatientId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVitalSignsRecordByPatientId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentRecord = action.payload;
            })
            .addCase(fetchVitalSignsRecordByPatientId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Create a new record
            .addCase(createVitalSignsRecord.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createVitalSignsRecord.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records.push(action.payload);
            })
            .addCase(createVitalSignsRecord.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Update a record
            .addCase(updateVitalSignsRecord.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateVitalSignsRecord.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.records.findIndex(record => record.id === action.payload.id);
                if (index !== -1) {
                    state.records[index] = action.payload;
                }
            })
            .addCase(updateVitalSignsRecord.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Delete a record
            .addCase(deleteVitalSignsRecord.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteVitalSignsRecord.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records = state.records.filter(record => record.id !== action.payload);
            })
            .addCase(deleteVitalSignsRecord.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

// Export actions
export const { clearCurrentRecord } = vitalSignsSlice.actions;

// Export the reducer
export default vitalSignsSlice.reducer;