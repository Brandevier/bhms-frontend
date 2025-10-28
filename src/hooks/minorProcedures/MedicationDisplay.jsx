import React from 'react';
import { Card, InputNumber, Tag, Divider, Descriptions } from 'antd';

const MedicationDisplay = ({ 
  selectedMed, 
  onQuantityChange, 
  onMarketPriceChange 
}) => {
  if (!selectedMed) return null;

  const totalPrice = selectedMed.quantity * (selectedMed.marketPrice || selectedMed.price_ghc);

  return (
    <Card className="medication-display" size="small">
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Medication">
          <Tag color="blue">{selectedMed.code}</Tag>
          {selectedMed.generic_name}
        </Descriptions.Item>
        <Descriptions.Item label="NHIA Price">
          GH₵{selectedMed.price_ghc}
        </Descriptions.Item>
        <Descriptions.Item label="Quantity">
          <InputNumber
            min={1}
            value={selectedMed.quantity}
            onChange={onQuantityChange}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Market Price">
          <InputNumber
            min={0}
            value={selectedMed.marketPrice}
            onChange={onMarketPriceChange}
            formatter={value => `GH₵${value}`}
            parser={value => value.replace('GH₵', '')}
          />
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Payment</Divider>
      <div className="payment-summary">
        <Tag color="green" style={{ fontSize: 16 }}>
          Total: GH₵{totalPrice.toFixed(2)}
        </Tag>
      </div>
    </Card>
  );
};

export default MedicationDisplay;