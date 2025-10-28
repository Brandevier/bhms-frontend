import React, { useState } from 'react';
import { Card, Upload, Button, Typography, Alert, Space } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const XMLUploadSection = ({ onFileUpload, status, disabled = false }) => {
  const [fileList, setFileList] = useState([]);

  const beforeUpload = (file) => {
    // Check if file is XML
    const isXML = file.type === 'text/xml' || file.name.endsWith('.xml');
    if (!isXML) {
      Alert.error('Please upload an XML file only!');
      return Upload.LIST_IGNORE;
    }
    
    // Limit to one file
    setFileList([file]);
    onFileUpload(file);
    return false; // Prevent automatic upload
  };

  const onRemove = () => {
    setFileList([]);
  };

  return (
    <Card>
      <Title level={5} style={{ marginBottom: 16 }}>
        <FileTextOutlined style={{ marginRight: 8 }} />
        Upload NHIA Claims XML
      </Title>
      
      <Upload
        beforeUpload={beforeUpload}
        fileList={fileList}
        onRemove={onRemove}
        accept=".xml"
        maxCount={1}
        disabled={disabled || status === 'uploading'}
      >
        <Button 
          icon={<UploadOutlined />} 
          type="primary"
          loading={status === 'uploading'}
          disabled={disabled || status === 'uploading'}
        >
          {status === 'uploading' ? 'Processing...' : 'Select XML File'}
        </Button>
      </Upload>

      <div style={{ marginTop: 16 }}>
        <Text type="secondary">
          Requirements:
        </Text>
        <ul style={{ color: '#666', fontSize: '13px', marginTop: 8 }}>
          <li>Valid NHIA XML format</li>
          <li>File size limit: 10MB</li>
          <li>Must include all required claim fields</li>
          <li>Should follow NHIA schema guidelines</li>
        </ul>
      </div>

      {status === 'success' && (
        <Alert
          message="File Uploaded Successfully"
          description="The XML file has been processed successfully."
          type="success"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </Card>
  );
};

export default XMLUploadSection;