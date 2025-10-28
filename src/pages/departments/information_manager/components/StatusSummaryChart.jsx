// components/diagnosis/StatusSummaryChart.js
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

const StatusSummaryChart = ({ statusSummary, interpretation }) => {
  const total = statusSummary.data.reduce((sum, item) => sum + item.count, 0);
  
  const chartData = {
    labels: statusSummary.data.map(s => s.status),
    datasets: [
      {
        data: statusSummary.data.map(s => s.count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
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
        text: 'Status Distribution',
      },
    },
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'pending': return 'orange';
      case 'resolved': return 'blue';
      case 'critical': return 'red';
      default: return 'default';
    }
  };

  return (
    <Card className="w-full">
      <div className="flex justify-between items-center mb-4">
        <AntTitle level={4}>Status Summary</AntTitle>
        <Tag color="purple">{total} Total Cases</Tag>
      </div>

      <div className="h-64 mb-6">
        <Pie data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {statusSummary.data.map((status, index) => {
          const percentage = total > 0 ? Math.round((status.count / total) * 100) : 0;
          
          return (
            <Card key={index} size="small">
              <div className="flex justify-between items-center mb-2">
                <Tag color={getStatusColor(status.status)}>{status.status}</Tag>
                <Text strong>{status.count} ({percentage}%)</Text>
              </div>
              <Progress 
                percent={percentage} 
                status={
                  status.status.toLowerCase() === 'critical' ? 'exception' : 
                  status.status.toLowerCase() === 'active' ? 'active' : 'normal'
                }
                showInfo={false}
              />
            </Card>
          );
        })}
      </div>

      {interpretation && interpretation.length > 0 && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <Text strong>Interpretation:</Text>
          <List
            size="small"
            dataSource={interpretation}
            renderItem={(item, index) => (
              <List.Item>
                <Text>{item}</Text>
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default StatusSummaryChart;