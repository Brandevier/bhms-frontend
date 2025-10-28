import React from "react";
import { Card, Radio, Space, Typography } from "antd";
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
  Filler
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const { Text } = Typography;

const PatientVitalsTrendChart = ({ vitalsData }) => {
  const [selectedView, setSelectedView] = React.useState('all');

  if (!vitalsData || vitalsData.length === 0) {
    return (
      <Card title="Vitals Trends" bordered={true} style={{ marginBottom: 20 }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text type="secondary">No vitals data available for trend analysis.</Text>
        </div>
      </Card>
    );
  }

  // Ensure vitalsData is sorted by date
  const sortedVitals = [...vitalsData].sort((a, b) => 
    new Date(a.created_at || a.createdAt || 0) - new Date(b.created_at || b.createdAt || 0)
  );

  // Extract dates and vital sign values with better formatting
  const labels = sortedVitals.map((v) => {
    const date = new Date(v.created_at || v.createdAt);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  // Prepare datasets based on selected view
  const getDatasets = () => {
    switch(selectedView) {
      case 'bp':
        return [
          {
            label: "Systolic BP",
            data: sortedVitals.map((v) => v.systole ?? null),
            borderColor: "#ff4d4f",
            backgroundColor: "rgba(255, 77, 79, 0.1)",
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: "#ff4d4f",
            fill: true,
            tension: 0.4,
            yAxisID: 'y',
          },
          {
            label: "Diastolic BP",
            data: sortedVitals.map((v) => v.diastole ?? null),
            borderColor: "#1890ff",
            backgroundColor: "rgba(24, 144, 255, 0.1)",
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: "#1890ff",
            fill: true,
            tension: 0.4,
            yAxisID: 'y',
          }
        ];
      
      case 'temp_pulse':
        return [
          {
            label: "Temperature (°C)",
            data: sortedVitals.map((v) => v.temperature ?? null),
            borderColor: "#52c41a",
            backgroundColor: "rgba(82, 196, 26, 0.1)",
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: "#52c41a",
            fill: true,
            tension: 0.4,
            yAxisID: 'y1',
          },
          {
            label: "Pulse (bpm)",
            data: sortedVitals.map((v) => v.pulse ?? null),
            borderColor: "#722ed1",
            backgroundColor: "rgba(114, 46, 209, 0.1)",
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: "#722ed1",
            fill: true,
            tension: 0.4,
            yAxisID: 'y2',
          }
        ];
      
      case 'oxygen':
        return [
          {
            label: "SpO2 (%)",
            data: sortedVitals.map((v) => v.SpO2 ?? v.oxygen ?? null),
            borderColor: "#fa8c16",
            backgroundColor: "rgba(250, 140, 22, 0.1)",
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBackgroundColor: "#fa8c16",
            fill: true,
            tension: 0.4,
            yAxisID: 'y',
          }
        ];
      
      default: // 'all' view
        return [
          {
            label: "Systolic BP",
            data: sortedVitals.map((v) => v.systole ?? null),
            borderColor: "#ff4d4f",
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "#ff4d4f",
            yAxisID: 'y',
          },
          {
            label: "Diastolic BP",
            data: sortedVitals.map((v) => v.diastole ?? null),
            borderColor: "#1890ff",
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "#1890ff",
            yAxisID: 'y',
          },
          {
            label: "Temperature (°C)",
            data: sortedVitals.map((v) => v.temperature ?? null),
            borderColor: "#52c41a",
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "#52c41a",
            yAxisID: 'y1',
          },
          {
            label: "Pulse (bpm)",
            data: sortedVitals.map((v) => v.pulse ?? null),
            borderColor: "#722ed1",
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "#722ed1",
            yAxisID: 'y2',
          },
          {
            label: "SpO2 (%)",
            data: sortedVitals.map((v) => v.SpO2 ?? v.oxygen ?? null),
            borderColor: "#fa8c16",
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "#fa8c16",
            yAxisID: 'y3',
          }
        ];
    }
  };

  const chartData = {
    labels,
    datasets: getDatasets(),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 15,
        cornerRadius: 8,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        }
      },
      y: {
        type: 'linear',
        display: selectedView === 'all' || selectedView === 'bp' || selectedView === 'oxygen',
        position: 'left',
        title: {
          display: true,
          text: selectedView === 'bp' ? 'Blood Pressure (mmHg)' : 
                selectedView === 'oxygen' ? 'SpO2 (%)' : 'BP / SpO2',
          color: '#666',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y1: {
        type: 'linear',
        display: selectedView === 'all' || selectedView === 'temp_pulse',
        position: 'right',
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: '#666',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear',
        display: selectedView === 'all' || selectedView === 'temp_pulse',
        position: 'right',
        title: {
          display: true,
          text: 'Pulse (bpm)',
          color: '#666',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y3: {
        type: 'linear',
        display: selectedView === 'all',
        position: 'right',
        title: {
          display: true,
          text: 'SpO2 (%)',
          color: '#666',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <Card 
      title="Vitals Trends Analysis" 
      bordered={true} 
      style={{ marginBottom: 20 }}
      extra={
        <Radio.Group 
          value={selectedView} 
          onChange={(e) => setSelectedView(e.target.value)}
          size="small"
        >
          <Space>
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="bp">Blood Pressure</Radio.Button>
            <Radio.Button value="temp_pulse">Temp & Pulse</Radio.Button>
            <Radio.Button value="oxygen">Oxygen</Radio.Button>
          </Space>
        </Radio.Group>
      }
    >
      <div style={{ height: "500px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div style={{ marginTop: 16, padding: 12, background: '#f0f8ff', borderRadius: 6 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          💡 Tip: Use the view buttons to focus on specific vital sign groups. 
          Hover over data points for detailed values.
        </Text>
      </div>
    </Card>
  );
};

export default PatientVitalsTrendChart;