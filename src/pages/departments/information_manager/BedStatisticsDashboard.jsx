// components/bed/BedStatisticsDashboard.js
import React, { useEffect } from 'react';
import { Spin, Alert, Card, Typography, Button } from 'antd'; // Added Button import
import { BoxPlotFilled } from '@ant-design/icons';
import { useBedStatisticsActions } from '../../../redux/hooks/useBedStatistics'; // Only import the main hook
import DashboardHeader from './common/DashboardHeader';
import BedSummaryCards from './common/BedSummaryCards';
import OccupancyProgress from './common/OccupancyProgress';
import PatientOccupancyGrid from './common/PatientOccupancyGrid';
import DepartmentStats from './common/DepartmentStats';


const { Title } = Typography;

const BedStatisticsDashboard = () => {
  const { 
    statistics, // Now this will work with the fixed hook
    loading, 
    error, 
    filters, 
    fetchStatistics, 
    clearStatisticsError, 
    updateFilters 
  } = useBedStatisticsActions();

  useEffect(() => {
    fetchStatistics(filters);
  }, [fetchStatistics, filters]);

  useEffect(() => {
    if (error) {
      console.error('Bed Statistics Error:', error);
    }
  }, [error]);

  const handleDepartmentChange = (department_id) => {
    updateFilters({ department_id: department_id || null });
  };

  const handleRefresh = () => {
    fetchStatistics(filters);
  };

  const handleClearFilters = () => {
    updateFilters({ department_id: null });
  };

  if (loading && !statistics) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Loading bed statistics..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Bed Statistics"
        description={error || 'Failed to load bed statistics. Please try again.'}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={clearStatisticsError}>
            Dismiss
          </Button>
        }
      />
    );
  }

  if (!statistics) {
    return (
      <Card className="text-center py-12">
        <BoxPlotFilled className="text-4xl text-gray-400 mb-4" />
        <Title level={4} className="text-gray-600">No Bed Data Available</Title>
        <p className="text-gray-500">There is no bed statistics data to display at this time.</p>
      </Card>
    );
  }

  const {
    totalBeds,
    statusCounts,
    occupancyRate,
    departmentStats,
    patientDetails
  } = statistics;

  const occupiedCount = statusCounts?.find(s => s.status === 'occupied')?.count || 0;
  const availableCount = statusCounts?.find(s => s.status === 'available')?.count || 0;
  const maintenanceCount = statusCounts?.find(s => s.status === 'maintenance')?.count || 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* You'll need to update DashboardHeader to use the new props */}
      <DashboardHeader
        filters={filters}
        loading={loading}
        onDepartmentChange={handleDepartmentChange}
        onRefresh={handleRefresh}
        onClearFilters={handleClearFilters}
      />

      <BedSummaryCards
        totalBeds={totalBeds}
        occupiedCount={occupiedCount}
        availableCount={availableCount}
        occupancyRate={occupancyRate}
      />

      <OccupancyProgress
        totalBeds={totalBeds}
        occupiedCount={occupiedCount}
        availableCount={availableCount}
        maintenanceCount={maintenanceCount}
        occupancyRate={occupancyRate}
      />

      <PatientOccupancyGrid
        patientDetails={patientDetails}
        totalBeds={totalBeds}
      />

      <DepartmentStats
        departmentStats={departmentStats}
        totalBeds={totalBeds}
      />
    </div>
  );
};

export default BedStatisticsDashboard;