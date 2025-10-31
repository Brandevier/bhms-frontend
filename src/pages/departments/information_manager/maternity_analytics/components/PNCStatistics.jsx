// components/maternity/components/PNCStatistics.js
import React from 'react';
import { Card, Progress, Empty, Typography } from 'antd';

const { Text } = Typography;

const PNCStatistics = ({ data }) => {
  const hasData = data.coverageRate > 0;

  if (!hasData) {
    return (
      <Card title="Postnatal Care Statistics" className="h-full">
        <Empty 
          description="No PNC data available" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title="Postnatal Care Statistics" className="h-full">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <Text strong>PNC Coverage Rate</Text>
            <Text strong>{data.coverageRate.toFixed(1)}%</Text>
          </div>
          <Progress 
            percent={data.coverageRate} 
            status={data.coverageRate > 80 ? 'success' : 'normal'}
          />
        </div>

        {data.breastfeeding.length > 0 && (
          <div>
            <Text strong>Breastfeeding Status:</Text>
            <div className="mt-2 space-y-2">
              {data.breastfeeding.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <Text>{item.status}</Text>
                  <Text strong>{item.count}</Text>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PNCStatistics;