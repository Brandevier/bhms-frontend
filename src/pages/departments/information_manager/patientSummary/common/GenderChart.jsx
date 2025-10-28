// GenderChart.jsx
import React from 'react';
import { Card, Button } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DownloadOutlined } from '@ant-design/icons';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const GenderChart = ({ genderData }) => {
  const chartData = genderData.map(item => ({
    name: item.gender,
    value: parseInt(item.inpatients) + parseInt(item.outpatients),
    inpatients: parseInt(item.inpatients),
    outpatients: parseInt(item.outpatients)
  }));

  const handleDownload = () => {
    console.log("Download gender chart as PDF");
    // PDF download implementation will go here
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-blue-500">Total: {payload[0].value}</p>
          <p className="text-green-500">Inpatients: {payload[0].payload.inpatients}</p>
          <p className="text-red-500">Outpatients: {payload[0].payload.outpatients}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      title="Patient Distribution by Gender" 
      extra={
        <Button icon={<DownloadOutlined />} size="small" onClick={handleDownload}>
          PDF
        </Button>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default GenderChart;