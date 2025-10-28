import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Alert } from 'antd';
import FluidSummaryCards from './common/FluidSummaryCards';
import FluidCharts from './common/FluidCharts';
import FluidRecordsTable from './common/FluidRecordsTable';
import FluidTrends from './common/FluidTrends';
import AddFluidEntryModal from './common/AddFluidEntryModal';
import { useFluidMonitoring } from '../../redux/hooks/useFluidMonitoring';


const FluidMonitoring = ({ visit_id,institution_id }) => {
  const {
    entries,
    currentSummary,
    settings,
    loading,
    error,
    getFluidEntries,
    getFluidBalanceSummary,
    getFluidSettings,
    calculateCurrentBalance,
    getIntakeTotal,
    getOutputTotal
  } = useFluidMonitoring();




  useEffect(() => {
    // Load initial data
    getFluidEntries({ visit_id,  institution_id });
    getFluidBalanceSummary({  visit_id, institution_id });
    getFluidSettings({ visit_id, institution_id: institution_id });
  }, [visit_id,  institution_id]);

  if (loading.entries) {
    return <div className="p-6">Loading fluid data...</div>;
  }

  if (error.entries) {
    return (
      <div className="p-6">
        <Alert message="Error" description={error.entries} type="error" showIcon />
      </div>
    );
  }

  const fluidData = {
    currentBalance: calculateCurrentBalance(),
    totalIntake: getIntakeTotal(),
    totalOutput: getOutputTotal(),
    targetIntake: settings?.target_daily_intake || 2000,
    targetOutput: settings?.target_daily_output || 1800
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800" onClick={()=>console.log(visit_id)}>Fluid Monitoring</h1>
        <p className="text-gray-600">Real-time tracking of patient fluid intake and output</p>
      </div>

      {/* Alert Section - Show if balance is critical */}
      {Math.abs(fluidData.currentBalance) > (settings?.critical_threshold_positive || 1000) && (
        <Alert
          message="Fluid Balance Alert"
          description={`Current fluid balance is ${fluidData.currentBalance > 0 ? 'positive' : 'negative'} (${fluidData.currentBalance}ml). Monitor for signs of ${fluidData.currentBalance > 0 ? 'fluid overload' : 'dehydration'}.`}
          type="warning"
          showIcon
          className="mb-6"
        />
      )}

      <FluidSummaryCards fluidData={fluidData} settings={settings} />

      <FluidCharts entries={entries.all} />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <FluidRecordsTable
            type="intake"
            data={entries.intake}
            title="Intake Records"
          />
        </Col>
        <Col xs={24} lg={12}>
          <FluidRecordsTable
            type="output"
            data={entries.output}
            title="Output Records"
            institutionId={institution_id}
            visitId={visit_id}
            
          />
        </Col>
      </Row>

      <FluidTrends entries={entries.all} />

      <AddFluidEntryModal
        visitId={visit_id}
        institutionId={institution_id}

      />
    </div>
  );
};

export default FluidMonitoring;