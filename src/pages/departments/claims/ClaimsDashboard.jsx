import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentClaims, fetchClaimItemsBreakdown, fetchClaimSummary } from '../../../redux/slice/claimItemSlice';
import { 
  Card, 
  Alert, 
  Spin, 
  Row, 
  Col,
  Empty 
} from 'antd';
import { 
  DashboardHeader, 
  SummaryCards, 
  StatusChart, 
  ItemsBreakdownChart, 
  RecentClaimsTable 
} from './components';

const ClaimsDashboard = () => {
  const dispatch = useDispatch();
  const { summary, recentClaims, itemsBreakdown, loading, error } = useSelector(state => state.claimItem);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchClaimSummary()),
        dispatch(fetchRecentClaims()),
        dispatch(fetchClaimItemsBreakdown())
      ]);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && !summary && !recentClaims && !itemsBreakdown) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Dashboard"
        description={error}
        type="error"
        showIcon
        className="m-4"
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <DashboardHeader 
        onRefresh={loadDashboardData} 
        refreshing={refreshing}
      />
      
      {/* Summary Cards */}
      <SummaryCards summary={summary} loading={loading} />
      
      <Row gutter={[16, 16]} className="mt-6">
        {/* Charts Section */}
        <Col xs={24} lg={12}>
          <Card 
            title="Claims Status Distribution" 
            className="h-full shadow-sm"
            loading={loading}
          >
            <StatusChart data={summary?.statusBreakdown} />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="Items Breakdown" 
            className="h-full shadow-sm"
            loading={loading}
          >
            <ItemsBreakdownChart data={itemsBreakdown} />
          </Card>
        </Col>
      </Row>

      {/* Recent Claims Table */}
      <Card 
        title="Recent Claims" 
        className="mt-6 shadow-sm"
        loading={loading}
      >
        <RecentClaimsTable data={recentClaims} />
      </Card>
    </div>
  );
};

export default ClaimsDashboard;