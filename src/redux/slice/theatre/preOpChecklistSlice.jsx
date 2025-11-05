import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../middleware/apiClient';

// 🟢 Fetch or create checklist
export const fetchOrCreateChecklist = createAsyncThunk(
  'preOpChecklist/fetchOrCreate',
  async ({ visit_id, surgery_schedule_id }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/theatre/pre-op-checklist/create-or-get', {
        visit_id,
        surgery_schedule_id
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🟢 Fetch static template (optional)
export const fetchChecklistTemplate = createAsyncThunk(
  'preOpChecklist/fetchTemplate',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/theatre/pre-op-checklist/pre-op-checklist/templates');
      return res.data.data; // template array
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🟢 Update checklist progress or completion
export const updateChecklist = createAsyncThunk(
  'preOpChecklist/update',
  async ({ id, checklist_data, status, completed_by }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/theatre/pre-op-checklist/${id}`, {
        checklist_data,
        status,
        completed_by
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🧩 Slice
const preOpChecklistSlice = createSlice({
  name: 'preOpChecklist',
  initialState: {
    checklist: null,
    template: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetChecklistState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch/Create
      .addCase(fetchOrCreateChecklist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrCreateChecklist.fulfilled, (state, action) => {
        state.loading = false;
        state.checklist = action.payload;
      })
      .addCase(fetchOrCreateChecklist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Template
      .addCase(fetchChecklistTemplate.fulfilled, (state, action) => {
        state.template = action.payload;
      })
      // Update
      .addCase(updateChecklist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChecklist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.checklist = action.payload;
      })
      .addCase(updateChecklist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetChecklistState } = preOpChecklistSlice.actions;
export default preOpChecklistSlice.reducer;
