// components/maternity/components/DeliveryMetrics.js
import React from 'react';
import { Card, Empty, Typography } from 'antd';

const { Text } = Typography;

const DeliveryMetrics = ({ deliveryModes, birthWeightStats, complicationRates }) => {
  const hasData = deliveryModes.length > 0 || birthWeightStats.totalWeighed > 0;

  if (!hasData) {
    return (
      <Card title="Delivery Metrics" className="h-full">
        <Empty 
          description="No delivery data available" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title="Delivery Metrics" className="h-full">
      <div className="space-y-4">
        {deliveryModes.length > 0 && (
          <div>
            <Text strong>Delivery Modes:</Text>
            <div className="mt-2 space-y-2">
              {deliveryModes.map((mode, index) => (
                <div key={index} className="flex justify-between">
                  <Text>{mode.mode}</Text>
                  <Text strong>{mode.count} ({mode.percentage.toFixed(1)}%)</Text>
                </div>
              ))}
            </div>
          </div>
        )}

        {birthWeightStats.totalWeighed > 0 && (
          <div>
            <Text strong>Birth Weight Stats:</Text>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <Text>Average Weight:</Text>
                <Text strong>{birthWeightStats.average.toFixed(2)} kg</Text>
              </div>
              <div className="flex justify-between">
                <Text>Low Birth Weight Rate:</Text>
                <Text strong>{birthWeightStats.lowBirthWeightRate.toFixed(1)}%</Text>
              </div>
            </div>
          </div>
        )}

        {complicationRates.length > 0 && (
          <div>
            <Text strong>Complications:</Text>
            <div className="mt-2 space-y-2">
              {complicationRates.map((comp, index) => (
                <div key={index} className="flex justify-between">
                  <Text>{comp.complication}</Text>
                  <Text strong>{comp.count} cases</Text>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DeliveryMetrics;