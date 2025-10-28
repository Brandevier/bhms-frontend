import React from 'react';
import { Alert } from 'antd';

const StrengthAlert = ({ adjustmentInfo }) => {
  if (!adjustmentInfo) return null;

  return (
    <Alert
      message="Strength Adjustment Applied"
      description={
        <div>
          <p>
            Prescribed dose ({adjustmentInfo.prescribedMg.toFixed(2)}mg) differs from 
            available strength ({adjustmentInfo.availableMg.toFixed(2)}mg).
          </p>
          <p className="mt-1">
            <strong>Adjustment factor:</strong> {adjustmentInfo.adjustmentFactor.toFixed(2)}x
          </p>
          <p className="mt-1 text-xs">
            Quantity automatically adjusted based on the strength difference.
          </p>
        </div>
      }
      type="warning"
      showIcon
      className="mb-2"
    />
  );
};

export default StrengthAlert;