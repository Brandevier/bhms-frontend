import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from "../middleware/apiClient";


const API_URL = "https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search";

// 🔹 Fetch Diagnosis Suggestions
export const searchDiagnosis = createAsyncThunk(
    "diagnosis/searchDiagnosis",
    async (query, { rejectWithValue }) => {
        try {
            if (!query) return [];

            const response = await axios.get(API_URL, {
                params: { sf: "code,name", terms: query },
            });
            const codes = response.data[1] || [];
            const descriptions = response.data[3] || [];

            return codes.map((code, index) => ({
                code,
                description: descriptions[index]?.[1] || "No description available",
            }));
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch diagnoses");
        }
    }
);

// 🔹 Add New Diagnosis
export const addDiagnosis = createAsyncThunk(
    "diagnosis/addDiagnosis",
    async (diagnosisData, { rejectWithValue,getState }) => {
        const { auth } = getState()
        const user = auth.user
        try {
            const response = await apiClient.post(`/diagnosis/patient-diagnoses/add-diagnosis`, {
                ...diagnosisData,
                institution_id:user.institution.id,
                staff_id:user.id

            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add diagnosis");
        }
    }
);

// 🔹 Get Patient Diagnosis
export const getPatientDiagnosis = createAsyncThunk(
    "diagnosis/getPatientDiagnosis",
    async ({ patient_id, institution_id }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`${BASE_URL}/patient`, {
                params: { patient_id, institution_id },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch patient diagnosis");
        }
    }
);

// 🔹 Update Diagnosis
export const updateDiagnosis = createAsyncThunk(
    "diagnosis/updateDiagnosis",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`${BASE_URL}/update/${id}`, updatedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update diagnosis");
        }
    }
);

// 🔹 Delete Diagnosis
export const deleteDiagnosis = createAsyncThunk(
    "diagnosis/deleteDiagnosis",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${BASE_URL}/delete/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete diagnosis");
        }
    }
);

// Diagnosis Slice
const diagnosisSlice = createSlice({
    name: "diagnosis",
    initialState: {
        diagnoses: [],
        loading: false,
        addDiagnosisStatus:false,
        error: null,
    },
    reducers: {
        clearDiagnosisResults: (state) => {
            state.diagnoses = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchDiagnosis.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchDiagnosis.fulfilled, (state, action) => {
                state.loading = false;
                state.diagnoses = action.payload;
            })
            .addCase(searchDiagnosis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addDiagnosis.fulfilled, (state, action) => {
                state.diagnoses.push(action.payload);
                state.addDiagnosisStatus = false;
            }).addCase(addDiagnosis.pending,(state,action)=>{
                state.addDiagnosisStatus = true;
            }).addCase(addDiagnosis.rejected,(state,action)=>{
                state.addDiagnosisStatus = false
            })
            .addCase(getPatientDiagnosis.fulfilled, (state, action) => {
                state.diagnoses = action.payload;
            })
            .addCase(updateDiagnosis.fulfilled, (state, action) => {
                state.diagnoses = state.diagnoses.map(diagnosis =>
                    diagnosis.id === action.payload.id ? action.payload : diagnosis
                );
            })
            .addCase(deleteDiagnosis.fulfilled, (state, action) => {
                state.diagnoses = state.diagnoses.filter(diagnosis => diagnosis.id !== action.payload);
            });
    },
});

export const { clearDiagnosisResults } = diagnosisSlice.actions;
export default diagnosisSlice.reducer;
