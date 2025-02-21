import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLabStatistics } from "../../../redux/slice/labSlice";
import { Card, Row, Col, Statistic, Spin } from "antd";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js auto

const LabStatistics = () => {
  const dispatch = useDispatch();
  const { statistics, loading } = useSelector((state) => state.lab);

  useEffect(() => {
    dispatch(fetchLabStatistics());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {/* Total Tests */}
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Tests" value={statistics?.totalTests || 0} />
          </Card>
        </Col>

        {/* Average Completion Time */}
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Avg Completion Time (Seconds)"
              value={Math.round(statistics?.avgCompletionTime || 0)}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        {/* Most Common Tests (Bar Chart) */}
        <Col xs={24} md={12}>
          <Card title="Most Common Tests">
            <Bar
              data={{
                labels: statistics?.mostCommonTests?.map((test) => test?.test_name?.test_name),
                datasets: [
                  {
                    label: "Number of Tests",
                    data: statistics?.mostCommonTests?.map((test) => test?.count),
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                  },
                ],
              }}
            />
          </Card>
        </Col>

        {/* Tests by Status (Doughnut Chart) */}
        <Col xs={24} md={12}>
          <Card title="Tests by Status">
            <Doughnut
              data={{
                labels: statistics?.testsByStatus?.map((status) => status?.status),
                datasets: [
                  {
                    data: statistics?.testsByStatus?.map((status) => status?.count),
                    backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
                  },
                ],
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        {/* Tests by Department (Pie Chart) */}
        <Col xs={24} md={12}>
          <Card title="Tests by Department">
            <Pie
              data={{
                labels: statistics?.testsByDepartment?.map((dept) => dept?.department?.name),
                datasets: [
                  {
                    data: statistics?.testsByDepartment?.map((dept) => dept?.count),
                    backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A8"],
                  },
                ],
              }}
            />
          </Card>
        </Col>

        {/* Tests by Doctor (Horizontal Bar Chart) */}
        <Col xs={24} md={12}>
          <Card title="Tests by Doctor">
            <Bar
              data={{
                labels: statistics?.testsByDoctor?.map((doctor) => doctor?.doctor?.lastName),
                datasets: [
                  {
                    label: "Number of Tests",
                    data: statistics?.testsByDoctor?.map((doctor) => doctor?.count),
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                  },
                ],
              }}
              options={{
                indexAxis: "y", // Horizontal bar chart
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LabStatistics;
