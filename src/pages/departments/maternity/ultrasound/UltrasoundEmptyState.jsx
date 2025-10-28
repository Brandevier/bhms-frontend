// components/maternity/UltrasoundEmptyState.js
import React from 'react';
import { Empty, Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const UltrasoundEmptyState = ({ onCreate }) => {
  return (
    <Card className="text-center py-8">
      <Empty
        description={
          <div>
            <p className="text-gray-600 mb-2">No ultrasound records found for this visit</p>
            <p className="text-sm text-gray-500">
              Start by creating the first ultrasound record for this patient
            </p>
          </div>
        }
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onCreate}
          size="large"
        >
          Create First Ultrasound
        </Button>
      </Empty>
    </Card>
  );
};

export default UltrasoundEmptyState;