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
  // Add safety checks and ensure data is properly formatted
  const safeData = statusSummary?.data || [];
  const safeInterpretation = interpretation || [];
  
  // Fix: Ensure counts are numbers and handle null/undefined values
  const total = safeData.reduce((sum, item) => sum + parseInt(item.count || 0), 0);
  
  const chartData = {
    labels: safeData.map(s => s.status || 'Unknown'),
    datasets: [
      {
        data: safeData.map(s => parseInt(s.count || 0)),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
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
    if (!status) return 'default';
    
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'pending': return 'orange';
      case 'resolved': return 'blue';
      case 'critical': return 'red';
      case 'completed': return 'green';
      case 'in progress': return 'blue';
      default: return 'default';
    }
  };

  const getProgressStatus = (status) => {
    if (!status) return 'normal';
    
    switch (status.toLowerCase()) {
      case 'critical': return 'exception';
      case 'active': return 'active';
      case 'pending': return 'normal';
      case 'resolved': return 'success';
      default: return 'normal';
    }
  };

  return (
    <Card className="w-full">
      <div className="flex justify-between items-center mb-4">
        <AntTitle level={4}>Status Summary</AntTitle>
        <Tag color="purple">{total} Total Cases</Tag>
      </div>

      {safeData.length > 0 ? (
        <>
          <div className="h-64 mb-6">
            <Pie data={chartData} options={chartOptions} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {safeData.map((status, index) => {
              const count = parseInt(status.count || 0);
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              
              return (
                <Card key={index} size="small">
                  <div className="flex justify-between items-center mb-2">
                    <Tag color={getStatusColor(status.status)}>{status.status || 'Unknown'}</Tag>
                    <Text strong>{count} ({percentage}%)</Text>
                  </div>
                  <Progress 
                    percent={percentage} 
                    status={getProgressStatus(status.status)}
                    showInfo={false}
                  />
                </Card>
              );
            })}
          </div>

          {/* FIXED: Properly render interpretation objects */}
          {safeInterpretation.length > 0 && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <Text strong>Insights:</Text>
              <List
                size="small"
                dataSource={safeInterpretation}
                renderItem={(item, index) => (
                  <List.Item>
                    {/* FIX: Access the insight property from the object */}
                    <Text>{item.insight || 'No insight available'}</Text>
                  </List.Item>
                )}
              />
            </div>
          )}
        </>
      ) : (
        <Text type="secondary">No status summary data available</Text>
      )}
    </Card>
  );
};

export default StatusSummaryChart;