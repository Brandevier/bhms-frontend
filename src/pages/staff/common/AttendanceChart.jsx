import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AttendanceChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Present Days',
        data: [22, 20, 23, 21, 22, 20, 21],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'Leave Days',
        data: [1, 2, 0, 1, 0, 2, 1],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }
    ]
  };

  return <Line data={data} />;
};

export default AttendanceChart;