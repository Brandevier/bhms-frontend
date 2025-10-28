import React from 'react';
import { Alert, Typography, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ValidationStatus = ({ status }) => {
  if (status === 'pass') {
    return (
      <Alert
        message="Validation Passed"
        description={
          <Space direction="vertical">
            <Text>All NHIA validation checks have passed successfully.</Text>
            <Text type="secondary">The claim file is ready for submission to NHIA.</Text>
          </Space>
        }
        type="success"
        showIcon
        icon={<CheckCircleOutlined />}
        style={{ marginBottom: 24 }}
      />
    );
  }

  return (
    <Alert
      message="Validation Failed"
      description={
        <Space direction="vertical">
          <Text>Some items failed NHIA validation checks.</Text>
          <Text type="secondary">Please review and fix the issues before submission.</Text>
        </Space>
      }
      type="error"
      showIcon
      icon={<CloseCircleOutlined />}
      style={{ marginBottom: 24 }}
    />
  );
};

export default ValidationStatus;