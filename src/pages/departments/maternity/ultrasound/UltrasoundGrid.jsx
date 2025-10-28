// components/maternity/UltrasoundGrid.js
import React from 'react';
import { Spin, Alert } from 'antd';
import UltrasoundCard from './UltrasoundCard';

const UltrasoundGrid = ({ ultrasounds, loading, error, onView, onEdit }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spin size="large" tip="Loading ultrasound records..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Ultrasounds"
        description={error || 'Failed to load ultrasound records. Please try again.'}
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  return (
    <div className="space-y-4">
      {ultrasounds.map((ultrasound) => (
        <UltrasoundCard
          key={ultrasound.id}
          ultrasound={ultrasound}
          onView={onView}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default UltrasoundGrid;