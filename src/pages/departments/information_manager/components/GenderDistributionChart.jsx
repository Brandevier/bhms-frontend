// components/diagnosis/GenderDistributionChart.js
import React from 'react';
import { Card, Typography, Progress, Row, Col, Tag } from 'antd';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title: AntTitle, Text } = Typography;

const GenderDistributionChart = ({ genderDistribution, interpretation }) => {
  // Add safety checks and ensure data is properly formatted
  const safeData = genderDistribution?.data || [];
  const safeInterpretation = interpretation || [];
  
  // Fix: Ensure counts are numbers and handle null/undefined values
  const total = safeData.reduce((sum, item) => sum + parseInt(item.count || 0), 0);
  
  const chartData = {
    labels: safeData.map(g => g.gender || 'Unknown'),
    datasets: [
      {
        data: safeData.map(g => parseInt(g.count || 0)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
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
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gender Distribution',
      },
    },
  };

  return (
    <Card className="w-full">
      <div className="flex justify-between items-center mb-4">
        <AntTitle level={4}>Gender Distribution</AntTitle>
        <Tag color="green">{total} Total Cases</Tag>
      </div>

      {safeData.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div className="h-64">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="space-y-4">
                {safeData.map((gender, index) => {
                  const count = parseInt(gender.count || 0);
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                  const colors = ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff'];
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Text strong>{gender.gender || 'Unknown'}</Text>
                        <Text>{count} ({percentage}%)</Text>
                      </div>
                      <Progress 
                        percent={percentage} 
                        strokeColor={colors[index % colors.length]}
                        showInfo={false}
                      />
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>

          {/* FIXED: Properly render interpretation objects */}
          {safeInterpretation.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <Text strong>Insights:</Text>
              <div className="mt-2">
                {safeInterpretation.map((item, index) => (
                  // FIX: Access the insight property from the object
                  <Text key={index} className="block">
                    {item.insight || 'No insight available'}
                  </Text>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <Text type="secondary">No gender distribution data available</Text>
      )}
    </Card>
  );
};

export default GenderDistributionChart;