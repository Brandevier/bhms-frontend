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

// **5️⃣ Fetch Stock Alerts**
export const fetchStockAlerts = createAsyncThunk(
    "store/fetchStockAlerts",
    async ({ is_resolved = false }, { rejectWithValue, getState }) => {
        const { auth } = getState()

        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        try {
            const response = await apiClient.get(`/store/stock-alerts`, {
                params: { institution_id, is_resolved },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch stock alerts");
        }
    }
);

// **6️⃣ Fetch Pending Requests**
export const fetchPendingRequests = createAsyncThunk(
    "store/fetchPendingRequests",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()

        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        try {
            const response = await apiClient.get(`/store/pending-requests`, {
                params: { institution_id, status: 'pending' },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch pending requests");
        }
    }
);

// **7️⃣ Fetch Low Stock Items**
export const fetchLowStockItems = createAsyncThunk(
    "store/fetchLowStockItems",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()

        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        try {
            const response = await apiClient.get(`/store/low-stock-items`, {
                params: { institution_id },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch low stock items");
        }
    }
);

// **8️⃣ Fetch Stock Status Report**
export const fetchStockStatusReport = createAsyncThunk(
    "store/fetchStockStatusReport",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()

        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        try {
            const response = await apiClient.get(`/store/stock-status-report`, {
                params: { institution_id },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch stock status report");
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

// ============================================
// NEW: ITEM MANAGEMENT THUNKS
// ============================================

// **Fetch Items**
export const fetchItems = createAsyncThunk(
    "store/fetchItems",
    async ({ category, search, page = 1, limit = 50 }, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.get("/store/items", {
                params: { institution_id, category, search, page, limit },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch items");
        }
    }
);

// **Create Item**
export const createItem = createAsyncThunk(
    "store/createItem",
    async (data, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.post(`/store/items?institution_id=${institution_id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create item");
        }
    }
);

// **Update Item**
export const updateItem = createAsyncThunk(
    "store/updateItem",
    async ({ id, data }, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.put(`/store/items/${id}`, {
                ...data,
                institution_id
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update item");
        }
    }
);

// **Delete Item**
export const deleteItem = createAsyncThunk(
    "store/deleteItem",
    async (id, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            await apiClient.delete(`/store/items/${id}`, {
                params: { institution_id }
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete item");
        }
    }
);

// ============================================
// NEW: SUPPLIER MANAGEMENT THUNKS
// ============================================

// **Fetch Suppliers**
export const fetchSuppliers = createAsyncThunk(
    "store/fetchSuppliers",
    async ({ search, is_active }, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.get("/store/suppliers", {
                params: { institution_id, search, is_active },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch suppliers");
        }
    }
);

// **Create Supplier**
export const createSupplier = createAsyncThunk(
    "store/createSupplier",
    async (data, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.post(`/store/suppliers?institution_id=${institution_id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create supplier");
        }
    }
);

// **Update Supplier**
export const updateSupplier = createAsyncThunk(
    "store/updateSupplier",
    async ({ id, data }, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.put(`/store/suppliers/${id}`, {
                ...data,
                institution_id
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update supplier");
        }
    }
);

// **Delete Supplier**
export const deleteSupplier = createAsyncThunk(
    "store/deleteSupplier",
    async (id, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            await apiClient.delete(`/store/suppliers/${id}`, {
                params: { institution_id }
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete supplier");
        }
    }
);

// ============================================
// NEW: PURCHASE ORDER THUNKS
// ============================================

// **Fetch Purchase Orders**
export const fetchPurchaseOrders = createAsyncThunk(
    "store/fetchPurchaseOrders",
    async ({ supplier_id, status }, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.get("/store/purchase-orders", {
                params: { institution_id, supplier_id, status },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch purchase orders");
        }
    }
);

// **Create Purchase Order**
export const createPurchaseOrder = createAsyncThunk(
    "store/createPurchaseOrder",
    async (data, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.post("/store/purchase-orders", {
                ...data,
                institution_id,
                ordered_by: user.id
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create purchase order");
        }
    }
);

// ============================================
// NEW: STOCK TRANSFER THUNKS
// ============================================

// **Fetch Stock Transfers**
export const fetchStockTransfers = createAsyncThunk(
    "store/fetchStockTransfers",
    async ({ from_department_id, to_department_id, status }, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.get("/store/stock-transfers", {
                params: { institution_id, from_department_id, to_department_id, status },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch stock transfers");
        } 
    }
);

// **Create Stock Transfer**
export const createStockTransfer = createAsyncThunk(
    "store/createStockTransfer",
    async (data, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.post("/store/stock-transfers", {
                ...data,
                institution_id,
                transferred_by: user.id
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create stock transfer");
        }
    }
);

// ============================================
// NEW: INVENTORY RECORDS THUNKS
// ============================================

// **Fetch Inventory Records**
export const fetchInventoryRecords = createAsyncThunk(
    "store/fetchInventoryRecords",
    async ({ item_id, batch_id, movement_type, start_date, end_date }, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.get("/store/inventory-records", {
                params: { institution_id, item_id, batch_id, movement_type, start_date, end_date },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch inventory records");
        }
    }
);

// ============================================
// NEW: STOCK ALERT THUNKS
// ============================================

// **Resolve Stock Alert**
export const resolveStockAlert = createAsyncThunk(
    "store/resolveStockAlert",
    async (alertId, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.put(`/store/stock-alerts/${alertId}/resolve`, {
                institution_id
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to resolve stock alert");
        }
    }
);

// ============================================
// NEW: REPORTS THUNKS
// ============================================

// **Fetch Stock Valuation**
export const fetchStockValuation = createAsyncThunk(
    "store/fetchStockValuation",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.get("/store/stock-valuation", {
                params: { institution_id },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch stock valuation");
        }
    }
);

// **Fetch Consumption Report**
export const fetchConsumptionReport = createAsyncThunk(
    "store/fetchConsumptionReport",
    async ({ start_date, end_date, department_id }, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.get("/store/reports/consumption", {
                params: { institution_id, start_date, end_date, department_id },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch consumption report");
        }
    }
);

// ============================================
// NEW: STOCK ADJUSTMENT THUNKS
// ============================================

// **Fetch Stock Adjustments**
export const fetchStockAdjustments = createAsyncThunk(
    "store/fetchStockAdjustments",
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.get("/store/stock-adjustments", {
                params: { institution_id },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch stock adjustments");
        }
    }
);

// **Create Stock Adjustment**
export const createStockAdjustment = createAsyncThunk(
    "store/createStockAdjustment",
    async (data, { rejectWithValue, getState }) => {
        const { auth } = getState()
        const user = auth.admin || auth.user
        const institution_id = user.institution.id
        
        try {
            const response = await apiClient.post("/store/stock-adjustments", {
                ...data,
                institution_id,
                adjusted_by: user.id
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create stock adjustment");
        }
    }
);

// **Adjust Stock** (alias for createStockAdjustment)
export const adjustStock = createStockAdjustment;







// **Store Management Slice**
const storeSlice = createSlice({
    name: "store",
initialState: {
        statistics: null,
        expiredItems: [],
        stockItems: [],
        items: [],
        pendingRequests: [],
        lowStockItems: [],
        stockAlerts: [],
        stockStatus: null,
        loading: false,
        addStockLoading: false,
        requestItemLoading: false,
        issueItemLoading: false,
        rejectDepartmentItemLoading:false,
        error: null,
        // NEW: Additional state properties
        itemsList: [],
        itemsPagination: { total: 0, page: 1, totalPages: 1 },
        suppliers: [],
        purchaseOrders: [],
        stockTransfers: [],
        inventoryRecords: [],
        stockValuation: null,
        consumptionReport: null,
        createItemLoading: false,
        updateItemLoading: false,
        deleteItemLoading: false,
        supplierLoading: false,
        purchaseOrderLoading: false,
        transferLoading: false,
        inventoryRecordLoading: false,
        valuationLoading: false,
        consumptionLoading: false,
        adjustmentLoading: false,
        stockAdjustments: [],
    },
    reducers: {
        // Clear error
        clearStoreError: (state) => {
            state.error = null;
        },
        // Clear specific data
        clearItemsList: (state) => {
            state.itemsList = [];
        },
        clearSuppliers: (state) => {
            state.suppliers = [];
        },
        clearPurchaseOrders: (state) => {
            state.purchaseOrders = [];
        },
        clearStockTransfers: (state) => {
            state.stockTransfers = [];
        },
        clearInventoryRecords: (state) => {
            state.inventoryRecords = [];
        },
    }, 
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

            // Fetch Stock Alerts
            .addCase(fetchStockAlerts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockAlerts.fulfilled, (state, action) => {
                state.loading = false;
                state.stockAlerts = action.payload.alerts || action.payload;
            })
            .addCase(fetchStockAlerts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Pending Requests
            .addCase(fetchPendingRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPendingRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingRequests = action.payload.requests || action.payload;
            })
            .addCase(fetchPendingRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Low Stock Items
            .addCase(fetchLowStockItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLowStockItems.fulfilled, (state, action) => {
                state.loading = false;
                state.lowStockItems = action.payload.items || action.payload;
            })
            .addCase(fetchLowStockItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Stock Status Report
            .addCase(fetchStockStatusReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockStatusReport.fulfilled, (state, action) => {
                state.loading = false;
                state.stockStatus = action.payload;
            })
            .addCase(fetchStockStatusReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ============================================
            // NEW: ITEM MANAGEMENT CASES
            // ============================================
            
            // Fetch Items
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.itemsList = action.payload.items || [];
                state.itemsPagination = {
                    total: action.payload.total || 0,
                    page: action.payload.page || 1,
                    totalPages: action.payload.totalPages || 1
                };
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Item
            .addCase(createItem.pending, (state) => {
                state.createItemLoading = true;
                state.error = null;
            })
            .addCase(createItem.fulfilled, (state, action) => {
                state.createItemLoading = false;
                state.itemsList.unshift(action.payload);
            })
            .addCase(createItem.rejected, (state, action) => {
                state.createItemLoading = false;
                state.error = action.payload;
            })

            // Update Item
            .addCase(updateItem.pending, (state) => {
                state.updateItemLoading = true;
                state.error = null;
            })
            .addCase(updateItem.fulfilled, (state, action) => {
                state.updateItemLoading = false;
                const index = state.itemsList.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.itemsList[index] = action.payload;
                }
            })
            .addCase(updateItem.rejected, (state, action) => {
                state.updateItemLoading = false;
                state.error = action.payload;
            })

            // Delete Item
            .addCase(deleteItem.pending, (state) => {
                state.deleteItemLoading = true;
                state.error = null;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.deleteItemLoading = false;
                state.itemsList = state.itemsList.filter(item => item.id !== action.payload);
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.deleteItemLoading = false;
                state.error = action.payload;
            })

            // ============================================
            // NEW: SUPPLIER MANAGEMENT CASES
            // ============================================

            // Fetch Suppliers
            .addCase(fetchSuppliers.pending, (state) => {
                state.supplierLoading = true;
                state.error = null;
            })
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
                state.supplierLoading = false;
                state.suppliers = action.payload;
            })
            .addCase(fetchSuppliers.rejected, (state, action) => {
                state.supplierLoading = false;
                state.error = action.payload;
            })

            // Create Supplier
            .addCase(createSupplier.pending, (state) => {
                state.supplierLoading = true;
                state.error = null;
            })
            .addCase(createSupplier.fulfilled, (state, action) => {
                state.supplierLoading = false;
                state.suppliers.unshift(action.payload);
            })
            .addCase(createSupplier.rejected, (state, action) => {
                state.supplierLoading = false;
                state.error = action.payload;
            })

            // Update Supplier
            .addCase(updateSupplier.pending, (state) => {
                state.supplierLoading = true;
                state.error = null;
            })
            .addCase(updateSupplier.fulfilled, (state, action) => {
                state.supplierLoading = false;
                const index = state.suppliers.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.suppliers[index] = action.payload;
                }
            })
            .addCase(updateSupplier.rejected, (state, action) => {
                state.supplierLoading = false;
                state.error = action.payload;
            })

            // Delete Supplier
            .addCase(deleteSupplier.pending, (state) => {
                state.supplierLoading = true;
                state.error = null;
            })
            .addCase(deleteSupplier.fulfilled, (state, action) => {
                state.supplierLoading = false;
                state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
            })
            .addCase(deleteSupplier.rejected, (state, action) => {
                state.supplierLoading = false;
                state.error = action.payload;
            })

            // ============================================
            // NEW: PURCHASE ORDER CASES
            // ============================================

            // Fetch Purchase Orders
            .addCase(fetchPurchaseOrders.pending, (state) => {
                state.purchaseOrderLoading = true;
                state.error = null;
            })
            .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
                state.purchaseOrderLoading = false;
                state.purchaseOrders = action.payload;
            })
            .addCase(fetchPurchaseOrders.rejected, (state, action) => {
                state.purchaseOrderLoading = false;
                state.error = action.payload;
            })

            // Create Purchase Order
            .addCase(createPurchaseOrder.pending, (state) => {
                state.purchaseOrderLoading = true;
                state.error = null;
            })
            .addCase(createPurchaseOrder.fulfilled, (state, action) => {
                state.purchaseOrderLoading = false;
                state.purchaseOrders.unshift(action.payload);
            })
            .addCase(createPurchaseOrder.rejected, (state, action) => {
                state.purchaseOrderLoading = false;
                state.error = action.payload;
            })

            // ============================================
            // NEW: STOCK TRANSFER CASES
            // ============================================

            // Fetch Stock Transfers
            .addCase(fetchStockTransfers.pending, (state) => {
                state.transferLoading = true;
                state.error = null;
            })
            .addCase(fetchStockTransfers.fulfilled, (state, action) => {
                state.transferLoading = false;
                state.stockTransfers = action.payload;
            })
            .addCase(fetchStockTransfers.rejected, (state, action) => {
                state.transferLoading = false;
                state.error = action.payload;
            })

            // Create Stock Transfer
            .addCase(createStockTransfer.pending, (state) => {
                state.transferLoading = true;
                state.error = null;
            })
            .addCase(createStockTransfer.fulfilled, (state, action) => {
                state.transferLoading = false;
                state.stockTransfers.unshift(action.payload);
            })
            .addCase(createStockTransfer.rejected, (state, action) => {
                state.transferLoading = false;
                state.error = action.payload;
            })

            // ============================================
            // NEW: INVENTORY RECORDS CASES
            // ============================================

            // Fetch Inventory Records
            .addCase(fetchInventoryRecords.pending, (state) => {
                state.inventoryRecordLoading = true;
                state.error = null;
            })
            .addCase(fetchInventoryRecords.fulfilled, (state, action) => {
                state.inventoryRecordLoading = false;
                state.inventoryRecords = action.payload;
            })
            .addCase(fetchInventoryRecords.rejected, (state, action) => {
                state.inventoryRecordLoading = false;
                state.error = action.payload;
            })

            // ============================================
            // NEW: STOCK ALERT CASES
            // ============================================

            // Resolve Stock Alert
            .addCase(resolveStockAlert.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resolveStockAlert.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.stockAlerts.findIndex(alert => alert.id === action.payload.id);
                if (index !== -1) {
                    state.stockAlerts[index] = action.payload;
                }
            })
            .addCase(resolveStockAlert.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ============================================
            // NEW: REPORTS CASES
            // ============================================

            // Fetch Stock Valuation
            .addCase(fetchStockValuation.pending, (state) => {
                state.valuationLoading = true;
                state.error = null;
            })
            .addCase(fetchStockValuation.fulfilled, (state, action) => {
                state.valuationLoading = false;
                state.stockValuation = action.payload;
            })
            .addCase(fetchStockValuation.rejected, (state, action) => {
                state.valuationLoading = false;
                state.error = action.payload;
            })

            // Fetch Consumption Report
            .addCase(fetchConsumptionReport.pending, (state) => {
                state.consumptionLoading = true;
                state.error = null;
            })
            .addCase(fetchConsumptionReport.fulfilled, (state, action) => {
                state.consumptionLoading = false;
                state.consumptionReport = action.payload;
            })
            .addCase(fetchConsumptionReport.rejected, (state, action) => {
                state.consumptionLoading = false;
                state.error = action.payload;
            })

// ============================================
            // NEW: STOCK ADJUSTMENT CASES
            // ============================================

            // Fetch Stock Adjustments
            .addCase(fetchStockAdjustments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockAdjustments.fulfilled, (state, action) => {
                state.loading = false;
                state.stockAdjustments = action.payload.adjustments || action.payload || [];
            })
            .addCase(fetchStockAdjustments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Stock Adjustment
            .addCase(createStockAdjustment.pending, (state) => {
                state.adjustmentLoading = true;
                state.error = null;
            })
            .addCase(createStockAdjustment.fulfilled, (state, action) => {
                state.adjustmentLoading = false;
                // Add the new adjustment to the list
                if (state.stockAdjustments) {
                    state.stockAdjustments.unshift(action.payload);
                }
            })
            .addCase(createStockAdjustment.rejected, (state, action) => {
                state.adjustmentLoading = false;
                state.error = action.payload;
            })
    },
});

// Export actions
export const { 
    clearStoreError, 
    clearItemsList, 
    clearSuppliers, 
    clearPurchaseOrders, 
    clearStockTransfers,
    clearInventoryRecords
} = storeSlice.actions;

export default storeSlice.reducer;
