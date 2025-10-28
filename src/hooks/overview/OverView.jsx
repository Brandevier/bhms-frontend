import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisitStatistics } from '../../redux/slice/recordSlice';
import { Card, Spin, Alert } from 'antd';
import KPICards from './KPICards';
import VisitTimeline from './VisitTimeline';
import StatusDonuts from './StatusDonuts';
import ProceduresDiagnoses from './ProceduresDiagnoses';
import ClaimItemsBreakdown from './ClaimItemsBreakdown';

const Overview = ({ visit_id }) => {
  const dispatch = useDispatch();
  const { visit_statistics, statsLoading, error } = useSelector((state) => state.records);

  useEffect(() => {

    dispatch(fetchVisitStatistics(visit_id));
  }, [ dispatch]);

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error.message || 'Failed to load visit statistics'}
        type="error"
        showIcon
      />
    );
  }

  if (!visit_statistics) {
    return (
      <Alert
        message="No Data"
        description="No statistics available for this visit"
        type="info"
        showIcon
        onClick={()=>console.log(visit_id)}
      />
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Top row - KPI Cards */}
      <KPICards statistics={visit_statistics} />
      
      {/* Second row - Visit Timeline */}
      <VisitTimeline statistics={visit_statistics} />
      
      {/* Third row - Donut charts */}
      <StatusDonuts statistics={visit_statistics} />
      
      {/* Fourth row - Procedures & Diagnoses */}
      <ProceduresDiagnoses statistics={visit_statistics} />
      
      {/* Fifth row - Claim Items Breakdown */}
      <ClaimItemsBreakdown statistics={visit_statistics} />
    </div>
  );
};

export default Overview;