// components/maternity/ANCEmptyState.js
import React from 'react';
import { Empty } from 'antd';

const ANCEmptyState = ({ visitId, onRegisterClick }) => {
  return (
    <Empty
      description="No ANC record found for this visit"
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    >
      <p className="text-gray-500 mb-2">
        Click the "Register New ANC Visit" button above to create a new ANC record.
      </p>
    </Empty>
  );
};

export default ANCEmptyState;