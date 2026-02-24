import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../middleware/apiClient';

// Fetch Dashboard Statistics
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/statistics/summary', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Revenue Trends
export const fetchRevenueTrends = createAsyncThunk(
  'dashboard/fetchRevenueTrends',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/statistics/revenue-trends', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Department Performance
export const fetchDepartmentPerformance = createAsyncThunk(
  'dashboard/fetchDepartmentPerformance',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/statistics/department-performance', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Recent Activities
export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/activity/recent', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Upcoming Appointments
export const fetchUpcomingAppointments = createAsyncThunk(
  'dashboard/fetchUpcomingAppointments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/appointments/upcoming', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch System Health
export const fetchSystemHealth = createAsyncThunk(
  'dashboard/fetchSystemHealth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/system/health');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Backup Status
export const fetchBackupStatus = createAsyncThunk(
  'dashboard/fetchBackupStatus',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/system/backup/list', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create Backup
export const createBackup = createAsyncThunk(
  'dashboard/createBackup',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/system/backup/create', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch All Dashboard Data at once
export const fetchAllDashboardData = createAsyncThunk(
  'dashboard/fetchAllData',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const institutionId = params?.institution_id;
      
      // Dispatch all requests in parallel
      const results = await Promise.allSettled([
        dispatch(fetchDashboardStats({ institution_id: institutionId })),
        dispatch(fetchRevenueTrends({ institution_id: institutionId, period: params.period || 'month' })),
        dispatch(fetchDepartmentPerformance({ institution_id: institutionId })),
        dispatch(fetchRecentActivities({ institution_id: institutionId, limit: 10 })),
        dispatch(fetchUpcomingAppointments({ institution_id: institutionId, limit: 5 })),
        dispatch(fetchSystemHealth()),
        dispatch(fetchBackupStatus({ institution_id: institutionId })),
      ]);

      // Return combined data
      return {
        stats: results[0].payload?.data || null,
        revenueTrends: results[1].payload?.data || [],
        departmentPerformance: results[2].payload?.data || [],
        recentActivities: results[3].payload?.data || [],
        upcomingAppointments: results[4].payload?.data || [],
        systemHealth: results[5].payload?.data || null,
        backupStatus: results[6].payload?.data || null,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Stats
  totalPatients: 0,
  totalRevenue: 0,
  totalAppointments: 0,
  bedOccupancy: 0,
  totalDepartments: 0,
  totalStaff: 0,
  pendingBills: 0,
  todayPatients: 0,
  monthlyRevenue: 0,
  admittedPatients: 0,
  dischargedPatients: 0,
  labTests: 0,
  prescriptions: 0,
  
  // Data
  revenueTrends: [],
  departmentPerformance: [],
  recentActivities: [],
  upcomingAppointments: [],
  systemHealth: {
    database: 'healthy',
    api: 'healthy',
    storage: 'healthy',
    lastBackup: null
  },
  backupStatus: {
    lastBackup: null,
    nextScheduled: null,
    backupsAvailable: 0,
    totalSize: '0 MB'
  },
  
  // State
  loading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    setMockData: (state) => {
      // Set mock data for demo purposes
      state.totalPatients = 1247;
      state.totalRevenue = 2850000;
      state.totalAppointments = 342;
      state.bedOccupancy = 78;
      state.totalDepartments = 12;
      state.totalStaff = 89;
      state.pendingBills = 45;
      state.todayPatients = 28;
      state.monthlyRevenue = 1250000;
      state.admittedPatients = 156;
      state.dischargedPatients = 23;
      state.labTests = 89;
      state.prescriptions = 234;
      
      state.revenueTrends = [
        { month: 'Jan', revenue: 850000, expenses: 620000 },
        { month: 'Feb', revenue: 920000, expenses: 680000 },
        { month: 'Mar', revenue: 780000, expenses: 590000 },
        { month: 'Apr', revenue: 1100000, expenses: 720000 },
        { month: 'May', revenue: 1250000, expenses: 780000 },
        { month: 'Jun', revenue: 1180000, expenses: 750000 },
      ];
      
      state.departmentPerformance = [
        { name: 'Emergency', patients: 234, revenue: 450000, efficiency: 92 },
        { name: 'Outpatient', patients: 567, revenue: 380000, efficiency: 88 },
        { name: 'Inpatient', patients: 189, revenue: 520000, efficiency: 85 },
        { name: 'Laboratory', patients: 445, revenue: 280000, efficiency: 95 },
        { name: 'Pharmacy', patients: 312, revenue: 320000, efficiency: 90 },
        { name: 'Radiology', patients: 178, revenue: 210000, efficiency: 87 },
      ];
      
      state.recentActivities = [
        { id: 1, type: 'admission', description: 'New patient admitted to Ward A', time: '2 mins ago', icon: 'user-add', color: 'green' },
        { id: 2, type: 'billing', description: 'Payment received - $1,250.00', time: '15 mins ago', icon: 'dollar', color: 'blue' },
        { id: 3, type: 'lab', description: 'Lab results ready for John Doe', time: '30 mins ago', icon: 'experiment', color: 'purple' },
        { id: 4, type: 'prescription', description: 'Prescription filled - Pharmacy', time: '45 mins ago', icon: 'medicine-box', color: 'orange' },
        { id: 5, type: 'discharge', description: 'Patient discharged from ICU', time: '1 hour ago', icon: 'user-delete', color: 'red' },
        { id: 6, type: 'appointment', description: 'New appointment scheduled', time: '2 hours ago', icon: 'calendar', color: 'cyan' },
      ];
      
      state.upcomingAppointments = [
        { id: 1, patient: 'Sarah Johnson', time: '09:00 AM', department: 'Cardiology', status: 'confirmed' },
        { id: 2, patient: 'Michael Chen', time: '10:30 AM', department: 'General Surgery', status: 'pending' },
        { id: 3, patient: 'Emily Davis', time: '11:00 AM', department: 'Orthopedics', status: 'confirmed' },
        { id: 4, patient: 'Robert Wilson', time: '02:00 PM', department: 'Neurology', status: 'confirmed' },
        { id: 5, patient: 'Lisa Anderson', time: '03:30 PM', department: 'Pediatrics', status: 'pending' },
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Dashboard Data
      .addCase(fetchAllDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        
        // Update stats
        if (action.payload.stats) {
          const stats = action.payload.stats;
          state.totalPatients = stats.totalPatients || 0;
          state.totalRevenue = stats.totalRevenue || 0;
          state.totalAppointments = stats.totalAppointments || 0;
          state.bedOccupancy = stats.bedOccupancy || 0;
          state.totalDepartments = stats.totalDepartments || 0;
          state.totalStaff = stats.totalStaff || 0;
          state.pendingBills = stats.pendingBills || 0;
          state.todayPatients = stats.todayPatients || 0;
          state.monthlyRevenue = stats.monthlyRevenue || 0;
          state.admittedPatients = stats.admittedPatients || 0;
          state.dischargedPatients = stats.dischargedPatients || 0;
          state.labTests = stats.labTests || 0;
          state.prescriptions = stats.prescriptions || 0;
        }
        
        // Update other data
        state.revenueTrends = action.payload.revenueTrends || [];
        state.departmentPerformance = action.payload.departmentPerformance || [];
        state.recentActivities = action.payload.recentActivities || [];
        state.upcomingAppointments = action.payload.upcomingAppointments || [];
        
        if (action.payload.systemHealth) {
          state.systemHealth = {
            database: action.payload.systemHealth.database || 'healthy',
            api: action.payload.systemHealth.api || 'healthy',
            storage: action.payload.systemHealth.storage || 'healthy',
            lastBackup: action.payload.systemHealth.lastBackup || null
          };
        }
        
        if (action.payload.backupStatus) {
          state.backupStatus = {
            lastBackup: action.payload.backupStatus.lastBackup || null,
            nextScheduled: action.payload.backupStatus.nextScheduled || null,
            backupsAvailable: action.payload.backupStatus.totalBackups || 0,
            totalSize: action.payload.backupStatus.totalSize || '0 MB'
          };
        }
      })
      .addCase(fetchAllDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // System Health
      .addCase(fetchSystemHealth.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSystemHealth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.systemHealth = {
            database: action.payload.data.database || 'healthy',
            api: action.payload.data.api || 'healthy',
            storage: action.payload.data.storage || 'healthy',
            lastBackup: action.payload.data.lastBackup || null
          };
        }
      })
      .addCase(fetchSystemHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Backup Status
      .addCase(fetchBackupStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBackupStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.backupStatus = {
            lastBackup: action.payload.data.lastBackup || null,
            nextScheduled: action.payload.data.nextScheduled || null,
            backupsAvailable: action.payload.data.totalBackups || 0,
            totalSize: action.payload.data.totalSize || '0 MB'
          };
        }
      })
      .addCase(fetchBackupStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Backup
      .addCase(createBackup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBackup.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.backupStatus.lastBackup = action.payload.data.created_at;
          state.backupStatus.backupsAvailable = (state.backupStatus.backupsAvailable || 0) + 1;
        }
      })
      .addCase(createBackup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError, setMockData } = dashboardSlice.actions;
export default dashboardSlice.reducer;

