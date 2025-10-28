import React from 'react';
import { Card } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FluidCharts = ({ entries }) => {
  // Generate chart data from entries
  const generateChartData = () => {
    const hourlyData = {};
    
    entries.forEach(entry => {
      const hour = new Date(entry.recorded_at).getHours();
      const hourKey = `${hour}:00`;
      
      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = { hour: hourKey, intake: 0, output: 0 };
      }
      
      if (entry.type === 'intake') {
        hourlyData[hourKey].intake += parseFloat(entry.amount);
      } else {
        hourlyData[hourKey].output += parseFloat(entry.amount);
      }
    });
    
    return Object.values(hourlyData).sort((a, b) => a.hour.localeCompare(b.hour));
  };

  const chartData = generateChartData();

  return (
    <Card title="Fluid Balance Trend" className="shadow-md mb-6" extra={<LineChartOutlined />}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="intake" stroke="#1890ff" strokeWidth={3} name="Intake" />
          <Line type="monotone" dataKey="output" stroke="#ff4d4f" strokeWidth={3} name="Output" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default FluidCharts;