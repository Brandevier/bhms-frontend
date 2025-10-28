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
    async (data, { rejectWithValue, getState }) => {
        const { auth } = getState()

        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        try {
            const response = await apiClient.post(`/store/stock-items`, {
                institution_id,
                "received_by": user.id,
                ...data,


            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add items");
        }
    }
);

// **3️⃣ Issue Items to Department by request**
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
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()

        const user = auth.admin || auth.user
        const institution_id = user.institution.id
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

// ISSUE ITEMS DIRECTLY
export const getStockItems = createAsyncThunk(
    "store/get-stock-items",
    async ({ store_id }, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.user || auth.admin
        try {
            const response = await apiClient.get(`/store/stock-items`, {
                params: { institution_id: user.institution.id, store_id },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch expired items");
        }
    }
);

export const issueItems = createAsyncThunk(
    "inventory/issueItems",
    async (data, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.user || auth.admin
        try {
            const response = await apiClient.post("/store/issue-items-directly", {
                ...data,
                institution_id: user.institution.id,
                issued_by: user.id
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: "Something went wrong" });
        }
    }
);

// 🔄 Fetch Issued Items from API
export const fetchIssuedItems = createAsyncThunk(
    "inventory/fetchIssuedItems",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.user || auth.admin
        try {
            const response = await apiClient.get("/store/issued-items", {
                params: {
                    institution_id: user.institution.id
                }
            });
            return response.data.issuedItems;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch issued items");
        }
    }
);

// 🔄 Fetch Issued Items from API
export const fetchDepartmentItems = createAsyncThunk(
    "inventory/fetchDepartmentItems",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.user || auth.admin
        try {
            const response = await apiClient.get("/store/department-items", {
                params: {
                    institution_id: user.institution.id,
                    department_id: user.department.id
                }
            });
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data?.error || "Failed to fetch issued items");
        }
    }
);



export const requestItems = createAsyncThunk(
    "inventory/requestItems",
    async (data, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.user || auth.admin
        try {
            const response = await apiClient.post("/store/request-items", {
                ...data,
                institution_id: user.institution.id,
                department_id: user.department.id,
                requested_by: user.id
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch issued items");
        }
    }
);


// 🔄 Fetch requested Items from API
export const fetchRequestedItems = createAsyncThunk(
    "inventory/fetchRequestedItems",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.user || auth.admin
        try {
            const response = await apiClient.get("/store/requested-items", {
                params: {
                    institution_id: user.institution.id,
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch requested items");
        }
    }
);

// 🔄 Fetch requested Items from API
export const fetchRequestedItemsByDepartment = createAsyncThunk(
    "inventory/fetchRequestedItemsByDepartment",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.user || auth.admin
        try {
            const response = await apiClient.get("/store/requested-items", {
                params: {
                    institution_id: user.institution.id,
                    department_id: user.department.id
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch requested items");
        }
    }
);
export const approveDepartmentItemRequest = createAsyncThunk(
    "inventory/approveDepartmentItemRequest",
    async (data, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.user || auth.admin
        try {
            const response = await apiClient.post("/store/requested-items/approve", {
                ...data,
                institution_id: user.institution.id,

            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to approve item request");
        }
    }
);




export const rejectDepartmentItemRequest = createAsyncThunk(
    "inventory/rejectDepartmentItemRequest",
    async (data, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.user || auth.admin
        try {
            const response = await apiClient.put("/store/requested-items/reject", {
                ...data,
                institution_id: user.institution.id,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to reject item request");
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
        items: [],
        loading: false,
        addStockLoading: false,
        requestItemLoading: false,
        issueItemLoading: false,
        rejectDepartmentItemLoading:false,
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
                state.addStockLoading = true;
                state.error = null;
            })
            .addCase(addBulkItems.fulfilled, (state, action) => {
                state.addStockLoading = false;
            })
            .addCase(addBulkItems.rejected, (state, action) => {
                state.addStockLoading = false;
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
            }).addCase(issueItems.pending, (state) => {
                state.issueItemLoading = true;
                state.error = null;
            })
            .addCase(issueItems.fulfilled, (state, action) => {
                state.issueItemLoading = false;

            })
            .addCase(issueItems.rejected, (state, action) => {
                state.issueItemLoading = false;
                state.error = action.payload.error;
            }).addCase(fetchIssuedItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIssuedItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchIssuedItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(fetchDepartmentItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartmentItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchDepartmentItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(requestItems.pending, (state) => {
                state.requestItemLoading = true;
                state.error = null;
            })
            .addCase(requestItems.fulfilled, (state, action) => {
                state.requestItemLoading = false;
            })
            .addCase(requestItems.rejected, (state, action) => {
                state.requestItemLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchRequestedItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequestedItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchRequestedItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(rejectDepartmentItemRequest.pending, (state) => {
                state.rejectDepartmentItemLoading = true;
                state.error = null;
            })
            .addCase(rejectDepartmentItemRequest.fulfilled, (state, action) => {
                state.rejectDepartmentItemLoading = false;
            })
            .addCase(rejectDepartmentItemRequest.rejected, (state, action) => {
                state.rejectDepartmentItemLoading = false;
                state.error = action.payload;
            })

            ;
    },
});

export default storeSlice.reducer;
