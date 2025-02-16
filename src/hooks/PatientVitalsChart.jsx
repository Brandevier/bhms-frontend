import React from "react";
import { Card } from "antd";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PatientVitalsChart = ({ vitalsData }) => {
  if (!vitalsData || vitalsData.length === 0) {
    return <Card title="Patient Vitals Chart">No vitals data available.</Card>;
  }

  // Ensure vitalsData is sorted by date for a smooth trend
  const sortedVitals = [...vitalsData].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  // Extract dates and vital sign values
  const labels = sortedVitals.map((v) => new Date(v.created_at).toLocaleDateString()); // Format dates
  const temperature = sortedVitals.map((v) => v.temperature ?? null);
  const diastole = sortedVitals.map((v) => v.diastole ?? null);
  const systole = sortedVitals.map((v) => v.systole ?? null);
  const pulse = sortedVitals.map((v) => v.pulse ?? null);
  const spo2 = sortedVitals.map((v) => v.SpO2 ?? null);

  const chartData = {
    labels,
    datasets: [
      { label: "Systole (mmHg)", data: systole, borderColor: "red", borderWidth: 2, pointRadius: 4, fill: false },
      { label: "Diastole (mmHg)", data: diastole, borderColor: "blue", borderWidth: 2, pointRadius: 4, fill: false },
      { label: "Temperature (°C)", data: temperature, borderColor: "green", borderWidth: 2, pointRadius: 4, fill: false },
      { label: "Pulse (bpm)", data: pulse, borderColor: "purple", borderWidth: 2, pointRadius: 4, fill: false },
      { label: "SpO2 (%)", data: spo2, borderColor: "orange", borderWidth: 2, pointRadius: 4, fill: false },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: false } },
  };

  return (
    <Card title="Patient Vitals Chart" bordered={true} style={{ marginBottom: 20 }}>
      <div style={{ width: "600px",  height: "400px" }}> 
        <Line data={chartData} options={chartOptions} />
      </div>
    </Card>  
  );
};

export default PatientVitalsChart;
