// components/PriceDisplayFields.js
import React from 'react';
import { Form, InputNumber, Typography } from 'antd';

const { Text } = Typography;

const PriceDisplayFields = ({ selectedProcedure, form }) => {
  return (
    <>
      <Form.Item
        name="unit_price"
        label="Unit Price (GHC)"
      >
        <InputNumber
          min={0}
          step={0.01}
          className="w-full"
          placeholder="0.00"
          readOnly
        />
      </Form.Item>

      <Form.Item
        name="nhia_amount"
        label="NHIA Amount (GHC)"
      >
        <InputNumber
          min={0}
          step={0.01}
          className="w-full"
          placeholder="0.00"
          readOnly
        />
      </Form.Item>

      <Form.Item
        name="procedure_price"
        label="Procedure Price (GHC)"
      >
        <InputNumber
          min={0}
          step={0.01}
          className="w-full"
          placeholder="0.00"
          readOnly
        />
      </Form.Item>

      {selectedProcedure && (
        <div style={{ background: '#f0f8ff', padding: '8px', borderRadius: '4px', marginBottom: '16px' }}>
          <Text type="secondary">
            <strong>Selected Procedure:</strong> {selectedProcedure.code} - {selectedProcedure.description}
          </Text>
        </div>
      )}
    </>
  );
};

export default PriceDisplayFields;