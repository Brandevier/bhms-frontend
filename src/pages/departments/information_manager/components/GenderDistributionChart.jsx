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
  const total = genderDistribution.data.reduce((sum, item) => sum + item.count, 0);
  
  const chartData = {
    labels: genderDistribution.data.map(g => g.gender),
    datasets: [
      {
        data: genderDistribution.data.map(g => g.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
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

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <div className="h-64">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="space-y-4">
            {genderDistribution.data.map((gender, index) => {
              const percentage = total > 0 ? Math.round((gender.count / total) * 100) : 0;
              const colors = ['#ff6384', '#36a2eb', '#ffcd56'];
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Text strong>{gender.gender}</Text>
                    <Text>{gender.count} ({percentage}%)</Text>
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

      {interpretation && interpretation.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <Text strong>Interpretation:</Text>
          <div className="mt-2">
            {interpretation.map((item, index) => (
              <Text key={index} className="block">{item}</Text>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default GenderDistributionChart;