// AgeDistributionChart.jsx
import React from 'react';
import { Card, Button } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DownloadOutlined } from '@ant-design/icons';

const AgeDistributionChart = ({ ageData }) => {
  const chartData = [
    { name: 'Infants', count: ageData.infants?.length || 0 },
    { name: 'Children', count: ageData.children?.length || 0 },
    { name: 'Youth', count: ageData.youth?.length || 0 },
    { name: 'Adults', count: ageData.adults?.length || 0 },
    { name: 'Elderly', count: ageData.elderly?.length || 0 },
  ];

  const handleDownload = () => {
    console.log("Download age distribution chart as PDF");
    // PDF download implementation will go here
  };

  return (
    <Card 
      title="Age Group Distribution" 
      extra={
        <Button icon={<DownloadOutlined />} size="small" onClick={handleDownload}>
          PDF
        </Button>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AgeDistributionChart;