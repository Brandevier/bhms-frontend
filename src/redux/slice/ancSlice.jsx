// redux/slice/ancSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Async thunks
export const createANC = createAsyncThunk(
    'anc/createANC',
    async (ancData, { rejectWithValue, getState }) => {
        const { user } = getState().auth;
        ancData.auditor_id = user.id;
        ancData.institution_id = user.institution_id;
        try {
            const response = await apiClient.post('/anc/create', ancData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchANCByVisit = createAsyncThunk(
    'anc/getANCByVisit',
    async (visit_id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/anc/visit/${visit_id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateANC = createAsyncThunk(
    'anc/updateANC',
    async ({ id, ancData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/anc/update/${id}`, ancData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteANC = createAsyncThunk(
    'anc/deleteANC',
    async (id, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/anc/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getPregnancyTimeline = createAsyncThunk(
    'anc/getPregnancyTimeline',
    async (visit_id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/anc/timeline/${visit_id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const ancSlice = createSlice({
    name: 'anc',
    initialState: {
        currentANC: null,
        pregnancyTimeline: null,
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        clearANCState: (state) => {
            state.currentANC = null;
            state.pregnancyTimeline = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        setCurrentANC: (state, action) => {
            state.currentANC = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create ANC
            .addCase(createANC.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createANC.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentANC = action.payload.data;
            })
            .addCase(createANC.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create ANC record';
            })
            // Fetch ANC by Visit
            .addCase(fetchANCByVisit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchANCByVisit.fulfilled, (state, action) => {
                state.loading = false;
                state.currentANC = action.payload.data;
            })
            .addCase(fetchANCByVisit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch ANC record';
            })
            // Update ANC
            .addCase(updateANC.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateANC.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentANC = action.payload.data;
            })
            .addCase(updateANC.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update ANC record';
            })
            // Delete ANC
            .addCase(deleteANC.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteANC.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentANC = null;
            })
            .addCase(deleteANC.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete ANC record';
            })
            // Get Pregnancy Timeline
            .addCase(getPregnancyTimeline.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPregnancyTimeline.fulfilled, (state, action) => {
                state.loading = false;
                state.pregnancyTimeline = action.payload.data;
            })
            .addCase(getPregnancyTimeline.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch pregnancy timeline';
            });
    }
});

export const { clearANCState, clearError, setCurrentANC } = ancSlice.actions;
export default ancSlice.reducer;