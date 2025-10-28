import React from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ClaimItemsBreakdown = ({ statistics }) => {
  // Sample data - you would replace this with actual claim item categories from your API
  const claimItemsData = [
    { category: 'Medication', value: 4 },
    { category: 'Lab Tests', value: 3 },
    { category: 'Procedures', value: 1 },
    { category: 'Consultation', value: 2 },
  ];

  return (
    <Card title="Claim Items by Category" size="small" className="h-80">
      {claimItemsData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={claimItemsData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No claim item data
        </div>
      )}
    </Card>
  );
};

export default ClaimItemsBreakdown;