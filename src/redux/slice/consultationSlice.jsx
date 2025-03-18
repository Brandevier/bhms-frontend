import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';






// Async actions
export const requestConsultation = createAsyncThunk(
    'consultation/requestConsultation',
    async (record_id, { rejectWithValue,getState }) => {
        const {auth} = getState();
        const user = auth.user
        try {
            const response = await apiClient.post(`/consultation/request`, {
                record_id,
                institution_id:user.institution.id
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const approveConsultation = createAsyncThunk(
    'consultation/approveConsultation',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(`/approve/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getConsultationResults = createAsyncThunk(
    'consultation/getConsultationResults',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Slice
const consultationSlice = createSlice({
    name: 'consultation',
    initialState: {
        consultations: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(requestConsultation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestConsultation.fulfilled, (state, action) => {
                state.loading = false;
                state.consultations.push(action.payload);
            })
            .addCase(requestConsultation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(approveConsultation.pending, (state) => {
                state.loading = true;
            })
            .addCase(approveConsultation.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.consultations.findIndex(c => c.id === action.payload.consultation.id);
                if (index !== -1) {
                    state.consultations[index] = action.payload.consultation;
                }
            })
            .addCase(approveConsultation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getConsultationResults.pending, (state) => {
                state.loading = true;
            })
            .addCase(getConsultationResults.fulfilled, (state, action) => {
                state.loading = false;
                const existing = state.consultations.find(c => c.id === action.payload.consultation.id);
                if (!existing) {
                    state.consultations.push(action.payload.consultation);
                }
            })
            .addCase(getConsultationResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default consultationSlice.reducer;
