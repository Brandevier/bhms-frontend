import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Define the initial state
const initialState = {
    records: [], // Array to store all records
    currentRecord: null, // Object to store the currently selected record
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // Store any error messages
};

// Define async thunks for API calls

// Fetch all records for an institution
export const fetchRecordsByInstitution = createAsyncThunk(
    'records/fetchRecordsByInstitution',
    async (_, { rejectWithValue,getState }) => {
        const { admin,user } = getState().auth
        const institutionId = admin ? admin.institution.id : user.institution.id
        try {
            const response = await apiClient.get(`/records/institution`,{
                params:{
                    'institution_id':institutionId,
                }
            });
            return response.data;
        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data);
        }
    }
);

// Fetch a single record by patient ID and institution ID
export const fetchRecordByPatient = createAsyncThunk(
    'records/fetchRecordByPatient',
    async ({ record_id }, { rejectWithValue ,getState}) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        try {
            const response = await apiClient.get(`/records/institution/patient/get-patient-details`,{
                params:{
                    'institution_id':user.institution.id,
                    'record_id':record_id
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Create a new record
export const createRecord = createAsyncThunk(
    'records/createRecord',
    async (recordData, { rejectWithValue,getState }) => {
        const { admin } = getState().auth
        try {
            const response = await apiClient.post('/records/institution/patient/create', {
                ...recordData,
                institution_id: admin.institution.id,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update a record
export const updateRecord = createAsyncThunk(
    'records/updateRecord',
    async ({ recordId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/api/records/${recordId}`, updatedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete a record
export const deleteRecord = createAsyncThunk(
    'records/deleteRecord',
    async (recordId, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/api/records/${recordId}`);
            return recordId;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Create the slice
const recordSlice = createSlice({
    name: 'records',
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
            .addCase(fetchRecordsByInstitution.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRecordsByInstitution.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records = action.payload;
            })
            .addCase(fetchRecordsByInstitution.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Fetch a single record
            .addCase(fetchRecordByPatient.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRecordByPatient.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentRecord = action.payload;
            })
            .addCase(fetchRecordByPatient.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Create a new record
            .addCase(createRecord.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createRecord.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records.push(action.payload);
            })
            .addCase(createRecord.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Update a record
            .addCase(updateRecord.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateRecord.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.records.findIndex(record => record.id === action.payload.id);
                if (index !== -1) {
                    state.records[index] = action.payload;
                }
            })
            .addCase(updateRecord.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Delete a record
            .addCase(deleteRecord.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteRecord.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records = state.records.filter(record => record.id !== action.payload);
            })
            .addCase(deleteRecord.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

// Export actions
export default recordSlice.reducer;