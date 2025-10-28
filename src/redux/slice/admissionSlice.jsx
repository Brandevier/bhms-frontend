import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";

// ✅ Admit a Patient
export const admitPatient = createAsyncThunk("admissions/admit", async (admissionData, { rejectWithValue, getState }) => {
    const { auth } = getState()

    const user = auth.user


    try {
        const response = await apiClient.post(`/admission/create-new-admission`, {
            ...admissionData,
            staff_id: user.id,
            institution_id: user.institution.id
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// ✅ Discharge a Patient
export const dischargePatient = createAsyncThunk("admissions/discharge", async (dischargeData, { rejectWithValue }) => {
    try {
        const response = await apiClient.post(`/discharge`, dischargeData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// ✅ Get All Admissions in an Institution (optionally filtered by department)
export const fetchAdmissions = createAsyncThunk(
    "admissions/fetchAll",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState();
        const user = auth.user || auth.admin;

        const department_id = localStorage.getItem('department_id')

        try {
            const params = {
                institution_id: user.institution.id,
                department_id:  department_id
            };

            const response = await apiClient.get(`/admission/institution/department/all-admissions`, { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ✅ Update Patient Condition Status
export const updateConditionStatus = createAsyncThunk("admissions/updateCondition", async (conditionData, { rejectWithValue }) => {
    try {
        const response = await apiClient.put(`/condition`, conditionData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// ✅ Transfer a Patient to Another Department
export const transferPatient = createAsyncThunk("admissions/transfer", async (transferData, { rejectWithValue }) => {
    try {
        const response = await apiClient.post(`/transfer`, transferData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// ✅ Reassign a Bed
export const reassignBed = createAsyncThunk("admissions/reassignBed", async (bedData, { rejectWithValue }) => {
    try {
        const response = await apiClient.put(`/reassign-bed`, bedData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// ✅ Transfer Patient to a Different Institution
export const transferPatientToInstitution = createAsyncThunk("admissions/transferInstitution", async (transferData, { rejectWithValue }) => {
    try {
        const response = await apiClient.post(`/transfer-institution`, transferData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


// Get all admited patient in an institution

export const getAdmitedPatient = createAsyncThunk("admission/admittedPatient", async (_, { rejectWithValue, getState }) => {
    try {
        const { auth } = getState()
        const user = auth.admin || auth.user

        const response = await apiClient.get('/get-admitted-patients', {
            params: {
                institution_id: user.institution.id

            }
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

// ✅ Update Admission_status
export const updateAdmissionStatus = createAsyncThunk("admissions/updateAdmissionStatus", async (statusData, { rejectWithValue }) => {
    try {
        const response = await apiClient.put(`/admission/update-admission-status`, statusData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// get all admissions by departments
export const getAllAdmissionsByDepartment = createAsyncThunk("admissions/getAllByDepartment", async (department_id, { rejectWithValue, getState }) => {
    try {
        const { auth } = getState()
        const user = auth.admin || auth.user

        const response = await apiClient.get('/admission/institution/department/all-admissions', {
            params: {
                institution_id: user.institution.id,
                department_id: department_id
                
            }
        })
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.response.data);
    }
})


// 🔹 Initial State
const initialState = {
    admissions: [],
    admissionDetails: null,
    admissionStatus: null,
    loading: false,
    error: null,
};

// 🔹 Slice Definition
const admissionSlice = createSlice({
    name: "admissions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(admitPatient.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(admitPatient.fulfilled, (state, action) => {
                state.loading = false;
                state.admissions.push(action.payload);
            })
            .addCase(admitPatient.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(dischargePatient.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(dischargePatient.fulfilled, (state, action) => {
                state.loading = false;
                state.admissions = state.admissions.filter(adm => adm.id !== action.meta.arg.admission_id);
            })
            .addCase(dischargePatient.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchAdmissions.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAdmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.admissions = action.payload;
            })
            .addCase(fetchAdmissions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateConditionStatus.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateConditionStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.admissions.findIndex(adm => adm.record_id === action.meta.arg.record_id);
                if (index !== -1) state.admissions[index].condition_status = action.meta.arg.condition_status;
            })
            .addCase(updateConditionStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(transferPatient.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(transferPatient.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.admissions.findIndex(adm => adm.record_id === action.meta.arg.record_id);
                if (index !== -1) state.admissions[index].department_id = action.meta.arg.new_department_id;
            })
            .addCase(transferPatient.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(reassignBed.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(reassignBed.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.admissions.findIndex(adm => adm.id === action.meta.arg.admission_id);
                if (index !== -1) state.admissions[index].bed_id = action.meta.arg.new_bed_id;
            })
            .addCase(reassignBed.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(transferPatientToInstitution.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(transferPatientToInstitution.fulfilled, (state, action) => {
                state.loading = false;
                state.admissions = state.admissions.filter(adm => adm.record_id !== action.meta.arg.record_id);
            })
            .addCase(transferPatientToInstitution.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(getAdmitedPatient.pending, (state, action) => { state.loading = false, state.error = null })
            .addCase(getAdmitedPatient.fulfilled, (state, action) => { state.loading = false; state.admissions = action.payload })
            .addCase(getAdmitedPatient.rejected, (state, action) => { state.loading = false; state.error = action.payload })

            .addCase(updateAdmissionStatus.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateAdmissionStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.admissions.findIndex(adm => adm.id === action.meta.arg.visit_id);
                if (index !== -1) {
                    state.admissions[index].admission_status = action.payload.admission_status;
                }
            })
            .addCase(updateAdmissionStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addDefaultCase((state) => { state.loading = false; });
    },
});

// Export Reducer
export default admissionSlice.reducer;
