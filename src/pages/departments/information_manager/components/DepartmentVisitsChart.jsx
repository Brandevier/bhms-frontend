// components/patient/DepartmentVisitsChart.js
import React from 'react';
import { Card, Typography, List, Progress } from 'antd';
import { Bar } from 'react-chartjs-2'; // Changed from HorizontalBar to Bar
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

const { Title: AntTitle, Text } = Typography;

const DepartmentVisitsChart = ({ visitsByDepartment }) => {
  const sortedDepartments = [...visitsByDepartment].sort((a, b) => b.count - a.count);
  const total = sortedDepartments.reduce((sum, item) => sum + item.count, 0);

  const chartData = {
    labels: sortedDepartments.map(item => item.department?.name || 'Unknown'),
    datasets: [
      {
        label: 'Number of Visits',
        data: sortedDepartments.map(item => item.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y', // This makes the bar chart horizontal
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Visits by Department',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Visits',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Departments',
        },
      },
    },
  };

  return (
    <Card className="w-full">
      <AntTitle level={4}>Department-wise Visits</AntTitle>
      
      <div className="h-64 mt-4">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <List
        className="mt-4"
        dataSource={sortedDepartments.slice(0, 5)}
        renderItem={(item, index) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          
          return (
            <List.Item>
              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <Text>{item.department?.name || 'Unknown'}</Text>
                  <Text strong>{item.count} ({percentage}%)</Text>
                </div>
                <Progress 
                  percent={percentage} 
                  showInfo={false}
                  strokeColor="rgba(153, 102, 255, 0.6)"
                />
              </div>
            </List.Item>
          );
        }}
      />

      {total > 0 && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <Text strong>Top 3 Departments: </Text>
          <Text>
            {sortedDepartments.slice(0, 3).map(dept => dept.department?.name).join(', ')}
          </Text>
        </div>
      )}
    </Card>
  );
};

export default DepartmentVisitsChart;