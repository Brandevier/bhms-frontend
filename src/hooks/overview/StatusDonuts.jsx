import React from 'react';
import { Card, Row, Col } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const StatusDonuts = ({ statistics }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const claimData = Object.entries(statistics.claimStatusCounts || {}).map(([status, count]) => ({
    name: status === 'undefined' ? 'Uncategorized' : status,
    value: count
  }));

  const prescriptionData = Object.entries(statistics.prescriptionStatusCounts || {}).map(([status, count]) => ({
    name: status,
    value: count
  }));

  const labTestData = Object.entries(statistics.labTestStatusCounts || {}).map(([status, count]) => ({
    name: status,
    value: count
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const ChartCard = ({ title, data }) => (
    <Card title={title} size="small" className="h-80">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No data available
        </div>
      )}
    </Card>
  );

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <ChartCard title="Claims Status" data={claimData} />
      </Col>
      <Col xs={24} md={8}>
        <ChartCard title="Prescriptions Status" data={prescriptionData} />
      </Col>
      <Col xs={24} md={8}>
        <ChartCard title="Lab Tests Status" data={labTestData} />
      </Col>
    </Row>
  );
};

export default StatusDonuts;