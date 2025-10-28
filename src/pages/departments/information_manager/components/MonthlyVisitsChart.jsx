// components/patient/MonthlyVisitsChart.js
import React from 'react';
import { Card, Typography, Select } from 'antd';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle } = Typography;
const { Option } = Select;

const MonthlyVisitsChart = ({ monthlyVisits }) => {
  const currentYear = new Date().getFullYear();
  const years = [...new Set(monthlyVisits.map(item => new Date(item.month).getFullYear()))];
  
  const chartData = {
    labels: monthlyVisits.map(item => {
      const date = new Date(item.month);
      return date.toLocaleString('default', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Monthly Visits',
        data: monthlyVisits.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Visit Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Visits',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Months',
        },
      },
    },
  };

  return (
    <Card 
      className="w-full"
      extra={
        years.length > 1 && (
          <Select defaultValue={currentYear} style={{ width: 120 }}>
            {years.map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        )
      }
    >
      <AntTitle level={4}>Monthly Visit Trends</AntTitle>
      
      <div className="h-64 mt-4">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {monthlyVisits.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {monthlyVisits.slice(-6).map((item, index) => (
            <div key={index} className="text-center p-2 bg-gray-50 rounded">
              <div className="font-semibold">{item.count}</div>
              <div className="text-xs text-gray-500">
                {new Date(item.month).toLocaleString('default', { month: 'short' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default MonthlyVisitsChart;