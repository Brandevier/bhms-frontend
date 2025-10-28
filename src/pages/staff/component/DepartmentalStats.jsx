import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDepartmentSummaryWithDiagnosisDetails } from "../../../redux/slice/departmentSlice";
import { Card, Row, Col, Statistic, Tooltip, Skeleton } from "antd";
import { Pie, Bar } from "react-chartjs-2";
import { InfoCircleOutlined, UserOutlined, MedicineBoxOutlined, FileTextOutlined } from "@ant-design/icons";
import Chart from "chart.js/auto";

const DepartmentalStats = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.departments);

  useEffect(() => {
    dispatch(getDepartmentSummaryWithDiagnosisDetails());
  }, [dispatch]);

  // Placeholder for loading state
  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ textAlign: "center", fontWeight: "bold", marginBottom: "20px" }}>
          <Skeleton.Input style={{ width: 200 }} active />
        </h2>

        {/* Skeleton for Stats Cards */}
        <Row gutter={[16, 16]}>
          {[...Array(4)].map((_, index) => (
            <Col span={6} key={index}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Skeleton for Charts */}
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          {[...Array(2)].map((_, index) => (
            <Col span={12} key={index}>
              <Card>
                <Skeleton active paragraph={{ rows: 6 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (!stats) return <p>No data available</p>;

  const { departmentName, totalStaff, totalPatients, totalInventoryRecords, bedsByStatus, totalBeds } = stats;

  // Pie Chart Data for Bed Status
  const bedStatusData = {
    labels: ["Available", "Occupied", "Faulty"],
    datasets: [
      {
        data: [bedsByStatus?.available || 0, bedsByStatus?.occupied || 0, bedsByStatus?.faulty || 0],
        backgroundColor: ["#52c41a", "#fa8c16", "#f5222d"],
      },
    ],
  };

  // Bar Chart Data for Department Overview
  const departmentData = {
    labels: ["Staff", "Patients", "Inventory", "Beds"],
    datasets: [
      {
        label: "Count",
        data: [totalStaff, totalPatients, totalInventoryRecords, totalBeds],
        backgroundColor: ["#1890ff", "#faad14", "#722ed1", "#13c2c2"],
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", fontWeight: "bold", marginBottom: "20px" }}>{departmentName} Statistics</h2>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Staff"
              value={totalStaff}
              prefix={<UserOutlined />}
              suffix={
                <Tooltip title="Number of staff in this department">
                  <InfoCircleOutlined style={{ color: "#1890ff" }} />
                </Tooltip>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Patients"
              value={totalPatients}
              prefix={<MedicineBoxOutlined />}
              suffix={
                <Tooltip title="Total number of patients in this department">
                  <InfoCircleOutlined style={{ color: "#faad14" }} />
                </Tooltip>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Inventory Records"
              value={totalInventoryRecords}
              prefix={<FileTextOutlined />}
              suffix={
                <Tooltip title="Total medical inventory records">
                  <InfoCircleOutlined style={{ color: "#722ed1" }} />
                </Tooltip>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Beds"
              value={totalBeds}
              suffix={
                <Tooltip title="Total number of beds available in the department">
                  <InfoCircleOutlined style={{ color: "#13c2c2" }} />
                </Tooltip>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card title="Bed Status Breakdown">
            <Pie data={bedStatusData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Department Overview">
            <Bar data={departmentData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DepartmentalStats;
