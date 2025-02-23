import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../middleware/apiClient";


// **1️⃣ Fetch Store Statistics**
export const fetchStoreStatistics = createAsyncThunk(
    "store/fetchStoreStatistics",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()

        const user = auth.admin || auth.user
        const institution_id = user.institution.id

        try {
            const response = await apiClient.get(`/store/store-stats`, {
                params: { institution_id },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch store statistics");
        }
    }
);

// **2️⃣ Add Bulk Items**
export const addBulkItems = createAsyncThunk(
    "store/addBulkItems",
    async (data, { rejectWithValue,getState }) => {
        const { auth } = getState()

        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        try {
            const response = await apiClient.post(`/store/stock-items`, {
                institution_id,
                "received_by":user.id,
                ...data,
               

            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add items");
        }
    }
);

// **3️⃣ Issue Items to Department**
export const issueItemsToDepartment = createAsyncThunk(
    "store/issueItems",
    async (request_id, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/store/issue-items`, { request_id });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to issue items");
        }
    }
);

// **4️⃣ Fetch Expired Items**
export const fetchExpiredItems = createAsyncThunk(
    "store/fetchExpiredItems",
    async (institution_id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/store/get-expired-items`, {
                params: { institution_id },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch expired items");
        }
    }
);


export const getStockItems = createAsyncThunk(
    "store/get-stock-items",
    async ({store_id }, { rejectWithValue,getState }) => {
        const { auth } = getState()
        const user = auth.user || auth.admin
        try {
            const response = await apiClient.get(`/store/stock-items`, {
                params: { institution_id:user.institution.id, store_id },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch expired items");
        }
    }
);

// **Store Management Slice**
const storeSlice = createSlice({
    name: "store",
    initialState: {
        statistics: null,
        expiredItems: [],
        stockItems: [],
        loading: false,
        error: null,
    },
    reducers: {}, // No additional reducers needed
    extraReducers: (builder) => {
        builder
            // Fetch Store Statistics
            .addCase(fetchStoreStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStoreStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload;
            })
            .addCase(fetchStoreStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Bulk Items
            .addCase(addBulkItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBulkItems.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addBulkItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Issue Items to Department
            .addCase(issueItemsToDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(issueItemsToDepartment.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(issueItemsToDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Expired Items
            .addCase(fetchExpiredItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpiredItems.fulfilled, (state, action) => {
                state.loading = false;
                state.expiredItems = action.payload.expiredItems;
            })
            .addCase(fetchExpiredItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //   GET STOCK ITEMS
            .addCase(getStockItems.pending, (state, action) => {
                state.loading = true;
            }).addCase(getStockItems.fulfilled, (state, action) => {
                state.loading = false;
                state.stockItems = action.payload
            }).addCase(getStockItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default storeSlice.reducer;
