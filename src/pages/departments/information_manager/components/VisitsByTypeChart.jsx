// components/patient/VisitsByTypeChart.js
import React from 'react';
import { Card, Typography, List, Tag, Progress } from 'antd';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title: AntTitle, Text } = Typography;

const VisitsByTypeChart = ({ visitsByType }) => {
  const total = visitsByType.reduce((sum, item) => sum + item.count, 0);

  const chartData = {
    labels: visitsByType.map(item => item.visit_type || 'Unknown'),
    datasets: [
      {
        data: visitsByType.map(item => item.count),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Visits by Type Distribution',
      },
    },
  };

  const getVisitTypeColor = (type) => {
    const colors = {
      'Emergency': 'red',
      'OPD': 'blue',
      'IPD': 'green',
      'Follow-up': 'orange',
      'Maternity': 'purple',
      'default': 'gray'
    };
    return colors[type] || colors.default;
  };

  return (
    <Card className="w-full">
      <AntTitle level={4} className="mb-4">Visits by Type</AntTitle>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64">
          <Pie data={chartData} options={chartOptions} />
        </div>
        
        <div className="space-y-4">
          {visitsByType.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Tag color={getVisitTypeColor(item.visit_type)}>
                      {item.visit_type || 'Unknown'}
                    </Tag>
                  </div>
                  <Text strong>{item.count} ({percentage}%)</Text>
                </div>
                <Progress 
                  percent={percentage} 
                  showInfo={false}
                  strokeColor={chartData.datasets[0].backgroundColor[index]}
                />
              </div>
            );
          })}
          
          {total > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <Text strong>Total: {total} visits</Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VisitsByTypeChart;