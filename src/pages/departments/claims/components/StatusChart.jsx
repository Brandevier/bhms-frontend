import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Empty, Typography } from 'antd';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Text } = Typography;

const StatusChart = ({ data }) => {
  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Empty description="No status data available" />
      </div>
    );
  }

  const chartData = {
    labels: ['Pending', 'Approved', 'Rejected', 'Submitted'],
    datasets: [
      {
        data: [
          data.pending || 0,
          data.approved || 0,
          data.rejected || 0,
          data.submitted || 0
        ],
        backgroundColor: [
          '#faad14', // Pending - orange
          '#52c41a', // Approved - green
          '#ff4d4f', // Rejected - red
          '#1890ff'  // Submitted - blue
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default StatusChart;