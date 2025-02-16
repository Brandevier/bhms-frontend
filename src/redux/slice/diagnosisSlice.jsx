import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ API Base URL (ICD-10 API)
const API_URL = "https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search";

// 🔹 Async Thunk: Fetch Diagnosis Suggestions
export const searchDiagnosis = createAsyncThunk(
    "diagnosis/searchDiagnosis",
    async (query, { rejectWithValue }) => {
        try {
            if (!query) return [];

            const response = await axios.get(API_URL, {
                params: {
                    sf: "code,name",
                    terms: query
                }
            });

            // Extract codes and descriptions correctly
            const codes = response.data[1] || [];
            const descriptions = response.data[3] || [];

            // Format the data properly
            return codes.map((code, index) => ({
                code,
                description: descriptions[index] ? descriptions[index][1] : "No description available"
            }));
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch diagnoses");
        }
    }
);


// 🔹 Diagnosis Slice
const diagnosisSlice = createSlice({
    name: "diagnosis",
    initialState: {
        diagnoses: [],  // Search results
        loading: false,
        error: null
    },
    reducers: {
        clearDiagnosisResults: (state) => {
            state.diagnoses = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchDiagnosis.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchDiagnosis.fulfilled, (state, action) => {
                state.loading = false;
                state.diagnoses = action.payload;
            })
            .addCase(searchDiagnosis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export Actions & Reducer
export const { clearDiagnosisResults } = diagnosisSlice.actions;
export default diagnosisSlice.reducer;
