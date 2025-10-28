// PatientSummaryDashboard.jsx
import React from 'react';
import { usePatientSummaryActions } from '../../../../redux/hooks/usePatientSummary';
import { Row, Col, Spin, Alert, Button, Select, Tabs } from 'antd';
import { useEffect } from 'react';
import SummaryCards from './common/SummaryCards';
import GenderChart from './common/GenderChart';
import AgeDistributionChart from './common/AgeDistributionChart';
import PatientTable from './common/PatientTable';

const { Option } = Select;
const { TabPane } = Tabs;

const PatientSummaryDashboard = () => {
  const {
    summary,
    monthlyTrend,
    departmentStats,
    loading,
    error,
    filters,
    fetchSummary,
    fetchMonthlyTrend,
    fetchDepartmentStats,
    clearSummaryError,
    updateDepartmentFilter
  } = usePatientSummaryActions();

  useEffect(() => {
    fetchSummary();
    fetchMonthlyTrend();
    fetchDepartmentStats(filters.department_id);
  }, [fetchSummary, fetchMonthlyTrend, fetchDepartmentStats, filters.department_id]);

  useEffect(() => {
    if (error) {
      console.error('Patient Summary Error:', error);
    }
  }, [error]);

  const handleDepartmentChange = (department_id) => {
    updateDepartmentFilter(department_id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Loading patient summary..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Patient Summary"
        description={error || 'Failed to load patient summary data. Please try again.'}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={clearSummaryError}>
            Dismiss
          </Button>
        }
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Patient Summary Dashboard</h1>
        <Select 
          defaultValue={filters.department_id || "all"} 
          style={{ width: 200 }} 
          onChange={handleDepartmentChange}
          placeholder="Select Department"
        >
          <Option value="all">All Departments</Option>
          {/* Add department options here */}
        </Select>
      </div>

      <SummaryCards summary={summary} />
      
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={12}>
          <GenderChart genderData={summary?.genderSummary || []} />
        </Col>
        <Col xs={24} md={12}>
          <AgeDistributionChart ageData={summary?.ageGroups || {}} />
        </Col>
      </Row>

      <div className="mt-6 bg-white rounded-lg shadow">
        <Tabs defaultActiveKey="inpatients" type="card">
          <TabPane tab="Inpatients" key="inpatients">
            <PatientTable 
              data={summary?.genderSummary?.flatMap(g => 
                g.patients.filter(p => parseInt(g.inpatients) > 0)
              ) || []} 
              type="inpatient" 
            />
          </TabPane>
          <TabPane tab="Outpatients" key="outpatients">
            <PatientTable 
              data={summary?.genderSummary?.flatMap(g => 
                g.patients.filter(p => parseInt(g.outpatients) > 0)
              ) || []} 
              type="outpatient" 
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  ); 
};

export default PatientSummaryDashboard;