import React from 'react';
import { Card, Row, Col, Progress } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProceduresDiagnoses = ({ statistics }) => {
  const procedureData = Object.entries(statistics.procedureStatusCounts || {}).map(([status, count]) => ({
    status,
    count
  }));

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="Procedures Distribution" size="small" className="h-80">
          {procedureData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={procedureData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Procedures" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No procedure data
            </div>
          )}
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Diagnoses Overview" size="small" className="h-80">
          <div className="flex flex-col justify-center h-full space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Total Diagnoses</span>
                <span className="font-medium">{statistics.totalDiagnoses || 0}</span>
              </div>
              <Progress 
                percent={100} 
                showInfo={false}
                strokeColor="#722ed1"
              />
            </div>
            <div className="text-center text-gray-500 p-4">
              <p>Detailed diagnoses breakdown would appear here</p>
              <p className="text-sm mt-2">Diagnosis types and counts would be displayed in a chart format</p>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ProceduresDiagnoses;