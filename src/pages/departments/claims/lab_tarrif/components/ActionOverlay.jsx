// ActionOverlay.js
import React from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ActionOverlay = ({ selectedCount, selectedRows, onClearSelection }) => {
  if (selectedCount === 0) {
    return null;
  }

  // Calculate totals for selected rows - ensure values are numbers
  const totalTariff = selectedRows.reduce((sum, row) => {
    const tariffValue = parseFloat(row.tariff_ghc) || 0;
    return sum + tariffValue;
  }, 0);

  const totalMarketPrice = selectedRows.reduce((sum, row) => {
    const marketPriceValue = parseFloat(row.market_price) || 0;
    return sum + marketPriceValue;
  }, 0);

  // Format numbers safely
  const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'GHS 0.00';
    }
    return `GHS ${value.toFixed(2)}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        title={
          <div className="flex justify-between items-center">
            <Space>
              <Text strong>{selectedCount} item(s) selected</Text>
            </Space>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={onClearSelection}
              size="small"
            />
          </div>
        }
        size="small"
        className="w-80 shadow-lg border-blue-200"
        bodyStyle={{ padding: '12px' }}
      >
        <div className="space-y-2">
          <div className="flex justify-between">
            <Text type="secondary">Total NHIS Tariff:</Text>
            <Text strong>{formatCurrency(totalTariff)}</Text>
          </div>
          <div className="flex justify-between">
            <Text type="secondary">Total Market Price:</Text>
            <Text strong>{formatCurrency(totalMarketPrice)}</Text>
          </div>
          
          <div className="flex justify-between mt-3">
            <Button type="primary" size="small">
              Export Selected
            </Button>
            <Button type="default" size="small" onClick={onClearSelection}>
              Clear Selection
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ActionOverlay;