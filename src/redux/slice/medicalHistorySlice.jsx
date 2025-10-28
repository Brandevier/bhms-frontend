import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";


// Fetch all medical histories
export const fetchMedicalHistories = createAsyncThunk(
    "medicalHistory/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(``);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Fetch a single medical history
export const fetchMedicalHistoryById = createAsyncThunk(
    "medicalHistory/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Create a new medical history
export const createMedicalHistory = createAsyncThunk(
    "medicalHistory/create",
    async (historyData, { rejectWithValue,getState }) => {
        const { auth } = getState()
        const user = auth.user
        try {
            const response = await apiClient.post(`/ANC/medical-history`, {
                ...historyData,
                institution_id:user.institution.id
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update a medical history
export const updateMedicalHistory = createAsyncThunk(
    "medicalHistory/update",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`${API_URL}/${id}`, updatedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete a medical history
export const deleteMedicalHistory = createAsyncThunk(
    "medicalHistory/delete",
    async (id, { rejectWithValue }) => {
        try {
           const response =  await apiClient.delete(`/ANC/medical-history/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



const medicalHistorySlice = createSlice({
    name: "medicalHistory",
    initialState: {
        histories: [],
        selectedHistory: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedHistory: (state) => {
            state.selectedHistory = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMedicalHistories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMedicalHistories.fulfilled, (state, action) => {
                state.loading = false;
                state.histories = action.payload;
            })
            .addCase(fetchMedicalHistories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMedicalHistoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMedicalHistoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedHistory = action.payload;
            })
            .addCase(fetchMedicalHistoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createMedicalHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(createMedicalHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.histories.push(action.payload);
            })
            .addCase(createMedicalHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateMedicalHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateMedicalHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.histories = state.histories.map((history) =>
                    history.id === action.payload.id ? action.payload : history
                );
            })
            .addCase(updateMedicalHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteMedicalHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteMedicalHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.histories = state.histories.filter((history) => history.id !== action.payload);
            })
            .addCase(deleteMedicalHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSelectedHistory } = medicalHistorySlice.actions;
export default medicalHistorySlice.reducer;
