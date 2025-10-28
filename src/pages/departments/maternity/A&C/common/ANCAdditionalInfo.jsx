// components/maternity/ANCAdditionalInfo.js
import React from 'react';
import { Card, Typography, Row, Col, Divider, Alert } from 'antd';

const { Text } = Typography;

const ANCAdditionalInfo = ({ ancRecord }) => {
  return (
    <>
      <Card title="Additional Information" className="mt-6">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div className="text-center">
              <Text strong className="block mb-2">Institution</Text>
              <Text>{ancRecord?.institution?.name || 'N/A'}</Text>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <Text strong className="block mb-2">Auditor</Text>
              <Text>
                {ancRecord?.auditor ? `Dr. ${ancRecord.auditor.firstName} ${ancRecord.auditor.lastName}` : 'Unknown'}
              </Text>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <Text strong className="block mb-2">Record ID</Text>
              <Text type="secondary" className="text-xs">
                {ancRecord?.id || 'N/A'}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* Remove the warning since we don't have these fields in the API response */}
    </>
  );
};

export default ANCAdditionalInfo;