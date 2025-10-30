// components/patient/PatientAnalysis.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTotalVisits,
  fetchVisitsByType,
  fetchAdmissionStats,
  fetchAverageLengthOfStay,
  fetchDischargeStats,
  fetchMonthlyVisits,
  fetchVisitsByDepartment,
} from "../../../redux/slice/patientAnalysisSlice";
import { Row, Col, Spin, Alert, Card, Typography, Statistic,Tag } from "antd";
import { DashboardOutlined } from "@ant-design/icons";
import TotalVisitsCard from "./components/TotalVisitsCard";
import VisitsByTypeChart from "./components/VisitsByTypeChart";
import AdmissionStatsCard from "./components/AdmissionStatsCard";
import MonthlyVisitsChart from "./components/MonthlyVisitsChart";
import DepartmentVisitsChart from "./components/DepartmentVisitsChart";

const { Title,Text } = Typography;

const PatientAnalysis = () => {
  const dispatch = useDispatch();
  const {
    totalVisits,
    visitsByType,
    admissionStats,
    averageStay,
    dischargeStats,
    monthlyVisits,
    visitsByDepartment,
    loading,
    error,
  } = useSelector((state) => state.patientAnalysis);

  useEffect(() => {
    dispatch(fetchTotalVisits());
    dispatch(fetchVisitsByType());
    dispatch(fetchAdmissionStats());
    dispatch(fetchAverageLengthOfStay());
    dispatch(fetchDischargeStats());
    dispatch(fetchMonthlyVisits());
    dispatch(fetchVisitsByDepartment());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Loading patient analysis..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Patient Analysis"
        description={error || "Failed to load patient analysis data. Please try again."}
        type="error"
        showIcon
      />
    );
  }

  const isEmpty = 
    (!totalVisits && !admissionStats?.admissions) &&
    (!visitsByType || visitsByType.length === 0) &&
    (!monthlyVisits || monthlyVisits.length === 0);

  if (isEmpty) {
    return (
      <Card className="text-center py-12">
        <DashboardOutlined className="text-4xl text-gray-400 mb-4" />
        <Title level={4} className="text-gray-600">No Patient Data Available</Title>
        <p className="text-gray-500">There is no patient analysis data to display at this time.</p>
      </Card>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="flex items-center">
          <DashboardOutlined className="mr-3 text-blue-500" />
          Patient Analysis Dashboard
        </Title>
        <p className="text-gray-600">
          Comprehensive overview of patient visits, admissions, and department statistics
        </p>
      </div>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8} lg={6}>
          <TotalVisitsCard totalVisits={totalVisits} />
        </Col>
        <Col xs={24} sm={8} lg={6}>
          {/* <Card className="text-center">
            <Statistic
              title="Average Length of Stay"
              value={averageStay?.averageStay || 0}
              suffix="days"
              valueStyle={{ color: '#faad14' }}
            />
          </Card> */}
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card className="text-center">
            <Statistic
              title="Total Admissions"
              value={admissionStats?.admissions || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card className="text-center">
            <Statistic
              title="Outpatient Visits"
              value={admissionStats?.outpatients || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Charts */}
      <Row gutter={[16, 16]}>
        {/* Visits by Type */}
        {visitsByType && visitsByType.length > 0 && (
          <Col xs={24} lg={12}>
            <VisitsByTypeChart visitsByType={visitsByType} />
          </Col>
        )}

        {/* Admission Stats */}
        {admissionStats && (
          <Col xs={24} lg={12}>
            <AdmissionStatsCard admissionStats={admissionStats} />
          </Col>
        )}

        {/* Monthly Trends */}
        {monthlyVisits && monthlyVisits.length > 0 && (
          <Col xs={24}>
            <MonthlyVisitsChart monthlyVisits={monthlyVisits} />
          </Col>
        )}

        {/* Department Visits */}
        {visitsByDepartment && visitsByDepartment.length > 0 && (
          <Col xs={24}>
            <DepartmentVisitsChart visitsByDepartment={visitsByDepartment} />
          </Col>
        )}
      </Row>

      {/* Additional Statistics */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={12}>
          <Card title="Discharge Statistics" className="h-full">
            {dischargeStats && dischargeStats.length > 0 ? (
              <div className="space-y-2">
                {dischargeStats.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{item.discharge_type || "Unknown"}</span>
                    <Tag color="blue">{item.count}</Tag>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No discharge data available</p>
            )}
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Quick Insights" className="h-full">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Text strong>Busiest Department: </Text>
                {visitsByDepartment && visitsByDepartment.length > 0 && (
                  <Text>{visitsByDepartment[0]?.department?.name || 'Unknown'}</Text>
                )}
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <Text strong>Most Common Visit Type: </Text>
                {visitsByType && visitsByType.length > 0 && (
                  <Text>{visitsByType[0]?.visit_type || 'Unknown'}</Text>
                )}
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg">
                <Text strong>Average Stay Duration: </Text>
                <Text>{averageStay?.averageStay || 0} days</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PatientAnalysis;